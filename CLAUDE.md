# 週刊ラグドール 〜ラグドールは可愛いのか？〜

ラグドールを「検証」する1ページのサイト(Astro 7)。運営は横田さん。
アメショの森(../amesho-mori)とABテストで比べるためのサイトなので、デザインもトーンもアメショの森と変えている。姉妹サイトとしてリンクしない。

- 公開先:https://shukan-ragdoll.com/ (GitHub Pages。main に push すると GitHub Actions で自動デプロイ)
  - ドメインは Cloudflare Registrar。DNS は Cloudflare で apex と www を yynoche-woop.github.io に CNAME(DNS only)。`public/CNAME` がドメイン設定
  - GA4:プロパティ「週刊ラグドール」G-CKBY18KWLF(本番ドメインのときだけ計測)
  - Search Console:ドメインプロパティ sc-domain:shukan-ragdoll.com(Cloudflare の TXT で確認済み)、sitemap.xml 送信済み
- `npm run build` / `npx astro dev`

## コラム(アクセス集めの本体)
- `src/content/columns/*.md` → `/columns/<ファイル名>/`。一覧は `/columns/`、トップにも最新6本
- 書き方は `ops/column-spec.md` に従う(「ウワサ → 取材班が調べた → 判定 → 飼い主向けメモ」の型、frontmatter の verdict / sources 必須)
- `draft: true` は本番に出ない。病気・値段など情報リスクの高い記事は draft で入れ、横田さんの確認後に外す
- ネタ元:`ops/x-memes-2026-09-25.md`(Xでネタにされる話)、`ops/google-suggest-2026-09-25.txt`(検索キーワード)

## デザイン
- 週刊誌・号外テイスト。真っ白な地、黒インク、差し色はラグドールの目の青(#3d8cf0)だけ
- ページ上部にハチワレ(グレーの前髪+白い逆V字)の髪型
- イラストは `src/data/pop-art.ts`:太い黒線のステッカー調。人は描かない。familySvg(寝そべって伸びる母ラグ+背中の子ラグ)、faceSvg / bodySvg(毛色6色+ミンク × がら4種 × 模様 solid/lynx/tortie/torbie)
- `public/og.png` / `public/favicon.svg` はアメショの森の `.scratch/rag-assets.mts` で生成

## 文章
- 「可愛い押し」ではなく、アホっぽいノリ(「可愛いかは知らん。長い。」)。日本語が多少おかしくてもOK
- 文章に散りばめる方向性:「長毛種好きは、ほかの長毛種も好きになる」「猫好きは結局ぜんぶの猫が好き」(オチや一言ツッコミとして。他の猫種を下げない)
- ただし情報は正確に。性格は「よく言われるウワサ」と「実際は(個体差)」を分けて書く。「おとなしい・のんびり・鳴かない」を事実として書かない
- 毛色の情報は CFA・TICA・FIFe・GCCF・WCF の公式ブリード標準で確認済み(6色共通、バンはCFAのみ、ミンク等はTICAでは別品種チェルビム)
- 確かなこと:目は青のみ(品種の基準)、ポイントカラーで子猫は白く生まれる、大型(オス6〜9kgは目安)、成長に3〜4年といわれる、肥大型心筋症に関わる遺伝子変異の報告と遺伝子検査
- 健康情報は断定しない・数字は「目安」

## 日本語の改行
- `scripts/phrase-break.mjs` がビルド後に BudouX で文節の境目へ `<wbr>` を入れる。区切った文字列は `<pb-t>` で包み(flex の中でばらけないように)、カッコ・句読点を含む短い文節は `<nobr>` で包む(Safari は keep-all でもカッコの前後で切ってしまうため)
- 見出し・ボタン・商品名・表のセルなど短い文字は `word-break: keep-all`。本文の段落は通常の折り返し(keep-all だと右側がガタガタになる)。全体に `line-break: strict` と `text-wrap: pretty`

## 占い
- 猫の姓名判断(五格・性別で文章を書き分け)と星座占いは混ぜない。それぞれ別ページで完結させる(横田さんの方針 2026-09-26)
