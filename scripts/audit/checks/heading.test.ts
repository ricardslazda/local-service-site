import assert from 'node:assert/strict';
import { test } from 'node:test';

import { distFrom, page } from '../testing.ts';

import { heading } from './heading.ts';

test('an indexable page needs exactly one h1', () => {
    const findings = heading(
        distFrom({
            pages: [
                page('/', '', '<h1>A</h1><h1>B</h1>'),
                page('/b', '', '<h2>Only a subheading</h2>'),
                page('/c', '', '<h1>One</h1>'),
            ],
        }),
    );

    assert.deepEqual(
        findings.map((item) => `${item.at} ${item.detail}`),
        [
            '/ has 2 h1 elements, want exactly one',
            '/b has 0 h1 elements, want exactly one',
        ],
    );
});

test('a noindexed page may shape its heading as it likes', () => {
    const findings = heading(
        distFrom({
            pages: [
                page(
                    '/404',
                    '<meta name="robots" content="noindex">',
                    '<h1>A</h1><h1>B</h1>',
                ),
            ],
        }),
    );

    assert.deepEqual(findings, []);
});
