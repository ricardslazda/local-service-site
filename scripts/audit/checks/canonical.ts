import { absoluteUrl } from '../../../src/lib/paths.ts';
import type { Check } from '../dist.ts';
import { finding } from '../dist.ts';

export const canonical: Check = ({ pages }) =>
    pages
        .filter((page) => page.indexable)
        .flatMap((page) => {
            const links = page.$('link[rel="canonical"]');
            const expected = absoluteUrl(page.path);

            if (links.length !== 1) {
                return [
                    finding(
                        'canonical',
                        page.path,
                        `has ${links.length} canonical links, want exactly one`,
                    ),
                ];
            }

            const href = links.attr('href') ?? '';

            return href === expected
                ? []
                : [
                      finding(
                          'canonical',
                          page.path,
                          `canonical is ${href}, want ${expected}`,
                      ),
                  ];
        });
