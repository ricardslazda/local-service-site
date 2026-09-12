# Working on this site

Read `README.md` first. It names the conventions and the checks; this file says how to work
within them.

## Commands

Use `astro dev --background` for the development server, and manage it with `astro dev stop`,
`astro dev status` and `astro dev logs`. Run `npm run format`, `npm run lint` and
`npm run types:check` before committing; the hooks run them again and refuse a commit that fails.
Run `npm test` and `npm run gate` before pushing; the pre-push hook runs them again.

## Commits

One logical change per commit. The subject is Conventional Commits, imperative, lowercase,
under 72 characters, no trailing period. A body is optional: when a change needs explaining,
write it after a blank line, in plain sentences. Never add `Co-Authored-By`, `Claude-Session`,
"generated with" or any other attribution footer, and never an emoji. The commit-message hook
rejects all of them.

## Code

- No comments. If a line needs prose to be understood, rename or restructure it.
- Facts about the business live in `src/site.ts`, never in a template.
- A fact the business does not have is omitted, never invented.
- URLs come from `src/lib/paths.ts`. Nothing else composes a path.
- Prefer a library's documented mechanism over a workaround, checked against current
  documentation rather than memory.

## Adding an audit check

A check is a pure function from the built pages to findings, in `scripts/audit/checks/`, listed
in `checks/index.ts`, with a test beside it that feeds it a page that breaks the rule and asserts
the finding. A check without that test is not finished. Thresholds are constants in the check
file, not configuration: a limit the site could lower to pass is not a limit.

## Content

The site is Latvian first, Russian second. Every entry exists in both languages, paired by
`translationKey`, written in each language rather than translated. Place names, service names
and grammatical forms are written out, never derived by rule. A front matter string that
contains a colon must be quoted. Titles are at most 48 characters, because the site name is
appended; descriptions are 70 to 160. Copy reads like the business wrote it for a customer, not
like a template with a town name substituted in, and the audit measures that.

A town entry carries one section per service, 60 to 90 words each, about that town rather than
about the service. A job names its service and its town, and no town when the work was in Rīga.
A testimonial names the job it is about when that job has a page. Aim for descriptions of 150
characters or fewer, because a count made by eye runs low and the schema stops at 160.

## Documentation

- [Routing](https://docs.astro.build/en/guides/routing/)
- [Components](https://docs.astro.build/en/basics/astro-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling and Tailwind](https://docs.astro.build/en/guides/styling/)
- [Internationalization](https://docs.astro.build/en/guides/internationalization/)
