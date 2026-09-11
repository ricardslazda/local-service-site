import assert from 'node:assert/strict';
import { test } from 'node:test';

import { site } from '../site.ts';

import { businessId, pageGraph } from './graph.ts';

const home = {
    locale: 'lv' as const,
    url: `${site.origin}/`,
    title: site.name,
    description: 'Pakalpojumi Rīgā',
    areaServed: ['Rīga', 'Parauga pilsēta'],
};

function nodesOf(graph: ReturnType<typeof pageGraph>) {
    return graph['@graph'] as Record<string, unknown>[];
}

function typeOf(node: Record<string, unknown>): string {
    return String(node['@type']);
}

function references(value: unknown, found: string[] = []): string[] {
    if (Array.isArray(value)) {
        value.forEach((item) => references(item, found));
    } else if (value && typeof value === 'object') {
        const record = value as Record<string, unknown>;
        const keys = Object.keys(record);

        if (
            typeof record['@id'] === 'string' &&
            keys.every((key) => key === '@id' || key === 'name')
        ) {
            found.push(record['@id']);
        }

        for (const child of Object.values(record)) {
            references(child, found);
        }
    }

    return found;
}

function assertNoDanglingReferences(graph: ReturnType<typeof pageGraph>) {
    const declared = new Set(nodesOf(graph).map((node) => node['@id']));

    for (const id of references(
        nodesOf(graph).flatMap((node) => Object.values(node)),
    )) {
        assert.ok(
            declared.has(id),
            `graph points at ${id}, which no node declares`,
        );
    }
}

test('every page carries the one business node with its stable id', () => {
    const nodes = nodesOf(pageGraph(home));
    const business = nodes.find((node) => typeOf(node) === site.businessType);

    assert.ok(business);
    assert.equal(business['@id'], businessId);
    assert.equal(business.telephone, site.phone.e164);
    assert.deepEqual(business.areaServed, [
        { '@type': 'City', name: 'Rīga' },
        { '@type': 'City', name: 'Parauga pilsēta' },
    ]);
    assertNoDanglingReferences(pageGraph(home));
});

test('the website is published by the business and the page belongs to the website', () => {
    const nodes = nodesOf(pageGraph(home));
    const website = nodes.find((node) => typeOf(node) === 'WebSite');
    const page = nodes.find((node) => typeOf(node) === 'WebPage');

    assert.deepEqual(website?.publisher, { '@id': businessId });
    assert.deepEqual(page?.isPartOf, { '@id': website?.['@id'] });
    assert.equal(page?.inLanguage, 'lv');
});

test('a breadcrumb list appears only when there is a trail to show', () => {
    const withoutTrail = pageGraph({
        ...home,
        breadcrumbs: [{ name: 'Sākums', url: home.url }],
    });
    const withTrail = pageGraph({
        ...home,
        url: `${site.origin}/pakalpojumi`,
        breadcrumbs: [
            { name: 'Sākums', url: home.url },
            { name: 'Pakalpojumi', url: `${site.origin}/pakalpojumi` },
        ],
    });

    assert.equal(
        nodesOf(withoutTrail).some((node) => typeOf(node) === 'BreadcrumbList'),
        false,
    );
    assert.equal(
        nodesOf(withTrail).some((node) => typeOf(node) === 'BreadcrumbList'),
        true,
    );
    assertNoDanglingReferences(withTrail);
});

test('a service page states the service, its provider, its area and its starting price', () => {
    const url = `${site.origin}/pakalpojumi/pakalpojums-viens`;
    const graph = pageGraph({
        ...home,
        url,
        service: {
            url,
            name: 'Pirmais pakalpojums',
            description: 'Pirmais pakalpojums Rīgā un apkārtnē',
            serviceType: 'Pirmais pakalpojums',
            areaServed: ['Rīga'],
            priceFrom: { amount: 150, unit: 'par vienību' },
        },
    });
    const service = nodesOf(graph).find((node) => typeOf(node) === 'Service');

    assert.deepEqual(service?.provider, { '@id': businessId });
    assert.deepEqual(service?.areaServed, [{ '@type': 'City', name: 'Rīga' }]);
    assert.deepEqual(service?.offers, {
        '@type': 'Offer',
        priceCurrency: site.currency,
        priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: site.currency,
            minPrice: 150,
            unitText: 'par vienību',
        },
    });
    assertNoDanglingReferences(graph);
});

test('a service without a price carries no offer', () => {
    const url = `${site.origin}/pakalpojumi/pakalpojums-divi`;
    const graph = pageGraph({
        ...home,
        url,
        service: {
            url,
            name: 'Otrais pakalpojums',
            description: 'Otrais pakalpojums pēc pieprasījuma',
            serviceType: 'Otrais pakalpojums',
            areaServed: ['Rīga'],
        },
    });
    const service = nodesOf(graph).find((node) => typeOf(node) === 'Service');

    assert.equal('offers' in (service ?? {}), false);
});

test('a guide is a blog posting written and published by the business', () => {
    const url = `${site.origin}/padomi/padoms-viens`;
    const graph = pageGraph({
        ...home,
        url,
        article: {
            url,
            headline: 'Pirmais padoms',
            description: 'Parauga raksts klientiem',
            datePublished: new Date('2026-08-01'),
        },
    });
    const article = nodesOf(graph).find(
        (node) => typeOf(node) === 'BlogPosting',
    );

    assert.equal(
        article?.publisher && (article.publisher as { '@id': string })['@id'],
        businessId,
    );
    assert.equal(article?.datePublished, '2026-08-01T00:00:00.000Z');
    assertNoDanglingReferences(graph);
});
