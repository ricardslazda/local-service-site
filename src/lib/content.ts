import { getCollection } from 'astro:content';
import type { CollectionEntry, CollectionKey } from 'astro:content';

import type { Locale } from '../site.ts';
import { localeCodes } from '../site.ts';

import { localeOf } from './paths.ts';

type Paired = {
    [K in CollectionKey]: CollectionEntry<K>['data'] extends {
        translationKey: string;
    }
        ? K
        : never;
}[CollectionKey];

export async function entriesIn<C extends Paired>(
    collection: C,
    locale: Locale,
): Promise<CollectionEntry<C>[]> {
    const entries = await getCollection(
        collection,
        ({ id }) => localeOf(id) === locale,
    );

    return entries.sort(byOrderThenTitle);
}

function byOrderThenTitle<C extends Paired>(
    left: CollectionEntry<C>,
    right: CollectionEntry<C>,
): number {
    const leftOrder = orderOf(left.data);
    const rightOrder = orderOf(right.data);

    if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
    }

    return left.data.title.localeCompare(right.data.title);
}

function orderOf(data: object): number {
    const { order } = data as { order?: unknown };

    return typeof order === 'number' ? order : Number.MAX_SAFE_INTEGER;
}

export async function alternatesOf<C extends Paired>(
    collection: C,
    entry: CollectionEntry<C>,
    pathFor: (locale: Locale, entry: CollectionEntry<C>) => string,
): Promise<Partial<Record<Locale, string>>> {
    const siblings = await getCollection(
        collection,
        ({ data }) => data.translationKey === entry.data.translationKey,
    );
    const alternates: Partial<Record<Locale, string>> = {};

    for (const locale of localeCodes) {
        const sibling = siblings.find(({ id }) => localeOf(id) === locale);

        if (sibling) {
            alternates[locale] = pathFor(locale, sibling);
        }
    }

    return alternates;
}

export async function guidesIn(
    locale: Locale,
): Promise<CollectionEntry<'guides'>[]> {
    const guides = await entriesIn('guides', locale);

    return guides.sort(
        (left, right) =>
            right.data.pubDate.getTime() - left.data.pubDate.getTime(),
    );
}

export async function testimonialsFor(
    filter: { location?: string; service?: string } = {},
): Promise<CollectionEntry<'testimonials'>[]> {
    const entries = await getCollection(
        'testimonials',
        ({ data }) =>
            (filter.location === undefined ||
                data.location === filter.location) &&
            (filter.service === undefined || data.service === filter.service),
    );

    return entries.sort(
        (left, right) => right.data.date.getTime() - left.data.date.getTime(),
    );
}

export async function pageOf(
    kind: CollectionEntry<'pages'>['data']['kind'],
    locale: Locale,
): Promise<CollectionEntry<'pages'>> {
    const entry = (await entriesIn('pages', locale)).find(
        ({ data }) => data.kind === kind,
    );

    if (!entry) {
        throw new Error(
            `No ${locale} page of kind "${kind}" in src/content/pages`,
        );
    }

    return entry;
}

const PAIRED_COLLECTIONS = [
    'services',
    'locations',
    'guides',
    'jobs',
    'pages',
] as const;

async function assertContent(): Promise<void> {
    for (const locale of localeCodes) {
        const keywordOwners = new Map<string, string>();

        for (const collection of PAIRED_COLLECTIONS) {
            const keyOwners = new Map<string, string>();

            for (const entry of await entriesIn(collection, locale)) {
                const keyword = entry.data.primaryKeyword.trim().toLowerCase();
                const keywordOwner = keywordOwners.get(keyword);

                if (keywordOwner) {
                    throw new Error(
                        `${collection}/${entry.id} targets "${keyword}", which ${keywordOwner} already targets`,
                    );
                }

                keywordOwners.set(keyword, `${collection}/${entry.id}`);

                const key = entry.data.translationKey;
                const keyOwner = keyOwners.get(key);

                if (keyOwner) {
                    throw new Error(
                        `${collection}/${entry.id} carries translationKey "${key}", which ${keyOwner} already carries`,
                    );
                }

                keyOwners.set(key, `${collection}/${entry.id}`);
            }
        }

        for (const collection of PAIRED_COLLECTIONS) {
            for (const entry of await entriesIn(collection, locale)) {
                for (const other of localeCodes.filter(
                    (code) => code !== locale,
                )) {
                    const counterpart = (
                        await entriesIn(collection, other)
                    ).find(
                        ({ data }) =>
                            data.translationKey === entry.data.translationKey,
                    );

                    if (!counterpart) {
                        throw new Error(
                            `${collection}/${entry.id} has no ${other} counterpart with translationKey "${entry.data.translationKey}"`,
                        );
                    }
                }
            }
        }

        for (const job of await entriesIn('jobs', locale)) {
            await entryByKey('services', locale, job.data.service);

            if (job.data.location) {
                await entryByKey('locations', locale, job.data.location);
            }
        }

        for (const testimonial of await getCollection('testimonials')) {
            if (testimonial.data.service) {
                await entryByKey('services', locale, testimonial.data.service);
            }

            if (testimonial.data.job) {
                await entryByKey('jobs', locale, testimonial.data.job);
            }
        }

        const serviceKeys = (await entriesIn('services', locale)).map(
            (service) => service.data.translationKey,
        );

        for (const town of await entriesIn('locations', locale)) {
            const covered = new Set<string>();

            for (const section of town.data.sections) {
                await entryByKey('services', locale, section.service);

                if (covered.has(section.service)) {
                    throw new Error(
                        `locations/${town.id} has two sections for "${section.service}"`,
                    );
                }

                covered.add(section.service);
            }

            for (const key of serviceKeys) {
                if (!covered.has(key)) {
                    throw new Error(
                        `locations/${town.id} has no section for "${key}"`,
                    );
                }
            }
        }
    }
}

let contentChecked: Promise<void> | undefined;

export function assertContentOnce(): Promise<void> {
    contentChecked ??= assertContent();

    return contentChecked;
}

export async function entryByKey<C extends Paired>(
    collection: C,
    locale: Locale,
    key: string,
): Promise<CollectionEntry<C>> {
    const entry = (await entriesIn(collection, locale)).find(
        ({ data }) => data.translationKey === key,
    );

    if (!entry) {
        throw new Error(
            `No ${locale} ${collection} entry with translationKey "${key}"`,
        );
    }

    return entry;
}

export async function jobsIn(
    locale: Locale,
): Promise<CollectionEntry<'jobs'>[]> {
    const jobs = await entriesIn('jobs', locale);

    return jobs.sort(
        (left, right) =>
            right.data.pubDate.getTime() - left.data.pubDate.getTime(),
    );
}

export async function jobsFor(
    locale: Locale,
    filter: { service?: string; location?: string },
): Promise<CollectionEntry<'jobs'>[]> {
    return (await jobsIn(locale)).filter(
        ({ data }) =>
            (filter.service === undefined || data.service === filter.service) &&
            (filter.location === undefined ||
                data.location === filter.location),
    );
}
