// 日本語の見出し・短い文が単語の途中で改行されないようにする(ビルド後処理)。
// BudouX で文節を判定して文節の境目に <wbr> を入れ、CSS の word-break: keep-all と組み合わせて
// 「文節の切れ目でだけ改行」させる。Safari を含むすべてのブラウザで効く。
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDefaultJapaneseParser } from 'budoux';

const parser = loadDefaultJapaneseParser();
// <wbr> はすべてのテキストに入れ、実際に文節で改行させるか(keep-all)は CSS 側で要素ごとに決める
const JA = /[぀-ヿ㐀-鿿]/;

function breakText(text) {
  if (!JA.test(text) || text.length < 6) return text;
  return parser
    .parse(text)
    .join('<wbr>')
    // 「・」のあとでも改行できるように
    .replace(/・(?!<wbr>|$)/g, '・<wbr>')
    // &amp; などの文字参照の途中に入った <wbr> は取り除く
    .replace(/&[#a-z0-9<>wbr]*;/gi, (ent) => ent.replaceAll('<wbr>', ''));
}

// タグの外側のテキストだけに <wbr> を入れる。script / style / svg / textarea / pre の中身は触らない
function processHtml(html) {
  const skip = /<(script|style|svg|textarea|pre|code|title|head)\b[\s\S]*?<\/\1>/gi;
  let out = '';
  let last = 0;
  for (const m of html.matchAll(skip)) {
    out += processChunk(html.slice(last, m.index)) + m[0];
    last = m.index + m[0].length;
  }
  return out + processChunk(html.slice(last));
}

function processChunk(chunk) {
  // タグとタグの間のテキストだけを対象にする(属性値は触らない)
  return chunk.replace(/>([^<]+)</g, (_, text) => `>${breakText(text)}<`);
}

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

export default function phraseBreak() {
  return {
    name: 'phrase-break',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        let n = 0;
        for await (const file of walk(fileURLToPath(dir))) {
          const html = await readFile(file, 'utf8');
          const out = processHtml(html);
          if (out !== html) {
            await writeFile(file, out);
            n++;
          }
        }
        logger.info(`文節改行(<wbr>)を ${n} ファイルに適用`);
      },
    },
  };
}
