import { resolve } from 'node:path';

import { checks } from './checks/index.ts';
import { loadDist } from './dist.ts';

const dist = loadDist(resolve(import.meta.dirname, '..', '..', 'dist'));
const findings = checks.flatMap((check) => check(dist));
const indexable = dist.pages.filter((page) => page.indexable).length;

console.log(
    `audit: ${dist.pages.length} pages, ${indexable} indexable, ${checks.length} checks`,
);

if (findings.length > 0) {
    console.error(`\nFAILED (${findings.length}):`);

    for (const { check, at, detail } of findings) {
        console.error(`  x ${check}: ${at} ${detail}`);
    }

    process.exit(1);
}

console.log('All checks passed.');
