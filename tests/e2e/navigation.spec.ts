import { expect, test } from '@playwright/test';

import { t } from '../../src/i18n/strings.ts';
import { homePath } from '../../src/lib/paths.ts';
import { locales, site } from '../../src/site.ts';

import { alternateOf, pairedPage, representativePages } from './pages.ts';

for (const type of ['service', 'job'] as const) {
    test(`the language switcher follows a ${type} page rather than going home`, async ({
        page,
    }) => {
        const origin = pairedPage(type, 'lv', 'ru');

        test.skip(
            origin === undefined,
            `no ${type} page exists in both languages`,
        );

        const path = origin?.path ?? '/';
        const expected = origin ? alternateOf(origin, 'ru') : undefined;

        await page.goto(path);
        await page
            .getByRole('navigation', { name: t('lv').language })
            .getByRole('link', { name: locales.ru.name })
            .click();

        expect(new URL(page.url()).pathname).toBe(expected);
        await expect(page).not.toHaveURL(homePath('ru'));

        await page
            .getByRole('navigation', { name: t('ru').language })
            .getByRole('link', { name: locales.lv.name })
            .click();

        expect(new URL(page.url()).pathname).toBe(path);
    });
}

for (const { type, locale, path } of representativePages()) {
    test(`${type} (${locale}) offers the phone number`, async ({ page }) => {
        await page.goto(path);

        await expect(
            page.locator(`a[href="tel:${site.phone.e164}"]`).first(),
        ).toBeVisible();
    });
}

test('the call bar is reachable and nothing overflows at 320px', async ({
    page,
}) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/');

    await expect(
        page.locator(`a[href="tel:${site.phone.e164}"]:visible`).last(),
    ).toBeVisible();
    await expect(page.locator('html')).toHaveJSProperty('scrollWidth', 320);
});

test('the skip link is the first focusable element and moves focus to the main region', async ({
    page,
}) => {
    await page.goto('/');
    await page.keyboard.press('Tab');

    await expect(
        page.getByRole('link', { name: t('lv').skipToContent }),
    ).toBeFocused();
});

test('a missing page answers with a 404 status and stays at its address', async ({
    page,
}) => {
    const response = await page.goto('/no-such-page');

    expect(response?.status()).toBe(404);
    await expect(page).toHaveURL('/no-such-page');
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
});
