// @ts-check
import { defineConfig } from 'astro/config';
import phraseBreak from './scripts/phrase-break.mjs';

// GitHub Pages(https://yynoche-woop.github.io/ragdoll-kawaii/)で公開
export default defineConfig({
  site: 'https://yynoche-woop.github.io',
  base: '/ragdoll-kawaii',
  trailingSlash: 'ignore',
  integrations: [phraseBreak()],
});
