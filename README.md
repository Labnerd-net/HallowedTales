# HallowedTales

[hallowedtales.com](https://hallowedtales.com)

A content site for Catholic saint and miracle *lore* - legendary, apocryphal, oral-tradition,
or otherwise unverified stories - told with warmth and curiosity rather than an evidentiary
bar. It's a companion-but-separate project to
[The Miracle Register](https://themiracleregister.org), which holds itself to a
Vatican-documentation / medical-verification standard; HallowedTales deliberately does not,
and cross-links to the Register wherever a story overlaps a verified case.

## Content

Six pillars, each an [Astro Content Collection](https://docs.astro.build/en/guides/content-collections/)
backed by a Zod-validated frontmatter schema (`src/content.config.ts`):

- **Legends** - saint-and-creature stories, patronage origin stories, founding/shrine legends
- **Traditions** - feast-day customs, liturgical-object traditions, food traditions, naming
  and weather folklore
- **Relics** - biblical artifacts and legendary relics (True Cross, Holy Lance, Crown of
  Thorns, and similar)
- **Phenomena** - mystical phenomena from saints' lives (bilocation, levitation, inedia,
  luminosity)
- **Symbols** - Catholic symbols (Chi-Rho, scallop shell, pelican, Tau cross) and how their
  meaning and use have shifted across eras
- **Biographies** - condensed, cradle-to-grave saint lives

Every entry carries a sourcing note distinguishing the legend as told from what the
historical record actually supports, rather than presenting tradition as documented fact.

## Stack

- [Astro](https://astro.build) with the Cloudflare adapter, deployed to Cloudflare Workers
- Content authored as Markdown/MDX in `src/content/`, validated against Zod schemas - no
  database; cross-links and indexes are derived at build time from the content files
- [Pagefind](https://pagefind.app) for static full-text search
- Tailwind v4 for styling
- Vitest for unit tests, including content-level rules (style, cross-reference integrity)
- GitHub Actions runs typecheck -> test -> build on every push and PR

## Local development

```
npm install
npm run dev        # http://localhost:4321
npm run typecheck
npm test
npm run build       # astro build + pagefind indexing
```

Deploying requires a `CLOUDFLARE_API_TOKEN` in a local `.env` (gitignored, not required for
dev/build/test).

## Related project

[The Miracle Register](https://themiracleregister.org) - the evidentiary counterpart, for
documented and medically reviewed cases.

## License

All rights reserved - see [LICENSE](./LICENSE). This repository is public for portfolio
review, not for reuse.
