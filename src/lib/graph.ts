import {
    assembleGraph,
    buildArticle,
    buildBreadcrumbList,
    buildPiece,
    buildWebPage,
    buildWebSite,
    makeIds,
} from '@jdevalk/seo-graph-core';
import type { BreadcrumbItem, GraphEntity } from '@jdevalk/seo-graph-core';
import type { LocalBusiness, Service } from 'schema-dts';

import type { Locale } from '../site.ts';
import { localeCodes, locales, site } from '../site.ts';

const ids = makeIds({ siteUrl: site.origin });
const websiteUrl = `${site.origin}/`;

export const businessId = ids.organization(site.slug);

export interface PriceFrom {
    amount: number;
    unit?: string;
}

export interface ServiceInput {
    url: string;
    name: string;
    description: string;
    serviceType: string;
    areaServed: readonly string[];
    priceFrom?: PriceFrom;
}

export interface ArticleInput {
    url: string;
    headline: string;
    description: string;
    datePublished: Date;
    dateModified?: Date;
}

export interface PageGraphInput {
    locale: Locale;
    url: string;
    title: string;
    description: string;
    pageType?: 'WebPage' | 'CollectionPage';
    breadcrumbs?: readonly BreadcrumbItem[];
    areaServed?: readonly string[];
    service?: ServiceInput;
    article?: ArticleInput;
    datePublished?: Date;
    dateModified?: Date;
}

function city(name: string) {
    return { '@type': 'City' as const, name };
}

function business(areaServed: readonly string[]): GraphEntity {
    return buildPiece<LocalBusiness>({
        '@type': site.businessType,
        '@id': businessId,
        name: site.name,
        legalName: site.legalName,
        url: websiteUrl,
        telephone: site.phone.e164,
        email: site.email,
        vatID: site.vatNumber,
        foundingDate: String(site.founded),
        knowsLanguage: localeCodes.map((code) => locales[code].htmlLang),
        address: {
            '@type': 'PostalAddress',
            streetAddress: site.address.street,
            addressLocality: site.address.locality,
            postalCode: site.address.postalCode,
            addressCountry: site.address.country,
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: site.geo.latitude,
            longitude: site.geo.longitude,
        },
        openingHoursSpecification: site.openingHours.map((hours) => ({
            '@type': 'OpeningHoursSpecification' as const,
            dayOfWeek: hours.days.map(
                (day) => `https://schema.org/${day}` as const,
            ),
            opens: hours.opens,
            closes: hours.closes,
        })),
        ...(areaServed.length > 0 ? { areaServed: areaServed.map(city) } : {}),
    });
}

function service(input: ServiceInput): GraphEntity {
    const offers = input.priceFrom
        ? {
              offers: {
                  '@type': 'Offer' as const,
                  priceCurrency: site.currency,
                  priceSpecification: {
                      '@type': 'PriceSpecification' as const,
                      priceCurrency: site.currency,
                      minPrice: input.priceFrom.amount,
                      ...(input.priceFrom.unit
                          ? { unitText: input.priceFrom.unit }
                          : {}),
                  },
              },
          }
        : {};

    return buildPiece<Service>({
        '@type': 'Service',
        '@id': `${input.url}#service`,
        name: input.name,
        description: input.description,
        serviceType: input.serviceType,
        url: input.url,
        provider: { '@id': businessId },
        areaServed: input.areaServed.map(city),
        ...offers,
    });
}

export function pageGraph(input: PageGraphInput) {
    const language = locales[input.locale].htmlLang;
    const breadcrumbs = input.breadcrumbs ?? [];
    const hasTrail = breadcrumbs.length > 1;
    const pieces: GraphEntity[] = [
        business(input.areaServed ?? []),
        buildWebSite(
            {
                url: websiteUrl,
                name: site.name,
                publisher: { '@id': businessId },
                inLanguage: language,
            },
            ids,
        ),
        buildWebPage(
            {
                url: input.url,
                name: input.title,
                description: input.description,
                isPartOf: { '@id': ids.website },
                inLanguage: language,
                ...(hasTrail
                    ? { breadcrumb: { '@id': ids.breadcrumb(input.url) } }
                    : {}),
                ...(input.datePublished
                    ? { datePublished: input.datePublished }
                    : {}),
                ...(input.dateModified
                    ? { dateModified: input.dateModified }
                    : {}),
            },
            ids,
            input.pageType ?? 'WebPage',
        ),
    ];

    if (hasTrail) {
        pieces.push(
            buildBreadcrumbList({ url: input.url, items: breadcrumbs }, ids),
        );
    }

    if (input.service) {
        pieces.push(service(input.service));
    }

    if (input.article) {
        pieces.push(
            buildArticle(
                {
                    url: input.article.url,
                    isPartOf: { '@id': ids.webPage(input.url) },
                    author: { '@id': businessId, name: site.name },
                    publisher: { '@id': businessId },
                    headline: input.article.headline,
                    description: input.article.description,
                    datePublished: input.article.datePublished,
                    ...(input.article.dateModified
                        ? { dateModified: input.article.dateModified }
                        : {}),
                    inLanguage: language,
                },
                ids,
                'BlogPosting',
            ),
        );
    }

    return assembleGraph(pieces, { warnOnDanglingReferences: true });
}
