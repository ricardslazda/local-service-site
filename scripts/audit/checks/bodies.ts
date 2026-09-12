import type { Check, Finding, Page, PageType } from '../dist.ts';
import { finding } from '../dist.ts';

export const MIN_WORDS = 150;
export const MAX_SIMILARITY = 0.5;
const SHINGLE_WORDS = 5;
const MIN_SHINGLES = 50;
const PROSE_PAGES = new Set<PageType>(['service', 'location', 'guide', 'job']);

export function bodyText(page: Page): string {
    const scope =
        page.$('article').length > 0
            ? page.$('article').first()
            : page.$('main').first();
    const copy = scope.clone();

    copy.find('form, nav').remove();

    return copy.text();
}

function wordsOf(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .split(/\s+/)
        .filter(Boolean);
}

function shinglesOf(words: string[]): Set<string> {
    const shingles = new Set<string>();

    for (let start = 0; start + SHINGLE_WORDS <= words.length; start++) {
        shingles.add(words.slice(start, start + SHINGLE_WORDS).join(' '));
    }

    return shingles;
}

export function similarity(left: Set<string>, right: Set<string>): number {
    let shared = 0;

    for (const shingle of left) {
        if (right.has(shingle)) {
            shared++;
        }
    }

    return shared / (left.size + right.size - shared);
}

export const bodies: Check = ({ pages }) => {
    const findings: Finding[] = [];
    const measured = pages
        .filter((page) => page.indexable)
        .map((page) => {
            const words = wordsOf(bodyText(page));

            return { page, words: words.length, shingles: shinglesOf(words) };
        });

    for (const { page, words } of measured) {
        if (PROSE_PAGES.has(page.type) && words < MIN_WORDS) {
            findings.push(
                finding(
                    'bodies',
                    page.path,
                    `has ${words} words of body copy, want at least ${MIN_WORDS}`,
                ),
            );
        }
    }

    const comparable = measured.filter(
        ({ shingles }) => shingles.size >= MIN_SHINGLES,
    );

    for (let left = 0; left < comparable.length; left++) {
        for (let right = left + 1; right < comparable.length; right++) {
            const a = comparable[left];
            const b = comparable[right];

            if (!a || !b || a.page.locale !== b.page.locale) {
                continue;
            }

            const overlap = similarity(a.shingles, b.shingles);

            if (overlap >= MAX_SIMILARITY) {
                findings.push(
                    finding(
                        'bodies',
                        a.page.path,
                        `shares ${Math.round(overlap * 100)}% of its body copy with ${b.page.path}, want under ${MAX_SIMILARITY * 100}%`,
                    ),
                );
            }
        }
    }

    return findings;
};
