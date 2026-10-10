import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { describe, expect, it } from 'vitest';
import { REGISTER_MIRACLE_SLUGS } from '../src/data/registerSlugs';
import { SAINT_NAMES } from '../src/lib/saints';

// Cross-reference checks the Zod schemas in content.config.ts can't express:
// relatedLegends, saints and registerSlug are all free-form in the schema, so
// a typo would otherwise fail silently (a dead related link, a missing
// same-saint section, a broken Register cross-link).
// Covers every entry, drafts included. (featuredImageIndex bounds, image alt
// text and monthly-devotion's month are checked by the schema itself.)

const CONTENT_ROOT = join(import.meta.dirname, '..', 'src', 'content');

interface Frontmatter {
  saints?: string[];
  relatedLegends?: string[];
  registerSlug?: string;
  featured?: boolean;
}

interface Entry {
  id: string; // collection/slug
  data: Frontmatter;
}

const entries: Entry[] = [];
const legendSlugs = new Set<string>();

for (const collection of readdirSync(CONTENT_ROOT, { withFileTypes: true })) {
  if (!collection.isDirectory()) continue;
  for (const dir of readdirSync(join(CONTENT_ROOT, collection.name), { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const raw = readFileSync(join(CONTENT_ROOT, collection.name, dir.name, 'index.mdx'), 'utf-8');
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    entries.push({ id: `${collection.name}/${dir.name}`, data: (match ? parse(match[1]) : {}) as Frontmatter });
    if (collection.name === 'legends') legendSlugs.add(dir.name);
  }
}

describe('content cross-references', () => {
  it('finds content entries', () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it('at most one entry is the homepage featured pick', () => {
    // The schema can't see across entries; index.astro would silently take
    // whichever matched first.
    const featured = entries.filter((e) => e.data.featured).map((e) => e.id);
    expect(featured.length, `featured: ${featured.join(', ')}`).toBeLessThanOrEqual(1);
  });

  it.each(entries.map((e) => [e.id, e] as const))('%s', (_id, entry) => {
    for (const slug of entry.data.relatedLegends ?? []) {
      expect(legendSlugs.has(slug), `relatedLegends: no legend "${slug}"`).toBe(true);
    }

    // Every saint needs a SAINT_NAMES entry (src/lib/saints.ts): the slug is
    // the same-saint and Register cross-link key, so a typo must fail here.
    for (const slug of entry.data.saints ?? []) {
      expect(slug in SAINT_NAMES, `saints: "${slug}" is not in SAINT_NAMES`).toBe(true);
    }

    if (entry.data.registerSlug !== undefined) {
      expect(
        REGISTER_MIRACLE_SLUGS.has(entry.data.registerSlug),
        `registerSlug: "${entry.data.registerSlug}" is not a published Register miracle`
      ).toBe(true);
    }
  });
});
