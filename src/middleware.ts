import { defineMiddleware } from 'astro:middleware';
import { SECURITY_HEADERS } from './lib/securityHeaders';

export const onRequest = defineMiddleware(async (_context, next) => {
  const upstream = await next();
  // Re-wrap rather than mutate: responses that come from a binding or fetch()
  // (e.g. the /_image endpoint's Cloudflare Images output) have immutable
  // headers, and setting one throws, turning the request into a bare 500.
  const response = new Response(upstream.body, upstream);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(name, value);
  }
  return response;
});
