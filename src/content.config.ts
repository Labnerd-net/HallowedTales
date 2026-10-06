import { defineCollection, z, type ImageFunction } from 'astro:content';
import { glob } from 'astro/loaders';

// Shared across all five collections: a photo of a relic/location, or a
// period illustration/artwork for legends and phenomena that have no
// photographable subject. Images live alongside their entry's content file
// so Astro's image() helper can validate the path and optimize the output.
// Required (min 1) - every entry needs at least enough art to serve as its
// card image on the homepage and pillar listing pages.
const imagesField = (image: ImageFunction) =>
  z
    .array(
      z.object({
        src: image(),
        alt: z.string(),
        caption: z.string().optional(),
        // Attribution/license text, e.g. "Wikimedia Commons, public domain"
        // or "Photo: Jane Doe, CC BY-SA 4.0". Required for anything not
        // self-authored.
        credit: z.string().optional(),
        kind: z.enum(['photo', 'illustration', 'artwork']).default('photo'),
      })
    )
    .min(1);

// Which `images[]` entry represents this story on card art (homepage,
// pillar listings). Defaults to images[0] when unset - see
// `featuredImage` in lib/images.ts.
const featuredImageIndexField = z.number().int().min(0).optional();

const legends = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/legends' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    images: imagesField(image),
    featuredImageIndex: featuredImageIndexField,
    // One legend can involve more than one saint (kept as an array rather
    // than special-casing joint stories later).
    saints: z.array(z.string()).min(1),
    earliestSource: z.object({
      citation: z.string(),
      // Free text, not a date type: precision ranges from "9th century" to
      // "unknown" across entries.
      approxDate: z.string(),
    }),
    // "What we actually know historically" contrast line, per the
    // provenance-over-verdict framing in context/Notes/Pillar 1.
    historicalNote: z.string().optional(),
    // Minor retellings of THIS story (changed detail, same throughline) —
    // the St. Nicholas window/chimney/pawnbroker case. Rendered as a
    // "how this story changed" section on the same page, not a separate entry.
    variants: z
      .array(
        z.object({
          label: z.string(),
          detail: z.string(),
          note: z.string().optional(),
        })
      )
      .optional(),
    // Links to OTHER full entries that share a motif or lineage but are
    // their own complete narrative — the St. Hubert / St. Eustace case.
    relatedLegends: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().default(false),
    // Homepage hero pick. At most one entry should set this - if more than
    // one does, index.astro just takes the first match.
    featured: z.boolean().optional(),
  }),
});

const traditions = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/traditions' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    images: imagesField(image),
    featuredImageIndex: featuredImageIndexField,
    category: z.enum([
      'feast-day-custom',
      'liturgical-object',
      'food',
      'regional-festival',
      'naming',
      'weather-lore',
      // "Traditions born of persecution / concealment" section of Pillar 2
      // (Mass rocks, priest holes, ring rosaries) - customs that exist
      // specifically because open Catholic worship was banned, not tied to
      // a feast day or object the way the other categories are.
      'persecution-custom',
    ]),
    saints: z.array(z.string()).optional(),
    // Not every tradition pins to a fixed calendar date (regional festivals
    // vary by town), so this stays optional rather than required.
    feastDay: z
      .object({
        month: z.string(),
        day: z.string(),
        // Days from Easter Sunday, for movable feasts (Palm Sunday = -7)
        // where `day` is a placeholder like "varies" rather than a number.
        easterOffset: z.number().optional(),
      })
      .optional(),
    regions: z.array(z.string()).optional(),
    earliestSource: z
      .object({
        citation: z.string(),
        approxDate: z.string(),
      })
      .optional(),
    historicalNote: z.string().optional(),
    // Points at a `legends` entry this custom traces back to (e.g. the St.
    // Nicholas Day shoe custom -> the dowry-gold legend), not other traditions.
    relatedLegends: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().default(false),
  }),
});

const relics = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/relics' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    images: imagesField(image),
    featuredImageIndex: featuredImageIndexField,
    // See Pillar 3 note: veneration-relic is the confirmed cluster,
    // legendary-quest is evaluated case by case, shrine-legend is the
    // Holy-House-of-Loreto-style biblical-object founding legend.
    cluster: z.enum(['veneration-relic', 'legendary-quest', 'shrine-legend']),
    // Array, not a single site, because the "two places claim the same
    // relic" pattern (Holy Lance, Holy Tunic) is common enough in this
    // pillar to need first-class support rather than a workaround.
    claimedLocations: z
      .array(
        z.object({
          site: z.string(),
          region: z.string().optional(),
          note: z.string().optional(),
        })
      )
      .min(1),
    feastDay: z
      .object({
        month: z.string(),
        day: z.string(),
        easterOffset: z.number().optional(),
      })
      .optional(),
    earliestSource: z
      .object({
        citation: z.string(),
        approxDate: z.string(),
      })
      .optional(),
    historicalNote: z.string().optional(),
    relatedLegends: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().default(false),
  }),
});

const phenomena = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/phenomena' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    images: imagesField(image),
    featuredImageIndex: featuredImageIndexField,
    phenomenonType: z.enum([
      'bilocation',
      'levitation',
      'inedia',
      'luminosity',
      'odor-of-sanctity',
    ]),
    saints: z.array(z.string()).min(1),
    earliestSource: z
      .object({
        citation: z.string(),
        approxDate: z.string(),
      })
      .optional(),
    historicalNote: z.string().optional(),
    // Set when this saint's case is ALSO published on the Register (the
    // Padre Pio dual-site case) so the page can link out instead of
    // duplicating the Register's evidentiary caveat in lore-site voice.
    registerSlug: z.string().optional(),
    relatedLegends: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().default(false),
  }),
});

// Symbol-origin-story entries (Chi-Rho, scallop shell, Sacred Heart, crossed keys, ...).
// Deliberately its own collection rather than folded into `legends`: some of these
// entries anchor to one saint's experience and look like a legend (scallop shell,
// keys of St. Peter), but others (fish/ichthys, Chi-Rho, the pelican) have no single
// saint to require, and what the entry needs to say is "what it means + how its use
// evolved across eras," not purely a narrative. `saints` stays optional here for
// that reason, unlike `legends`/`phenomena` where it's required.
const symbols = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/symbols' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    images: imagesField(image),
    featuredImageIndex: featuredImageIndexField,
    // Short "what it represents" line, distinct from the longer body copy.
    meaning: z.string(),
    saints: z.array(z.string()).optional(),
    earliestSource: z
      .object({
        citation: z.string(),
        approxDate: z.string(),
      })
      .optional(),
    historicalNote: z.string().optional(),
    // Different readings of the symbol (the keys' gold/silver meaning) or small
    // differences in how its origin is told - same shape as `legends.variants`,
    // reused here for interpretive variants as much as narrative ones.
    variants: z
      .array(
        z.object({
          label: z.string(),
          detail: z.string(),
          note: z.string().optional(),
        })
      )
      .optional(),
    // How the symbol's use changed across eras - the "catacombs -> labarum ->
    // sarcophagi -> Paschal candle -> heraldry" shape, not narrative variants.
    usageTimeline: z
      .array(
        z.object({
          era: z.string(),
          note: z.string(),
        })
      )
      .optional(),
    relatedLegends: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().default(false),
  }),
});

export const collections = { legends, traditions, relics, phenomena, symbols };
