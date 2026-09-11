import type { LocalBusiness } from 'schema-dts';

export type Locale = 'lv' | 'ru';

export interface LocaleDefinition {
    name: string;
    htmlLang: string;
    hreflang: string;
    ogLocale: string;
    prefix: string;
}

export const defaultLocale: Locale = 'lv';

export const locales: Record<Locale, LocaleDefinition> = {
    lv: {
        name: 'Latviešu',
        htmlLang: 'lv',
        hreflang: 'lv',
        ogLocale: 'lv_LV',
        prefix: '',
    },
    ru: {
        name: 'Русский',
        htmlLang: 'ru',
        hreflang: 'ru-LV',
        ogLocale: 'ru_RU',
        prefix: 'ru',
    },
};

export const localeCodes = Object.keys(locales) as Locale[];

export type Collection = 'services' | 'locations' | 'guides' | 'jobs';
export type StandalonePage =
    'about' | 'contact' | 'thanks' | 'privacy' | 'prices' | 'faq' | 'reviews';

export const segments: Record<
    Locale,
    Record<Collection | StandalonePage, string>
> = {
    lv: {
        services: 'pakalpojumi',
        locations: 'pilsetas',
        guides: 'padomi',
        jobs: 'paveiktie-darbi',
        about: 'par-mums',
        contact: 'kontakti',
        thanks: 'paldies',
        privacy: 'privatuma-politika',
        prices: 'cenas',
        faq: 'jautajumi',
        reviews: 'atsauksmes',
    },
    ru: {
        services: 'uslugi',
        locations: 'goroda',
        guides: 'sovety',
        jobs: 'raboty',
        about: 'o-nas',
        contact: 'kontakty',
        thanks: 'spasibo',
        privacy: 'politika-konfidencialnosti',
        prices: 'ceny',
        faq: 'voprosy',
        reviews: 'otzyvy',
    },
};

export type Weekday =
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday';

export interface OpeningHours {
    days: Weekday[];
    opens: string;
    closes: string;
}

export const serviceGroups = ['core', 'extra'] as const;

export type ServiceGroup = (typeof serviceGroups)[number];

type BusinessType = Exclude<LocalBusiness, string>['@type'];

export const site = {
    name: 'Example Services',
    legalName: 'SIA "Example Services"',
    slug: 'example-services',
    businessType: 'LocalBusiness' satisfies BusinessType,
    origin: 'https://example.com',
    registrationNumber: '40000000000',
    vatNumber: 'LV40000000000',
    founded: 2015,
    currency: 'EUR',
    serviceRadiusKm: 25,
    phone: { e164: '+37120000000', display: '+371 20 000 000' },
    email: 'info@example.com',
    address: {
        street: 'Example iela 1',
        locality: 'Rīga',
        postalCode: 'LV-1000',
        country: 'LV',
    },
    geo: { latitude: 56.9496, longitude: 24.1052 },
    openingHours: [
        {
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '08:00',
            closes: '18:00',
        },
        { days: ['Saturday'], opens: '09:00', closes: '14:00' },
    ] satisfies OpeningHours[],
    formEndpoint: '/api/lead',
    mapsUrl:
        'https://www.google.com/maps/search/?api=1&query=Example+iela+1+R%C4%ABga',
    updated: {
        home: new Date('2026-09-02'),
        contact: new Date('2026-09-02'),
    },
} as const;
