import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// コラム。書き方のルールは ops/column-spec.md
const columns = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/columns' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // kensho = 検証コラム, jitsuyo = 実用
    category: z.enum(['kensho', 'jitsuyo']),
    tags: z.array(z.string()).default([]),
    verdict: z.object({
      type: z.enum(['hontou', 'uso', 'usoyori', 'kotai', 'kochou', 'warito']),
      label: z.string(),
      summary: z.string(),
    }),
    face: z
      .object({
        coat: z.enum(['seal', 'blue', 'chocolate', 'lilac', 'red', 'cream']).default('seal'),
        pattern: z.enum(['colorpoint', 'mitted', 'bicolor']).default('bicolor'),
        expr: z.enum(['normal', 'smug', 'wow', 'sleepy']).default('normal'),
      })
      .default({ coat: 'seal', pattern: 'bicolor', expr: 'normal' }),
    sources: z.array(z.object({ title: z.string(), url: z.string().url() })).default([]),
    // true の記事は本番ビルドに含めない(横田さんの確認待ち)
    draft: z.boolean().default(false),
  }),
});

export const collections = { columns };
