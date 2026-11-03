# Project Backlog

> Generated: 2026-11-03
> Focus: Full audit
> Security findings are tracked separately in context/backlog-security.md (gitignored).
> Items are renumbered in a single sequence across both files. Old 2026-10-09 numbers are noted as "(was #N)" where an item carried over.

---

## Bugs

### High
_None identified._

### Medium
- **#6 [src/components/EntryPage.astro:49]**: `data-pagefind-meta="title:...,category:..."` breaks for any title containing a comma, because Pagefind splits on commas with no escaping. At least 17 titles are affected (e.g. "May, the Month of Mary" shows as "May" in search results). Fix: put the title last (`category:X, title:Y`) or use an element with `data-pagefind-meta="title"`. Add a test over all titles.

### Low
- **#7 [src/lib/feastDays.ts:79-93]**: A fixed Feb 29 feast resolves to Mar 1 in non-leap years via `Date.UTC`. The schema allows Feb 29 but no entry uses it yet (latent). Fix: if the resulting month differs, skip or clamp to Feb 28; add a test.
- **#8 [src/lib/themeInit.ts:7, src/components/ThemeToggle.astro:64,84,89]**: `localStorage` is used with no try/catch. With storage blocked, `syncButtons(getStoredChoice())` throws at module load and the toggle never works. Wrap reads and writes in safe helpers; keep the init script ES5 (the CSP hash is derived automatically).

---

## Performance

### High
_None identified._

### Medium
- **#9 [src/components/CardThumb.astro, LightboxFigure.astro]** (was #18): `<Image>` sets only `width`; add `widths`/`sizes` for a responsive srcset and audit lazy/fetchpriority.
- **#10 [src/pages/index.astro, calendar.astro, LiturgicalBanner.astro]**: Home and calendar are on-demand with no `Cache-Control`, and the `server:defer` banner adds a second Worker request on every page including prerendered ones, for content that changes daily. Set short `s-maxage` on the banner island response and on these pages, or compute the banner client-side from the vendored feast data. Ties into #40.

### Low
- **#11 [src/layouts/Layout.astro, package.json]** (was #19): Many font weights imported plus MedievalSharp globally. Subset to latin, use `font-display: swap`, preload critical fonts, and check whether MedievalSharp is needed beyond the brand mark.
- **#12 [astro.config.mjs]**: About 101 style-attribute hashes are generated for `focalY` (0-100), bloating the CSP on every page. Quantize `focalY` in the schema to steps of 5 and map to a few classes or a CSS custom property set via class.

---

## Improvements & Refactors

### High
_None identified._

### Medium
- **#13 [src/lib/pillarMeta.ts, collections.ts, related.ts, tagArchive.ts, random.astro, index.astro:117-122, Search.astro:56-63]** (was #22): `PILLARS`, `COLLECTIONS`, `PillarKey` and `COLLECTION_LABELS` are overlapping sources. Make `COLLECTIONS` the source, derive `PillarKey = Collection`, make `PILLARS` a `Record<Collection, ...>`, and use `pillar.badge` instead of casts. Build the homepage `sidebarStories` by mapping `PILLARS`, and replace `Search.astro`'s hard-coded `categoryClasses` so a seventh pillar cannot fall through unstyled. Fix stale comments in `pillarMeta.ts` and `index.astro`.
- **#14 [src/pages/*/[slug].astro, */index.astro]**: Six near-identical `[slug].astro` files plus six two-line index wrappers. Replace with `[collection]/[slug].astro` and `[collection]/index.astro` validated against `COLLECTIONS`. Check static path generation and `tags`/`random` route conflicts first.
- **#15 [src/layouts/Layout.astro:38-134]** (was #23, partly done): `NAV_LINKS` exists, but the desktop and mobile `.map()` blocks and the inline menu script (~55 lines) remain. Derive pillar entries from `PILLARS`, add Calendar/Tags/Random, extract `Nav.astro`.
- **#16 [.github/workflows/ci.yml, tsconfig.json:6]** (was #24): No lint tool or CI step despite CLAUDE.md listing one, and `tests/` and `scripts/` are not typechecked. Add ESLint (`eslint-plugin-astro`) or Biome and include `tests` and `scripts` in tsconfig. See security backlog #4 for the related CI item.
- **#17 [src/lib/entryPage.ts]**: The Register note logic is repeated five times with near-identical constants; fold into one `registerNote(entry)` helper. Feast days are formatted three different ways ("Mar 19", "Feast day: Mar 19"); add `formatFeastDay()`. Movable feasts with `day: "varies"` render as "Mar varies"; use `easterOffset` to show a name or "Varies".
- **#18 [tests/content-rules.test.ts, content-integrity.test.ts, scripts/list-content.mjs]** (was #30): Each re-implements frontmatter parsing and file walking (the script with regex `split("---")[1]`). Share a `tests/helpers/content.ts`, use the `yaml` package already in devDependencies, and add an `npm run content:list` script.
- **#19 [src/components/EntryPage.astro, Search.astro]**: Pagefind only indexes `data-pagefind-body` with title/category meta. Add `data-pagefind-filter` for category/saints/tags, `data-pagefind-meta="image"` for thumbnails, and index the hero text (or weight it) so saint names in subtitles are searchable.
- **#20 [CI, src/data/]**: Add a post-build internal link checker over `dist/client` to catch dead `relatedLegends`, calendar and `registerSlug` links. Make sync drift visible from this repo: a generated header with date and source hash that a test checks, or a scheduled check against the master files.

### Low
- **#21 [src/lib/excerpt.ts, src/content.config.ts]** (was #27): Add optional `description` frontmatter for cards, meta description and OG; keep `excerptFrom` as fallback.
- **#22 [src/pages/index.astro:14-45]** (was #28): Category hero images are imported from specific entries' content folders; moving an entry breaks the homepage. Move to `src/assets/` or derive via `featuredImage`.
- **#23 [src/lib/related.ts, tests/content-integrity.test.ts, content.config.ts]**: `CITABLE_COLLECTIONS` is duplicated by comment between tests and `related.ts`; export it from a pure module. The field name `relatedLegends` is misleading when it cites symbols and relics; consider `relatedEntries` or a Zod `reference()`.
- **#24 [related.ts:46,78, tagArchive.ts:29,36,59]** (was #25): Remaining `entry.data as {...}` casts; use `isPublished` and a typed collection union.
- **#25 [src/lib/labels.ts, saints.ts, tags.ts]** (was #34): Three slug-to-label helpers with slightly different behavior. Consolidate.
- **#26 [package.json, wrangler.jsonc, ci.yml]** (was #33): No `.nvmrc`/`engines` (CI uses Node 24); add `pretypecheck` so `npm run types` runs first and a `test:watch` script. Document that deploys come from Workers Builds, not the `deploy` script.
- **#27 [src/pages/404.astro]**: 19 lines today; add search and the six pillar links.
- **#28 [src/pages/sitemap.xml.ts]**: Add `lastmod` (file mtime or git date), no schema change needed.

---

## Feature Ideas

### High
- **#29 [new src/pages/saints/]** (was #38): Derived `/saints/[slug]` hubs grouping biography, legends, phenomena and symbols per saint, from `saints[]` and `SAINT_NAMES` (optionally extended with `feast` and `patronOf`). Natural single home for the Register cross-link, removing the repeated note from every hero.
- **#30 [src/layouts/Layout.astro footer, new about page]** (was #44, promoted): The footer is one disclaimer paragraph with no nav, no about page and no Register cross-link beyond the hero note, though the cross-link is core positioning. Add footer nav, an about page carrying the positioning copy, and breadcrumbs on detail pages.
- **#31 [public/]** (was #35): Dedicated 1200x630 `og-default.png`; all non-entry pages currently share `icon-512.png` with `twitter:card=summary`.

### Medium
- **#32 [src/pages/*/index.astro, PillarIndex.astro]** (was #39): Listings are in glob order. Sort traditions by feast month, biographies by feast day, legends by `earliestSource.approxDate`; add filters from unused schema fields (`traditions.category`, `phenomena.phenomenonType`, `relics.cluster`, `regions`).
- **#33 [src/lib/related.ts, TagList.astro]** (was #40): Tag-based "similar entries" ranking and prev/next within a pillar, including a "Months of devotion" series in calendar order.
- **#34 [detail pages]** (was #41): Shared `SourceNote` component for `earliestSource`/`historicalNote`, plus JSON-LD `citation`/`isBasedOn` from `earliestSource`.
- **#35 [tests/]** (was #42): Remaining untested: `saints.ts`, `registerLink.ts`, `tags.ts`, `related.ts`, `entryPage.ts`, `tagArchive.ts` (mock `astro:content` as in `tests/feastDays.test.ts`).
- **#36 [src/lib/feastDays.ts, content.config.ts]**: "On this day" view and an iCal feed (`/feeds/feast-days.ics`) generated from the feast tables, no DB. Add optional `feastDay` to legends, phenomena and symbols (shared `feastDayField`) so Nicholas, Blaise and Francis stories appear on the calendar.
- **#37 [new src/pages/rss.xml.ts]** (was #37): RSS feed. Needs an optional `publishedAt`, or a feast-day feed from `lib/feastDays.ts`.
- **#38 [legend pages, src/lib/related.ts]**: Derived "In this saint's life" strip on legend pages pointing up to the biography, computed from `saints`. Helps the unresolved Helena/Kateri duplication.

### Low
- **#39 [public/]** (was #43): Web manifest; `icon-512.png` exists but is unreferenced. Do together with #31.
- **#40 [src/pages/index.astro, calendar.astro, LiturgicalBanner.astro]** (was #45): Deterministic date-seeded "story of the day" (better caching than per-request random), link calendar entries to monthly devotions, season-relevant banner links, printable feast list.
- **#41 [EntryPage.astro, global.css]**: Copy-link/Web Share button and print stylesheet for entry pages, since stories get shared out of context.
- **#42 [src/lib/excerpt.ts, cardMeta]**: Reading-time chip on cards.
- **#43 [new /glossary]**: Mini glossary or hover cards for recurring terms (novena, cultus, patronage).
- **#44 [src/pages/random.astro]**: `?pillar=` filter and an "Another one" button on entry pages.

---

## Summary

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Bugs | 0 | 1 | 2 | 3 |
| Performance | 0 | 2 | 2 | 4 |
| Improvements & Refactors | 0 | 8 | 8 | 16 |
| Feature Ideas | 3 | 7 | 6 | 16 |
| **Total** | 3 | 18 | 18 | 39 |
