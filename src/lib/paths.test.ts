import assert from 'node:assert/strict';
import { test } from 'node:test';

import { site } from '../site.ts';

import {
    absoluteUrl,
    anchorHref,
    anchors,
    homePath,
    hubPath,
    localeOf,
    locationPath,
    guidePath,
    servicePath,
    slugOf,
    standalonePath,
    townSectionPath,
} from './paths.ts';

test('the default locale owns the root and the other locale a prefix', () => {
    assert.equal(homePath('lv'), '/');
    assert.equal(homePath('ru'), '/ru');
});

test('collection paths use the segment of their locale', () => {
    assert.equal(hubPath('lv', 'services'), '/pakalpojumi');
    assert.equal(hubPath('ru', 'services'), '/ru/uslugi');
    assert.equal(
        servicePath('lv', 'pakalpojums-viens'),
        '/pakalpojumi/pakalpojums-viens',
    );
    assert.equal(locationPath('ru', 'primer-gorod'), '/ru/goroda/primer-gorod');
    assert.equal(guidePath('lv', 'padoms-viens'), '/padomi/padoms-viens');
});

test('a town section is an anchor on the town page', () => {
    assert.equal(
        townSectionPath('lv', 'parauga-pilseta', 'pakalpojums-viens'),
        '/pilsetas/parauga-pilseta#pakalpojums-viens',
    );
});

test('an anchor href is a fragment naming its anchor', () => {
    assert.equal(anchorHref('quote'), `#${anchors.quote}`);
    assert.equal(anchorHref('contact'), `#${anchors.contact}`);
});

test('standalone pages have one segment per locale', () => {
    assert.equal(standalonePath('lv', 'contact'), '/kontakti');
    assert.equal(
        standalonePath('ru', 'privacy'),
        '/ru/politika-konfidencialnosti',
    );
});

test('no path carries a trailing slash except the root', () => {
    for (const path of [
        homePath('ru'),
        hubPath('lv', 'guides'),
        standalonePath('ru', 'about'),
    ]) {
        assert.doesNotMatch(path, /\/$/);
    }
});

test('absolute urls keep the origin and the root slash', () => {
    assert.equal(absoluteUrl('/'), `${site.origin}/`);
    assert.equal(absoluteUrl('/ru/uslugi'), `${site.origin}/ru/uslugi`);
});

test('an entry id names its locale and its slug', () => {
    assert.equal(localeOf('ru/usluga-odin'), 'ru');
    assert.equal(slugOf('lv/pakalpojums-viens'), 'pakalpojums-viens');
    assert.throws(() => localeOf('pakalpojums-viens'));
    assert.throws(() => slugOf('lv/'));
});
