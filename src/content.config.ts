import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const legends = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/legends' }),
  schema: z.object({
    title: z.string(),
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
  }),
});

export const collections = { legends };
