// @ts-check
import { defineConfig } from 'astro/config';
import phraseBreak from './scripts/phrase-break.mjs';

// GitHub Pages + 独自ドメイン(https://shukan-ragdoll.com/)で公開。public/CNAME がドメイン設定
export default defineConfig({
  site: 'https://shukan-ragdoll.com',
  trailingSlash: 'ignore',
  integrations: [phraseBreak()],
});
