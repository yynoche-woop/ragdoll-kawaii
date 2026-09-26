// 猫の姓名判断で使う漢字の画数表を作る(src/data/kanji-strokes.ts を生成)。
//   node scripts/gen-kanji-strokes.mjs
// Unicode の Unihan データベース(Unihan.zip)をダウンロードして、
//   - 対象の字:常用漢字(kJoyoKanji)+人名用漢字(kJinmeiyoKanji)+JIS第1・第2水準(kJis0)
//   - 画数:kRSAdobe_Japan1_6 の「C+」(日本の字形)の 部首の画数+残りの画数。なければ kTotalStrokes
// を取り出す。kTotalStrokes は台湾などの字形の数え方で、日本の字形と1画ずれる字が多い(道=13 など)ため
// 日本の字形の値を優先している。2010年に常用漢字に入った字で、JISの字形と常用漢字表の字形が違う字は下の OVERRIDE で直す。
import { writeFile } from 'node:fs/promises';
import { inflateRawSync } from 'node:zlib';

const URL = 'https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip';
const OUT = new globalThis.URL('../src/data/kanji-strokes.ts', import.meta.url);

// 常用漢字表の字形での画数(JIS の例示字形と違う字)
const OVERRIDE = { 収: 4, 餌: 15, 餅: 15, 遡: 14, 遜: 14, 謎: 17, 頬: 16, 捗: 10, 賭: 16, 噌: 15 };

// 最小限の zip 読み取り(中央ディレクトリを読んで deflate を展開)
function unzip(buf) {
  const files = {};
  let eocd = buf.length - 22;
  while (eocd >= 0 && buf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  for (let i = 0; i < count; i++) {
    const method = buf.readUInt16LE(p + 10);
    const csize = buf.readUInt32LE(p + 20);
    const nlen = buf.readUInt16LE(p + 28);
    const xlen = buf.readUInt16LE(p + 30);
    const clen = buf.readUInt16LE(p + 32);
    const off = buf.readUInt32LE(p + 42);
    const name = buf.subarray(p + 46, p + 46 + nlen).toString();
    const lnlen = buf.readUInt16LE(off + 26);
    const lxlen = buf.readUInt16LE(off + 28);
    const data = buf.subarray(off + 30 + lnlen + lxlen, off + 30 + lnlen + lxlen + csize);
    files[name] = (method === 8 ? inflateRawSync(data) : data).toString('utf8');
    p += 46 + nlen + xlen + clen;
  }
  return files;
}

const res = await fetch(URL);
if (!res.ok) throw new Error(`download failed: ${res.status}`);
const files = unzip(Buffer.from(await res.arrayBuffer()));

const target = new Set();
const adobe = new Map();
const total = new Map();
const ch = (u) => String.fromCodePoint(parseInt(u.replace('U+', ''), 16));
for (const text of Object.values(files)) {
  for (const line of text.split(/\r?\n/)) {
    if (!line.startsWith('U+')) continue;
    const [cp, field, value] = line.split('\t');
    const c = ch(cp);
    if (field === 'kJoyoKanji' || field === 'kJinmeiyoKanji') {
      target.add(c);
      // 「U+525D」「2010:U+4E57」のように異体字が書いてあれば、それも入れる
      for (const m of value.matchAll(/U\+[0-9A-F]+/g)) target.add(ch(m[0]));
    } else if (field === 'kJis0') {
      target.add(c);
    } else if (field === 'kRSAdobe_Japan1_6') {
      const c1 = value.split(' ').find((v) => v.startsWith('C+'));
      if (c1) {
        const [, rad, rest] = c1.split('+')[2].split('.');
        adobe.set(c, Number(rad) + Number(rest));
      }
    } else if (field === 'kTotalStrokes') {
      total.set(c, Number(value.split(' ')[0]));
    }
  }
}

const byStrokes = [];
let n = 0;
for (const c of [...target].sort()) {
  const s = OVERRIDE[c] ?? adobe.get(c) ?? total.get(c);
  if (!s) continue;
  (byStrokes[s] ??= []).push(c);
  n++;
}
const rows = Array.from({ length: byStrokes.length }, (_, i) => JSON.stringify((byStrokes[i] ?? []).join('')));
const src = `// 自動生成:node scripts/gen-kanji-strokes.mjs(手で編集しない)
// 出典:Unicode Unihan Database(kRSAdobe_Japan1_6 の日本の字形の画数、なければ kTotalStrokes)
// 常用漢字+人名用漢字+JIS第1・第2水準 ${n}字。配列の添字が画数。
export const KANJI_BY_STROKES: string[] = [
${rows.map((r, i) => `  /* ${i} */ ${r},`).join('\n')}
];
`;
await writeFile(OUT, src);
console.log(`kanji-strokes.ts: ${n}字`);
