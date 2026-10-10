import { defineCollection, z, type ImageFunction } from 'astro:content';
import { glob } from 'astro/loaders';
import { TAG_SLUGS } from './lib/tags';

// Shared across all five collections - see src/lib/tags.ts for why this is
// a closed enum rather than z.array(z.string()).
const FEAST_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
// Feb allows 29 since the feast recurs every year, not in one specific one.
const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// A typo here ("Sept", "31" for June) would otherwise become an Invalid Date
// downstream and silently drop the entry from the calendar, so it fails the
// build instead.
const feastDayField = z
  .object({
    month: z.enum(FEAST_MONTHS),
    day: z.string(),
    // Days from Easter Sunday, for movable feasts (Palm Sunday = -7)
    // where `day` is a placeholder like "varies" rather than a number.
    easterOffset: z.number().optional(),
  })
  .superRefine((feast, ctx) => {
    if (feast.easterOffset !== undefined) return;
    const day = Number(feast.day);
    const max = DAYS_IN_MONTH[FEAST_MONTHS.indexOf(feast.month)];
    if (!Number.isInteger(day) || day < 1 || day > max) {
      ctx.addIssue({
        code: 'custom',
        path: ['day'],
        message: `day must be a whole number from 1 to ${max} for ${feast.month} (or set easterOffset for a movable feast)`,
      });
    }
  })
  .optional();

const tagsField = z.array(z.enum(TAG_SLUGS)).optional();

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
        // Required and non-empty: it's the only text a screen reader gets.
        alt: z.string().min(1),
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

// Where the story is first attested. Free text for `approxDate`, not a date
// type: precision ranges from "9th century" to "unknown" across entries.
// Required on legends, optional elsewhere (see each collection).
const earliestSourceShape = z.object({
  citation: z.string(),
  approxDate: z.string(),
});

// "What we actually know historically" contrast line, per the
// provenance-over-verdict framing in
// ../catholic-research/HallowedTales/Notes/Pillar 1.
const historicalNoteField = z.string().optional();

// Minor retellings of THIS story (changed detail, same throughline) -
// the St. Nicholas window/chimney/pawnbroker case. Rendered as a "how this
// story changed" section on the same page, not a separate entry.
const variantsField = z
  .array(
    z.object({
      label: z.string(),
      detail: z.string(),
      note: z.string().optional(),
    })
  )
  .optional();

// Links to OTHER full `legends` entries that share a motif or lineage but are
// their own complete narrative - the St. Hubert / St. Eustace case. From any
// collection, always into `legends`.
const relatedLegendsField = z.array(z.string()).optional();

const publishedField = z.boolean().default(false);

// Object-level check shared by every collection: featuredImageIndex has to
// point at a real images[] entry, or card art silently falls back/breaks.
function checkFeaturedImage(
  data: { images: unknown[]; featuredImageIndex?: number },
  ctx: { addIssue: (issue: { code: 'custom'; path: string[]; message: string }) => void }
) {
  if (data.featuredImageIndex !== undefined && data.featuredImageIndex >= data.images.length) {
    ctx.addIssue({
      code: 'custom',
      path: ['featuredImageIndex'],
      message: `featuredImageIndex ${data.featuredImageIndex} is out of range for ${data.images.length} image(s)`,
    });
  }
}

const legends = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/legends' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    images: imagesField(image),
    featuredImageIndex: featuredImageIndexField,
    // One legend can involve more than one saint (kept as an array rather
    // than special-casing joint stories later).
    saints: z.array(z.string()).min(1),
    earliestSource: earliestSourceShape,
    historicalNote: historicalNoteField,
    variants: variantsField,
    relatedLegends: relatedLegendsField,
    tags: tagsField,
    published: publishedField,
    // Homepage hero pick. At most one entry should set this - if more than
    // one does, index.astro just takes the first match.
    featured: z.boolean().optional(),
  }).superRefine(checkFeaturedImage),
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
      // The custom of dedicating an entire calendar month to a devotion
      // (May = Mary, June = the Sacred Heart, October = the Rosary, etc.) -
      // spans a whole month rather than pinning to one day, so it gets its
      // own category rather than stretching `feastDay`.
      'monthly-devotion',
    ]),
    saints: z.array(z.string()).optional(),
    // Not every tradition pins to a fixed calendar date (regional festivals
    // vary by town), so this stays optional rather than required.
    feastDay: feastDayField,
    // For category: 'monthly-devotion' entries - which calendar month (1-12)
    // the devotion belongs to. Separate from `feastDay`, which models a single
    // date, not a whole-month custom.
    month: z.number().int().min(1).max(12).optional(),
    regions: z.array(z.string()).optional(),
    earliestSource: earliestSourceShape.optional(),
    historicalNote: historicalNoteField,
    // Points at a `legends` entry this custom traces back to (e.g. the St.
    // Nicholas Day shoe custom -> the dowry-gold legend), not other traditions.
    relatedLegends: relatedLegendsField,
    tags: tagsField,
    published: publishedField,
  }).superRefine((data, ctx) => {
    checkFeaturedImage(data, ctx);
    if (data.category === 'monthly-devotion' && data.month === undefined) {
      ctx.addIssue({
        code: 'custom',
        path: ['month'],
        message: "month (1-12) is required when category is 'monthly-devotion'",
      });
    }
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
    feastDay: feastDayField,
    earliestSource: earliestSourceShape.optional(),
    historicalNote: historicalNoteField,
    relatedLegends: relatedLegendsField,
    tags: tagsField,
    published: publishedField,
  }).superRefine(checkFeaturedImage),
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
    earliestSource: earliestSourceShape.optional(),
    historicalNote: historicalNoteField,
    // Set when this saint's case is ALSO published on the Register (the
    // Padre Pio dual-site case) so the page can link out instead of
    // duplicating the Register's evidentiary caveat in lore-site voice.
    registerSlug: z.string().optional(),
    relatedLegends: relatedLegendsField,
    tags: tagsField,
    published: publishedField,
  }).superRefine(checkFeaturedImage),
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
    earliestSource: earliestSourceShape.optional(),
    historicalNote: historicalNoteField,
    // Different readings of the symbol (the keys' gold/silver meaning) or small
    // differences in how its origin is told - same shape as `legends.variants`,
    // reused here for interpretive variants as much as narrative ones.
    variants: variantsField,
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
    relatedLegends: relatedLegendsField,
    tags: tagsField,
    published: publishedField,
  }).superRefine(checkFeaturedImage),
});

export const collections = { legends, traditions, relics, phenomena, symbols };
