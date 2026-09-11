import { brotliCompressSync } from 'node:zlib';

import type { Check, Page } from '../dist.ts';
import { finding } from '../dist.ts';

export const JAVASCRIPT_BUDGET_BYTES = 30 * 1024;

function inlineScripts(pages: Page[]): string[] {
    const distinct = new Set<string>();

    for (const page of pages) {
        page.$('script:not([src])').each((_, element) => {
            const type = page.$(element).attr('type');

            if (
                !type ||
                /^(module|text\/javascript|application\/javascript)$/.test(type)
            ) {
                distinct.add(page.$(element).html() ?? '');
            }
        });
    }

    return [...distinct];
}

export const javascript: Check = ({ pages, scripts }) => {
    const served = scripts.filter(
        (script) => !script.path.includes('/.prerender/'),
    );
    const files = served.reduce(
        (total, script) => total + brotliCompressSync(script.bytes).byteLength,
        0,
    );
    const inline = inlineScripts(pages);
    const inlineBytes =
        inline.length === 0
            ? 0
            : brotliCompressSync(Buffer.from(inline.join('\n'))).byteLength;
    const total = files + inlineBytes;

    if (total <= JAVASCRIPT_BUDGET_BYTES) {
        return [];
    }

    return [
        finding(
            'javascript',
            'site',
            `ships ${(total / 1024).toFixed(1)} KB of compressed JavaScript across ${served.length} file(s) and ${inline.length} inline script(s), budget ${JAVASCRIPT_BUDGET_BYTES / 1024} KB`,
        ),
    ];
};
