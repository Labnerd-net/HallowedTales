import { getCollection, type CollectionEntry } from 'astro:content';

const COLLECTIONS = ['legends', 'traditions', 'relics', 'phenomena'] as const;
type Collection = (typeof COLLECTIONS)[number];

export const COLLECTION_LABELS: Record<Collection, string> = {
  legends: 'Legend',
  traditions: 'Folk Tradition',
  relics: 'Relic & Legend',
  phenomena: 'Mystical Phenomenon',
};

export interface RelatedLink {
  href: string;
  title: string;
  collection: Collection;
}

const hrefFor = (collection: Collection, id: string) => `/${collection}/${id}`;

// relatedLegends is a slug array that always points into the `legends`
// collection, from any of the four collections (including legends itself,
// for the St. Hubert / St. Eustace peer case).
export async function resolveRelatedLegends(slugs: string[] | undefined): Promise<RelatedLink[]> {
  if (!slugs || slugs.length === 0) return [];
  const legends = await getCollection('legends');
  const bySlug = new Map(legends.map((e) => [e.id, e]));
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((e): e is CollectionEntry<'legends'> => Boolean(e))
    .map((e) => ({ href: hrefFor('legends', e.id), title: e.data.title, collection: 'legends' as const }));
}

// The reverse of resolveRelatedLegends: every entry, in any collection, whose
// relatedLegends[] cites this legend. Derived rather than hand-maintained so
// a tradition/relic/phenomenon page linking to a legend doesn't require a
// second, easily-forgotten edit on the legend's own frontmatter.
export async function findReferencingEntries(legendSlug: string): Promise<RelatedLink[]> {
  const results: RelatedLink[] = [];
  for (const collection of COLLECTIONS) {
    const entries = await getCollection(collection);
    for (const entry of entries) {
      if (collection === 'legends' && entry.id === legendSlug) continue;
      const related = (entry.data as { relatedLegends?: string[] }).relatedLegends;
      if (related?.includes(legendSlug)) {
        results.push({ href: hrefFor(collection, entry.id), title: entry.data.title, collection });
      }
    }
  }
  return results;
}

// Collections that carry a `saints` field. Relics is excluded - a relic's
// identity is its claimed locations/cluster, not a saint it belongs to.
const SAINT_COLLECTIONS = ['legends', 'traditions', 'phenomena'] as const;

// Other entries, in any saint-bearing collection, that cite at least one of
// the same saint slugs - the "two Francis legends should point at each
// other" case. Derived from the `saints` field each entry already has
// rather than hand-curated, so it stays complete as entries are added
// instead of needing a relatedLegends edit for every same-saint pair.
export async function findBySaint(
  saintSlugs: string[] | undefined,
  currentCollection: Collection,
  currentId: string
): Promise<RelatedLink[]> {
  if (!saintSlugs || saintSlugs.length === 0) return [];
  const saintSet = new Set(saintSlugs);
  const results: RelatedLink[] = [];
  for (const collection of SAINT_COLLECTIONS) {
    const entries = await getCollection(collection);
    for (const entry of entries) {
      if (collection === currentCollection && entry.id === currentId) continue;
      const entrySaints = (entry.data as { saints?: string[] }).saints;
      if (entrySaints?.some((slug) => saintSet.has(slug))) {
        results.push({ href: hrefFor(collection, entry.id), title: entry.data.title, collection });
      }
    }
  }
  return results;
}
