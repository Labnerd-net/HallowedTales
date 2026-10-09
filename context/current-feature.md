# Current Feature

_No active feature._

## History

- 2026-10-09 - Fix Advent start detection (backlog #4) and remove dead branches in `getLiturgicalDay` (#31). Advent is now detected in late November (Advent 1 can fall Nov 27 - Dec 3); added tests for Nov 28-30, 2026 and Nov 29-30, 2025.
- 2026-10-09 - Homepage fetches each collection once and drops `any` casts in `index.astro` (backlog #16, part of #25); fixed stale comments in `index.astro` and `pillarMeta.ts`.
- 2026-10-09 - Small cleanups: symbols same-saint heading (#9), `charAt` in slug humanizers (#11), removed unused pirata-one font package (part of #19), hyphen instead of em dash in `list-content.mjs` output (part of #30).
- 2026-10-09 - SEO layer (#35): meta description, canonical, Open Graph/Twitter tags, Article JSON-LD, hand-built sitemap (drafts excluded), robots.txt, 404 page. Umami website ID now read from `PUBLIC_UMAMI_ID` with fallback (#46). Dedicated og-default.png still open.
