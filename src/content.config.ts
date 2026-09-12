import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

import { serviceGroups } from './site.ts';

const question = z.object({
    question: z.string().min(5),
    answer: z.string().min(20),
});

const reference = z.object({
    collection: z.enum(['services', 'guides', 'pages']),
    key: z.string().regex(/^[a-z0-9-]+$/),
});

const priceFrom = z.object({
    amount: z.number().positive(),
    unit: z.string().min(1).optional(),
});

const priceRow = z.object({
    item: z.string().min(3),
    from: z.number().positive(),
    unit: z.string().min(1).optional(),
});

const fact = z.object({ label: z.string().min(2), value: z.string().min(1) });

const titled = z.object({ title: z.string().min(2), body: z.string().min(20) });

const key = z.string().regex(/^[a-z0-9-]+$/);

const page = z.object({
    title: z.string().min(15).max(48),
    description: z.string().min(70).max(160),
    primaryKeyword: z.string().min(3),
    translationKey: key,
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
});

const services = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
    schema: ({ image }) =>
        page.extend({
            name: z.string().min(3),
            summary: z.string().min(40).max(220),
            order: z.number().int().positive(),
            group: z.enum(serviceGroups),
            priceFrom: priceFrom.optional(),
            photo: image(),
            photoAlt: z.string().min(5),
            intro: z.string().min(80),
            facts: z.array(fact).length(3),
            covers: z.object({
                heading: z.string().min(3),
                items: z.array(titled).min(2),
            }),
            steps: z.object({
                heading: z.string().min(3),
                items: z.array(titled).min(3),
            }),
            prices: z.object({
                rows: z.array(priceRow).min(1),
                note: z.string().min(20),
            }),
            quoteHeading: z.string().min(5),
            questions: z.array(question).default([]),
        }),
});

const locations = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/locations' }),
    schema: page.extend({
        name: z.string().min(2),
        inPlace: z.string().min(3),
        summary: z.string().min(40).max(220),
        order: z.number().int().positive(),
        coordinates: z.object({ latitude: z.number(), longitude: z.number() }),
        distanceKm: z.number().positive(),
        travelMinutes: z.number().int().positive(),
        facts: z.array(z.string().min(10)).length(3),
        sections: z
            .array(
                z.object({
                    service: key,
                    heading: z.string().min(5),
                    body: z.string().min(120),
                }),
            )
            .min(1),
        questions: z.array(question).default([]),
    }),
});

const guides = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
    schema: ({ image }) =>
        page.extend({
            image: image(),
            imageAlt: z.string().min(5),
            services: z.array(key).default([]),
        }),
});

const jobs = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/jobs' }),
    schema: ({ image }) =>
        page.extend({
            summary: z.string().min(40).max(220),
            service: key,
            location: key.optional(),
            facts: z.array(fact).min(1).max(4),
            duration: z.string().min(2),
            priceBand: z.string().min(3),
            year: z.number().int().min(1900),
            photos: z.object({ before: image(), after: image() }),
            photoAlt: z.object({
                before: z.string().min(5),
                after: z.string().min(5),
            }),
        }),
});

const pages = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
    schema: page.extend({
        kind: z.enum(['about', 'privacy', 'prices', 'faq', 'reviews']),
        summary: z.string().min(40).max(220).optional(),
        questions: z
            .array(question.extend({ more: reference.optional() }))
            .optional(),
        examples: z
            .array(
                z.object({
                    title: z.string().min(5),
                    facts: z.array(fact).min(1).max(4),
                    total: z.string().min(3),
                }),
            )
            .optional(),
    }),
});

const localized = z.object({ lv: z.string().min(1), ru: z.string().min(1) });

const testimonials = defineCollection({
    loader: file('./src/content/testimonials.json'),
    schema: ({ image }) =>
        z.object({
            name: z.string().min(2),
            place: localized,
            work: localized,
            quote: z.object({ lv: z.string().min(60), ru: z.string().min(60) }),
            photo: image(),
            photoAlt: localized,
            date: z.coerce.date(),
            location: key.optional(),
            service: key.optional(),
            job: key.optional(),
        }),
});

export const collections = {
    services,
    locations,
    guides,
    jobs,
    pages,
    testimonials,
};
