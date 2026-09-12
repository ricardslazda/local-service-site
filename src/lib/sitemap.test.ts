import assert from 'node:assert/strict';
import { test } from 'node:test';

import { renderSitemap } from './sitemap.ts';

test('every url carries a lastmod date and its alternates', () => {
    const xml = renderSitemap([
        {
            url: 'https://example.com/pakalpojumi',
            lastmod: new Date('2026-09-02T10:00:00Z'),
            alternates: [
                {
                    hreflang: 'lv',
                    href: 'https://example.com/pakalpojumi',
                },
                {
                    hreflang: 'ru-LV',
                    href: 'https://example.com/ru/uslugi',
                },
                {
                    hreflang: 'x-default',
                    href: 'https://example.com/pakalpojumi',
                },
            ],
        },
    ]);

    assert.match(xml, /<loc>https:\/\/example\.com\/pakalpojumi<\/loc>/);
    assert.match(xml, /<lastmod>2026-09-02<\/lastmod>/);
    assert.match(
        xml,
        /hreflang="ru-LV" href="https:\/\/example\.com\/ru\/uslugi"/,
    );
    assert.match(xml, /hreflang="x-default"/);
    assert.match(xml, /xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml"/);
});

test('reserved characters are escaped', () => {
    const xml = renderSitemap([
        {
            url: 'https://example.com/?a=1&b=2',
            lastmod: new Date('2026-01-01'),
            alternates: [],
        },
    ]);

    assert.match(xml, /<loc>https:\/\/example\.com\/\?a=1&amp;b=2<\/loc>/);
    assert.doesNotMatch(xml, /&b=2/);
});
