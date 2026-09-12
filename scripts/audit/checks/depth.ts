import { homePath } from '../../../src/lib/paths.ts';
import { localeCodes } from '../../../src/site.ts';
import type { Check, Finding, Page } from '../dist.ts';
import { finding } from '../dist.ts';

import { internalPath } from './links.ts';

export const MAX_CLICKS = 3;

function targetsOf(page: Page, known: Set<string>): string[] {
    return page
        .$('a[href]')
        .toArray()
        .map((element) => internalPath(page.$(element).attr('href') ?? ''))
        .filter(
            (path): path is string => path !== undefined && known.has(path),
        );
}

export const depth: Check = ({ pages }) => {
    const indexable = pages.filter((page) => page.indexable);
    const byPath = new Map(indexable.map((page) => [page.path, page]));
    const known = new Set(byPath.keys());
    const findings: Finding[] = [];

    for (const locale of localeCodes) {
        const home = homePath(locale);

        if (!byPath.has(home)) {
            findings.push(
                finding(
                    'depth',
                    home,
                    'is not an indexable page, so nothing can be reached from it',
                ),
            );
            continue;
        }

        const distance = new Map([[home, 0]]);
        const queue = [home];

        while (queue.length > 0) {
            const current = queue.shift() ?? home;
            const page = byPath.get(current);

            for (const next of page ? targetsOf(page, known) : []) {
                if (!distance.has(next)) {
                    distance.set(next, (distance.get(current) ?? 0) + 1);
                    queue.push(next);
                }
            }
        }

        for (const page of indexable.filter(
            (candidate) => candidate.locale === locale,
        )) {
            const clicks = distance.get(page.path);

            if (clicks === undefined) {
                findings.push(
                    finding(
                        'depth',
                        page.path,
                        `is not reachable from ${home}`,
                    ),
                );
            } else if (clicks > MAX_CLICKS) {
                findings.push(
                    finding(
                        'depth',
                        page.path,
                        `is ${clicks} clicks from ${home}, want at most ${MAX_CLICKS}`,
                    ),
                );
            }
        }
    }

    return findings;
};
