import { createHash } from 'node:crypto';
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';

import tailwindcss from '@tailwindcss/vite';
import { THEME_INIT_SCRIPT } from './src/lib/themeInit.ts';

const UMAMI_ORIGIN = 'https://umami.labnerd.net';
const themeInitHash = `sha256-${createHash('sha256').update(THEME_INIT_SCRIPT).digest('base64')}`;

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
        `connect-src 'self' ${UMAMI_ORIGIN}`,
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      scriptDirective: {
        // wasm-unsafe-eval: Pagefind's search engine is WebAssembly.
        resources: ["'self'", "'wasm-unsafe-eval'", UMAMI_ORIGIN],
        hashes: [themeInitHash],
      },
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
