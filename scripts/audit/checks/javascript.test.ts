import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { test } from 'node:test';

import { distFrom, page } from '../testing.ts';

import { JAVASCRIPT_BUDGET_BYTES, javascript } from './javascript.ts';

const incompressible = (bytes: number) => randomBytes(bytes).toString('base64');

test('script files and inline scripts count together against the budget', () => {
    const findings = javascript(
        distFrom({
            pages: [
                page(
                    '/',
                    '',
                    `<script>${incompressible(JAVASCRIPT_BUDGET_BYTES / 2)}</script>`,
                ),
            ],
            scripts: [
                {
                    path: '/_astro/a.js',
                    text: incompressible(JAVASCRIPT_BUDGET_BYTES / 2),
                },
            ],
        }),
    );

    assert.equal(findings.length, 1);
    assert.match(findings[0]?.detail ?? '', /budget 30 KB/);
});

test('the same inline script on many pages is counted once', () => {
    const script = `<script>${incompressible(JAVASCRIPT_BUDGET_BYTES / 2)}</script>`;
    const findings = javascript(
        distFrom({
            pages: [
                page('/', '', script),
                page('/a', '', script),
                page('/b', '', script),
            ],
        }),
    );

    assert.deepEqual(findings, []);
});

test('json-ld and other data blocks are not scripts', () => {
    const findings = javascript(
        distFrom({
            pages: [
                page(
                    '/',
                    `<script type="application/ld+json">${incompressible(JAVASCRIPT_BUDGET_BYTES * 2)}</script>`,
                    '',
                ),
            ],
        }),
    );

    assert.deepEqual(findings, []);
});
