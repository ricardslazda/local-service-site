// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';

import { defaultLocale, localeCodes, site } from './src/site.ts';

export default defineConfig({
    site: site.origin,
    trailingSlash: 'never',
    compressHTML: true,
    build: {
        format: 'file',
    },
    i18n: {
        defaultLocale,
        locales: localeCodes,
        routing: {
            prefixDefaultLocale: false,
        },
    },
    fonts: [
        {
            provider: fontProviders.google(),
            name: 'Fira Sans Extra Condensed',
            cssVariable: '--font-fira-sans-extra-condensed',
            weights: [600, 700, 800],
            styles: ['normal'],
            subsets: ['latin', 'latin-ext', 'cyrillic'],
            fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
        },
        {
            provider: fontProviders.google(),
            name: 'Fira Sans',
            cssVariable: '--font-fira-sans',
            weights: [400, 500, 600],
            styles: ['normal'],
            subsets: ['latin', 'latin-ext', 'cyrillic'],
            fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
        },
    ],
    vite: {
        plugins: [tailwindcss()],
    },
});
