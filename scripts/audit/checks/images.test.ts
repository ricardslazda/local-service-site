import assert from 'node:assert/strict';
import { test } from 'node:test';

import { distFrom, page } from '../testing.ts';

import { images } from './images.ts';

test('every image needs dimensions and alt text, on every page', () => {
    const findings = images(
        distFrom({
            pages: [
                page(
                    '/404',
                    '<meta name="robots" content="noindex">',
                    '<img src="/a.png" alt="A photo"><img src="/b.png" width="10" height="10" alt=""><img src="/c.png" width="10" height="10" alt="Photo">',
                ),
            ],
        }),
    );

    assert.deepEqual(
        findings.map((item) => item.detail),
        [
            'image /a.png has no width and height',
            'image /b.png has no alt text',
        ],
    );
});

test('a page without images has nothing to report', () => {
    assert.deepEqual(
        images(distFrom({ pages: [page('/', '', '<p>Text</p>')] })),
        [],
    );
});
