## What this is

`TMR_sitemap_2026-10-04.xml` is a point-in-time copy of TheMiracleRegister's sitemap
(`https://themiracleregister.org/sitemap.xml`), saved 2026-10-04. It's the source for the
`REGISTER_SAINT_SLUGS` snapshot hardcoded in `src/lib/registerLink.ts`, which drives the
"Visit The Miracle Register" / "View the Register entry" cross-links on legend and phenomena
pages.

## Why a snapshot instead of a live lookup

Per `CLAUDE.md`, this repo doesn't read from or write to the Register's database - the two
sites are deliberately decoupled (separate repos, separate deploys). TMR's sitemap route is
also DB-generated and blocked to automated fetches (403, Cloudflare bot protection), so there's
no build-time way to check it live even if we wanted to. A manually-refreshed snapshot is the
only practical option that keeps HallowedTales from depending on TMR being reachable at build
or deploy time.

## How to refresh it

1. Open `https://themiracleregister.org/sitemap.xml` in a browser (it 403s to automated
   fetchers, so this has to be a real browser session) and save it here as
   `TMR_sitemap_<date>.xml`.
2. Diff the `/saints/` entries against the `REGISTER_SAINT_SLUGS` set in
   `src/lib/registerLink.ts` and update that set to match.
3. Delete the previous dated snapshot once the new one is confirmed good, so this folder
   doesn't accumulate stale copies.

Only the saint slugs matter for `registerSaintHref()` - the `/miracles/` entries aren't
snapshotted anywhere because `registerMiracleHref()` takes a specific `registerSlug` per
phenomena entry (set by hand when a case is known to be dual-published), not a lookup against
a saved list.
