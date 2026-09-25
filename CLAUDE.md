# 週刊ラグドール 〜ラグドールは可愛いのか？〜

ラグドールを「検証」する1ページのサイト(Astro 7)。運営は横田さん。
アメショの森(../amesho-mori)とABテストで比べるためのサイトなので、デザインもトーンもアメショの森と変えている。姉妹サイトとしてリンクしない。

- 公開先:https://shukan-ragdoll.com/ (GitHub Pages。main に push すると GitHub Actions で自動デプロイ)
  - ドメインは Cloudflare Registrar。DNS は Cloudflare で apex と www を yynoche-woop.github.io に CNAME(DNS only)。`public/CNAME` がドメイン設定
  - GA4:プロパティ「週刊ラグドール」G-CKBY18KWLF(本番ドメインのときだけ計測)
  - Search Console:ドメインプロパティ sc-domain:shukan-ragdoll.com(Cloudflare の TXT で確認済み)、sitemap.xml 送信済み
- `npm run build` / `npx astro dev`

## デザイン
- 週刊誌・号外テイスト。真っ白な地、黒インク、差し色はラグドールの目の青(#3d8cf0)だけ
- ページ上部にハチワレ(グレーの前髪+白い逆V字)の髪型
- イラストは `src/data/pop-art.ts`:太い黒線のステッカー調。人は描かない。familySvg(寝そべって伸びる母ラグ+背中の子ラグ)、faceSvg / bodySvg(毛色6色+ミンク × がら4種 × 模様 solid/lynx/tortie/torbie)
- `public/og.png` / `public/favicon.svg` はアメショの森の `.scratch/rag-assets.mts` で生成

## 文章
- 「可愛い押し」ではなく、アホっぽいノリ(「可愛いかは知らん。長い。」)。日本語が多少おかしくてもOK
- ただし情報は正確に。性格は「よく言われるウワサ」と「実際は(個体差)」を分けて書く。「おとなしい・のんびり・鳴かない」を事実として書かない
- 毛色の情報は CFA・TICA・FIFe・GCCF・WCF の公式ブリード標準で確認済み(6色共通、バンはCFAのみ、ミンク等はTICAでは別品種チェルビム)
- 確かなこと:目は青のみ(品種の基準)、ポイントカラーで子猫は白く生まれる、大型(オス6〜9kgは目安)、成長に3〜4年といわれる、肥大型心筋症に関わる遺伝子変異の報告と遺伝子検査
- 健康情報は断定しない・数字は「目安」
