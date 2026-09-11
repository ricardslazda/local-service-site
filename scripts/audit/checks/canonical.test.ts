import assert from 'node:assert/strict';
import { test } from 'node:test';

import { site } from '../../../src/site.ts';
import { distFrom, page } from '../testing.ts';

import { canonical } from './canonical.ts';

test('the canonical must name the page itself on the site origin', () => {
    const findings = canonical(
        distFrom({
            pages: [
                page(
                    '/pakalpojumi',
                    `<link rel="canonical" href="${site.origin}/pakalpojumi.html">`,
                    '',
                ),
                page('/ru', '', ''),
                page('/', `<link rel="canonical" href="${site.origin}/">`, ''),
                page(
                    '/kontakti',
                    `<link rel="canonical" href="${site.origin}/kontakti">`,
                    '',
                ),
            ],
        }),
    );

    assert.deepEqual(
        findings.map((item) => `${item.at} ${item.detail}`),
        [
            `/pakalpojumi canonical is ${site.origin}/pakalpojumi.html, want ${site.origin}/pakalpojumi`,
            '/ru has 0 canonical links, want exactly one',
        ],
    );
});

test('a noindexed page carries no canonical and is not asked for one', () => {
    const findings = canonical(
        distFrom({
            pages: [
                page('/paldies', '<meta name="robots" content="noindex">', ''),
            ],
        }),
    );

    assert.deepEqual(findings, []);
});
