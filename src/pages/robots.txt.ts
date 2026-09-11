import type { APIRoute } from 'astro';

import { site } from '../site.ts';

export const GET: APIRoute = () =>
    new Response(
        `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${site.origin}/sitemap.xml\n`,
        { headers: { 'content-type': 'text/plain; charset=utf-8' } },
    );
