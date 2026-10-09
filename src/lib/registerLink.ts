import { REGISTER_MIRACLE_SLUGS, REGISTER_SAINT_SLUGS } from '../data/registerSlugs';

const SITE = 'https://themiracleregister.org';

// The sets of published Register slugs are generated, not hand-edited - see
// src/data/registerSlugs.ts. TMR only covers modern causes with
// medically-documented miracle claims, so most HallowedTales saints won't
// appear there - that's the two sites' differing scope, not a gap to fill.
// There's no live lookup (see CLAUDE.md: this repo doesn't read TMR's
// database).

// First of this entry's saints (by HallowedTales slug) that also has a
// Register saint page, resolved to that page's URL - or undefined if none
// of them do, so callers can skip the cross-link entirely rather than
// rendering a link to a page that doesn't exist.
export function registerSaintHref(saintSlugs: string[] | undefined): string | undefined {
  const match = saintSlugs?.find((slug) => REGISTER_SAINT_SLUGS.has(slug));
  return match ? `${SITE}/saints/${match}` : undefined;
}

export function registerMiracleHref(registerSlug: string | undefined): string | undefined {
  return registerSlug && REGISTER_MIRACLE_SLUGS.has(registerSlug) ? `${SITE}/miracles/${registerSlug}` : undefined;
}
