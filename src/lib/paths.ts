import type { Collection, Locale, StandalonePage } from '../site.ts';
import { locales, segments, site } from '../site.ts';

function join(...parts: string[]): string {
    const path = parts.filter((part) => part !== '').join('/');

    return `/${path}`;
}

export function homePath(locale: Locale): string {
    return join(locales[locale].prefix);
}

export function hubPath(locale: Locale, collection: Collection): string {
    return join(locales[locale].prefix, segments[locale][collection]);
}

export function servicePath(locale: Locale, slug: string): string {
    return join(locales[locale].prefix, segments[locale].services, slug);
}

export function locationPath(locale: Locale, slug: string): string {
    return join(locales[locale].prefix, segments[locale].locations, slug);
}

export function guidePath(locale: Locale, slug: string): string {
    return join(locales[locale].prefix, segments[locale].guides, slug);
}

export function jobPath(locale: Locale, slug: string): string {
    return join(locales[locale].prefix, segments[locale].jobs, slug);
}

export function townSectionPath(
    locale: Locale,
    townSlug: string,
    serviceSlug: string,
): string {
    return `${locationPath(locale, townSlug)}#${serviceSlug}`;
}

export function standalonePath(locale: Locale, page: StandalonePage): string {
    return join(locales[locale].prefix, segments[locale][page]);
}

export const anchors = { quote: 'quote', contact: 'contact' } as const;

export function anchorHref(name: keyof typeof anchors): string {
    return `#${anchors[name]}`;
}

export function absoluteUrl(path: string): string {
    return path === '/' ? `${site.origin}/` : `${site.origin}${path}`;
}

export function slugOf(entryId: string): string {
    const slug = entryId.split('/').at(-1);

    if (slug === undefined || slug === '') {
        throw new Error(`Entry id "${entryId}" carries no slug`);
    }

    return slug;
}

export function localeOf(entryId: string): Locale {
    const [locale] = entryId.split('/');

    if (locale === undefined || !(locale in locales)) {
        throw new Error(`Entry id "${entryId}" is not under a locale folder`);
    }

    return locale as Locale;
}
