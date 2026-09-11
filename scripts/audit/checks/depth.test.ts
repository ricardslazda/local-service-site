import assert from 'node:assert/strict';
import { test } from 'node:test';

import { distFrom, page } from '../testing.ts';

import { depth } from './depth.ts';

const link = (href: string) => `<a href="${href}">x</a>`;

test('a page more than three clicks from its home, or unreachable, is a finding', () => {
    const findings = depth(
        distFrom({
            pages: [
                page('/', '', link('/a')),
                page('/a', '', link('/b')),
                page('/b', '', link('/c')),
                page('/c', '', link('/d')),
                page('/d', '', ''),
                page('/orphan', '', ''),
                page('/ru', '', '', 'ru'),
            ],
        }),
    );

    assert.deepEqual(
        findings.map((item) => `${item.at} ${item.detail}`),
        [
            '/d is 4 clicks from /, want at most 3',
            '/orphan is not reachable from /',
        ],
    );
});

test('a locale without an indexable home cannot be measured', () => {
    const findings = depth(distFrom({ pages: [page('/', '', '')] }));

    assert.deepEqual(
        findings.map((item) => item.at),
        ['/ru'],
    );
});

test('links through the navigation count, and noindexed pages are neither targets nor measured', () => {
    const findings = depth(
        distFrom({
            pages: [
                page('/', '', link('/paldies')),
                page(
                    '/paldies',
                    '<meta name="robots" content="noindex">',
                    link('/deep'),
                ),
                page('/deep', '', ''),
                page('/ru', '', '', 'ru'),
            ],
        }),
    );

    assert.deepEqual(
        findings.map((item) => item.at),
        ['/deep'],
    );
});
