// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import { rehypeImageCaptions } from './src/lib/rehype-image-captions.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://caythian.github.io',
  integrations: [react()],
  markdown: {
    rehypePlugins: [rehypeImageCaptions],
  },
});