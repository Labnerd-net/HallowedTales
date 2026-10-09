import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://hallowedtales.com',
  output: 'server',
  adapter: cloudflare(),
  integrations: [mdx()],

  vite: {
    plugins: [tailwindcss()],
  },
});
