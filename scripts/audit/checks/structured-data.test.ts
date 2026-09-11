import assert from 'node:assert/strict';
import { test } from 'node:test';

import { businessId } from '../../../src/lib/graph.ts';
import { site } from '../../../src/site.ts';
import { distFrom, page } from '../testing.ts';

import { structuredData } from './structured-data.ts';

function script(graph: unknown): string {
    return `<script type="application/ld+json">${JSON.stringify(graph)}</script>`;
}

const business = {
    '@type': site.businessType,
    '@id': businessId,
    name: site.name,
};

test('a page whose graph declares the business and resolves every reference passes', () => {
    const findings = structuredData(
        distFrom({
            pages: [
                page(
                    '/',
                    script({
                        '@context': 'https://schema.org',
                        '@graph': [
                            business,
                            {
                                '@type': 'WebSite',
                                '@id': 'https://x/#site',
                                publisher: { '@id': businessId },
                            },
                        ],
                    }),
                    '',
                ),
            ],
        }),
    );

    assert.deepEqual(findings, []);
});

test('a missing business node, a dangling reference and broken JSON are findings', () => {
    const findings = structuredData(
        distFrom({
            pages: [
                page(
                    '/a',
                    script({
                        '@graph': [
                            {
                                '@type': 'WebPage',
                                '@id': 'https://x/a',
                                isPartOf: { '@id': 'https://x/#site' },
                            },
                        ],
                    }),
                    '',
                ),
                page(
                    '/b',
                    '<script type="application/ld+json">{not json</script>',
                    '',
                ),
            ],
        }),
    );

    assert.deepEqual(
        findings.map((item) => item.at),
        ['/a', '/a', '/b', '/b'],
    );
    assert.equal(
        findings[0]?.detail,
        `declares no business node with @id ${businessId}`,
    );
    assert.match(
        findings[1]?.detail ?? '',
        /^points at https:\/\/x\/#site, which no node/,
    );
    assert.match(findings[2]?.detail ?? '', /^has JSON-LD that does not parse/);
    assert.equal(
        findings[3]?.detail,
        `declares no business node with @id ${businessId}`,
    );
});

test('a noindexed page is not held to the graph', () => {
    const findings = structuredData(
        distFrom({
            pages: [
                page('/paldies', '<meta name="robots" content="noindex">', ''),
            ],
        }),
    );

    assert.deepEqual(findings, []);
});
