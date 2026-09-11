import type { Locale } from '../site.ts';
import { site } from '../site.ts';

const tags: Record<Locale, string> = { lv: 'lv-LV', ru: 'ru-LV' };

export function formatDate(date: Date, locale: Locale): string {
    return new Intl.DateTimeFormat(tags[locale], { dateStyle: 'long' }).format(
        date,
    );
}

export function isoDate(date: Date): string {
    return date.toISOString().slice(0, 10);
}

export function formatMonth(date: Date, locale: Locale): string {
    return new Intl.DateTimeFormat(tags[locale], {
        month: 'long',
        year: 'numeric',
    }).format(date);
}

export function formatPrice(amount: number, locale: Locale): string {
    return new Intl.NumberFormat(tags[locale], {
        style: 'currency',
        currency: site.currency,
        trailingZeroDisplay: 'stripIfInteger',
    }).format(amount);
}
