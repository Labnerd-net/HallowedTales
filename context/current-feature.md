# Current Feature

_No active feature._

## History

- 2026-10-10 - Schema fragments and calendar tests (#21, part of #42): shared `earliestSourceShape`/`variantsField`/`historicalNoteField`/`relatedLegendsField`/`publishedField` in `content.config.ts`; new build-time checks for `featuredImageIndex` bounds, non-empty `images[].alt`, and `month` on `monthly-devotion`; at-most-one-`featured` in the content-integrity test. Added `vitest.config.ts` (aliases `astro:content` to a stub) and tests for `easter.ts`, `feasts.ts`, `feastDays.ts`.
- 2026-10-10 - Security headers and CSP (#1): Astro `security.csp` meta (hashed bundled scripts/styles, theme-init script hashed from `lib/themeInit.ts`, Umami allowed), `nosniff`/Referrer-Policy/X-Frame-Options/frame-ancestors via `public/_headers` (static) and `src/middleware.ts` (on-demand). Hero inline styles became Tailwind classes; lightbox CSS moved to `global.css`.
- 2026-10-10 - Validate `feastDay` (#5): shared `feastDayField` in `content.config.ts`; `month` is an enum of Jan-Dec and `day` must be valid for the month unless `easterOffset` is set, so typos fail the build instead of silently dropping the entry from the calendar.
- 2026-10-10 - Perf and entry-page refactor (#14, #15, #17, #20, plus #3): shared memoized `getAllPublished()`/`getPublished()` in `lib/collections.ts`; feast-day loader skips excerpts; detail pages use `EntryPage.astro` + `lib/entryPage.ts` + `buildRelatedSections`, listings use `PillarIndex.astro`; listings and `/tags` prerendered; `LiturgicalBanner` is a server island so it stays live on prerendered pages. Related and same-saint lists are now de-duplicated on every pillar.
- 2026-10-09 - Fix Advent start detection (backlog #4) and remove dead branches in `getLiturgicalDay` (#31). Advent is now detected in late November (Advent 1 can fall Nov 27 - Dec 3); added tests for Nov 28-30, 2026 and Nov 29-30, 2025.
- 2026-10-09 - Homepage fetches each collection once and drops `any` casts in `index.astro` (backlog #16, part of #25); fixed stale comments in `index.astro` and `pillarMeta.ts`.
- 2026-10-09 - Small cleanups: symbols same-saint heading (#9), `charAt` in slug humanizers (#11), removed unused pirata-one font package (part of #19), hyphen instead of em dash in `list-content.mjs` output (part of #30).
- 2026-10-09 - SEO layer (#35): meta description, canonical, Open Graph/Twitter tags, Article JSON-LD, hand-built sitemap (drafts excluded), robots.txt, 404 page. Umami website ID now read from `PUBLIC_UMAMI_ID` with fallback (#46). Dedicated og-default.png still open.
- 2026-10-09 - `/random` picks from one flat pool of published entries (#6); `TagList` only links tags that have an archive page (#10).
- 2026-10-09 - Documented that "today" is the UTC date in the banner and calendar (#8); `excerptFrom` skips headings, handles CRLF and strips Markdown (#12).
- 2026-10-09 - Added a content-integrity test (relatedLegends, saints, registerSlug, featuredImageIndex) (#7). Filled in 8 missing `SAINT_NAMES` entries and emptied a dead `relatedLegends` reference in `catacomb-concealment-symbols`.
