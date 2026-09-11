import assert from 'node:assert/strict';
import { test } from 'node:test';

import { distFrom, page } from '../testing.ts';

import { bodies } from './bodies.ts';

const prose = (seed: string, words = 200) =>
    Array.from({ length: words }, (_, index) => `${seed}${index}`).join(' ');

test('a service, town, guide or job page with too little copy is thin', () => {
    const findings = bodies(
        distFrom({
            pages: [
                page(
                    '/pakalpojumi/pakalpojums-viens',
                    '',
                    `<article>${prose('a', 40)}</article>`,
                ),
                page(
                    '/pilsetas/parauga-pilseta',
                    '',
                    `<article>${prose('b', 200)}</article>`,
                ),
                page('/kontakti', '', '<p>short is fine here</p>'),
            ],
        }),
    );

    assert.deepEqual(
        findings.map((item) => `${item.at} ${item.detail}`),
        [
            '/pakalpojumi/pakalpojums-viens has 40 words of body copy, want at least 150',
        ],
    );
});

test('two pages in one language with the same copy and a town name swapped are duplicates', () => {
    const shared = prose('w', 300);
    const findings = bodies(
        distFrom({
            pages: [
                page(
                    '/pilsetas/parauga-pilseta',
                    '',
                    `<article>Parauga pilsētā ${shared}</article>`,
                ),
                page(
                    '/pilsetas/otra-pilseta',
                    '',
                    `<article>Otrā pilsētā ${shared}</article>`,
                ),
                page(
                    '/ru/goroda/primer-gorod',
                    '',
                    `<article>Пример города ${shared}</article>`,
                    'ru',
                ),
            ],
        }),
    );

    assert.equal(findings.length, 1);
    assert.match(
        findings[0]?.detail ?? '',
        /shares \d+% of its body copy with \/pilsetas\/otra-pilseta/,
    );
});

test('forms and navigation inside the article are not body copy', () => {
    const form = `<form>${prose('f', 120)}</form><nav>${prose('n', 60)}</nav>`;
    const findings = bodies(
        distFrom({
            pages: [
                page(
                    '/pakalpojumi/a',
                    '',
                    `<article>${prose('a', 200)}${form}</article>`,
                ),
                page(
                    '/pakalpojumi/b',
                    '',
                    `<article>${prose('b', 200)}${form}</article>`,
                ),
                page(
                    '/pakalpojumi/c',
                    '',
                    `<article>${prose('c', 20)}${form}</article>`,
                ),
            ],
        }),
    );

    assert.deepEqual(
        findings.map((item) => item.at),
        ['/pakalpojumi/c'],
    );
});
