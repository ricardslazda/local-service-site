export interface SitemapAlternate {
    hreflang: string;
    href: string;
}

export interface SitemapEntry {
    url: string;
    lastmod: Date;
    alternates: SitemapAlternate[];
}

function escape(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');
}

function lastmodOf(entry: SitemapEntry): string {
    return entry.lastmod.toISOString().slice(0, 10);
}

export function renderSitemap(entries: readonly SitemapEntry[]): string {
    const urls = entries.map((entry) => {
        const alternates = entry.alternates
            .map(
                (alternate) =>
                    `<xhtml:link rel="alternate" hreflang="${escape(alternate.hreflang)}" href="${escape(alternate.href)}"/>`,
            )
            .join('');

        return `<url><loc>${escape(entry.url)}</loc><lastmod>${lastmodOf(entry)}</lastmod>${alternates}</url>`;
    });

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
}
