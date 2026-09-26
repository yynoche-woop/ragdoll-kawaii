// 猫の姓名判断:画数の数え方と五格の計算(ブラウザで動く)。
// 人間向けの一般的な「五格」方式をベースに、結果の読み方だけ猫の暮らしに置き換える。
// 文章(各格の意味・判定文)はサイトごとに src/data/seimei-text.ts に書く。
import { KANJI_BY_STROKES } from './kanji-strokes';

// ---------- ひらがな・カタカナの画数(姓名判断で一般的な数え方) ----------
// 濁点は+2、半濁点は+1、小書き文字は元の字と同じ、長音「ー」は1画。
const HIRA =
  'あ3い2う2え3お4か3き4く1け3こ2さ3し1す3せ3そ3た4ち3つ1て2と2な5に3ぬ4ね4の1は4ひ2ふ4へ1ほ5ま4み3む4め2も3や3ゆ3よ3ら3り2る2れ3ろ3わ3ゐ3ゑ5を4ん2';
const KATA =
  'ア2イ2ウ3エ3オ3カ2キ3ク2ケ3コ2サ3シ3ス2セ2ソ2タ3チ3ツ3テ3ト2ナ2ニ2ヌ2ネ4ノ1ハ2ヒ2フ1ヘ1ホ4マ2ミ3ム2メ2モ3ヤ2ユ2ヨ3ラ2リ2ル2レ1ロ3ワ2ヰ4ヱ3ヲ3ン2';
const SMALL: Record<string, string> = {
  ぁ: 'あ', ぃ: 'い', ぅ: 'う', ぇ: 'え', ぉ: 'お', っ: 'つ', ゃ: 'や', ゅ: 'ゆ', ょ: 'よ', ゎ: 'わ', ゕ: 'か', ゖ: 'け',
  ァ: 'ア', ィ: 'イ', ゥ: 'ウ', ェ: 'エ', ォ: 'オ', ッ: 'ツ', ャ: 'ヤ', ュ: 'ユ', ョ: 'ヨ', ヮ: 'ワ', ヵ: 'カ', ヶ: 'ケ',
};
const KANA = new Map<string, number>();
for (const src of [HIRA, KATA]) for (const m of src.matchAll(/(\D)(\d)/g)) KANA.set(m[1], Number(m[2]));
KANA.set('ー', 1);

let KANJI: Map<string, number> | null = null;
function kanjiStrokes(c: string): number | undefined {
  if (!KANJI) {
    KANJI = new Map();
    KANJI_BY_STROKES.forEach((chars, n) => { for (const k of chars) KANJI!.set(k, n); });
  }
  return KANJI.get(c);
}

export interface CharStroke { c: string; n: number | null }
export interface ParseResult { chars: CharStroke[]; unknown: string[]; latin: boolean }

/** 文字ごとの画数。表にない字は n=null */
export function strokesOf(input: string): ParseResult {
  const text = input.normalize('NFKC').replace(/[\s・･.]/g, '');
  const chars: CharStroke[] = [];
  const unknown: string[] = [];
  let latin = false;
  for (const raw of text) {
    if (/[A-Za-z0-9]/.test(raw)) { latin = true; continue; }
    if (raw === '々' || raw === 'ゝ' || raw === 'ヽ') {
      // 繰り返し記号は直前の字と同じ画数で数える
      const prev = chars[chars.length - 1];
      chars.push({ c: raw, n: prev ? prev.n : null });
      if (!prev) unknown.push(raw);
      continue;
    }
    // 濁点・半濁点を分ける(が → か + ゛)
    const parts = [...raw.normalize('NFD')];
    const base = SMALL[parts[0]] ?? parts[0];
    let n = KANA.get(base) ?? kanjiStrokes(raw) ?? kanjiStrokes(base);
    if (n != null) {
      for (const m of parts.slice(1)) n += m === '゙' ? 2 : m === '゚' ? 1 : 0;
    } else if (raw === 'ゔ' || raw === 'ヴ') {
      n = (KANA.get(raw === 'ゔ' ? 'う' : 'ウ') ?? 0) + 2;
    }
    chars.push({ c: raw, n: n ?? null });
    if (n == null) unknown.push(raw);
  }
  return { chars, unknown, latin };
}

// ---------- 吉凶 ----------
export type Rank = '大吉' | '吉' | '半吉' | '凶';
// 一般的な吉凶表をもとにした4段階(流派によって違う数もある)
const DAIKICHI = [1, 3, 5, 11, 13, 15, 16, 21, 23, 24, 31, 32, 41, 45, 48, 52, 63, 81];
const KICHI = [6, 7, 8, 17, 18, 25, 29, 33, 35, 37, 38, 39, 47, 57, 58, 61, 65, 67, 68];
const HANKICHI = [27, 30, 36, 40, 42, 51, 55, 71, 73, 75];
export const RANK_POINT: Record<Rank, number> = { 大吉: 3, 吉: 2, 半吉: 1, 凶: 0 };

/** 81を超えたら80を引く */
export const fold = (n: number) => { while (n > 81) n -= 80; return n; };
export function rankOf(n: number): Rank {
  const x = fold(n);
  if (DAIKICHI.includes(x)) return '大吉';
  if (KICHI.includes(x)) return '吉';
  if (HANKICHI.includes(x)) return '半吉';
  return '凶';
}

// 数ごとの小さなキーワード(アメショの森・週刊ラグドール共通の、猫の暮らしに置き換えたオリジナル)
export const KEYWORD: string[] = [
  '',
  'はじまりの肉球', 'ふたりで半分こ', '陽気なしっぽ', '迷子の毛糸玉', 'まんぷくの福', 'ぬくぬくの家', 'ひとり狩りの名人', 'こつこつ爪とぎ', '月夜の大運動会', '空っぽの段ボール',
  '春のひだまり', '届かない棚の上', '人気者のゴロゴロ', 'すきま風の窓辺', 'みんなのひざの上', 'ボスの貫禄', 'ゆずらない寝床', 'がんばり屋の肉球', '雨の日のお留守番', 'からっぽのお皿',
  'てっぺんの特等席', 'ひとりの夜長', '朝日のジャンプ', 'ごほうびのカリカリ', 'マイペースの達人', '波乱のカーテン登り', 'ちょっと頑固なしっぽ', 'ドタバタの引っ越し', '知恵のパズル', 'ころがるサイコロ',
  '頼れる見回り役', '思いがけない贈りもの', '堂々の伸び', 'こぼれたお水', 'おだやかな毛づくろい', 'おせっかいな見張り', 'ひとり立ちの誇り', 'アートな寝相', 'まぶしいスポットライト', 'きまぐれ冒険',
  'みんなの人気者', '器用すぎる前足', '散らかったおもちゃ箱', '空回りの追いかけっこ', '順風満帆のしっぽ', '迷い道の探検', '花咲く縁側', '物知りの長老', '七変化の気分屋', 'シーソー気分',
  '浮き沈みのジャンプ', '先読みの名ハンター', 'ふくらみしっぽ', 'からまった毛玉', '表と裏のしっぽ', 'ひと休みの香箱', '雨のち晴れのひなた', 'あとから来る大当たり', 'ためらいの前足', '暗がりの手さぐり',
  'つやつやの毛並み', 'すれちがいのおやつ', 'まんまるの満月', 'ゆらぐ水面', '長居の座布団', '迷子の鈴', 'すいすい通り道', 'ひらめきの猫パンチ', '落ち着かない夜', '静かなしっぽ',
  'じわじわ実るごはん', '見た目より苦労人', 'ほどほどの幸せ', '空振りの狩り', '守りのかまくら', '行ったり来たり', '前半と後半', '早咲きの花', '霧の中の散歩', 'しずかな充電期間',
  'はじまりに還る大肉球',
];

// ---------- 性別 ----------
export type Sex = 'f' | 'm';
// 人間の姓名判断で「頭領運(リーダーの数)」とされ、女性には強すぎるといわれることもある数。猫版では性別ごとに読み替える
export const LEADER_NUMS = [21, 23, 29, 33, 39];
/** 性別で結果(パラメータ・ラッキーアイテムなど)の揺らし方を変える。五格の計算そのものは性別で変わらない */
export const sexHash = (hash: number, sex: Sex) => (sex === 'm' ? (hash ^ 0x9e3779b9) >>> 0 : hash);

// ---------- 五格 ----------
export type GradeKey = 'ten' | 'jin' | 'chi' | 'gai' | 'sou';
export interface Grade { key: GradeKey; n: number; folded: number; rank: Rank; formula: string }
export interface Seimei {
  sei: CharStroke[];
  mei: CharStroke[];
  grades: Record<GradeKey, Grade>;
  score: number; // 0〜15(大吉3・吉2・半吉1・凶0 の合計)
  hash: number;
}

const sum = (a: CharStroke[]) => a.reduce((s, x) => s + (x.n ?? 0), 0);
export const hashOf = (s: string) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.codePointAt(0)!) >>> 0, 2166136261);

/**
 * 天格 = 姓の合計(1字姓は霊数1を足す)
 * 人格 = 姓の最後の字 + 名の最初の字
 * 地格 = 名の合計(1字名は霊数1を足す)
 * 外格 = 総格 − 人格(1字姓・1字名のときは霊数1をそれぞれ足す)
 * 総格 = 姓と名の全部の合計(霊数は入れない)
 */
export function calcSeimei(sei: CharStroke[], mei: CharStroke[]): Seimei {
  const s = sum(sei);
  const m = sum(mei);
  const reiS = sei.length === 1 ? 1 : 0;
  const reiM = mei.length === 1 ? 1 : 0;
  const ten = s + reiS;
  const jin = (sei[sei.length - 1]?.n ?? 0) + (mei[0]?.n ?? 0);
  const chi = m + reiM;
  const sou = s + m;
  const gai = sou - jin + reiS + reiM;
  const mk = (key: GradeKey, n: number, formula: string): Grade => ({ key, n, folded: fold(n), rank: rankOf(n), formula });
  const grades = {
    ten: mk('ten', ten, reiS ? `${s}+霊数1` : sei.map((x) => x.n).join('+')),
    jin: mk('jin', jin, `${sei[sei.length - 1]?.n}+${mei[0]?.n}`),
    chi: mk('chi', chi, reiM ? `${m}+霊数1` : mei.map((x) => x.n).join('+')),
    gai: mk('gai', gai, `${sou}−${jin}${reiS || reiM ? `+霊数${reiS + reiM}` : ''}`),
    sou: mk('sou', sou, `${s}+${m}`),
  };
  const score = Object.values(grades).reduce((a, g) => a + RANK_POINT[g.rank], 0);
  const hash = hashOf(sei.map((x) => x.c).join('') + '|' + mei.map((x) => x.c).join(''));
  return { sei, mei, grades, score, hash };
}

/** 1〜5の星。吉凶ランクをもとに、数の偶奇で少しだけ揺らす(同じ数なら毎回同じ) */
export function stars(g: Grade, salt: number): number {
  const base = RANK_POINT[g.rank] + 1; // 1〜4
  return Math.min(5, base + ((g.folded * 7 + salt) % 3 === 0 ? 1 : 0));
}

/**
 * 動的に入れる短い見出しを文節っぽく区切って <wbr> を入れる(ビルド時の phrase-break.mjs と同じ考え方)。
 * Intl.Segmenter の単語区切りに、直後の短いひらがな(助詞など)をくっつける。CSS の keep-all と組み合わせて使う。
 */
export function setPhrased(el: HTMLElement, text: string) {
  const Seg = (Intl as any).Segmenter;
  if (!Seg) { el.textContent = text; return; }
  const out: string[] = [];
  for (const { segment } of new Seg('ja', { granularity: 'word' }).segment(text)) {
    const prev = out.length - 1;
    if (prev >= 0 && (/^[ぁ-ゖー、。!?！？」』)）…〜]+$/.test(segment) || /[「『(（]$/.test(out[prev]))) out[prev] += segment;
    else out.push(segment);
  }
  el.replaceChildren();
  out.forEach((s, i) => {
    if (i) el.append(document.createElement('wbr'));
    el.append(s);
  });
}
