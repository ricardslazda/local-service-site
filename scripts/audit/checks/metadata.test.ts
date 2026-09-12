import assert from 'node:assert/strict';
import { test } from 'node:test';

import { distFrom } from '../testing.ts';

import { metadata } from './metadata.ts';

const description = 'A'.repeat(90);

function html(title: string, desc: string, robots = 'index, follow'): string {
    return `<html lang="lv"><head><title>${title}</title><meta name="description" content="${desc}"><meta name="robots" content="${robots}"></head><body></body></html>`;
}

test('a missing or short title and description are findings', () => {
    const findings = metadata(
        distFrom({
            pages: [
                { path: '/', html: html('Short', 'too short') },
                {
                    path: '/b',
                    html: '<html lang="lv"><head></head><body></body></html>',
                },
            ],
        }),
    );

    assert.deepEqual(
        findings.map((item) => `${item.at} ${item.detail}`),
        [
            '/ title is 5 characters, want 15 to 65',
            '/ description is 9 characters, want 70 to 160',
            '/b has no title',
            '/b has no description',
        ],
    );
});

test('two indexable pages may not share a title or a description', () => {
    const findings = metadata(
        distFrom({
            pages: [
                { path: '/', html: html('Pakalpojums Rīgā', description) },
                { path: '/b', html: html('Pakalpojums Rīgā', description) },
            ],
        }),
    );

    assert.deepEqual(
        findings.map((item) => item.detail),
        ['repeats the title of /', 'repeats the description of /'],
    );
});

test('a noindexed page is not held to the metadata rules', () => {
    const findings = metadata(
        distFrom({
            pages: [
                { path: '/paldies', html: html('Paldies', 'x', 'noindex') },
            ],
        }),
    );

    assert.deepEqual(findings, []);
});

test('distinct titles and descriptions within range pass', () => {
    const findings = metadata(
        distFrom({
            pages: [
                {
                    path: '/',
                    html: html('Pirmais pakalpojums Rīgā', description),
                },
                {
                    path: '/b',
                    html: html('Otrais pakalpojums Rīgā', `${description}B`),
                },
            ],
        }),
    );

    assert.deepEqual(findings, []);
});
