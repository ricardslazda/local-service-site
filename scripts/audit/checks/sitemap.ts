import { site } from '../../../src/site.ts';
import type { Check, Finding } from '../dist.ts';
import { finding } from '../dist.ts';

interface SitemapEntry {
    path: string;
    lastmod: boolean;
}

export function entriesOf(xml: string): SitemapEntry[] {
    return [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(.*?)<\/url>/gs)].map(
        ([, loc, rest]) => {
            const path = (loc ?? '').startsWith(site.origin)
                ? (loc ?? '').slice(site.origin.length)
                : (loc ?? '');

            return {
                path:
                    path === '' || path === '/' ? '/' : path.replace(/\/$/, ''),
                lastmod: /<lastmod>\d{4}-\d{2}-\d{2}/.test(rest ?? ''),
            };
        },
    );
}

export const sitemap: Check = ({ pages, sitemap: xml, robots }) => {
    if (xml === undefined) {
        return [finding('sitemap', '/sitemap.xml', 'is not in the build')];
    }

    const findings: Finding[] = [];
    const entries = entriesOf(xml);
    const listed = new Set(entries.map((entry) => entry.path));
    const indexable = new Set(
        pages.filter((page) => page.indexable).map((page) => page.path),
    );

    for (const entry of entries) {
        if (!entry.lastmod) {
            findings.push(
                finding(
                    'sitemap',
                    entry.path,
                    'is listed without a lastmod date',
                ),
            );
        }

        if (!indexable.has(entry.path)) {
            findings.push(
                finding(
                    'sitemap',
                    entry.path,
                    'is listed but is not an indexable page',
                ),
            );
        }
    }

    for (const path of indexable) {
        if (!listed.has(path)) {
            findings.push(
                finding('sitemap', path, 'is indexable but not listed'),
            );
        }
    }

    const sitemapUrl = `${site.origin}/sitemap.xml`;

    if (robots === undefined) {
        findings.push(finding('sitemap', '/robots.txt', 'is not in the build'));
    } else if (!robots.includes(`Sitemap: ${sitemapUrl}`)) {
        findings.push(
            finding('sitemap', '/robots.txt', `does not name ${sitemapUrl}`),
        );
    }

    return findings;
};
