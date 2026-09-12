import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { home } from '../../src/copy/home.ts';
import { t } from '../../src/i18n/strings.ts';
import { anchorHref, anchors, homePath } from '../../src/lib/paths.ts';
import type { Locale } from '../../src/site.ts';
import { localeCodes } from '../../src/site.ts';

import { pairedPage } from './pages.ts';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const opener = (page: Page, locale: Locale) =>
    page
        .getByRole('main')
        .getByRole('link', { name: home[locale].hero.primary })
        .first();
const dialogOf = (page: Page, locale: Locale) =>
    page.getByRole('dialog', { name: t(locale).wizard.title });

for (const locale of localeCodes) {
    test(`the quote wizard opens from the hero and walks its four steps (${locale})`, async ({
        page,
    }) => {
        await page.goto(homePath(locale));
        await opener(page, locale).click();

        const dialog = dialogOf(page, locale);
        const next = dialog.getByRole('button', {
            name: t(locale).wizard.next,
        });

        await expect(dialog).toBeVisible();
        await expect(dialog.locator('legend').first()).toBeFocused();
        await expect(dialog.locator('[aria-current="step"]')).toHaveCount(1);

        for (let step = 0; step < 3; step += 1) {
            await next.click();
        }

        await expect(
            dialog.getByRole('button', { name: t(locale).form.submit }),
        ).toBeVisible();
        await expect(next).toBeHidden();

        await dialog
            .getByRole('button', { name: t(locale).wizard.back })
            .click();

        await expect(next).toBeVisible();
    });
}

test('escape closes the wizard and returns focus to the button that opened it', async ({
    page,
}) => {
    await page.goto('/');
    await opener(page, 'lv').click();
    await expect(dialogOf(page, 'lv')).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(dialogOf(page, 'lv')).toBeHidden();
    await expect(opener(page, 'lv')).toBeFocused();
});

test('the wizard fits a 320px screen without horizontal overflow', async ({
    page,
}) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/');
    await opener(page, 'lv').click();

    const box = await dialogOf(page, 'lv').boundingBox();

    await expect(page.locator('html')).toHaveJSProperty('scrollWidth', 320);
    expect(box?.width).toBeLessThanOrEqual(320);
});

test('the open wizard has no WCAG 2.2 AA violations', async ({ page }) => {
    await page.goto('/');
    await opener(page, 'lv').click();
    await expect(dialogOf(page, 'lv')).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();

    expect(results.violations).toEqual([]);
});

test('a service page preselects its service in the wizard', async ({
    page,
}) => {
    const origin = pairedPage('service', 'lv', 'ru');

    test.skip(origin === undefined, 'no service page exists in both languages');

    const key = origin
        ?.$('select[name="service"] option[selected]')
        .attr('value');

    await page.goto(origin?.path ?? '/');
    await page
        .getByRole('link', { name: t('lv').cta.requestQuote })
        .first()
        .click();

    const dialog = dialogOf(page, 'lv');

    await expect(dialog.locator('input[name="service"]:checked')).toHaveValue(
        key ?? '',
    );
});

test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('the quote button reaches the inline form', async ({ page }) => {
        await page.goto('/');
        await opener(page, 'lv').click();

        await expect(page).toHaveURL(new RegExp(`${anchorHref('quote')}$`));
        await expect(page.locator(`#${anchors.quote}`)).toBeInViewport();
    });
});
