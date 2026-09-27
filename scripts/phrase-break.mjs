// 日本語が単語や文節の途中で改行されないようにする(ビルド後処理)。
// 形態素解析(kuromoji)で文節を組み立てて、文節の境目にだけ <wbr> を入れる。
// CSS の pb-t { word-break: keep-all } と組み合わせると「文節の切れ目でだけ改行」になる(iPhone の Safari でも効く)。
// BudouX は「見た|目」「光る|目」のように単語の途中で切ることがあるので、辞書を持つ kuromoji で判定する。
//
// 使い方
//   Astro:   integrations: [phraseBreak()]
//   単体:    node scripts/phrase-break.mjs <HTMLのフォルダかファイル>...
//   確認:    node scripts/phrase-break.mjs --test "見た目から付けた名前"
//
// 共通版。週刊ラグドール・ネコキチ猫吉・アメショの森・平成図鑑・ウラ話大全で同じファイルを使う。直したら全サイトにコピーする。
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import kuromoji from 'kuromoji';

const require = createRequire(import.meta.url);
const JA = /[぀-ヿ㐀-鿿]/;
const OPEN = '「『（(【〈《［[｛〔';
const CLOSE = '」』）)】〉》］]｝〕';
const PUNCT = '、。，．,.!！?？:：;；・〜～ー…‥';
const isOpen = (s) => OPEN.includes(s[0]);
const isCloseOrPunct = (s) => (CLOSE + PUNCT).includes(s[0]);

let tokenizer;
async function getTokenizer() {
  if (tokenizer) return tokenizer;
  const dicPath = join(require.resolve('kuromoji/package.json'), '..', 'dict');
  tokenizer = await new Promise((ok, ng) => kuromoji.builder({ dicPath }).build((e, t) => (e ? ng(e) : ok(t))));
  return tokenizer;
}

const isNoun = (t) => t.pos === '名詞' && !['非自立', '接尾', '代名詞'].includes(t.pos_detail_1);

// トークン t の前で新しい文節を始めてよいか
function startsNew(t, p, run) {
  const s = t.surface_form;
  if (isOpen(p.surface_form.at(-1))) return false; // 開きカッコの直後では切らない
  if (isOpen(s)) return true; // 開きカッコは次の文節の頭へ
  if (isCloseOrPunct(s)) return false; // 閉じカッコ・句読点の前では切らない
  if (/[、。・，．!！?？]$/.test(p.surface_form)) return true; // 句読点・中黒のあとは切ってよい
  if (p.pos === '接頭詞') return false; // 「お|名前」「約|3日」
  if (t.pos === '助詞' || t.pos === '助動詞') return false;
  if ((t.pos === '動詞' || t.pos === '形容詞') && ['非自立', '接尾'].includes(t.pos_detail_1)) return false; // 「て|いる」「れ」
  if (t.pos === '名詞' && ['非自立', '接尾'].includes(t.pos_detail_1)) return false; // 「3|日」「する|こと」
  if (t.pos === '動詞' && ['する', 'できる', 'させる', 'される'].includes(t.basic_form) && p.pos === '名詞') return false; // 「検証|する」
  if (t.pos === '記号') return false;
  // 複合名詞(「ラグドール名前ランキング」)は切らない。ただし長すぎるときだけ名詞の境目で切ってよい
  if (isNoun(t) && (isNoun(p) || (p.pos === '名詞' && p.pos_detail_1 === '接尾'))) return run >= 5 && run + s.length > 10;
  return true;
}

// 辞書にない長いカタカナ語(猫種名など)は、よく使う部品の切れ目で折り返せるようにする
// (「スコティッシュ|フォールド」「ノルウェージャン|フォレスト|キャット」)。「ショートヘア」は1つの部品として扱う
const KATA_PARTS = ['アメリカン', 'ブリティッシュ', 'スコティッシュ', 'エキゾチック', 'ノルウェージャン', 'ジャパニーズ', 'ターキッシュ', 'オリエンタル', 'エジプシャン', 'コーニッシュ', 'セルカーク', 'ショートヘア', 'ロングヘア', 'フォレスト', 'キャット', 'フォールド', 'ストレート', 'レックス', 'カール', 'ボブテイル', 'アンゴラ', 'ブルー', 'クーン'];
function splitKatakana(word) {
  if (word.length < 8 || !/^[ァ-ヺー・]+$/.test(word)) return [word];
  const cut = new Set();
  for (const p of KATA_PARTS)
    for (let i = word.indexOf(p); i >= 0; i = word.indexOf(p, i + 1)) {
      if (i >= 3) cut.add(i);
      if (i + p.length <= word.length - 3) cut.add(i + p.length);
    }
  // 「ショートヘア」の中(ショート|ヘア)では切らない
  const parts = [];
  let last = 0;
  for (const i of [...cut].sort((a, b) => a - b)) {
    if (i - last < 3 || /ショート$|ロング$/.test(word.slice(0, i)) && word.slice(i).startsWith('ヘア')) continue;
    parts.push(word.slice(last, i));
    last = i;
  }
  parts.push(word.slice(last));
  return parts;
}

function bunsetsu(tk, seg) {
  const chunks = [];
  let cur = '';
  let prev = null;
  let run = 0; // 続いている名詞の文字数
  for (const t of tk.tokenize(seg)) {
    const s = t.surface_form;
    if (prev && startsNew(t, prev, run)) {
      chunks.push(cur);
      cur = '';
      run = 0;
    }
    run = t.pos === '名詞' ? run + s.length : 0;
    cur += s;
    prev = t;
  }
  if (cur) chunks.push(cur);
  // 辞書にないカタカナ語は「・」ごと1語になることがあるので、「・」のあとで分けてから長い語を部品に分ける
  return chunks.flatMap((c) => c.split(/(?<=・)(?=.)/)).flatMap((c) => {
    const m = c.match(/^([ァ-ヺー]{8,})(.*)$/);
    if (!m) return [c];
    const parts = splitKatakana(m[1]);
    parts[parts.length - 1] += m[2];
    return parts;
  });
}

const cache = new Map();
function breakSegment(tk, seg) {
  if (cache.has(seg)) return cache.get(seg);
  let s = (seg.length < 5 ? [seg] : bunsetsu(tk, seg)).join('<wbr>');
  s = s
    // 短いカギカッコ(「光る目」)は中で切らない
    .replace(/[「『]([^「『」』<]|<wbr>){1,24}?[」』]/g, (m) => (m.replaceAll('<wbr>', '').length <= 10 ? m.replaceAll('<wbr>', '') : m))
    // 「〜」「｜」のあとでも改行できるように(「2〜3歳」のような数字の範囲は切らない)
    .replace(/〜(?![\d０-９]|<wbr>|$)/g, '〜<wbr>')
    .replace(/([|｜])(?!<wbr>|$)/g, '$1<wbr>')
    // 小さい「ゃ」「ッ」や長音の前では切らない。「か|月」「ヶ|月」も切らない
    .replace(/<wbr>(?=[ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮヵヶー])/g, '')
    .replace(/([かヶケヵ])<wbr>(?=月)/g, '$1')
    .replace(/^<wbr>|<wbr>$/g, '')
    .replace(/(<wbr>)+/g, '<wbr>');
  const out = s.split('<wbr>').map(nowrapPunct).join('<wbr>');
  cache.set(seg, out);
  return out;
}

// Safari(WebKit)は keep-all でもカッコ・句読点の前後で単語の途中を改行してしまうので、
// カッコ・句読点とその隣の1文字だけを <nobr> で包む(文節まるごと包むと狭い枠からはみ出すため)
function nowrapPunct(chunk) {
  // 短い文節はまるごと包む(一部だけ包むと「クリー|ム」」のように包みの境目で切れるため)
  if (/[「『（(【〈《」』）)】〉》、。・]/.test(chunk) && chunk.length <= 9) return `<nobr>${chunk}</nobr>`;
  return chunk
    .replace(/[^「『（(【〈《」』）)】〉》、。・]?[」』）)】〉》、。・]+/g, (m) => `<nobr>${m}</nobr>`)
    .replace(/(?<!<nobr>)[「『（(【〈《]+[^「『（(【〈《」』）)】〉》、。・<]?/g, (m) => `<nobr>${m}</nobr>`)
    .replace(/<nobr>([^<]*)<\/nobr><nobr>([^<]*)<\/nobr>/g, '<nobr>$1$2</nobr>');
}

// 空白と文字参照(&amp; など)で区切った単位ごとに処理する。文字参照の前後では切らない
function breakText(tk, text) {
  if (!JA.test(text)) return text;
  return text
    .split(/(\s+|&[#a-zA-Z0-9]+;)/)
    .map((seg) => (!seg || /^\s+$/.test(seg) || seg.startsWith('&') || !JA.test(seg) ? seg : breakSegment(tk, seg)))
    .join('');
}

// タグの外側のテキストだけを対象にする。script / style / svg / textarea / pre などの中身と属性値は触らない
// 区切りを入れた文字列は <pb-t> で1つにまとめる(flex / grid の中で文節がばらばらの要素として並ぶのを防ぐため)
export function processHtml(tk, html) {
  // 多言語サイトでは日本語のページだけを処理する(中国語のページの漢字を日本語として区切らないように)
  const lang = html.match(/<html[^>]*\slang="([^"]+)"/i)?.[1];
  if (lang && !/^ja(-|$)/i.test(lang)) return html;
  const skip = /<(script|style|svg|textarea|pre|code|title|head|select|pb-t)\b[\s\S]*?<\/\1>/gi;
  const chunk = (c) =>
    c.replace(/>([^<]+)</g, (_, text) => {
      // 区切りのない短い日本語(リンク直後の「へ」など)も <pb-t> に入れ、親要素ごと keep-all にする
      if (!JA.test(text)) return `>${text}<`;
      // 「・」や句読点で終わる文字(リンクを「・」でつないだ一覧など)は、そのあとで改行できるようにする
      const tail = /[、。・,，]\s*$/.test(text) ? '<wbr>' : '';
      return `><pb-t>${breakText(tk, text)}</pb-t>${tail}<`;
    });
  let out = '';
  let last = 0;
  for (const m of html.matchAll(skip)) {
    out += chunk(html.slice(last, m.index)) + m[0];
    last = m.index + m[0].length;
  }
  return out + chunk(html.slice(last));
}

async function* walk(p) {
  if (!(await stat(p)).isDirectory()) {
    if (p.endsWith('.html')) yield p;
    return;
  }
  for (const e of await readdir(p, { withFileTypes: true })) yield* walk(join(p, e.name));
}

export async function processPaths(paths) {
  const tk = await getTokenizer();
  let n = 0;
  for (const root of paths)
    for await (const file of walk(root)) {
      const html = await readFile(file, 'utf8');
      const out = processHtml(tk, html);
      if (out !== html) {
        await writeFile(file, out);
        n++;
      }
    }
  return n;
}

export default function phraseBreak() {
  return {
    name: 'phrase-break',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const n = await processPaths([fileURLToPath(dir)]);
        logger.info(`文節改行(<wbr>)を ${n} ファイルに適用`);
      },
    },
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  if (args[0] === '--test') {
    const tk = await getTokenizer();
    for (const s of args.slice(1)) console.log(breakText(tk, s).replace(/<\/?nobr>/g, '').replaceAll('<wbr>', '|'));
  } else {
    console.log(`文節改行(<wbr>)を ${await processPaths(args)} ファイルに適用`);
  }
}
