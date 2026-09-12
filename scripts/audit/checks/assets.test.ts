import assert from 'node:assert/strict';
import { test } from 'node:test';

import { site } from '../../../src/site.ts';
import { distFrom, page } from '../testing.ts';

import { assets, localPath } from './assets.ts';

test('a share image, an icon and an image source must exist in the build', () => {
    const findings = assets(
        distFrom({
            pages: [
                page(
                    '/',
                    `<meta property="og:image" content="${site.origin}/og/lv.png"><link rel="icon" href="/favicon.svg">`,
                    '<img src="/images/photo.webp" srcset="/images/photo-480.webp 480w, /images/photo-960.webp 960w" width="1" height="1" alt="Photo">',
                ),
            ],
            files: ['/og/lv.png', '/images/photo-480.webp'],
        }),
    );

    assert.deepEqual(findings.map((item) => item.detail).sort(), [
        'references /favicon.svg, which is not in the build',
        'references /images/photo-960.webp, which is not in the build',
        'references /images/photo.webp, which is not in the build',
    ]);
});

test('data uris, fragments and other origins are not build assets', () => {
    assert.equal(localPath('data:image/png;base64,AAAA'), undefined);
    assert.equal(localPath('#main'), undefined);
    assert.equal(localPath('https://elsewhere.example/x.png'), undefined);
    assert.equal(localPath(`${site.origin}/og/lv.png?v=2`), '/og/lv.png');
    assert.equal(localPath('/_astro/a%20b.css'), '/_astro/a b.css');
});
