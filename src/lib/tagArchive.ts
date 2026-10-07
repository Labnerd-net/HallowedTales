import { getCollection } from 'astro:content';
import { isPublished } from './published';
import { COLLECTION_LABELS } from './related';
import { tagLabel } from './tags';
import { excerptFrom } from './excerpt';
import type { EntryImage } from './images';
import type { Badge } from '../components/LegendCard.astro';

const COLLECTIONS = ['legends', 'traditions', 'relics', 'phenomena', 'symbols'] as const;

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
  const results: TagEntryCard[] = [];
  for (const collection of COLLECTIONS) {
    const entries = (await getCollection(collection)).filter(isPublished);
    for (const entry of entries) {
      const tags = entry.data.tags as string[] | undefined;
      if (!tags?.includes(tagSlug)) continue;
      results.push({
        href: `/${collection}/${entry.id}`,
        badge: COLLECTION_LABELS[collection] as Badge,
        title: entry.data.title,
        excerpt: excerptFrom(entry.body),
        meta: (entry.data as { earliestSource?: { approxDate: string } }).earliestSource?.approxDate ?? '',
        images: entry.data.images,
        featuredImageIndex: entry.data.featuredImageIndex,
      });
    }
  }
  return results;
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
  for (const collection of COLLECTIONS) {
    const entries = (await getCollection(collection)).filter(isPublished);
    for (const entry of entries) {
      const tags = entry.data.tags as string[] | undefined;
      for (const tag of tags ?? []) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
  }
  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, label: tagLabel(slug), count }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
