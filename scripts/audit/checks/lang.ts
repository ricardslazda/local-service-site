import { locales } from '../../../src/site.ts';
import type { Check } from '../dist.ts';
import { finding } from '../dist.ts';

export const lang: Check = ({ pages }) =>
    pages.flatMap((page) => {
        const declared = page.$('html').attr('lang')?.trim() ?? '';
        const expected = locales[page.locale].htmlLang;

        if (declared === '') {
            return [
                finding('lang', page.path, 'has no lang attribute on <html>'),
            ];
        }

        if (declared !== expected) {
            return [
                finding(
                    'lang',
                    page.path,
                    `declares lang="${declared}", but a page under this prefix must declare "${expected}"`,
                ),
            ];
        }

        return [];
    });
