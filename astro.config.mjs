// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

/**
 * Keeps @vitejs/plugin-react from deleting its `transform` hook when Babel can be "skipped"
 * (OXC/Rolldown path). That deletion races with Vite's plugin container during dev restarts
 * / HMR and causes: TypeError: Cannot read properties of undefined (reading 'call')
 * @see https://github.com/vitejs/vite/issues/21162
 */
function babelNoopPlugin() {
  return { name: 'babel-noop-for-vite-react', visitor: {} };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://toywebcreations.dev',
  base: '/toywebcreations/',
  integrations: [
    react({
      babel: {
        plugins: [babelNoopPlugin],
      },
    }),
    mdx(),
  ],
});