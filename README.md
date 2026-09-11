# Local service site

A base for the website of a local service business in Latvia, published in Latvian and Russian:
services with prices, the towns around the home city, finished jobs, guides, testimonials and a
quote form. Nothing in the code belongs to a particular trade. Every business fact lives in one
file, every page is built from content entries, and the placeholder entries show the shape each
collection expects.

Static Astro, no client-side framework, and an audit that holds every built page to the rules
below before anything is pushed.

## Commands

    npm install
    npm run setup          # install the git hooks
    npm run dev            # development server
    npm run build          # static build into dist/
    npm run audit          # every check below, over dist/
    npm run gate           # build, then audit
    npm test               # unit tests, including one per audit check
    npm run format         # prettier, write
    npm run lint           # eslint, fix
    npm run types:check    # astro check

`format:check`, `lint:check` and `types:check` run on every commit through lefthook. `npm test`
and `npm run gate` run before every push, and all of it runs again in CI.

## Starting a new site

1. Fill in `src/site.ts`: the name and legal name, `slug`, `businessType` (a schema.org
   `LocalBusiness` type), `origin`, registration and VAT numbers, `currency`, `serviceRadiusKm`,
   contact details, address, coordinates, opening hours, the `updated` dates and the
   `serviceGroups` the services fall into.
2. Set the URL `segments` for each language, and the home city in `strings.base`.
3. In `src/i18n/strings.ts`, rewrite the tagline, the opening-hours text, the service group
   labels and the wording of the wizard and the form.
4. Rewrite the hand-written pages in `src/copy/`.
5. Replace the placeholder entries in `src/content/` collection by collection. Every town needs
   one section per service, all five page kinds must exist in both languages, and every
   testimonial needs its own `id`. A title has to stay within 65 characters once the separator
   and the site name are appended.
6. Replace the images in `src/assets/placeholders/`, the share images in `public/og/` and the
   favicons.
7. Set the palette in `src/styles/global.css`, keeping the token names.
8. Run `npm run gate`, `npm test` and `npm run test:e2e` until all three pass.

## Conventions

- **Latvian at the root, Russian under `/ru`.** URL segments are translated in each language,
  and every page pairs with its counterpart by `translationKey`.
- **No trailing slash.** Pages build as `page.html`, so every static host serves `/page` without
  a redirect rule. Canonicals and alternates are computed from `src/lib/paths.ts`, never from
  the URL Astro sees at build time.
- **Facts live in `src/site.ts`.** Name, contact, address, hours, the form endpoint and the
  origin, from which `robots.txt` is generated. Copy for hand-written pages lives in `src/copy/`,
  interface strings in `src/i18n/strings.ts`, and everything else is a markdown entry under
  `src/content/`.
- **Rīga is the home page.** There is no Rīga town page: the towns index, and a job or
  testimonial without a location, point at the home page.
- **Every town covers every service.** A town page carries one anchored section per service.
  The build refuses a town that misses a service or names one twice, and the `mesh` check reads
  the built pages for the links in both directions.
- **Every quote button is a link to the inline form.** When JavaScript runs, a script takes the
  click over and opens the quote wizard, a native dialog with four steps that posts to the same
  endpoint. Nothing it collects leaves the page before submit.
- **Conventional Commits.** An imperative lowercase subject under 72 characters, a body that says
  why, no attribution footers, no emoji. The hook enforces it.
- **No code comments.** Intent goes into names and structure; the why goes into the commit body.

## What the build checks

The build itself refuses, with file names, a duplicated primary keyword within a language, a
duplicated translation key within a collection, and an entry without its counterpart in the
other language.

`npm run audit` then reads every built page and fails on any of these:

| Check             | Holds every page to                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `lang`            | a `lang` attribute matching the locale its URL sits under                                                                       |
| `metadata`        | a title of 15 to 65 characters and a description of 70 to 160, both unique                                                      |
| `heading`         | exactly one `h1`                                                                                                                |
| `canonical`       | one canonical naming the page itself on the site origin                                                                         |
| `hreflang`        | naming itself, an `x-default`, and every alternate naming it back                                                               |
| `structured-data` | JSON-LD that parses, declares the business node, and dangles no reference                                                       |
| `images`          | width, height and alt text on every image                                                                                       |
| `assets`          | every same-origin file it references existing in the build                                                                      |
| `links`           | absolute links only, every internal one resolving                                                                               |
| `third-party`     | no resource from another origin, in markup or styles; forms post here                                                           |
| `javascript`      | at most 30 KB of compressed script across the site                                                                              |
| `primary-action`  | a `tel:` link to the company phone                                                                                              |
| `depth`           | at most three clicks from its language's home page                                                                              |
| `bodies`          | at least 150 words on service, town, guide and job pages ; under 50% five-word overlap with any page in the same language       |
| `mesh`            | every town page linking every service page and back, and every job page linked from its service and town pages and linking back |
| `sitemap`         | listed with a lastmod if indexable, absent if not; robots naming the sitemap                                                    |

Checks that concern only indexed pages skip the noindexed thank-you and not-found pages. Each
check is a pure function in `scripts/audit/checks/` with a test beside it that feeds it a broken
page, so a check that has never failed does not exist here.
