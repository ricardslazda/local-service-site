import { site } from '../../../src/site.ts';
import type { Check } from '../dist.ts';
import { finding } from '../dist.ts';

export const primaryAction: Check = ({ pages }) =>
    pages
        .filter((page) => page.indexable)
        .flatMap((page) =>
            page.$(`a[href="tel:${site.phone.e164}"]`).length > 0
                ? []
                : [
                      finding(
                          'primary-action',
                          page.path,
                          `has no link to tel:${site.phone.e164}`,
                      ),
                  ],
        );
