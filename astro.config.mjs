// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://chrisanderberg.github.io',
  base: '/toywebcreations/',
  trailingSlash: 'always',
  output: 'static',
  integrations: [react(), mdx()]
});