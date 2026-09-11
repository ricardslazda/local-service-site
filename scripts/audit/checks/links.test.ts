import assert from 'node:assert/strict';
import { test } from 'node:test';

import { site } from '../../../src/site.ts';
import { distFrom, page } from '../testing.ts';

import { links } from './links.ts';

test('internal links must be absolute paths that resolve to a built page or file', () => {
    const findings = links(
        distFrom({
            pages: [
                page(
                    '/pakalpojumi/pakalpojums-viens',
                    '',
                    `<a href="parauga-pilseta">relative</a><a href="/pakalpojumi/missing">missing</a><a href="/pakalpojumi/pakalpojums-viens/parauga-pilseta?x=1#top">ok</a><a href="${site.origin}/kontakti">absolute ok</a><a href="/sitemap.xml">file</a><a href="tel:${site.phone.e164}">tel</a><a href="mailto:a@b.lv">mail</a><a href="#main">fragment</a><a href="https://elsewhere.example/">external</a>`,
                ),
                page('/pakalpojumi/pakalpojums-viens/parauga-pilseta', '', ''),
                page('/kontakti', '', ''),
                page('/', '', ''),
            ],
            files: ['/sitemap.xml'],
        }),
    );

    assert.deepEqual(
        findings.map((item) => item.detail),
        [
            'links to "parauga-pilseta", which is neither an absolute path, a fragment nor a URL',
            'links to /pakalpojumi/missing, which does not exist',
        ],
    );
});

test('the root and a trailing slash resolve to the home page', () => {
    const findings = links(
        distFrom({
            pages: [
                page(
                    '/',
                    '',
                    `<a href="/">home</a><a href="${site.origin}/">home too</a>`,
                ),
            ],
        }),
    );

    assert.deepEqual(findings, []);
});
