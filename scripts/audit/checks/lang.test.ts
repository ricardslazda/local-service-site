import assert from 'node:assert/strict';
import { test } from 'node:test';

import { distFrom, page } from '../testing.ts';

import { lang } from './lang.ts';

test('a page under the russian prefix must declare ru', () => {
    const findings = lang(
        distFrom({
            pages: [
                page('/', '', '<h1>Sākums</h1>', 'lv'),
                page('/ru/uslugi', '', '<h1>Услуги</h1>', 'lv'),
            ],
        }),
    );

    assert.equal(findings.length, 1);
    assert.equal(findings[0]?.at, '/ru/uslugi');
    assert.match(findings[0]?.detail ?? '', /must declare "ru"/);
});

test('a missing lang attribute is a finding', () => {
    const findings = lang(
        distFrom({
            pages: [
                { path: '/', html: '<html><head></head><body></body></html>' },
            ],
        }),
    );

    assert.equal(findings.length, 1);
    assert.match(findings[0]?.detail ?? '', /no lang/);
});

test('a correct lang passes', () => {
    const findings = lang(
        distFrom({
            pages: [page('/', '', '', 'lv'), page('/ru', '', '', 'ru')],
        }),
    );

    assert.deepEqual(findings, []);
});
