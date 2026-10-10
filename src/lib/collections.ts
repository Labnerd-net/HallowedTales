import { getCollection, type CollectionEntry } from 'astro:content';
import { isPublished } from './published';

export const COLLECTIONS = ['legends', 'traditions', 'relics', 'phenomena', 'symbols'] as const;
export type Collection = (typeof COLLECTIONS)[number];

// Discriminated on `collection`, so narrowing on `entry.collection` gives the
// right `data` shape without casts.
export type AnyEntry = { [K in Collection]: CollectionEntry<K> }[Collection];

async function loadAllPublished(): Promise<AnyEntry[]> {
  const perCollection = await Promise.all(
    COLLECTIONS.map(async (name) => ((await getCollection(name)) as AnyEntry[]).filter(isPublished))
  );
  return perCollection.flat();
}

let cache: Promise<AnyEntry[]> | undefined;

// Every published entry across all five collections. Memoized in production
// so a build (or a long-lived Worker isolate) reads each collection once
// rather than once per page per helper; in dev it re-reads so content edits
// show up without restarting the server.
export function getAllPublished(): Promise<AnyEntry[]> {
  if (!import.meta.env.PROD) return loadAllPublished();
  cache ??= loadAllPublished();
  return cache;
}

export function getPublished<K extends Collection>(collection: K): Promise<CollectionEntry<K>[]> {
  return getAllPublished().then(
    (all) => all.filter((e): e is CollectionEntry<K> => e.collection === collection)
  );
}

export const hrefFor = (collection: Collection, id: string) => `/${collection}/${id}`;
