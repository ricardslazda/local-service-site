import assert from 'node:assert/strict';
import { test } from 'node:test';

import { site } from '../../../src/site.ts';
import { distFrom, page } from '../testing.ts';

import { hreflang } from './hreflang.ts';

const origin = site.origin;

function links(entries: [string, string][]): string {
    return entries
        .map(
            ([code, path]) =>
                `<link rel="alternate" hreflang="${code}" href="${origin}${path}">`,
        )
        .join('');
}

test('a reciprocal set with self and x-default passes', () => {
    const lv = links([
        ['lv', '/pakalpojumi'],
        ['ru-LV', '/ru/uslugi'],
        ['x-default', '/pakalpojumi'],
    ]);
    const ru = links([
        ['lv', '/pakalpojumi'],
        ['ru-LV', '/ru/uslugi'],
        ['x-default', '/pakalpojumi'],
    ]);
    const findings = hreflang(
        distFrom({
            pages: [
                page('/pakalpojumi', lv, ''),
                page('/ru/uslugi', ru, '', 'ru'),
            ],
        }),
    );

    assert.deepEqual(findings, []);
});

test('a page must name itself with its locale code and carry x-default', () => {
    const findings = hreflang(
        distFrom({
            pages: [
                page('/a', links([['ru-LV', '/ru/a']]), ''),
                page(
                    '/ru/a',
                    links([
                        ['ru', '/ru/a'],
                        ['x-default', '/ru/a'],
                    ]),
                    '',
                    'ru',
                ),
            ],
        }),
    );

    assert.deepEqual(
        findings.map((item) => `${item.at} ${item.detail}`),
        [
            '/a does not name itself as an alternate',
            '/a has no x-default alternate',
            `/a names ${origin}/ru/a as an alternate, which does not name it back`,
            '/ru/a names itself as "ru", want "ru-LV"',
        ],
    );
});

test('an alternate must be an indexable page that names the page back', () => {
    const findings = hreflang(
        distFrom({
            pages: [
                page(
                    '/a',
                    links([
                        ['lv', '/a'],
                        ['ru-LV', '/ru/missing'],
                        ['x-default', '/a'],
                    ]),
                    '',
                ),
            ],
        }),
    );

    assert.deepEqual(
        findings.map((item) => item.detail),
        [
            `names ${origin}/ru/missing as an alternate, which is not an indexable page`,
        ],
    );
});
