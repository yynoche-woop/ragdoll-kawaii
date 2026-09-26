// 週刊ラグドールのイラスト。太い黒線・フラット塗り・白ふちのステッカー調。
// ラグドールらしさ:青い目(品種の基準で青のみ)・顔/耳/しっぽ/足が濃いポイントカラー・ふわふわの顔まわり。
// 毛色はCFA・TICA・FIFe・GCCF・WCFの基準で共通の6色+トーティ/リンクス。バンはCFAのみ。ミンクは比較用(ラグドールとしては非公認)。

export type Coat = 'seal' | 'blue' | 'chocolate' | 'lilac' | 'red' | 'cream' | 'mink';
export type Pattern = 'colorpoint' | 'mitted' | 'bicolor' | 'van';
export type Overlay = 'solid' | 'lynx' | 'tortie' | 'torbie';
export type Expr = 'normal' | 'smug' | 'wow' | 'sleepy';

const K = '#141414';
const WHITE = '#ffffff';
const EYE = '#3d8cf0';
export const COAT: Record<Coat, { body: string; point: string; soft: string; label: string; eye?: string }> = {
  seal: { body: '#f3e7d6', point: '#5b4232', soft: '#a88467', label: 'シール' },
  blue: { body: '#eaeef5', point: '#5f7090', soft: '#9dabc4', label: 'ブルー' },
  chocolate: { body: '#f6ebdd', point: '#86604a', soft: '#c29c80', label: 'チョコレート' },
  lilac: { body: '#f5f0f3', point: '#a3909d', soft: '#cdbfc8', label: 'ライラック' },
  red: { body: '#fdf3ea', point: '#e0773a', soft: '#f1ad7e', label: 'レッド' },
  cream: { body: '#fffaf2', point: '#e6c08e', soft: '#f2dbb8', label: 'クリーム' },
  mink: { body: '#d9bfa3', point: '#6b4a36', soft: '#a8876b', label: 'ミンク', eye: '#3fbfae' },
};
export const PATTERN_LABEL: Record<Pattern, string> = { colorpoint: 'カラーポイント', mitted: 'ミテッド', bicolor: 'バイカラー', van: 'バン' };
export const OVERLAY_LABEL: Record<Overlay, string> = { solid: '', lynx: 'リンクス', tortie: 'トーティ', torbie: 'トービー' };
/** トーティのまだらの色:シール・チョコにはレッド、ブルー・ライラックにはクリーム */
const TORTIE: Partial<Record<Coat, string>> = { seal: '#e0773a', chocolate: '#e0773a', blue: '#ecc795', lilac: '#ecc795' };
export const canTortie = (c: Coat) => c in TORTIE;

const HEAD = 'M30 104 C28 60 60 40 100 40 C140 40 172 60 170 104 C178 110 176 120 183 128 C172 130 174 141 164 146 C150 164 126 172 100 172 C74 172 50 164 36 146 C26 141 28 130 17 128 C24 120 22 110 30 104 Z';
const EAR_L = 'M40 88 L45 24 Q47 11 60 20 L94 50 Z';
const EAR_R = 'M160 88 L155 24 Q153 11 140 20 L106 50 Z';

function eyes(expr: Expr, lidColor: string, iris: string): string {
  const eye = (x: number) => {
    if (expr === 'sleepy') return `<path d="M${x - 16} 110 Q${x} 124 ${x + 16} 110" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round"/>`;
    const base = `<circle cx="${x}" cy="110" r="16" fill="${iris}" stroke="${K}" stroke-width="4"/><circle cx="${x}" cy="111" r="10.5" fill="${K}"/>`;
    const hi = expr === 'wow'
      ? `<path d="M${x + 5} 99 l2.2 5 l5 2.2 l-5 2.2 l-2.2 5 l-2.2 -5 l-5 -2.2 l5 -2.2 Z" fill="#fff"/><circle cx="${x - 5}" cy="117" r="2.4" fill="#fff"/>`
      : `<circle cx="${x + 5}" cy="104" r="4.6" fill="#fff"/><circle cx="${x - 5}" cy="117" r="2" fill="#fff"/>`;
    const lid = expr === 'smug' ? `<path d="M${x - 18} 108 A18 18 0 0 1 ${x + 18} 108 Z" fill="${lidColor}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>` : '';
    return base + hi + lid;
  };
  return eye(74) + eye(126);
}

/** 2色を混ぜる(t=0でa、t=1でb) */
function mix(a: string, b: string, t: number): string {
  const n = (h: string, i: number) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  return '#' + [0, 1, 2].map((i) => Math.round(n(a, i) + (n(b, i) - n(a, i)) * t).toString(16).padStart(2, '0')).join('');
}

/** 顔(viewBox 0 0 200 190)。sticker: 白ふちを付ける。fade<1 は子猫(ポイントも体の色も薄く、生まれたてはほぼ白) */
export function faceGroup(coat: Coat, pattern: Pattern = 'bicolor', expr: Expr = 'normal', sticker = false, overlay: Overlay = 'solid', fade = 1): string {
  const c0 = COAT[coat];
  const c = fade < 1 ? { ...c0, body: mix(WHITE, c0.body, fade) } : c0;
  const s = `stroke="${K}" stroke-width="5" stroke-linejoin="round"`;
  const lynx = overlay === 'lynx' || overlay === 'torbie';
  const tortie = (overlay === 'tortie' || overlay === 'torbie') && TORTIE[coat];
  const van = pattern === 'van';
  const mask = van
    ? `<path d="M58 84 C66 56 134 56 142 84 C128 92 72 92 58 84 Z" fill="${c.soft}" opacity=".85"/>`
    : `<path d="M100 64 C70 64 50 86 50 112 C50 138 74 158 100 158 C126 158 150 138 150 112 C150 86 130 64 100 64 Z" fill="${c.soft}"/>
    <path d="M100 76 C78 76 64 92 64 112 C64 132 80 146 100 146 C120 146 136 132 136 112 C136 92 122 76 100 76 Z" fill="${c.point}" opacity=".6"/>`;
  const v = pattern === 'bicolor' ? `<path d="M100 78 C95 98 84 126 76 154 Q100 166 124 154 C116 126 105 98 100 78 Z" fill="${WHITE}"/>` : '';
  const chin = pattern === 'mitted' ? `<path d="M84 152 Q100 162 116 152 Q108 166 100 166 Q92 166 84 152 Z" fill="${WHITE}"/>` : '';
  const patches = tortie ? `<g fill="${TORTIE[coat]}" opacity=".9"><path d="M62 96 C66 84 80 80 86 88 C80 94 70 100 62 96 Z"/><path d="M118 134 C126 126 140 124 144 132 C136 140 124 142 118 134 Z"/><path d="M50 30 L58 24 L66 44 Z"/><path d="M146 40 L152 26 L156 48 Z"/></g>` : '';
  const stripes = lynx && !van ? `<g fill="none" stroke="${c.point}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M84 74 L90 62 L100 72 L110 62 L116 74"/><path d="M52 108 L64 110 M52 120 L64 118 M148 108 L136 110 M148 120 L136 118"/></g>
    <g fill="none" stroke="${c.body}" stroke-width="5" opacity=".9"><circle cx="74" cy="110" r="21"/><circle cx="126" cy="110" r="21"/></g>
    <g fill="${c.body}" opacity=".85"><ellipse cx="54" cy="46" rx="4" ry="8"/><ellipse cx="146" cy="46" rx="4" ry="8"/></g>` : '';
  const edge = sticker ? `<g fill="${WHITE}" stroke="${WHITE}" stroke-width="22" stroke-linejoin="round"><path d="${EAR_L}"/><path d="${EAR_R}"/><path d="${HEAD}"/></g>` : '';
  return `<g class="pface">
    ${edge}
    <path class="ear-l" d="${EAR_L}" fill="${fade < 1 ? c.body : c.point}" ${s}/>
    <path class="ear-r" d="${EAR_R}" fill="${fade < 1 ? c.body : c.point}" ${s}/>
    ${fade < 1 ? `<g fill="${c.point}" opacity="${fade}"><path d="${EAR_L}"/><path d="${EAR_R}"/></g>` : ''}
    <path d="M52 72 L55 38 L78 54 Z M148 72 L145 38 L122 54 Z" fill="#ff9fb8"/>
    ${tortie ? `<g fill="${TORTIE[coat]}"><path d="M44 36 L52 20 L62 44 Z"/><path d="M150 26 L156 22 L158 50 Z"/></g>` : ''}
    <path d="${HEAD}" fill="${van ? WHITE : c.body}" ${s}/>
    <g opacity="${fade}">${mask}</g>
    ${v}${chin}${patches}${stripes}
    <g class="eyes">${eyes(expr, c.soft, c.eye ?? EYE)}</g>
    <path d="M93 128 L107 128 L100 136 Z" fill="${pattern === 'colorpoint' ? c.soft : '#ff7d9c'}" stroke="${K}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M100 136 Q100 144 91 145 M100 136 Q100 144 109 145" fill="none" stroke="${K}" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M44 128 L14 122 M46 138 L16 142 M156 128 L186 122 M154 138 L184 142" stroke="${K}" stroke-width="3" stroke-linecap="round"/>
  </g>`;
}

export function faceSvg(coat: Coat, pattern: Pattern = 'bicolor', expr: Expr = 'normal', label?: string, sticker = false, overlay: Overlay = 'solid', fade = 1): string {
  const a = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
  return `<svg viewBox="0 0 200 190" ${a} xmlns="http://www.w3.org/2000/svg" style="overflow:visible">${faceGroup(coat, pattern, expr, sticker, overlay, fade)}</svg>`;
}

/** 全身のおすわり(viewBox 0 0 220 300)。がら(白の入り方)が分かるように、胸・足・しっぽまで描く */
export function bodySvg(coat: Coat, pattern: Pattern, overlay: Overlay = 'solid', label?: string, expr: Expr = 'normal'): string {
  const c = COAT[coat];
  const s = `stroke="${K}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"`;
  const lynx = overlay === 'lynx' || overlay === 'torbie';
  const tortie = (overlay === 'tortie' || overlay === 'torbie') && TORTIE[coat];
  const van = pattern === 'van';
  const white = pattern !== 'colorpoint';
  const bodyFill = van ? WHITE : c.body;
  const legFill = pattern === 'colorpoint' ? c.soft : pattern === 'mitted' ? c.soft : WHITE;
  const pawFill = pattern === 'colorpoint' ? c.soft : WHITE;
  const chest = pattern === 'bicolor'
    ? `<path d="M74 158 C64 200 66 250 72 284 L148 284 C154 250 156 200 146 158 Z" fill="${WHITE}"/>`
    : pattern === 'mitted'
      ? `<path d="M100 160 C94 200 96 250 100 284 L120 284 C124 250 126 200 120 160 Z" fill="${WHITE}"/>`
      : '';
  const tail = 'M160 272 C200 272 214 232 202 196';
  const a = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
  return `<svg viewBox="0 0 220 300" ${a} xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
    <g class="tail">
      <path d="${tail}" fill="none" stroke="${K}" stroke-width="34" stroke-linecap="round"/>
      <path d="${tail}" fill="none" stroke="${c.point}" stroke-width="24" stroke-linecap="round"/>
      ${lynx ? `<path d="${tail}" fill="none" stroke="${c.body}" stroke-width="24" stroke-dasharray="5 11" opacity=".55"/>` : ''}
      ${tortie ? `<path d="${tail}" fill="none" stroke="${TORTIE[coat]}" stroke-width="24" stroke-dasharray="14 26" stroke-dashoffset="8"/>` : ''}
    </g>
    <path d="M56 150 C38 196 40 256 60 286 L160 286 C180 256 182 196 164 150 Z" fill="${bodyFill}" ${s}/>
    ${chest}
    <rect x="76" y="212" width="28" height="74" rx="14" fill="${legFill}" ${s}/>
    <rect x="116" y="212" width="28" height="74" rx="14" fill="${legFill}" ${s}/>
    ${lynx && !white ? `<path d="M80 232 h20 M80 248 h20 M120 232 h20 M120 248 h20" stroke="${c.point}" stroke-width="4" stroke-linecap="round"/>` : ''}
    ${pattern === 'mitted' ? `<path d="M78 262 h24 v20 a12 12 0 0 1 -24 0 Z M118 262 h24 v20 a12 12 0 0 1 -24 0 Z" fill="${WHITE}" ${s} stroke-width="4"/>` : ''}
    <ellipse cx="90" cy="286" rx="19" ry="11" fill="${pawFill}" ${s}/>
    <ellipse cx="130" cy="286" rx="19" ry="11" fill="${pawFill}" ${s}/>
    <path d="M84 281 v9 M96 281 v9 M124 281 v9 M136 281 v9" stroke="${K}" stroke-width="3" stroke-linecap="round"/>
    <g transform="translate(14 0) scale(.96)">${faceGroup(coat, pattern, expr, false, overlay)}</g>
  </svg>`;
}

/** ヒーロー:でーんと寝そべって伸びる母ラグ(シールバイカラー)と、その背中に乗る子ラグ(ブルーミテッド) */
export function familySvg(): string {
  const m = COAT.seal;
  const k = COAT.blue;
  const s = `stroke="${K}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"`;
  const limb = (d: string, fill: string, w = 26) =>
    `<path d="${d}" fill="none" stroke="${K}" stroke-width="${w + 10}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linecap="round"/>`;
  return `<svg viewBox="0 0 560 360" role="img" aria-label="長く伸びて寝そべる大きなラグドールのお母さんと、その背中に乗る子猫" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
    <ellipse cx="290" cy="318" rx="250" ry="14" fill="${K}" opacity=".08"/>
    <g class="mom">
      <g class="mom-tail">${limb('M470 272 C510 268 540 240 532 196 C528 176 512 172 506 186', m.point, 34)}
        <path d="M530 222 l10 2 M534 200 l10 -4" stroke="${K}" stroke-width="3" stroke-linecap="round"/></g>
      ${limb('M452 292 L500 300', WHITE, 30)}
      <g class="mom-body">
        <path d="M130 250 C124 196 170 170 280 168 C400 166 470 186 480 246 C486 286 462 308 420 308 L170 308 C140 308 132 284 130 250 Z" fill="${m.body}" ${s}/>
        <path d="M170 300 C230 280 340 280 430 300 L420 306 L176 306 Z" fill="${WHITE}"/>
        <path d="M236 184 C300 176 370 178 430 196" fill="none" stroke="${m.soft}" stroke-width="16" stroke-linecap="round" opacity=".6"/>
        <path d="M150 226 q-8 6 -4 14 M466 226 q8 6 4 14 M300 176 q4 -8 12 -6" fill="none" ${s} stroke-width="3.5"/>
      </g>
      ${limb('M150 290 L60 298', WHITE, 30)}
      ${limb('M176 300 L84 312', WHITE, 30)}
      <path d="M50 290 v14 M62 292 v14 M74 304 v14 M86 306 v14" stroke="${K}" stroke-width="3" stroke-linecap="round"/>
      <g class="mom-head" transform="translate(40 122) scale(.9)">${faceGroup('seal', 'bicolor', 'normal')}</g>
    </g>
    <g class="kit">
      <g class="kit-tail">${limb('M370 174 C402 170 414 144 404 120', k.point, 18)}</g>
      <path d="M288 180 C282 130 306 110 336 110 C366 110 390 130 384 180 Z" fill="${k.body}" ${s} stroke-width="4.5"/>
      <path d="M320 180 C318 150 326 132 336 130 C346 132 354 150 352 180 Z" fill="${WHITE}"/>
      <ellipse cx="314" cy="178" rx="14" ry="8" fill="${WHITE}" ${s} stroke-width="4"/>
      <ellipse cx="358" cy="178" rx="14" ry="8" fill="${WHITE}" ${s} stroke-width="4"/>
      <g class="kit-head" transform="translate(272 16) scale(.64)">${faceGroup('blue', 'mitted', 'wow')}</g>
    </g>
  </svg>`;
}

export const PAW_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor"><ellipse cx="12" cy="16" rx="5.2" ry="4.4"/><ellipse cx="5.6" cy="10.4" rx="2.3" ry="2.9"/><ellipse cx="9.4" cy="6.4" rx="2.3" ry="2.9"/><ellipse cx="14.6" cy="6.4" rx="2.3" ry="2.9"/><ellipse cx="18.4" cy="10.4" rx="2.3" ry="2.9"/></g></svg>`;

/** 走って逃げるラグドール(右向き・viewBox 0 0 330 210)。
 * ギャロップを3コマで描き、CSSでコマを切り替える(のびる → ちぢむ → 前足で着地)。足は曲がった太い線で、パタパタ振らない。しっぽはご機嫌に真上へピン */
export function runSvg(coat: Coat = 'seal'): string {
  const c = COAT[coat];
  const s = `stroke="${K}" stroke-width="5" stroke-linejoin="round"`;
  const limb = (d: string, far = false) => {
    return `<path d="${d}" fill="none" stroke="${K}" stroke-width="28" stroke-linecap="round"/>
      <path d="${d}" fill="none" stroke="${far ? '#e4e4e4' : WHITE}" stroke-width="18" stroke-linecap="round"/>`;
  };
  const tail = (d: string) => `<path d="${d}" fill="none" stroke="${K}" stroke-width="38" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c.point}" stroke-width="28" stroke-linecap="round"/>`;
  const frame = (n: number, f: { tail: string; body: string; ff: string; fn: string; bf: string; bn: string; head: string }) =>
    `<g class="rf rf${n}">${tail(f.tail)}${limb(f.bf, true)}${limb(f.ff, true)}${limb(f.bn)}${limb(f.fn)}<path d="${f.body}" fill="${c.body}" ${s}/>
      <g transform="${f.head} scale(.64)">${faceGroup(coat, 'bicolor', 'wow')}</g></g>`;
  return `<svg viewBox="0 0 330 210" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
    ${frame(1, { // のびる(4本とも宙に浮く)
      tail: 'M84 98 C80 70 80 40 82 14 Q84 0 96 6',
      body: 'M70 104 C70 80 100 72 140 74 L210 76 C244 78 262 92 262 110 C262 130 244 140 210 140 L110 142 C84 142 70 128 70 104 Z',
      ff: 'M226 112 Q262 148 294 146', fn: 'M212 114 Q248 160 284 160',
      bf: 'M106 112 Q70 148 40 148', bn: 'M94 116 Q60 162 26 164',
      head: 'translate(200 -12) rotate(6 100 100)' })}
    ${frame(2, { // ちぢむ(背中が丸くなり、後ろ足が前へ)
      tail: 'M104 90 C100 64 102 34 106 8 Q108 -6 120 0',
      body: 'M88 118 C84 80 116 60 156 60 C200 60 236 76 240 104 C244 132 222 146 190 146 L124 146 C100 146 90 136 88 118 Z',
      ff: 'M212 116 Q210 160 190 174', fn: 'M200 118 Q198 166 174 182',
      bf: 'M114 116 Q136 158 160 166', bn: 'M104 118 Q126 168 152 180',
      head: 'translate(180 -26) rotate(-4 100 100)' })}
    ${frame(3, { // 前足で着地、後ろ足でける
      tail: 'M90 100 C86 72 86 42 88 16 Q90 2 102 8',
      body: 'M76 112 C74 84 104 72 146 72 L206 76 C240 80 258 98 256 118 C254 140 234 148 204 148 L112 148 C88 148 76 134 76 112 Z',
      ff: 'M222 118 Q238 162 246 184', fn: 'M210 120 Q224 168 230 192',
      bf: 'M106 118 Q86 162 60 174', bn: 'M96 120 Q76 170 46 184',
      head: 'translate(194 -8)' })}
    <path d="M-10 86 H-50 M-4 112 H-64 M-10 138 H-44" stroke="${K}" stroke-width="5" stroke-linecap="round"/>
  </svg>`;
}
