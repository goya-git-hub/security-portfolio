// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'never' },
  session: false,
  adapter: cloudflare({ imageService: 'compile' }),
});
