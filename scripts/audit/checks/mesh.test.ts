import assert from 'node:assert/strict';
import { test } from 'node:test';

import { distFrom, page } from '../testing.ts';

import { mesh } from './mesh.ts';

const serviceOne = '/pakalpojumi/pakalpojums-viens';
const serviceTwo = '/pakalpojumi/pakalpojums-divi';
const townOne = '/pilsetas/parauga-pilseta';
const townTwo = '/pilsetas/otra-pilseta';
const job = '/paveiktie-darbi/darbs-viens';
const link = (...hrefs: string[]) =>
    hrefs.map((href) => `<a href="${href}">x</a>`).join('');

test('towns and services that link each other, with a job linked both ways, pass', () => {
    const findings = mesh(
        distFrom({
            pages: [
                page(serviceOne, '', link(townOne, townTwo, job)),
                page(serviceTwo, '', link(townOne, townTwo)),
                page(townOne, '', link(serviceOne, serviceTwo, job)),
                page(townTwo, '', link(serviceOne, serviceTwo)),
                page(job, '', link(serviceOne, townOne)),
            ],
        }),
    );

    assert.deepEqual(findings, []);
});

test('every missing edge is named, and a job nobody lists is a finding', () => {
    const findings = mesh(
        distFrom({
            pages: [
                page(serviceOne, '', link(townOne, job)),
                page(serviceTwo, '', link(townTwo)),
                page(townOne, '', link(serviceOne, job)),
                page(townTwo, '', link(serviceOne, serviceTwo)),
                page(job, '', link(townOne)),
                page('/paveiktie-darbi/orphan', '', link(serviceOne, townTwo)),
            ],
        }),
    );

    assert.deepEqual(
        findings.map((item) => `${item.at} ${item.detail}`),
        [
            `${townOne} does not link to ${serviceTwo} from its body`,
            `${serviceOne} does not link to ${townTwo} from its body`,
            `${serviceTwo} does not link to ${townOne} from its body`,
            `${job} does not link back to its service page ${serviceOne}`,
            '/paveiktie-darbi/orphan is not linked from the body of any service page',
        ],
    );
});

test('links in the header and footer do not count', () => {
    const chrome = (links: string) =>
        `<html lang="lv"><body><header>${links}</header><main></main><footer>${links}</footer></body></html>`;
    const findings = mesh(
        distFrom({
            pages: [
                { path: serviceOne, html: chrome(link(townOne)) },
                { path: townOne, html: chrome(link(serviceOne)) },
            ],
        }),
    );

    assert.deepEqual(
        findings.map((item) => item.at),
        [townOne, serviceOne],
    );
});

test('the russian mesh resolves through its own segments', () => {
    const findings = mesh(
        distFrom({
            pages: [
                page(
                    '/ru/uslugi/usluga-odin',
                    '',
                    link('/ru/goroda/primer-gorod', '/ru/raboty/rabota-odna'),
                    'ru',
                ),
                page(
                    '/ru/goroda/primer-gorod',
                    '',
                    link('/ru/uslugi/usluga-odin', '/ru/raboty/rabota-odna'),
                    'ru',
                ),
                page(
                    '/ru/raboty/rabota-odna',
                    '',
                    link('/ru/uslugi/usluga-odin', '/ru/goroda/primer-gorod'),
                    'ru',
                ),
            ],
        }),
    );

    assert.deepEqual(findings, []);
});
