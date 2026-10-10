import type { APIRoute } from 'astro';
import { COLLECTIONS, getAllPublished, hrefFor } from '../lib/collections';
import { tagsInUse } from '../lib/tagArchive';

export const prerender = true;

// Hand-built rather than @astrojs/sitemap: the entry pages are emitted for
// drafts too (so a draft URL is shareable), and the integration has no way
// to know which are unpublished. /random is a redirect and is left out.
// Prerendered pages are served at their trailing-slash URL (the canonical
// form); the on-demand ones (home, calendar) are not.
export const GET: APIRoute = async ({ site }) => {
  const paths = ['/', '/calendar'];
  const prerendered: string[] = [
    '/tags/',
    ...COLLECTIONS.map((c) => `/${c}/`),
    ...(await getAllPublished()).map((entry) => `${hrefFor(entry.collection, entry.id)}/`),
  ];
  prerendered.push(...(await tagsInUse()).map((tag) => `/tags/${tag.slug}/`));

  const urls = [...paths, ...prerendered].map((path) => `  <url><loc>${new URL(path, site).href}</loc></url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
