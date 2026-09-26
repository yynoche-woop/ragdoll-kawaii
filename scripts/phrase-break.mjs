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
  if (!JA.test(text)) return text;
  // スペースで区切った単位ごとに文節を判定する(商品名など「に|ゃん|この」のような変な区切りを防ぐ)
  return text
    .split(/(\s+)/)
    .map((seg) => (/^\s*$/.test(seg) || !JA.test(seg) ? seg : breakSegment(seg)))
    .join('');
}

function breakSegment(seg) {
  const chunks = (seg.length < 6 ? [seg] : parser.parse(seg))
    .join('<wbr>')
    // 「・」のあとでも改行できるように
    .replace(/・(?!<wbr>|$)/g, '・<wbr>')
    // タイトルの区切り「|」のあとでも改行できるように
    .replace(/([|｜])(?!<wbr>|$)/g, '$1<wbr>')
    // 長い文節は、カタカナと漢字の境目でも改行できるように(「ラグドール|子猫詐欺事件」)
    .split('<wbr>')
    .map((c) => (c.length > 7 ? c.replace(/([ァ-ヺー])(?=[一-鿿々][一-鿿々ぁ-ん])/g, '$1<wbr>') : c))
    .join('<wbr>')
    // 開きカッコは次の文節の頭へ(「が行末に残らないように)。閉じカッコ・句読点・コロンの前では改行しない
    .replace(/([「『（(【〈《])<wbr>/g, '<wbr>$1')
    .replace(/(?<=[^\s>])(?<!<wbr>)([「『（(【〈《])/g, '<wbr>$1')
    .replace(/<wbr>([」』）)】〉》、。,.:：;；!！?？・〜ー])/g, '$1')
    // 小さい「ゃ」「ッ」などの前では切らない
    .replace(/<wbr>(?=[ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮヵヶ])/g, '')
    // 「か|月」「ヶ|月」は切らない
    .replace(/([かヶケヵ])<wbr>(?=月)/g, '$1')
    .replace(/^<wbr>/, '')
    .replace(/(<wbr>)+/g, '<wbr>')
    // &amp; などの文字参照の途中に入った <wbr> は取り除く
    .replace(/&[#a-z0-9<>wbr]*;/gi, (ent) => ent.replaceAll('<wbr>', ''))
    .split('<wbr>');
  return chunks.map(nowrapPunct).join('<wbr>');
}

// Safari(WebKit)は keep-all でもカッコ・句読点の前後で単語の途中を改行してしまう
// (「成猫(|2〜7歳ごろ)」「体型を「|月1回」」「いないか|、」)。カッコや句読点を含む短い文節は <nobr> で包む(span だとページ側の span 用スタイルが当たってしまうため)
function nowrapPunct(chunk) {
  return /[「『（(【〈《」』）)】〉》、。・]/.test(chunk) && chunk.length <= 14 && !chunk.includes('&')
    ? `<nobr>${chunk}</nobr>`
    : chunk;
}

// タグの外側のテキストだけに <wbr> を入れる。script / style / svg / textarea / pre の中身は触らない
function processHtml(html) {
  const skip = /<(script|style|svg|textarea|pre|code|title|head|select)\b[\s\S]*?<\/\1>/gi;
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
  // 区切りを入れた文字列は <pb-t> で1つにまとめる。flex / grid の中で文節がばらばらの要素として並ぶのを防ぐため
  // (独自タグなのでページ側のスタイルは当たらず、ふつうのインライン要素として振る舞う)
  return chunk.replace(/>([^<]+)</g, (_, text) => {
    const out = breakText(text);
    return out === text ? `>${text}<` : `><pb-t>${out}</pb-t><`;
  });
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
