import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';

import type { Locale } from '../../src/site.ts';
import {
    defaultLocale,
    localeCodes,
    locales,
    segments,
} from '../../src/site.ts';

export type PageType =
    'home' | 'hub' | 'service' | 'location' | 'guide' | 'job' | 'standalone';

export interface Page {
    path: string;
    html: string;
    $: CheerioAPI;
    locale: Locale;
    type: PageType;
    indexable: boolean;
}

export interface Asset {
    path: string;
    bytes: Buffer;
}

export interface Dist {
    pages: Page[];
    files: Set<string>;
    scripts: Asset[];
    stylesheets: Asset[];
    sitemap: string | undefined;
    robots: string | undefined;
}

export interface Finding {
    check: string;
    at: string;
    detail: string;
}

export type Check = (dist: Dist) => Finding[];

export function finding(check: string, at: string, detail: string): Finding {
    return { check, at, detail };
}

export function localeOfPath(path: string): Locale {
    return (
        localeCodes.find((code) => {
            const prefix = locales[code].prefix;

            return (
                prefix !== '' &&
                (path === `/${prefix}` || path.startsWith(`/${prefix}/`))
            );
        }) ?? defaultLocale
    );
}

export function typeOfPath(path: string, locale: Locale): PageType {
    const prefix =
        locales[locale].prefix === '' ? '' : `/${locales[locale].prefix}`;
    const parts = path.slice(prefix.length).split('/').filter(Boolean);
    const [first] = parts;
    const own = segments[locale];

    if (first === undefined) {
        return 'home';
    }

    if (first === own.services) {
        return parts.length === 1 ? 'hub' : 'service';
    }

    if (first === own.locations) {
        return parts.length === 1 ? 'hub' : 'location';
    }

    if (first === own.guides) {
        return parts.length === 1 ? 'hub' : 'guide';
    }

    if (first === own.jobs) {
        return parts.length === 1 ? 'hub' : 'job';
    }

    return 'standalone';
}

export function pathOfFile(file: string): string {
    const withoutExtension = file.replace(/\.html$/, '');

    if (withoutExtension === 'index') {
        return '/';
    }

    return `/${withoutExtension.replace(/\/index$/, '')}`;
}

export function pageFrom(path: string, html: string): Page {
    const $ = cheerio.load(html);
    const locale = localeOfPath(path);
    const robots = $('meta[name="robots"]').attr('content') ?? '';

    return {
        path,
        html,
        $,
        locale,
        type: typeOfPath(path, locale),
        indexable: !/noindex/i.test(robots),
    };
}

function walk(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
        const full = join(dir, name);

        return statSync(full).isDirectory() ? walk(full) : [full];
    });
}

export function loadDist(dir: string): Dist {
    const files = walk(dir).map((file) =>
        relative(dir, file).replaceAll('\\', '/'),
    );
    const read = (file: string) => readFileSync(join(dir, file));
    const pages = files
        .filter((file) => file.endsWith('.html'))
        .map((file) => pageFrom(pathOfFile(file), read(file).toString('utf8')));

    return {
        pages,
        files: new Set(files.map((file) => `/${file}`)),
        scripts: files
            .filter((file) => file.endsWith('.js'))
            .map((file) => ({ path: `/${file}`, bytes: read(file) })),
        stylesheets: files
            .filter((file) => file.endsWith('.css'))
            .map((file) => ({ path: `/${file}`, bytes: read(file) })),
        sitemap: files.includes('sitemap.xml')
            ? read('sitemap.xml').toString('utf8')
            : undefined,
        robots: files.includes('robots.txt')
            ? read('robots.txt').toString('utf8')
            : undefined,
    };
}
