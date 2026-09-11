import { resolve } from 'node:path';

import { loadDist } from '../../scripts/audit/dist.ts';
import type { Page, PageType } from '../../scripts/audit/dist.ts';
import { locales } from '../../src/site.ts';
import type { Locale } from '../../src/site.ts';

const dist = loadDist(resolve(import.meta.dirname, '..', '..', 'dist'));

function deepest(candidates: Page[]): Page | undefined {
    return [...candidates].sort(
        (left, right) =>
            right.path.split('/').length - left.path.split('/').length ||
            left.path.localeCompare(right.path),
    )[0];
}

export function representativePages(): Page[] {
    const chosen = new Map<string, Page>();

    for (const page of dist.pages.filter((candidate) => candidate.indexable)) {
        const key = `${page.type}:${page.locale}`;
        const current = chosen.get(key);
        const winner = deepest(current ? [current, page] : [page]);

        if (winner) {
            chosen.set(key, winner);
        }
    }

    return [...chosen.values()].sort((left, right) =>
        left.path.localeCompare(right.path),
    );
}

export function alternateOf(page: Page, locale: Locale): string | undefined {
    const href = page
        .$(`link[rel="alternate"][hreflang="${locales[locale].hreflang}"]`)
        .attr('href');

    return href?.replace(/^https?:\/\/[^/]+/, '');
}

export function pairedPage(
    type: PageType,
    from: Locale,
    to: Locale,
): Page | undefined {
    return deepest(
        dist.pages.filter(
            (page) =>
                page.indexable &&
                page.type === type &&
                page.locale === from &&
                alternateOf(page, to) !== undefined,
        ),
    );
}
