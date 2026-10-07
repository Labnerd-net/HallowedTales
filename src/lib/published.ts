export function isPublished<T extends { data: { published: boolean } }>(entry: T): boolean {
  return entry.data.published;
}
