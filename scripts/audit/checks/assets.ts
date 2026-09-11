import { site } from '../../../src/site.ts';
import type { Check, Page } from '../dist.ts';
import { finding } from '../dist.ts';

const SELECTORS = [
    ['img[src]', 'src'],
    ['source[src]', 'src'],
    ['video[poster]', 'poster'],
    ['script[src]', 'src'],
    ['link[rel="icon"][href]', 'href'],
    ['link[rel="apple-touch-icon"][href]', 'href'],
    ['link[rel="stylesheet"][href]', 'href'],
    ['link[rel="preload"][href]', 'href'],
    ['link[rel="modulepreload"][href]', 'href'],
    ['meta[property="og:image"][content]', 'content'],
    ['meta[name="twitter:image"][content]', 'content'],
] as const;

function candidates(page: Page): string[] {
    const direct = SELECTORS.flatMap(([selector, attribute]) =>
        page
            .$(selector)
            .toArray()
            .map((element) => page.$(element).attr(attribute) ?? ''),
    );
    const fromSrcset = page
        .$('img[srcset], source[srcset]')
        .toArray()
        .flatMap((element) =>
            (page.$(element).attr('srcset') ?? '')
                .split(',')
                .map((entry) => entry.trim().split(/\s+/)[0] ?? ''),
        );

    return [...direct, ...fromSrcset].filter((value) => value !== '');
}

export function localPath(reference: string): string | undefined {
    if (reference.startsWith('data:') || reference.startsWith('#')) {
        return undefined;
    }

    if (reference.startsWith(site.origin)) {
        return decodeURIComponent(
            reference.slice(site.origin.length).split(/[?#]/)[0] ?? '',
        );
    }

    if (reference.startsWith('/') && !reference.startsWith('//')) {
        return decodeURIComponent(reference.split(/[?#]/)[0] ?? '');
    }

    return undefined;
}

export const assets: Check = ({ pages, files }) =>
    pages.flatMap((page) =>
        candidates(page).flatMap((reference) => {
            const path = localPath(reference);

            if (path === undefined || path === '' || path === '/') {
                return [];
            }

            return files.has(path)
                ? []
                : [
                      finding(
                          'assets',
                          page.path,
                          `references ${reference}, which is not in the build`,
                      ),
                  ];
        }),
    );
