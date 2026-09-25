// ラグドールのマスコット(手描き風SVG)。アメショの森と同じタッチ。
// もこ = シールバイカラー(大きい子)、そら = ブルーミテッド(子猫)。
// ラグドールらしさ:青い目・顔/耳/しっぽが濃いポイントカラー・ふわふわの胸毛(ラフ)・太いしっぽ。

export type Coat = 'seal' | 'blue' | 'chocolate' | 'lilac';
export type Pattern = 'colorpoint' | 'mitted' | 'bicolor';

const INK = '#4a3b35';
const BLUSH = '#f6b3bf';
const WHITE = '#fffaf4';
const EYE = '#7cc0f0';
export const COAT = {
  seal: { body: '#f6ecdf', point: '#6e5445', soft: '#b39580', label: 'シール' },
  blue: { body: '#eef1f6', point: '#7c8aa2', soft: '#aab5c7', label: 'ブルー' },
  chocolate: { body: '#f8efe4', point: '#94705a', soft: '#c7a893', label: 'チョコレート' },
  lilac: { body: '#f7f3f5', point: '#ab9ba6', soft: '#d2c6ce', label: 'ライラック' },
} as const;

interface Opts {
  coat: Coat;
  pattern: Pattern;
  /** 頭の傾き(度) */
  tilt?: number;
  /** 目を細める(にっこり) */
  smile?: boolean;
}

/** viewBox 0 0 220 240 に収まる座り姿のラグドールを <g> で返す。
    h-tail / h-head / h-eyes / h-ear のクラスは、ヒーローで動かすためのフック */
export function ragGroup({ coat, pattern, tilt = 0, smile = false }: Opts): string {
  const c = COAT[coat];
  const s = `stroke="${INK}" stroke-linecap="round" stroke-linejoin="round"`;
  const white = pattern !== 'colorpoint';
  const paw = white ? WHITE : c.soft;
  const eyes = smile
    ? `<path d="M76 96 Q86 86 96 96 M124 96 Q134 86 144 96" fill="none" ${s} stroke-width="4"/>`
    : `<circle cx="86" cy="95" r="10.5" fill="${EYE}" stroke="${INK}" stroke-width="2.6"/><circle cx="134" cy="95" r="10.5" fill="${EYE}" stroke="${INK}" stroke-width="2.6"/>
       <circle cx="86" cy="96" r="6.6" fill="${INK}"/><circle cx="134" cy="96" r="6.6" fill="${INK}"/>
       <circle cx="89" cy="92" r="2.8" fill="#fff"/><circle cx="137" cy="92" r="2.8" fill="#fff"/>
       <circle cx="83" cy="100" r="1.3" fill="#fff"/><circle cx="131" cy="100" r="1.3" fill="#fff"/>`;
  // 胸:バイカラーは胸からおなかまで白、ミテッドは胸に白いすじ、カラーポイントは淡いクリーム
  const chest =
    pattern === 'bicolor'
      ? `<ellipse cx="110" cy="186" rx="36" ry="40" fill="${WHITE}"/>`
      : pattern === 'mitted'
        ? `<ellipse cx="110" cy="176" rx="15" ry="40" fill="${WHITE}"/>`
        : `<ellipse cx="110" cy="176" rx="28" ry="34" fill="#fffdf8" opacity=".7"/>`;
  const ruff = pattern === 'colorpoint' ? '#fffdf8' : WHITE;
  // 顔のマスク。バイカラーは鼻すじに白い逆V
  const faceV =
    pattern === 'bicolor'
      ? `<path d="M110 70 C105 86 96 106 88 128 Q110 140 132 128 C124 106 115 86 110 70 Z" fill="${WHITE}"/>`
      : `<ellipse cx="110" cy="120" rx="16" ry="11" fill="${c.soft}" opacity=".9"/>`;
  return `
  <g class="rag rag-${coat}">
    <g class="h-tail">
      <path d="M148 216 C198 222 216 186 204 150 C198 132 180 134 178 150" fill="none" stroke="${INK}" stroke-width="31" stroke-linecap="round"/>
      <path d="M148 216 C198 222 216 186 204 150 C198 132 180 134 178 150" fill="none" stroke="${c.point}" stroke-width="24" stroke-linecap="round"/>
      <path d="M150 216 C172 219 188 212 196 198" fill="none" stroke="${c.soft}" stroke-width="22" stroke-linecap="round"/>
      <path d="M206 170 l8 -3 M204 184 l9 1 M197 140 l4 -8" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
    </g>
    <path d="M60 116 C44 140 36 170 40 196 C33 204 37 214 46 218 Q52 230 68 230 L152 230 Q168 230 174 218 C183 214 187 204 180 196 C184 170 176 140 160 116 Z" fill="${c.body}" ${s} stroke-width="3.5"/>
    <path d="M46 176 q-6 4 -4 10 M174 176 q6 4 4 10 M50 204 q-5 3 -3 8 M170 204 q5 3 3 8" fill="none" ${s} stroke-width="2.2"/>
    ${chest}
    <path d="M70 122 Q76 146 88 138 Q92 160 104 148 Q110 166 116 148 Q128 160 132 138 Q144 146 150 122 Z" fill="${ruff}" ${s} stroke-width="2.4"/>
    <ellipse cx="89" cy="226" rx="17" ry="10.5" fill="${paw}" ${s} stroke-width="3.5"/>
    <ellipse cx="131" cy="226" rx="17" ry="10.5" fill="${paw}" ${s} stroke-width="3.5"/>
    <path d="M84 222 L84 229 M94 222 L94 229 M126 222 L126 229 M136 222 L136 229" ${s} stroke-width="2.2"/>
    <g class="h-head"><g transform="rotate(${tilt} 110 128)">
      <path d="M54 76 L57 28 Q59 15 71 22 L98 44 Z" fill="${c.point}" ${s} stroke-width="3.5"/>
      <path class="h-ear" d="M166 76 L163 28 Q161 15 149 22 L122 44 Z" fill="${c.point}" ${s} stroke-width="3.5"/>
      <path d="M63 60 L65 36 L84 47 Z" fill="#f3c6cd"/>
      <path class="h-ear" d="M157 60 L155 36 L136 47 Z" fill="#f3c6cd"/>
      <path d="M42 90 C42 52 72 34 110 34 C148 34 178 52 178 90 C184 96 182 104 187 110 C179 112 181 120 172 125 C160 137 138 145 110 145 C82 145 60 137 48 125 C39 120 41 112 33 110 C38 104 36 96 42 90 Z" fill="${c.body}" ${s} stroke-width="3.5"/>
      <path d="M110 56 C82 56 62 74 60 98 C58 120 82 136 110 136 C138 136 162 120 160 98 C158 74 138 56 110 56 Z" fill="${c.soft}"/>
      <path d="M110 66 C90 66 76 80 74 98 C73 114 90 126 110 126 C130 126 147 114 146 98 C144 80 130 66 110 66 Z" fill="${c.point}" opacity=".55"/>
      ${faceV}
      <g class="h-eyes">${eyes}</g>
      <ellipse cx="68" cy="116" rx="10" ry="6" fill="${BLUSH}" opacity=".85"/>
      <ellipse cx="152" cy="116" rx="10" ry="6" fill="${BLUSH}" opacity=".85"/>
      <path d="M104.5 108 L115.5 108 L110 114.5 Z" fill="#e98c9b" ${s} stroke-width="2"/>
      <path d="M110 114.5 Q110 121 103 122 M110 114.5 Q110 121 117 122" fill="none" ${s} stroke-width="2.6"/>
      <path d="M52 112 L30 108 M52 119 L32 122 M168 112 L190 108 M168 119 L188 122" stroke="${INK}" stroke-width="1.8" stroke-linecap="round" opacity=".45"/>
    </g></g>
  </g>`;
}

/** 単体のラグドールSVG */
export function ragSvg(opts: Opts & { label?: string }): string {
  const label = opts.label ?? `${COAT[opts.coat].label}${PATTERN_LABEL[opts.pattern]}のラグドール`;
  return `<svg viewBox="0 0 220 240" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">${ragGroup(opts)}</svg>`;
}

/** 顔だけ(アイコン用) */
export function ragFaceSvg(coat: Coat = 'seal', pattern: Pattern = 'bicolor'): string {
  const g = ragGroup({ coat, pattern });
  const head = g.slice(g.indexOf('<g class="h-head">'), g.lastIndexOf('</g>'));
  return `<svg viewBox="28 10 164 140" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${head}</svg>`;
}

export const PATTERN_LABEL: Record<Pattern, string> = { colorpoint: 'カラーポイント', mitted: 'ミテッド', bicolor: 'バイカラー' };

/** 羽根のねこじゃらし */
const feather = (x: number, y: number, r: number) => `<g transform="translate(${x} ${y}) rotate(${r})">
  <path d="M0 0 L0 -70" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
  <g stroke="${INK}" stroke-width="2.2"><ellipse cx="-6" cy="-78" rx="7" ry="16" fill="#f6b3bf" transform="rotate(-20 -6 -78)"/><ellipse cx="6" cy="-80" rx="7" ry="16" fill="#9fd3f2" transform="rotate(18 6 -80)"/><ellipse cx="0" cy="-88" rx="6" ry="14" fill="#ffd96a"/></g></g>`;

/** トップのヒーロー:お花畑のもこ(大)とそら(子猫) */
export function heroSceneSvg(): string {
  return `<svg viewBox="0 0 520 330" role="img" aria-label="お花畑に座るシールバイカラーとブルーミテッドのラグドール" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
    <g class="px-layer" data-depth="0.35">
      <g fill="#fff" opacity=".85"><circle cx="180" cy="40" r="16"/><circle cx="200" cy="34" r="21"/><circle cx="222" cy="42" r="15"/><circle cx="400" cy="30" r="12"/><circle cx="416" cy="25" r="16"/><circle cx="433" cy="31" r="11"/></g>
      <g stroke="${INK}" stroke-width="3" stroke-linejoin="round">
        <rect x="54" y="150" width="16" height="132" rx="7" fill="#b98a66"/>
        <path d="M62 34 C20 34 8 80 22 104 C0 130 22 172 60 164 C92 176 124 148 110 118 C132 90 108 42 62 34 Z" fill="#d9c8ef"/>
        <rect x="452" y="170" width="14" height="112" rx="6" fill="#b98a66"/>
        <path d="M459 70 C424 70 414 106 426 126 C408 148 428 182 458 176 C488 186 512 160 500 134 C516 110 496 72 459 70 Z" fill="#f7cddb"/>
      </g>
      <g fill="#fff" opacity=".8"><circle cx="46" cy="80" r="4"/><circle cx="86" cy="120" r="3.5"/><circle cx="72" cy="66" r="3"/><circle cx="452" cy="112" r="3.5"/><circle cx="476" cy="140" r="3"/></g>
    </g>
    <ellipse cx="260" cy="300" rx="250" ry="26" fill="#cfe7c6"/>
    <g class="px-layer" data-depth="0.12">
      <g class="hero-big" transform="translate(112 12) scale(1.2)">${ragGroup({ coat: 'seal', pattern: 'bicolor' })}</g>
      <g class="hero-small" transform="translate(318 132) scale(0.7)">${ragGroup({ coat: 'blue', pattern: 'mitted', tilt: -9, smile: true })}</g>
    </g>
    <g class="px-layer" data-depth="-0.25">
      <g fill="#f7c9d3" stroke="${INK}" stroke-width="2"><circle cx="150" cy="286" r="6"/><circle cx="398" cy="290" r="5"/><circle cx="430" cy="276" r="4"/><circle cx="96" cy="292" r="5"/></g>
      <g fill="#fff" stroke="${INK}" stroke-width="1.8"><circle cx="160" cy="296" r="4"/><circle cx="386" cy="282" r="3.5"/></g>
      <path d="M118 290 l6 -12 l6 12 M372 294 l5 -10 l5 10 M246 300 l5 -10 l5 10" fill="none" stroke="#7fb36f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <g fill="#ffd96a" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round">
        <path d="M338 58 l5 11 l12 1 l-9 8 l3 12 l-11 -6 l-11 6 l3 -12 l-9 -8 l12 -1 Z"/>
        <path d="M30 230 l3 7 l8 1 l-6 5 l2 8 l-7 -4 l-7 4 l2 -8 l-6 -5 l8 -1 Z"/>
      </g>
      <g class="hero-feather">${feather(474, 292, 12)}</g>
    </g>
  </svg>`;
}

/** セクション区切り:足あとと、もこ・そらの顔 */
export function walkingCatsSvg(): string {
  const paw = (x: number, y: number, r: number) =>
    `<g transform="translate(${x} ${y}) rotate(${r}) scale(.9)" fill="#d8cdc5"><ellipse cx="0" cy="4" rx="6" ry="5"/><ellipse cx="-6" cy="-3" rx="2.4" ry="3"/><ellipse cx="-2" cy="-7" rx="2.4" ry="3"/><ellipse cx="2.5" cy="-7" rx="2.4" ry="3"/><ellipse cx="6.5" cy="-3" rx="2.4" ry="3"/></g>`;
  const paws = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => paw(110 + i * 38, i % 2 ? 44 : 30, 90)).join('');
  const face = (coat: Coat, pattern: Pattern) => ragFaceSvg(coat, pattern).replace(/^<svg[^>]*>/, '<g transform="translate(-28 -10)">').replace(/<\/svg>$/, '</g>');
  return `<svg viewBox="0 0 520 80" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    ${paws}
    <g transform="translate(10 4) scale(.46)">${face('seal', 'bicolor')}</g>
    <g transform="translate(440 14) scale(.4)">${face('blue', 'mitted')}</g>
  </svg>`;
}

export const PAW_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor"><ellipse cx="12" cy="16" rx="5.2" ry="4.4"/><ellipse cx="5.6" cy="10.4" rx="2.3" ry="2.9"/><ellipse cx="9.4" cy="6.4" rx="2.3" ry="2.9"/><ellipse cx="14.6" cy="6.4" rx="2.3" ry="2.9"/><ellipse cx="18.4" cy="10.4" rx="2.3" ry="2.9"/></g></svg>`;
