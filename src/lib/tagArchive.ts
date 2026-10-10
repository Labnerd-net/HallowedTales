import { getAllPublished, hrefFor } from './collections';
import { COLLECTION_LABELS } from './related';
import { tagLabel } from './tags';
import { excerptFrom } from './excerpt';
import type { EntryImage } from './images';
import type { Badge } from '../components/LegendCard.astro';

export interface TagEntryCard {
  href: string;
  badge: Badge;
  title: string;
  excerpt: string;
  meta: string;
  images: EntryImage[];
  featuredImageIndex?: number;
}

// Every published entry, across all five collections, carrying a given tag.
// Powers /tags/[slug] - the actual "see everything with this tag" page the
// chips on each entry's detail page link out to.
export async function entriesForTag(tagSlug: string): Promise<TagEntryCard[]> {
  const all = await getAllPublished();
  return all
    .filter((entry) => (entry.data.tags as string[] | undefined)?.includes(tagSlug))
    .map((entry) => ({
      href: hrefFor(entry.collection, entry.id),
      badge: COLLECTION_LABELS[entry.collection] as Badge,
      title: entry.data.title,
      excerpt: excerptFrom(entry.body),
      meta: entry.data.earliestSource?.approxDate ?? '',
      images: entry.data.images,
      featuredImageIndex: entry.data.featuredImageIndex,
    }));
}

export interface TagUsage {
  slug: string;
  label: string;
  count: number;
}

// Tags with at least one published entry, not the full TAG_LABELS registry -
// a tag can be registered ahead of content using it, and a dead archive page
// for an unused tag isn't useful to surface on /tags.
export async function tagsInUse(): Promise<TagUsage[]> {
  const counts = new Map<string, number>();
  for (const entry of await getAllPublished()) {
    for (const tag of entry.data.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, label: tagLabel(slug), count }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
