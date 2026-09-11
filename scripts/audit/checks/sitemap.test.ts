import assert from 'node:assert/strict';
import { test } from 'node:test';

import { site } from '../../../src/site.ts';
import { distFrom, page } from '../testing.ts';

import { sitemap } from './sitemap.ts';

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`;

function xml(entries: [string, string | undefined][]): string {
    return `<?xml version="1.0"?><urlset>${entries
        .map(
            ([path, lastmod]) =>
                `<url><loc>${site.origin}${path === '/' ? '/' : path}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`,
        )
        .join('')}</urlset>`;
}

test('every indexable page is listed with a lastmod, nothing else is, and robots names the sitemap', () => {
    const findings = sitemap(
        distFrom({
            pages: [
                page('/', '', ''),
                page('/kontakti', '', ''),
                page('/paldies', '<meta name="robots" content="noindex">', ''),
            ],
            sitemap: xml([
                ['/', '2026-09-02'],
                ['/paldies', '2026-09-02'],
                ['/missing', undefined],
            ]),
            robots,
        }),
    );

    assert.deepEqual(
        findings.map((item) => `${item.at} ${item.detail}`),
        [
            '/paldies is listed but is not an indexable page',
            '/missing is listed without a lastmod date',
            '/missing is listed but is not an indexable page',
            '/kontakti is indexable but not listed',
        ],
    );
});

test('a complete sitemap passes', () => {
    const findings = sitemap(
        distFrom({
            pages: [page('/', '', ''), page('/ru', '', '', 'ru')],
            sitemap: xml([
                ['/', '2026-09-02'],
                ['/ru', '2026-09-02'],
            ]),
            robots,
        }),
    );

    assert.deepEqual(findings, []);
});

test('a missing sitemap or robots is a finding', () => {
    assert.deepEqual(
        sitemap(distFrom({ pages: [page('/', '', '')] })).map(
            (item) => item.at,
        ),
        ['/sitemap.xml'],
    );
    assert.deepEqual(
        sitemap(
            distFrom({
                pages: [page('/', '', '')],
                sitemap: xml([['/', '2026-09-02']]),
            }),
        ).map((item) => item.at),
        ['/robots.txt'],
    );
});
