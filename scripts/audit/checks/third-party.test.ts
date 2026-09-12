import assert from 'node:assert/strict';
import { test } from 'node:test';

import { site } from '../../../src/site.ts';
import { distFrom, page } from '../testing.ts';

import { thirdParty } from './third-party.ts';

test('a script, a font stylesheet, an image and a form on another origin are findings', () => {
    const findings = thirdParty(
        distFrom({
            pages: [
                page(
                    '/',
                    '<script src="https://www.googletagmanager.com/gtag.js"></script><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter">',
                    '<img src="//cdn.example.com/a.png" width="1" height="1" alt="a"><form action="https://formspree.io/f/abc" method="post"></form><form action="/api/lead" method="post"></form><a href="https://maps.google.com/">a link is not a request</a>',
                ),
            ],
        }),
    );

    assert.deepEqual(
        findings.map((item) => item.detail),
        [
            'loads a resource from https://www.googletagmanager.com',
            'loads a resource from https://cdn.example.com',
            'loads a resource from https://fonts.googleapis.com',
            'posts a form to "https://formspree.io/f/abc", which is not this origin',
        ],
    );
});

test('inline styles, style blocks and stylesheet files are read for imports and urls', () => {
    const findings = thirdParty(
        distFrom({
            pages: [
                page(
                    '/',
                    '<style>@import "https://fonts.googleapis.com/css2?family=Inter";</style>',
                    '<div style="background: url(https://images.example.com/bg.jpg)"></div><div style="background: url(/bg.jpg)"></div>',
                ),
            ],
            stylesheets: [
                {
                    path: '/_astro/x.css',
                    text: '.a{background:url("https://cdn.example.com/a.png")}',
                },
            ],
        }),
    );

    assert.deepEqual(
        findings.map((item) => `${item.at} ${item.detail}`).sort(),
        [
            '/ styling loads a resource from https://fonts.googleapis.com',
            '/ styling loads a resource from https://images.example.com',
            '/_astro/x.css loads a resource from https://cdn.example.com',
        ],
    );
});

test('same-origin and relative resources pass', () => {
    const findings = thirdParty(
        distFrom({
            pages: [
                page(
                    '/',
                    `<link rel="stylesheet" href="/_astro/a.css"><link rel="preload" href="${site.origin}/_astro/fonts/a.woff2" as="font">`,
                    '<img src="/a.png" width="1" height="1" alt="a">',
                ),
            ],
        }),
    );

    assert.deepEqual(findings, []);
});
