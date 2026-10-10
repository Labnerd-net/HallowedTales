import { COLLECTIONS, getAllPublished, getPublished, hrefFor, type AnyEntry, type Collection } from './collections';

export const COLLECTION_LABELS: Record<Collection, string> = {
  legends: 'Legend',
  traditions: 'Folk Tradition',
  relics: 'Relic & Legend',
  phenomena: 'Mystical Phenomenon',
  symbols: 'Symbol',
};

export interface RelatedLink {
  href: string;
  title: string;
  collection: Collection;
}

const toLink = (entry: AnyEntry): RelatedLink => ({
  href: hrefFor(entry.collection, entry.id),
  title: entry.data.title,
  collection: entry.collection,
});

// relatedLegends is a slug array that always points into the `legends`
// collection, from any of the four collections (including legends itself,
// for the St. Hubert / St. Eustace peer case).
export async function resolveRelatedLegends(slugs: string[] | undefined): Promise<RelatedLink[]> {
  if (!slugs || slugs.length === 0) return [];
  const legends = await getPublished('legends');
  const bySlug = new Map(legends.map((e) => [e.id, e]));
  return slugs.flatMap((slug) => {
    const legend = bySlug.get(slug);
    return legend ? [toLink(legend)] : [];
  });
}

// The reverse of resolveRelatedLegends: every entry, in any collection, whose
// relatedLegends[] cites this legend. Derived rather than hand-maintained so
// a tradition/relic/phenomenon page linking to a legend doesn't require a
// second, easily-forgotten edit on the legend's own frontmatter.
export async function findReferencingEntries(legendSlug: string): Promise<RelatedLink[]> {
  const all = await getAllPublished();
  return all
    .filter((entry) => !(entry.collection === 'legends' && entry.id === legendSlug))
    .filter((entry) => entry.data.relatedLegends?.includes(legendSlug))
    .map(toLink);
}

// Collections that carry a `saints` field. Relics is excluded - a relic's
// identity is its claimed locations/cluster, not a saint it belongs to.
// Symbols carries `saints` too, but optionally - entries with no saint (the
// fish, the pelican) just won't show up on either side of this lookup.
const SAINT_COLLECTIONS: readonly Collection[] = COLLECTIONS.filter((c) => c !== 'relics');

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
  const all = await getAllPublished();
  return all
    .filter((entry) => SAINT_COLLECTIONS.includes(entry.collection))
    .filter((entry) => !(entry.collection === currentCollection && entry.id === currentId))
    .filter((entry) => 'saints' in entry.data && entry.data.saints?.some((slug) => saintSet.has(slug)))
    .map(toLink);
}

export interface RelatedSections {
  related: RelatedLink[];
  sameSaint: RelatedLink[];
}

// Everything a detail page lists under its body: motif/lineage links
// (forward from relatedLegends, plus backward references for the pillars
// whose slugs can themselves be cited as legends) and same-saint entries.
// Each link appears once; the more specific "related" list wins over
// "more about this saint".
export async function buildRelatedSections(entry: AnyEntry): Promise<RelatedSections> {
  const seen = new Set<string>();
  const unseen = (link: RelatedLink) => (seen.has(link.href) ? false : (seen.add(link.href), true));

  const forward = await resolveRelatedLegends(entry.data.relatedLegends);
  const backward =
    entry.collection === 'legends' || entry.collection === 'symbols'
      ? await findReferencingEntries(entry.id)
      : [];
  const related = [...forward, ...backward].filter(unseen);

  const saints = 'saints' in entry.data ? entry.data.saints : undefined;
  const sameSaint = (await findBySaint(saints, entry.collection, entry.id)).filter(unseen);

  return { related, sameSaint };
}
