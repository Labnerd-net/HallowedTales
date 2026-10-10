# Project Backlog

> Generated: 2026-10-09
> Focus: Full audit
> Completed and removed: #4, #6, #7, #8, #9, #10, #11, #12, #16, #31, #46 (2026-10-09). Item numbers are not renumbered.

---

## Security

### High
_None identified._

### Medium
- **#1 [public/_headers (missing), src/layouts/Layout.astro:37]**: No CSP, `X-Content-Type-Options`, `Referrer-Policy`, or frame protections; third-party Umami script is unrestricted. Add `public/_headers` with a CSP (`'self'`, the Umami host, hash for the inline theme script), `nosniff`, `strict-origin-when-cross-origin`, `X-Frame-Options: DENY`.

### Low
- **#2 [src/pages/*/[slug].astro getStaticPaths]**: Unpublished entries are built and reachable at guessable URLs, protected only by `noindex`. Fine if drafts are not sensitive (repo is public anyway); otherwise include them only when `import.meta.env.DEV`. See also #29.

---

## Bugs

### High
- **#3 [src/layouts/Layout.astro:59, src/components/LiturgicalBanner.astro:6-9]**: All `[slug]` pages and `tags/[slug]` are `prerender = true`, but each renders `LiturgicalBanner`, which calls `new Date()`. Today's feasts, monthly devotion, and liturgical color are frozen at build time on those pages. Fix: render the banner as a server island (`server:defer`), compute client-side, or drop prerender on those pages.

### Medium
- **#5 [src/content.config.ts:105-112,156-162, src/lib/feastDays.ts:79-93]**: `feastDay.month`/`day` are free `z.string()`. A typo ("Sept") yields an Invalid Date, breaks the sort comparator, and silently drops the entry from the calendar with no build error. Fix: `z.enum` of Jan..Dec for month, numeric 1-31 refinement for day unless `easterOffset` is set; define the object once.

### Low
- **#13 [src/pages/calendar.astro:60-63,83-86]**: Grid always padded to 42 cells (blank sixth row on 5-week months); "next" past Dec 2099 silently clamps. Pad to a multiple of 7; disable the link at year bounds.

---

## Performance

### High
- **#14 [astro.config.mjs:8; src/pages/{legends,traditions,relics,symbols,phenomena}/index.astro, tags/index.astro]**: Whole site is `output: 'server'`, so static listing pages run `getCollection` + `excerptFrom` per request on the Worker. Add `prerender = true` to the listings and `/tags` (or flip to `output: 'static'` and mark only `/`, `/random`, `/calendar` dynamic). Depends on #3 for the banner.

### Medium
- **#15 [src/lib/feastDays.ts:44-63,126-158]**: `getFeastsForDate` loads two collections and computes excerpts for every dated entry on each SSR request just to get today's titles. Split out a lightweight loader without excerpts.
- **#17 [src/lib/related.ts, tagArchive.ts, feastDays.ts, random.astro, index.astro]**: Repeated per-page collection reads (O(pages x collections)). Add a memoized `getAllPublished()` in `lib/collections.ts`.
- **#18 [src/components/CardThumb.astro, LightboxFigure.astro]**: `<Image>` sets only `width`; add `widths`/`sizes` for responsive srcset and audit lazy/fetchpriority.

### Low
- **#19 [src/layouts/Layout.astro, package.json:21]**: Many font weights/variants imported; (pirata-one removed 2026-10-09.) Subset to latin, preload critical fonts.

---

## Improvements & Refactors

### High
- **#20 [src/pages/*/[slug].astro, */index.astro]**: Five detail pages are near-duplicates (relics vs phenomena differ by ~10 lines) including `getStaticPaths`, related/same-saint de-duplication, Register link, Hero/TagList/RelatedList composition; five listing pages are ~30 lines each of the same grid. Extract `EntryPage.astro` / `getEntryPageData` / `PillarIndex.astro` driven by `pillarMeta.ts`, plus a `buildRelatedSections` helper in `lib/related.ts`.
- **#21 [src/content.config.ts:45-241]**: `earliestSource`, `feastDay`, `variants`, `historicalNote` copy-pasted across collections. Extract shared Zod fragments and add refinements: `featuredImageIndex` in bounds, `images[].alt` `.min(1)`, `month` required for `monthly-devotion`, at most one `featured`. Pair with a content-integrity Vitest test (#42).

### Medium
- **#22 [src/lib/pillarMeta.ts, related.ts:4,59, tagArchive.ts:9, random.astro:6, index.astro]**: Pillar/collection metadata and the collection-name list are defined in 4+ places. Consolidate into `pillarMeta.ts` with one exported `COLLECTIONS`; fix stale comments (pillarMeta.ts header references nonexistent `alt-homepage-*.astro`; index.astro:20-23 says images are unpopulated).
- **#23 [src/layouts/Layout.astro:60-134]**: Desktop/mobile nav links duplicated; menu script inline. Drive from a `NAV_LINKS` array (derivable from `PILLARS`) and extract `Nav.astro`.
- **#24 [.github/workflows/ci.yml, tsconfig.json:6]**: CLAUDE.md pipeline says lint, but there is no lint tool or CI step. `tests/` and `scripts/` are not typechecked; actions pinned by tag not SHA. Add ESLint (`eslint-plugin-astro`) or Biome, include `tests` in tsconfig, pin actions.
- **#25 [src/pages/index.astro:49, related.ts:46,78, tagArchive.ts:29,36,59]**: (index.astro part done 2026-10-09; remaining: related.ts, tagArchive.ts) `entry.data as {...}` casts; use `isPublished` and a typed collection union; derive `Badge` from `COLLECTION_LABELS`.
- **#26 [src/layouts/Layout.astro, LightboxFigure.astro, ThemeToggle]**: Add skip link and `<main>` landmark, `aria-current="page"`, `aria-controls` and focus trap for the mobile menu; verify `<dialog>` lightbox focus and `text-ink-soft` contrast in both themes.
- **#27 [src/lib/excerpt.ts, src/content.config.ts]**: Add an optional `description` frontmatter field used for cards, meta description, and OG; keep `excerptFrom` as fallback and harden it (#12).
- **#28 [src/pages/index.astro:14-45]**: Category hero images imported from specific entries' content folders; moving an entry breaks the homepage. Move to `src/assets/` or derive via `featuredImage`.
- **#29 [src/pages/*/[slug].astro, future sitemap/Pagefind]**: Drafts are emitted by `getStaticPaths`. Ensure they are excluded from sitemap and search index, and consider skipping them in production builds. `random.astro` filters inline instead of via `isPublished`.

### Low
- **#30 [scripts/list-content.mjs:22,31]**: Regex frontmatter parsing (`split("---")[1]`), assumes `index.mdx`, no npm script. (Em dash fixed 2026-10-09.) Use a real parser.
- **#32 [src/components/Hero.astro:20,34, LightboxFigure.astro:15,27-55]**: Inline styles where Tailwind utilities exist; duplicated caption/credit markup; `crypto.randomUUID()` ids unnecessary.
- **#33 [wrangler.jsonc, package.json, ci.yml]**: Unused `SESSION` KV binding (Astro default); no `.nvmrc`/`engines` (CI uses Node 24); add `pretypecheck` so `npm run types` runs first; add `test:watch`. Document that deploys come from Workers Builds, not the `deploy` script.
- **#34 [src/lib/labels.ts, saints.ts, tags.ts]**: Three slug-to-label helpers (`titleCaseSlug`, `humanize`, `tagLabel`) with slightly different behavior. Consolidate.

---

## Feature Ideas

### High
- **#35 [partially done 2026-10-09]**: Remaining: a dedicated `og-default.png` (currently `icon-512.png`).
- **#36 [astro.config.mjs, Layout.astro]**: Pagefind is in the documented stack but absent. Add `astro-pagefind` or a post-build `pagefind --site dist/client`, `data-pagefind-body` on `<main>`, ignore nav/footer/banner and drafts, and a search UI in the nav. Update `build`/`deploy` scripts.

### Medium
- **#37 [new src/pages/rss.xml.ts]**: RSS feed. Needs an optional `publishedAt` in the schema, or a feast-day feed from `lib/feastDays.ts` with no schema change.
- **#38 [new src/pages/saints/]**: Derived `/saints` and `/saints/[slug]` hubs from `saints[]` and `SAINT_NAMES`, mirroring `tags/[slug].astro`; natural home for the Register cross-link (`registerSaintHref`). No D1 needed.
- **#39 [src/pages/*/index.astro]**: Listing filters/sorts from unused schema fields (`traditions.category`, `phenomena.phenomenonType`, `relics.cluster`, `regions`); sort traditions by calendar month.
- **#40 [src/lib/related.ts, TagList.astro]**: Tag-based "similar entries" ranking and prev/next within a pillar; tags currently only link to archives.
- **#41 [detail pages]**: `earliestSource`/`historicalNote` rendered inconsistently; add a shared `SourceNote` component.
- **#42 [tests/]**: Only `season.test.ts` and `content-rules.test.ts` exist. Add tests for `easter.ts`, `feasts.ts` (easterOffset), `feastDays.ts` (year wrap), `excerpt.ts`, `saints.ts`, `registerLink.ts`, `tags.ts`, `related.ts`, plus the content-integrity test from #21 (needs `getViteConfig` or mocks for `astro:content`).

### Low
- **#43 [public/]**: Web manifest (icon-512.png exists but is unreferenced).
- **#44 [detail pages, Layout.astro footer]**: Breadcrumbs/pillar links on detail pages, footer nav, and an about page carrying the positioning copy.
- **#45 [src/pages/index.astro, calendar.astro, LiturgicalBanner.astro]**: Deterministic date-seeded "story of the day" (better caching than per-request random), link calendar entries to monthly devotions, banner links to season-relevant entries, printable feast list.

---

## Summary

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Security | 0 | 1 | 1 | 2 |
| Bugs | 1 | 1 | 1 | 3 |
| Performance | 1 | 3 | 1 | 5 |
| Improvements & Refactors | 2 | 8 | 4 | 14 |
| Feature Ideas | 2 | 6 | 3 | 11 |
| **Total** | 6 | 19 | 10 | 35 |
