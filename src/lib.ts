import { getCollection, type CollectionEntry } from 'astro:content';

export type Column = CollectionEntry<'columns'>;

/** 公開順(新しい順)。本番ビルドでは draft を除く */
export async function getColumns() {
  const all = await getCollection('columns', (c) => (import.meta.env.PROD ? !c.data.draft : true));
  return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || a.id.localeCompare(b.id));
}

export const CATEGORY_LABEL = { kensho: '検証コラム', jitsuyo: '実用' } as const;
export const fmtDate = (d: Date) => `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
