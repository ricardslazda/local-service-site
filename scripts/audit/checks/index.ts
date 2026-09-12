import type { Check } from '../dist.ts';

import { assets } from './assets.ts';
import { bodies } from './bodies.ts';
import { canonical } from './canonical.ts';
import { depth } from './depth.ts';
import { heading } from './heading.ts';
import { hreflang } from './hreflang.ts';
import { images } from './images.ts';
import { javascript } from './javascript.ts';
import { lang } from './lang.ts';
import { links } from './links.ts';
import { mesh } from './mesh.ts';
import { metadata } from './metadata.ts';
import { primaryAction } from './primary-action.ts';
import { sitemap } from './sitemap.ts';
import { structuredData } from './structured-data.ts';
import { thirdParty } from './third-party.ts';

export const checks: Check[] = [
    lang,
    metadata,
    heading,
    canonical,
    hreflang,
    structuredData,
    images,
    assets,
    links,
    thirdParty,
    javascript,
    primaryAction,
    depth,
    bodies,
    mesh,
    sitemap,
];
