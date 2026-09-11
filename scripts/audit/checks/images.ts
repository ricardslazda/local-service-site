import type { Check } from '../dist.ts';
import { finding } from '../dist.ts';

export const images: Check = ({ pages }) =>
    pages.flatMap((page) =>
        page
            .$('img')
            .toArray()
            .flatMap((element) => {
                const image = page.$(element);
                const src = image.attr('src') ?? '(no src)';
                const problems: string[] = [];

                if (!image.attr('width') || !image.attr('height')) {
                    problems.push('has no width and height');
                }

                if ((image.attr('alt') ?? '').trim() === '') {
                    problems.push('has no alt text');
                }

                return problems.map((problem) =>
                    finding('images', page.path, `image ${src} ${problem}`),
                );
            }),
    );
