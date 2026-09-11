import type { APIRoute } from 'astro';

import { alternatesOf, entriesIn, guidesIn, jobsIn } from '../lib/content.ts';
import {
    absoluteUrl,
    homePath,
    hubPath,
    jobPath,
    locationPath,
    guidePath,
    servicePath,
    slugOf,
    standalonePath,
} from '../lib/paths.ts';
import { renderSitemap } from '../lib/sitemap.ts';
import type { SitemapAlternate, SitemapEntry } from '../lib/sitemap.ts';
import type { Locale } from '../site.ts';
import { defaultLocale, localeCodes, locales, site } from '../site.ts';

function alternatesFrom(
    paths: Partial<Record<Locale, string>>,
): SitemapAlternate[] {
    const alternates = localeCodes
        .filter((code) => paths[code] !== undefined)
        .map((code) => ({
            hreflang: locales[code].hreflang,
            href: absoluteUrl(paths[code] ?? '/'),
        }));
    const fallback = paths[defaultLocale] ?? Object.values(paths)[0];

    return fallback
        ? [
              ...alternates,
              { hreflang: 'x-default', href: absoluteUrl(fallback) },
          ]
        : alternates;
}

function everywhere(pathFor: (locale: Locale) => string) {
    return Object.fromEntries(
        localeCodes.map((code) => [code, pathFor(code)]),
    ) as Record<Locale, string>;
}

function latest(dates: readonly Date[], floor: Date): Date {
    return dates.reduce(
        (newest, date) => (date > newest ? date : newest),
        floor,
    );
}

function modified(data: { pubDate: Date; updatedDate?: Date }): Date {
    return data.updatedDate ?? data.pubDate;
}

async function entriesFor(locale: Locale): Promise<SitemapEntry[]> {
    const [services, locations, guides, jobs, pages] = await Promise.all([
        entriesIn('services', locale),
        entriesIn('locations', locale),
        guidesIn(locale),
        jobsIn(locale),
        entriesIn('pages', locale),
    ]);
    const entries: SitemapEntry[] = [
        {
            url: absoluteUrl(homePath(locale)),
            lastmod: site.updated.home,
            alternates: alternatesFrom(everywhere(homePath)),
        },
        {
            url: absoluteUrl(standalonePath(locale, 'contact')),
            lastmod: site.updated.contact,
            alternates: alternatesFrom(
                everywhere((code) => standalonePath(code, 'contact')),
            ),
        },
    ];

    for (const [collection, items] of [
        ['services', services],
        ['locations', locations],
        ['guides', guides],
        ['jobs', jobs],
    ] as const) {
        if (items.length > 0) {
            entries.push({
                url: absoluteUrl(hubPath(locale, collection)),
                lastmod: latest(
                    items.map((item) => modified(item.data)),
                    site.updated.home,
                ),
                alternates: alternatesFrom(
                    everywhere((code) => hubPath(code, collection)),
                ),
            });
        }
    }

    for (const entry of services) {
        entries.push({
            url: absoluteUrl(servicePath(locale, slugOf(entry.id))),
            lastmod: modified(entry.data),
            alternates: alternatesFrom(
                await alternatesOf('services', entry, (code, sibling) =>
                    servicePath(code, slugOf(sibling.id)),
                ),
            ),
        });
    }

    for (const entry of locations) {
        entries.push({
            url: absoluteUrl(locationPath(locale, slugOf(entry.id))),
            lastmod: modified(entry.data),
            alternates: alternatesFrom(
                await alternatesOf('locations', entry, (code, sibling) =>
                    locationPath(code, slugOf(sibling.id)),
                ),
            ),
        });
    }

    for (const entry of guides) {
        entries.push({
            url: absoluteUrl(guidePath(locale, slugOf(entry.id))),
            lastmod: modified(entry.data),
            alternates: alternatesFrom(
                await alternatesOf('guides', entry, (code, sibling) =>
                    guidePath(code, slugOf(sibling.id)),
                ),
            ),
        });
    }

    for (const entry of jobs) {
        entries.push({
            url: absoluteUrl(jobPath(locale, slugOf(entry.id))),
            lastmod: modified(entry.data),
            alternates: alternatesFrom(
                await alternatesOf('jobs', entry, (code, sibling) =>
                    jobPath(code, slugOf(sibling.id)),
                ),
            ),
        });
    }

    for (const entry of pages) {
        entries.push({
            url: absoluteUrl(standalonePath(locale, entry.data.kind)),
            lastmod: modified(entry.data),
            alternates: alternatesFrom(
                await alternatesOf('pages', entry, (code, sibling) =>
                    standalonePath(code, sibling.data.kind),
                ),
            ),
        });
    }

    return entries;
}

export const GET: APIRoute = async () => {
    const entries = (
        await Promise.all(localeCodes.map((locale) => entriesFor(locale)))
    ).flat();

    return new Response(renderSitemap(entries), {
        headers: { 'content-type': 'application/xml; charset=utf-8' },
    });
};
