import type { Dist, Page } from './dist.ts';
import { pageFrom } from './dist.ts';

export interface PageFixture {
    path: string;
    html: string;
}

export interface DistFixture {
    pages: PageFixture[];
    files?: string[];
    scripts?: { path: string; text: string }[];
    stylesheets?: { path: string; text: string }[];
    sitemap?: string;
    robots?: string;
}

export function distFrom(fixture: DistFixture): Dist {
    const pages: Page[] = fixture.pages.map(({ path, html }) =>
        pageFrom(path, html),
    );
    const pageFiles = fixture.pages.map(({ path }) =>
        path === '/' ? '/index.html' : `${path}.html`,
    );

    return {
        pages,
        files: new Set([
            ...pageFiles,
            ...(fixture.files ?? []),
            ...(fixture.scripts ?? []).map((script) => script.path),
            ...(fixture.stylesheets ?? []).map((sheet) => sheet.path),
            ...(fixture.sitemap === undefined ? [] : ['/sitemap.xml']),
            ...(fixture.robots === undefined ? [] : ['/robots.txt']),
        ]),
        scripts: (fixture.scripts ?? []).map((script) => ({
            path: script.path,
            bytes: Buffer.from(script.text),
        })),
        stylesheets: (fixture.stylesheets ?? []).map((sheet) => ({
            path: sheet.path,
            bytes: Buffer.from(sheet.text),
        })),
        sitemap: fixture.sitemap,
        robots: fixture.robots,
    };
}

export function page(
    path: string,
    head: string,
    body: string,
    lang = 'lv',
): PageFixture {
    return {
        path,
        html: `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>Title</title>${head}</head><body><header><nav><a href="/">Home</a></nav></header><main>${body}</main><footer></footer></body></html>`,
    };
}
