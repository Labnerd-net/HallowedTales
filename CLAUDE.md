# HallowedTales — Claude Code Reference

## Project Overview

A companion-but-separate site to [TheMiracleRegister](../TheMiracleRegister) exploring Catholic
saint and miracle *lore* — legendary, apocryphal, oral-tradition, or otherwise unverified
stories — explicitly without the Vatican-documentation / medical-verification bar the Register
holds itself to. More narrative ("here's the story people tell and where it came from"), less
"here's the decree and the medical board verdict."

**Why separate from the Register:** the Register's value proposition depends on "if it's on
this site, it's rigorously sourced" holding without exception. Mixing in unverifiable lore, even
clearly labeled, erodes that over time. The two sites also want different data shapes
(single-source-of-truth rows vs. multiple variants of the same legend) and different tone.

**Positioning:**
- **The Miracle Register** — evidentiary reference. Audience: skeptics, researchers,
  journalists citing a verified case.
- **HallowedTales** — cultural/heritage storytelling. Audience is explicitly *not* skeptics;
  someone who needs proof should bounce off this site by design.

Cross-link story between the two sites: "Want the verified miracle record for this saint? →
Register. Want the folklore and traditions around them? → HallowedTales."

---

## Scope Guardrails

- **Catholic only.** No cross-religious syncretism content (Santeria, indigenous-religion
  blending, Day of the Dead as a syncretic case study). Folk traditions covered should be
  Catholic practice/custom, even where the historical record shows outside influence. This does
  not exclude material with shared pre-Catholic origin (e.g. Old Testament figures/objects also
  significant to Judaism and Islam) - that's fine as long as the entry is anchored in Catholic
  veneration/tradition, not just a retelling of the shared source material. See Pillar 3 for the
  applied case.
- **Not dark.** No horror framing, no gore, no dwelling on martyrdom detail, no
  exorcism/demonic content. Tone stays warm and devotional/curious — "charming story behind a
  tradition," not "creepy unexplained phenomenon."
- These two rules override any individual content idea — if a specific legend or tradition can't
  be told without crossing one of them, cut it rather than sanitize it into something misleading.
- **Scope breadth (decided):** all Catholic lore broadly, not just lore tied to saints/miracles
  already adjacent to the Register's subject matter. Where a legend overlaps a Register case,
  HallowedTales covers it on its own terms and cross-links out to the Register for the verified
  record rather than narrowing coverage to avoid the overlap.
- **Style:** plain hyphens (`-`), never em dashes (`—`), in page copy, UI strings, and any text
  written into content files — matches the Register's convention.

## Content Pillars

| # | Pillar | Status |
|---|---|---|
| 1 | Legendary biography material (saint-and-creature legends, patronage origin stories, founding/shrine legends, meta-legends about how a cultus forms) | Confirmed |
| 2 | Catholic folk traditions (feast-day customs, liturgical-object traditions, food traditions, regional patronal festivals, naming traditions, weather folklore) | Confirmed |
| 3 | Biblical artifacts and legendary relics (True Cross, Holy Grail, Ark of the Covenant, etc.) | Confirmed for the Catholic-veneration-tradition relic cluster (True Cross, Holy Lance, Crown of Thorns, etc.). Shared-Old-Testament-origin "legendary quest" entries (Ark of the Covenant, Noah's Ark, Grail, Prester John) are not excluded but evaluated case by case. Shroud of Turin / Sudarium of Oviedo stay excluded (too close to the Register's contested-evidence territory). See `context/Notes/Pillar 3 - Biblical Artifacts and Legendary Relics.md`. |
| 4 | Mystical phenomena from saints' lives (bilocation, levitation, inedia, luminosity, odor of sanctity) | Confirmed. Can overlap with the Register case-by-case (e.g. Padre Pio's bilocation lives on both) — see Pillar 4 note for the rule. |
| 5 | Catholic symbols (Chi-Rho, scallop shell, crossed keys, Sacred Heart, pelican, Tau cross, etc.) — meaning, origin, and how usage changed across eras | Confirmed. Split out from Pillar 1 rather than folded into legends: some entries anchor to one saint's experience (scallop shell, keys of St. Peter) and would fit the `legends` shape, but others (fish/ichthys, Chi-Rho, the pelican) have no single saint to anchor to, and the content is "what it means + how it's been used over time," not a narrative with retellings. See `context/Notes/Pillar 5 - Symbols.md`. |

First-pass content research for each pillar lives in `context/Notes/Pillar N - *.md`. Treat those
as a working list, not a final content plan — every entry still needs a real source pass before
publishing.

---

## Tech Stack

Mirrors TheMiracleRegister's stack for operational consistency (same deploy target, shared
conventions), with two deliberate splits: lore content is authored as files, not DB rows, because
the content model here is "narrative pieces with possible variants," not "one verified row per
case"; and relational data uses Cloudflare D1 rather than TMR's Neon/Postgres, since this site's
relational needs (saint index, tags, search metadata) are small and read-heavy, D1 is co-located
with the Worker with no separate provider to manage, and D1's FTS5 support covers full-text search
if needed without requiring Postgres.

| Layer | Choice |
|---|---|
| Language | TypeScript (full stack) |
| Frontend | Astro with Cloudflare adapter |
| Lore content | Astro **Content Collections** — Markdown/MDX with Zod-validated frontmatter, lives in the repo (`src/content/`) |
| API layer | Hono (mounted as Cloudflare Worker at `/api/v1/*`), only if/when an API is actually needed |
| Hosting | Cloudflare Workers (with static assets) |
| Relational data | Cloudflare D1 (SQLite) via Drizzle (`drizzle-orm/d1`) — for anything genuinely relational: saint index, cross-pillar tags, search metadata. Not a home for prose content. Co-located with the Worker; no separate DB provider needed. |
| Search | Pagefind — static, build-time search index over rendered Content Collection pages, served client-side from Cloudflare's CDN. No DB in the loop. D1's FTS5 extension is available if structured search over relational metadata (tags, saint index) is ever needed. |
| Validation + types | Zod — shared between content collection schemas and any API routes |
| Styling | Tailwind v4 |
| Testing | Vitest (unit); Playwright if/when e2e is warranted |
| CI/CD | GitHub Actions (typecheck → lint → test → build), Cloudflare Workers Builds connector deploys on push to `main` — same split as the Register |

**Variant modeling (decided):** two different relationships, two different mechanisms, rather
than one `variant_of` field trying to cover both —
- **`variants[]` (inline on the legend entry)** — same throughline, changed detail (the St.
  Nicholas window/chimney/pawnbroker case). Not independently notable, so they render as a
  "how this story changed" section on the canonical entry rather than getting their own slug.
- **`relatedLegends[]` (cross-reference to other entries)** — shared motif or lineage but a
  distinct, independently real story (the St. Hubert / St. Eustace stag-with-a-cross case).
  These get full entries of their own and just point at each other.

See `src/content.config.ts` for the implemented schema. `relatedLegends` is still hand-authored
and one-directional in frontmatter (no validation that the reference exists), but back-links are
derived rather than requiring a second edit on the target entry — see
`findReferencingEntries` in `src/lib/related.ts`.

**Same-saint cross-linking** is a separate, fully-derived mechanism from `relatedLegends`: every
entry with a `saints` field (legends, traditions, phenomena, symbols — relics has no `saints`
field) that shares a saint slug with the current entry gets surfaced in a "More about this saint"
section, computed from `saints` rather than curated per pair. This is deliberately distinct from
`relatedLegends`, which is scoped to shared motif/lineage (Hubert/Eustace), not merely "same
saint" — two unrelated stories about the same saint (the two St. Francis legends) belong in the
same-saint section, not `relatedLegends`. See `findBySaint` in `src/lib/related.ts`. Unlike
`legends`/`phenomena`, `saints` is optional on `symbols` — a symbol with no single saint behind it
(the fish, the pelican) just sits out of this section rather than forcing a tag.

---

## Relationship to TheMiracleRegister

- Separate repo, separate deploy, separate domain — not a feature of the Register.
- Do **not** pull the Register's sourcing/verification standard into this project's content or
  schema. This site's entire premise is that it does *not* hold itself to that bar.
- Saint identity (slugs, names) should stay compatible enough to cross-link cleanly, but this
  repo does not read from or write to the Register's database.
- `context/Notes/Existing Miracle Websites.md`-style competitive research is TMR's, not
  duplicated here — if a competitive-landscape check is needed for this site, it gets its own
  note in this repo's `context/Notes/`.

---

## Research Notes

Research is confined to `context/Notes/` — check there before starting content work. Pillar
drafts are first-pass and unsourced; each entry needs a real source pass (earliest known written
source, rough date, "what we actually know historically" contrast) before publishing.

---

## Implementation Order

1. Astro + Cloudflare Workers base
2. Content Collections schema for Pillars 1, 2, 4, 5 (Pillars 1 and 5 done — see
   `src/content.config.ts`; variant modeling decided, see Tech Stack section)
3. Static pages rendering from content collections
4. Drizzle/D1 setup — only once there's an actual relational need (cross-linking, search,
   tags), not up front
5. Hono API layer — only if/when a public API is actually wanted
6. Vitest unit tests
7. GitHub Actions CI/CD
