import { site } from '../../../src/site.ts';
import type { Check, Finding, Page } from '../dist.ts';
import { finding } from '../dist.ts';

const FETCHED = [
    ['script[src]', 'src'],
    ['img[src]', 'src'],
    ['iframe[src]', 'src'],
    ['source[src]', 'src'],
    ['video[src]', 'src'],
    ['video[poster]', 'poster'],
    ['audio[src]', 'src'],
    ['embed[src]', 'src'],
    ['object[data]', 'data'],
    ['use[href]', 'href'],
    ['image[href]', 'href'],
    [
        'link[href]:not([rel="canonical"]):not([rel="alternate"]):not([rel="me"])',
        'href',
    ],
] as const;

export function externalOrigin(value: string): string | undefined {
    const url = value.startsWith('//') ? `https:${value}` : value;

    if (!/^https?:\/\//i.test(url)) {
        return undefined;
    }

    try {
        const origin = new URL(url).origin;

        return origin === new URL(site.origin).origin ? undefined : origin;
    } catch {
        return undefined;
    }
}

export function originsInStyles(text: string): string[] {
    return [
        ...text.matchAll(/url\(\s*['"]?([^'")]+)/g),
        ...text.matchAll(/@import\s+['"]([^'"]+)/g),
    ]
        .map((match) => externalOrigin((match[1] ?? '').trim()))
        .filter((origin): origin is string => origin !== undefined);
}

function requests(page: Page): string[] {
    const attributes = FETCHED.flatMap(([selector, attribute]) =>
        page
            .$(selector)
            .toArray()
            .map((element) => page.$(element).attr(attribute) ?? ''),
    );
    const srcsets = page
        .$('img[srcset], source[srcset]')
        .toArray()
        .flatMap((element) =>
            (page.$(element).attr('srcset') ?? '')
                .split(',')
                .map((entry) => entry.trim().split(/\s+/)[0] ?? ''),
        );

    return [...attributes, ...srcsets];
}

function styles(page: Page): string {
    const inline = page
        .$('[style]')
        .toArray()
        .map((element) => page.$(element).attr('style') ?? '');
    const blocks = page
        .$('style')
        .toArray()
        .map((element) => page.$(element).html() ?? '');

    return [...inline, ...blocks].join('\n');
}

export const thirdParty: Check = ({ pages, stylesheets }) => {
    const findings: Finding[] = [];

    for (const page of pages) {
        for (const value of requests(page)) {
            const origin = externalOrigin(value);

            if (origin) {
                findings.push(
                    finding(
                        'third-party',
                        page.path,
                        `loads a resource from ${origin}`,
                    ),
                );
            }
        }

        for (const origin of originsInStyles(styles(page))) {
            findings.push(
                finding(
                    'third-party',
                    page.path,
                    `styling loads a resource from ${origin}`,
                ),
            );
        }

        page.$('form[action]').each((_, element) => {
            const action = page.$(element).attr('action') ?? '';
            const origin = externalOrigin(action);

            if (
                origin ||
                !(action.startsWith('/') || action.startsWith(site.origin))
            ) {
                findings.push(
                    finding(
                        'third-party',
                        page.path,
                        `posts a form to "${action}", which is not this origin`,
                    ),
                );
            }
        });
    }

    for (const sheet of stylesheets) {
        for (const origin of originsInStyles(sheet.bytes.toString('utf8'))) {
            findings.push(
                finding(
                    'third-party',
                    sheet.path,
                    `loads a resource from ${origin}`,
                ),
            );
        }
    }

    return findings;
};
