import type { Check, Finding, Page } from '../dist.ts';
import { finding } from '../dist.ts';

const TITLE = { min: 15, max: 65 };
const DESCRIPTION = { min: 70, max: 160 };

function unique(
    pages: Page[],
    read: (page: Page) => string,
    what: string,
): Finding[] {
    const owners = new Map<string, string>();
    const findings: Finding[] = [];

    for (const page of pages) {
        const value = read(page);

        if (value === '') {
            continue;
        }

        const owner = owners.get(value);

        if (owner) {
            findings.push(
                finding(
                    'metadata',
                    page.path,
                    `repeats the ${what} of ${owner}`,
                ),
            );
        } else {
            owners.set(value, page.path);
        }
    }

    return findings;
}

function within(
    page: Page,
    value: string,
    what: string,
    range: { min: number; max: number },
): Finding[] {
    if (value === '') {
        return [finding('metadata', page.path, `has no ${what}`)];
    }

    const length = [...value].length;

    if (length < range.min || length > range.max) {
        return [
            finding(
                'metadata',
                page.path,
                `${what} is ${length} characters, want ${range.min} to ${range.max}`,
            ),
        ];
    }

    return [];
}

const titleOf = (page: Page) => page.$('title').first().text().trim();
const descriptionOf = (page: Page) =>
    page.$('meta[name="description"]').attr('content')?.trim() ?? '';

export const metadata: Check = ({ pages }) => {
    const indexable = pages.filter((page) => page.indexable);

    return [
        ...indexable.flatMap((page) => [
            ...within(page, titleOf(page), 'title', TITLE),
            ...within(page, descriptionOf(page), 'description', DESCRIPTION),
        ]),
        ...unique(indexable, titleOf, 'title'),
        ...unique(indexable, descriptionOf, 'description'),
    ];
};
