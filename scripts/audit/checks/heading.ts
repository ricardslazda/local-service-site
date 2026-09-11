import type { Check } from '../dist.ts';
import { finding } from '../dist.ts';

export const heading: Check = ({ pages }) =>
    pages
        .filter((page) => page.indexable)
        .flatMap((page) => {
            const count = page.$('h1').length;

            return count === 1
                ? []
                : [
                      finding(
                          'heading',
                          page.path,
                          `has ${count} h1 elements, want exactly one`,
                      ),
                  ];
        });
