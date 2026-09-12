import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { representativePages } from './pages.ts';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

for (const { type, locale, path } of representativePages()) {
    test(`${type} (${locale}) at ${path} has no WCAG 2.2 AA violations`, async ({
        page,
    }) => {
        await page.goto(path);

        const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();

        expect(results.violations).toEqual([]);
    });
}

test('the not-found page has no WCAG 2.2 AA violations', async ({ page }) => {
    await page.goto('/no-such-page');

    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();

    expect(results.violations).toEqual([]);
});
