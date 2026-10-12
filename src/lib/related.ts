import { COLLECTIONS, getAllPublished, getPublished, hrefFor, type AnyEntry, type Collection } from './collections';

export const COLLECTION_LABELS: Record<Collection, string> = {
  legends: 'Legend',
  traditions: 'Folk Tradition',
  relics: 'Relic & Legend',
  phenomena: 'Mystical Phenomenon',
  symbols: 'Symbol',
  biographies: 'Biography',
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

// Collections whose entries relatedLegends[] is allowed to cite, despite the
// field's name - originally legends-only (the St. Hubert / St. Eustace peer
// case), broadened to symbols (e.g. a symbol's own founding-legend) and
// relics (a biography linking out to its saint's relic, e.g. Helena ->
// true-cross) as those cross-pillar links came up. Traditions/phenomena/
// biographies can cite into these three but aren't themselves citable
// targets - nothing currently points a story back at a devotion or a life.
const CITABLE_COLLECTIONS: readonly Collection[] = ['legends', 'symbols', 'relics'];

// relatedLegends is a slug array that points into one of CITABLE_COLLECTIONS,
// from any collection (including a citable one citing a peer in the same
// collection, as with Hubert/Eustace).
export async function resolveRelatedLegends(slugs: string[] | undefined): Promise<RelatedLink[]> {
  if (!slugs || slugs.length === 0) return [];
  const citable = (await Promise.all(CITABLE_COLLECTIONS.map(getPublished))).flat();
  const bySlug = new Map(citable.map((e) => [e.id, e]));
  return slugs.flatMap((slug) => {
    const target = bySlug.get(slug);
    return target ? [toLink(target)] : [];
  });
}

// The reverse of resolveRelatedLegends: every entry, in any collection, whose
// relatedLegends[] cites this one. Derived rather than hand-maintained so a
// tradition/relic/phenomenon/biography linking to a legend (or relic, or
// symbol) doesn't require a second, easily-forgotten edit on the target's
// own frontmatter.
export async function findReferencingEntries(collection: Collection, id: string): Promise<RelatedLink[]> {
  const all = await getAllPublished();
  return all
    .filter((entry) => !(entry.collection === collection && entry.id === id))
    .filter((entry) => entry.data.relatedLegends?.includes(id))
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
  const backward = CITABLE_COLLECTIONS.includes(entry.collection)
    ? await findReferencingEntries(entry.collection, entry.id)
    : [];
  const related = [...forward, ...backward].filter(unseen);

  const saints = 'saints' in entry.data ? entry.data.saints : undefined;
  const sameSaint = (await findBySaint(saints, entry.collection, entry.id)).filter(unseen);

  return { related, sameSaint };
}
