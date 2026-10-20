import { createHash } from 'node:crypto';
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';

import tailwindcss from '@tailwindcss/vite';
import { THEME_INIT_SCRIPT } from './src/lib/themeInit.ts';

const UMAMI_ORIGIN = 'https://umami.labnerd.net';
// Cloudflare Web Analytics: the edge injects this beacon into HTML responses
// and it reports back to cloudflareinsights.com.
const CF_BEACON_SCRIPT = 'https://static.cloudflareinsights.com';
const CF_BEACON_CONNECT = 'https://cloudflareinsights.com';
const themeInitHash = `sha256-${createHash('sha256').update(THEME_INIT_SCRIPT).digest('base64')}`;

// CardThumb.astro sets a per-image `style="object-position: center N%"`
// attribute (N = an entry's `focalY`, an integer 0-100 - see
// content.config.ts) so each card thumbnail can crop to a different focal
// point. Hash-sources only match <style> elements, not inline style
// attributes, unless the hash is placed on style-src-attr (CSP3) - so every
// possible value gets its own hash here rather than relying on style-src's
// existing element hashes or 'unsafe-inline' (which hashes present would
// make browsers ignore anyway).
const objectPositionHashes = Array.from({ length: 101 }, (_, focalY) => ({
  hash: `sha256-${createHash('sha256').update(`object-position: center ${focalY}%`).digest('base64')}`,
  kind: 'attribute',
}));

export default defineConfig({
  site: 'https://hallowedtales.com',
  output: 'server',
  adapter: cloudflare(),
  integrations: [mdx()],

  // Astro hashes its own bundled scripts and styles; the theme-init script
  // (is:inline, so Astro doesn't see it) and the Umami script are added by
  // hand. See src/lib/securityHeaders.ts for the headers a <meta> can't carry.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        `connect-src 'self' ${UMAMI_ORIGIN} ${CF_BEACON_CONNECT}`,
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      scriptDirective: {
        // wasm-unsafe-eval: Pagefind's search engine is WebAssembly.
        resources: ["'self'", "'wasm-unsafe-eval'", UMAMI_ORIGIN, CF_BEACON_SCRIPT],
        hashes: [themeInitHash],
      },
      styleDirective: {
        // 'unsafe-hashes': hash-sources only match <style> element content by
        // default: CSP still requires this keyword to let a hash match an
        // inline style *attribute* instead, even on style-src-attr.
        resources: [{ resource: "'unsafe-hashes'", kind: 'attribute' }],
        hashes: objectPositionHashes,
      },
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
