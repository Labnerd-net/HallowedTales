const SITE = 'https://themiracleregister.org';

// Snapshot of TMR's published saint slugs, taken from TMR_sitemap.xml on
// 2026-10-04. TMR only covers modern causes with medically-documented
// miracle claims, so most HallowedTales saints won't appear here - that's
// the two sites' differing scope, not a gap to fill. Refresh this list by
// re-checking the sitemap rather than guessing slugs; there's no live
// lookup (see CLAUDE.md: this repo doesn't read TMR's database).
const REGISTER_SAINT_SLUGS = new Set([
  'andre-bessette',
  'bernadette-soubirous',
  'carlo-acutis',
  'catherine-laboure',
  'damien-of-molokai',
  'edith-stein',
  'elizabeth-ann-seton',
  'faustina-kowalska',
  'francisco-marto',
  'fulton-sheen',
  'gianna-beretta-molla',
  'jacinta-marto',
  'john-henry-newman',
  'john-neumann',
  'john-paul-ii',
  'john-xxiii',
  'josemaria-escriva',
  'josephine-bakhita',
  'juan-diego',
  'kateri-tekakwitha',
  'louis-martin',
  'maximilian-kolbe',
  'mother-teresa',
  'oscar-romero',
  'padre-pio',
  'pier-giorgio-frassati',
  'therese-of-lisieux',
  'zelie-martin',
]);

// First of this entry's saints (by HallowedTales slug) that also has a
// Register saint page, resolved to that page's URL - or undefined if none
// of them do, so callers can skip the cross-link entirely rather than
// rendering a link to a page that doesn't exist.
export function registerSaintHref(saintSlugs: string[] | undefined): string | undefined {
  const match = saintSlugs?.find((slug) => REGISTER_SAINT_SLUGS.has(slug));
  return match ? `${SITE}/saints/${match}` : undefined;
}

export function registerMiracleHref(registerSlug: string | undefined): string | undefined {
  return registerSlug ? `${SITE}/miracles/${registerSlug}` : undefined;
}
