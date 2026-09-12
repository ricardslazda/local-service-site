import { absoluteUrl } from '../../../src/lib/paths.ts';
import { locales, site } from '../../../src/site.ts';
import type { Check, Finding, Page } from '../dist.ts';
import { finding } from '../dist.ts';

interface Alternate {
    hreflang: string;
    href: string;
}

function alternatesOf(page: Page): Alternate[] {
    return page
        .$('link[rel="alternate"][hreflang]')
        .toArray()
        .map((element) => ({
            hreflang: page.$(element).attr('hreflang') ?? '',
            href: page.$(element).attr('href') ?? '',
        }));
}

function pathOfUrl(href: string): string | undefined {
    if (!href.startsWith(site.origin)) {
        return undefined;
    }

    const path = href.slice(site.origin.length);

    return path === '' || path === '/' ? '/' : path.replace(/\/$/, '');
}

export const hreflang: Check = ({ pages }) => {
    const indexable = pages.filter((page) => page.indexable);
    const sets = new Map(
        indexable.map((page) => [
            page.path,
            new Set(
                alternatesOf(page)
                    .filter((alternate) => alternate.hreflang !== 'x-default')
                    .map((alternate) => alternate.href),
            ),
        ]),
    );
    const findings: Finding[] = [];

    for (const page of indexable) {
        const own = absoluteUrl(page.path);
        const alternates = alternatesOf(page);
        const self = alternates.find(
            (alternate) =>
                alternate.href === own && alternate.hreflang !== 'x-default',
        );

        if (!self) {
            findings.push(
                finding(
                    'hreflang',
                    page.path,
                    'does not name itself as an alternate',
                ),
            );
        } else if (self.hreflang !== locales[page.locale].hreflang) {
            findings.push(
                finding(
                    'hreflang',
                    page.path,
                    `names itself as "${self.hreflang}", want "${locales[page.locale].hreflang}"`,
                ),
            );
        }

        if (
            !alternates.some((alternate) => alternate.hreflang === 'x-default')
        ) {
            findings.push(
                finding('hreflang', page.path, 'has no x-default alternate'),
            );
        }

        for (const href of sets.get(page.path) ?? []) {
            if (href === own) {
                continue;
            }

            const target = pathOfUrl(href);
            const theirs = target === undefined ? undefined : sets.get(target);

            if (!theirs) {
                findings.push(
                    finding(
                        'hreflang',
                        page.path,
                        `names ${href} as an alternate, which is not an indexable page`,
                    ),
                );
            } else if (!theirs.has(own)) {
                findings.push(
                    finding(
                        'hreflang',
                        page.path,
                        `names ${href} as an alternate, which does not name it back`,
                    ),
                );
            }
        }
    }

    return findings;
};
