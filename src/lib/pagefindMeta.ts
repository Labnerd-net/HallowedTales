// Pagefind splits data-pagefind-meta on commas and has no escaping, but an
// inline `key:value` capture may contain commas when it is the LAST item.
// Titles routinely contain commas ("May, the Month of Mary"), so the title
// must stay last and the category (a fixed label) must stay comma-free.
export function pagefindMeta(title: string, category: string): string {
  if (category.includes(',')) {
    throw new Error(`Pagefind category label must not contain a comma: ${category}`);
  }
  return `category:${category}, title:${title}`;
}
