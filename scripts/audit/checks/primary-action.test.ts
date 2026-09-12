import assert from 'node:assert/strict';
import { test } from 'node:test';

import { site } from '../../../src/site.ts';
import { distFrom, page } from '../testing.ts';

import { primaryAction } from './primary-action.ts';

test('every indexable page offers the phone number as a tel link', () => {
    const findings = primaryAction(
        distFrom({
            pages: [
                page('/', '', `<a href="tel:${site.phone.e164}">Zvanīt</a>`),
                page('/a', '', '<a href="tel:+37100000000">Wrong number</a>'),
                page('/b', '', `<p>${site.phone.display}</p>`),
                page('/paldies', '<meta name="robots" content="noindex">', ''),
            ],
        }),
    );

    assert.deepEqual(
        findings.map((item) => item.at),
        ['/a', '/b'],
    );
});
