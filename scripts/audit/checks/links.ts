import { site } from '../../../src/site.ts';
import type { Check, Dist } from '../dist.ts';
import { finding } from '../dist.ts';

function isAbsolute(href: string): boolean {
    return (
        (href.startsWith('/') && !href.startsWith('//')) ||
        href.startsWith('#') ||
        /^[a-z][a-z0-9+.-]*:/i.test(href)
    );
}

export function internalPath(href: string): string | undefined {
    if (href.startsWith(site.origin)) {
        return internalPath(href.slice(site.origin.length) || '/');
    }

    if (!href.startsWith('/') || href.startsWith('//')) {
        return undefined;
    }

    const path = href.split(/[?#]/)[0] ?? '/';

    return path === '' ? '/' : path.replace(/\/$/, '') || '/';
}

export function exists(path: string, files: Dist['files']): boolean {
    if (path === '/') {
        return files.has('/index.html');
    }

    return (
        files.has(`${path}.html`) ||
        files.has(`${path}/index.html`) ||
        files.has(path)
    );
}

export const links: Check = ({ pages, files }) =>
    pages.flatMap((page) =>
        page
            .$('a[href]')
            .toArray()
            .flatMap((element) => {
                const href = page.$(element).attr('href') ?? '';

                if (!isAbsolute(href)) {
                    return [
                        finding(
                            'links',
                            page.path,
                            `links to "${href}", which is neither an absolute path, a fragment nor a URL`,
                        ),
                    ];
                }

                const target = internalPath(href);

                if (target === undefined || exists(target, files)) {
                    return [];
                }

                return [
                    finding(
                        'links',
                        page.path,
                        `links to ${target}, which does not exist`,
                    ),
                ];
            }),
    );
