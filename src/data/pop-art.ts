// 週刊ラグドールのイラスト。太い黒線・フラット塗り・白ふちのステッカー調。
// ラグドールらしさ:青い目(品種の基準で青のみ)・顔/耳/しっぽ/足が濃いポイントカラー・ふわふわの顔まわり。

export type Coat = 'seal' | 'blue' | 'chocolate' | 'lilac';
export type Pattern = 'colorpoint' | 'mitted' | 'bicolor';
export type Expr = 'normal' | 'smug' | 'wow' | 'sleepy';

const K = '#141414';
const WHITE = '#ffffff';
const EYE = '#3d8cf0';
export const COAT = {
  seal: { body: '#f3e7d6', point: '#5b4232', soft: '#a88467', label: 'シール' },
  blue: { body: '#eaeef5', point: '#5f7090', soft: '#9dabc4', label: 'ブルー' },
  chocolate: { body: '#f6ebdd', point: '#86604a', soft: '#c29c80', label: 'チョコレート' },
  lilac: { body: '#f5f0f3', point: '#a3909d', soft: '#cdbfc8', label: 'ライラック' },
} as const;
export const PATTERN_LABEL: Record<Pattern, string> = { colorpoint: 'カラーポイント', mitted: 'ミテッド', bicolor: 'バイカラー' };

const HEAD = 'M30 104 C28 60 60 40 100 40 C140 40 172 60 170 104 C178 110 176 120 183 128 C172 130 174 141 164 146 C150 164 126 172 100 172 C74 172 50 164 36 146 C26 141 28 130 17 128 C24 120 22 110 30 104 Z';
const EAR_L = 'M40 88 L45 24 Q47 11 60 20 L94 50 Z';
const EAR_R = 'M160 88 L155 24 Q153 11 140 20 L106 50 Z';

function eyes(expr: Expr, lidColor: string): string {
  const eye = (x: number) => {
    if (expr === 'sleepy') return `<path d="M${x - 16} 110 Q${x} 124 ${x + 16} 110" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round"/>`;
    const base = `<circle cx="${x}" cy="110" r="16" fill="${EYE}" stroke="${K}" stroke-width="4"/><circle cx="${x}" cy="111" r="10.5" fill="${K}"/>`;
    const hi = expr === 'wow'
      ? `<path d="M${x + 5} 99 l2.2 5 l5 2.2 l-5 2.2 l-2.2 5 l-2.2 -5 l-5 -2.2 l5 -2.2 Z" fill="#fff"/><circle cx="${x - 5}" cy="117" r="2.4" fill="#fff"/>`
      : `<circle cx="${x + 5}" cy="104" r="4.6" fill="#fff"/><circle cx="${x - 5}" cy="117" r="2" fill="#fff"/>`;
    const lid = expr === 'smug' ? `<path d="M${x - 18} 108 A18 18 0 0 1 ${x + 18} 108 Z" fill="${lidColor}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>` : '';
    return base + hi + lid;
  };
  return eye(74) + eye(126);
}

/** 顔(viewBox 0 0 200 190)。sticker: 白ふちを付ける */
export function faceGroup(coat: Coat, pattern: Pattern = 'bicolor', expr: Expr = 'normal', sticker = false): string {
  const c = COAT[coat];
  const s = `stroke="${K}" stroke-width="5" stroke-linejoin="round"`;
  const v = pattern === 'bicolor' ? `<path d="M100 78 C95 98 84 126 76 154 Q100 166 124 154 C116 126 105 98 100 78 Z" fill="${WHITE}"/>` : '';
  const edge = sticker ? `<g fill="${WHITE}" stroke="${WHITE}" stroke-width="22" stroke-linejoin="round"><path d="${EAR_L}"/><path d="${EAR_R}"/><path d="${HEAD}"/></g>` : '';
  return `<g class="pface">
    ${edge}
    <path class="ear-l" d="${EAR_L}" fill="${c.point}" ${s}/>
    <path class="ear-r" d="${EAR_R}" fill="${c.point}" ${s}/>
    <path d="M52 72 L55 38 L78 54 Z M148 72 L145 38 L122 54 Z" fill="#ff9fb8"/>
    <path d="${HEAD}" fill="${c.body}" ${s}/>
    <path d="M100 64 C70 64 50 86 50 112 C50 138 74 158 100 158 C126 158 150 138 150 112 C150 86 130 64 100 64 Z" fill="${c.soft}"/>
    <path d="M100 76 C78 76 64 92 64 112 C64 132 80 146 100 146 C120 146 136 132 136 112 C136 92 122 76 100 76 Z" fill="${c.point}" opacity=".6"/>
    ${v}
    <g class="eyes">${eyes(expr, c.soft)}</g>
    <path d="M93 128 L107 128 L100 136 Z" fill="#ff7d9c" stroke="${K}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M100 136 Q100 144 91 145 M100 136 Q100 144 109 145" fill="none" stroke="${K}" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M44 128 L14 122 M46 138 L16 142 M156 128 L186 122 M154 138 L184 142" stroke="${K}" stroke-width="3" stroke-linecap="round"/>
  </g>`;
}

export function faceSvg(coat: Coat, pattern: Pattern = 'bicolor', expr: Expr = 'normal', label?: string, sticker = false): string {
  const a = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
  return `<svg viewBox="0 0 200 190" ${a} xmlns="http://www.w3.org/2000/svg" style="overflow:visible">${faceGroup(coat, pattern, expr, sticker)}</svg>`;
}

/** ヒーロー:脇の下を持たれて「だら〜ん」と伸びるラグドール(シールバイカラー) */
export function flopSvg(): string {
  const c = COAT.seal;
  const s = `stroke="${K}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"`;
  const limb = (d: string, fill: string, w = 26) =>
    `<path d="${d}" fill="none" stroke="${K}" stroke-width="${w + 10}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linecap="round"/>`;
  return `<svg viewBox="0 0 320 470" role="img" aria-label="両手で持ち上げられて、だらんと体を伸ばすラグドール" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
    <g class="flop">
      <g class="flop-tail">${limb('M160 372 C150 404 168 428 156 458', c.point, 30)}</g>
      <g class="flop-leg flop-leg-l">${limb('M134 356 L128 428', WHITE, 28)}</g>
      <g class="flop-leg flop-leg-r">${limb('M186 356 L192 428', WHITE, 28)}</g>
      <path d="M104 150 C92 226 96 306 120 356 Q160 382 200 356 C224 306 228 226 216 150 Z" fill="${c.body}" ${s}/>
      <path d="M126 168 C118 230 122 300 136 346 Q160 360 184 346 C198 300 202 230 194 168 Z" fill="${WHITE}"/>
      <path d="M112 196 q-8 6 -4 14 M208 196 q8 6 4 14 M110 262 q-8 6 -4 14 M210 262 q8 6 4 14" fill="none" ${s} stroke-width="3.5"/>
      <g class="flop-arm flop-arm-l">${limb('M112 166 C96 196 90 222 92 246', WHITE, 24)}</g>
      <g class="flop-arm flop-arm-r">${limb('M208 166 C224 196 230 222 228 246', WHITE, 24)}</g>
      <g class="flop-head" transform="translate(60 -6)">${faceGroup('seal', 'bicolor', 'sleepy')}</g>
    </g>
    <g class="hands">
      <path d="M-40 150 L70 150 L70 196 L-40 196 Z" fill="#2f6fe4" ${s}/>
      <path d="M-40 164 L70 164 M-40 180 L70 180" stroke="#fff" stroke-width="5"/>
      <path d="M360 150 L250 150 L250 196 L360 196 Z" fill="#2f6fe4" ${s}/>
      <path d="M360 164 L250 164 M360 180 L250 180" stroke="#fff" stroke-width="5"/>
      <path d="M66 146 C88 136 116 142 122 160 C126 176 112 188 96 190 L66 200 Z" fill="#f6cfae" ${s}/>
      <path d="M254 146 C232 136 204 142 198 160 C194 176 208 188 224 190 L254 200 Z" fill="#f6cfae" ${s}/>
      <path d="M100 150 q8 2 12 10 M220 150 q-8 2 -12 10" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round"/>
    </g>
  </svg>`;
}

export const PAW_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor"><ellipse cx="12" cy="16" rx="5.2" ry="4.4"/><ellipse cx="5.6" cy="10.4" rx="2.3" ry="2.9"/><ellipse cx="9.4" cy="6.4" rx="2.3" ry="2.9"/><ellipse cx="14.6" cy="6.4" rx="2.3" ry="2.9"/><ellipse cx="18.4" cy="10.4" rx="2.3" ry="2.9"/></g></svg>`;
