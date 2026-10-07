// Title-cases a hyphenated enum slug for display (e.g. 'veneration-relic' ->
// 'Veneration Relic'). For slugs with a dedicated display name (tags,
// saints), use their own lookup instead - this is only for the plain
// category/cluster enums that don't need special-casing.
export function titleCaseSlug(slug: string): string {
  return slug
    .split('-')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}
