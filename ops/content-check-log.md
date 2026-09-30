# 既存コンテンツのチェック記録

週次ルーティン(wed-sites-weekly)の「既存コンテンツのチェック」の記録。次回はまだ見ていないページ・古い順から続ける。

## 2026-09-27
- 機械チェック:ビルド警告なし。全24ページで title / description の欠落・重複なし、本文に `**` の残りなし、サイト内リンク切れなし。コラム内の外部リンク93件は200(403はボット避けのサイトで、ブラウザでは開ける想定:europepmc・oup・hills・koneko-breeder・min-petlife・jspca・wptv。gccf は202)
- インデックス状況:Search Console API が403(サービスアカウント未追加)のため未確認
- 目視(下書きだった2本を公開前に確認):/columns/health/(Borgeat 2014 の数値を Europe PMC の抄録で再確認:236頭、ホモ接合の生存期間中央値5.65年)・/columns/price/ → 問題なしで draft: false に
- 目視:/columns/liquid/ ・/columns/follows-to-toilet/ ・/columns/not-a-cat/ → 事実・表記とも問題なし
- 未確認(次回):kitten-color-change, hates-cuddles, size-ranking, night-zoomies, summer-winter-coat, voice-gap, origin-myths, lookalikes, weight-by-age, summer-room-temp, shedding-matting, celebrities, トップ, /seimei/

## 2026-09-28
- 役割分担(週刊ラグドール=ネタ系)に合わせ、実用コラム6本を検証コラム(category: kensho)に書き直し。slug はそのまま、updatedDate: 2026-09-28。健康・安全の要点は各記事の「ここだけ真面目」枠(`.prose .majime`)にまとめ、詳細はネコキチ猫吉 /breeds/ragdoll/(一部 /columns/emergency-signs/・/columns/room-temp/)へリンク。/columns/ 一覧は「実用」が0本のとき見出しを出さないように
  - weight-by-age「どこまで伸びるのか」/ shedding-matting「毎日もう1匹作れるのか」/ price「値段のウワサ」/ regret「飼ってから気づいた誤算」/ summer-room-temp「夏は溶けるのか」/ health「病気のウワサ」(HCM・遺伝子検査の表・受診目安の表は枠内に全部残した)
- 出典を開いて再確認(2026-09-28):CFA品種紹介(オス20ポンド・体の完成4歳・毛色2歳・週1〜2回コーム・脱力は今の多くには当てはまらない)、CFA基準PDF(もつれにくい毛・季節変化・下腹のたるみ可)、ピクシー(月齢表・6か月まで月500g〜1kg)、ねこちゃんホンポ/ロイヤルカナン(成猫オス5〜9kg・メス4〜6kg、1歳4kg超・2歳4〜8kg、あばらで確認)、ペットの実家note、VCA 2本(長毛は毎日・ハサミ禁止・鎮静・肥満/関節)、アニコム(20〜25℃/50〜60%、年間19万5,427円・治療費4万7,130円、平均寿命14.5歳)、SBIペット(27〜28℃・30℃超・5月〜・肥満/持病・保冷剤)、永原動物病院(21〜28℃/40〜60%・留守番中エアコン)、日本動物愛護協会(26℃以下・6月後半〜梅雨明け)、環境省(密な毛・室内管理/18項目の16・17)、みんなの子猫ブリーダー(平均約22万・最低7万・最高68万、9/28時点)、みんなのペットライフ(15〜30万・希少色50万以上・メスやや高め)、ネコマガ(月齢・中間費用)、ワンニャンとうきょう(譲渡条件)、Langford Vets、Salonen 2019(抄録で遺伝率0.4〜0.53)
- 確認できず削除:shedding の「アニコム:冬〜春の抜け替わり」・富士見台どうぶつ病院、regret の「Salonen:ラグドールは活動量が少なめのグループ」、price の「ペットショップは人件費が上乗せ」「実物を見せたうえで」「講習会(無料)」、weight の VCA BCS 出典(あばら確認はねこちゃんホンポで裏付け)
- ビルド(`--outDir .agent-dist`)警告なし、24ページ。本文の `**` 残りなし

## 2026-09-29
- 追加:/columns/allergy/(ラグドールは猫アレルギーでも平気?判定:ウソ寄り)。出典は The Conversation(2022)・Bastien 2019(Europe PMC 抄録:64匹・年平均0.4〜35µg/ml・性別/毛色/体格と無関係・高齢ほど低め)・Satyaraj 2019(105匹・10週で平均47%減、33〜71%)・ヒルズ(全猫がアレルゲンを作る、ラグドールは挙がっていない)・みんなのアレルギー情報室(服で運ばれる・ぜんそく悪化因子・血液検査)
- 機械チェック:`python ops/site_check.py --live` を新設(title/description 欠落・重複、`**` 残り、内部リンク、本番サイトマップ全URL、コラム外部リンク)。25ページ問題なし、本番24URLすべて200。外部リンク103件中200以外は403のボット避け(europepmc・oup・hills・thermofisher)と pubmed の203のみ
- 改行チェック(check-breaks.mjs 375/390):新記事は行頭NG・単語途中なし(出典名の長いカタカナを短縮)。既存はトップの「号|外」「ミルクチョコのよう|な」「ライラッククリー|ム」「トーティリンク|ス」、not-a-cat の「しれとこ|ともこ」が単語途中(報告のみ。phrase-break の辞書側の問題)。「ラグドール|○○」は検索語の半角スペース位置なので問題なし
- インデックス:`python ops/index_check.py` を新設(Git Bash では MSYS_NO_PATHCONV=1 を付ける)。トップのみ登録済み、/columns/・/seimei/・コラム7本は「検出 - インデックス未登録」。サイトマップ sitemap-index.xml はエラー0、旧登録の sitemap.xml は404でエラー1(Search Console から削除してよい)
- 目視:/columns/kitten-color-change/ ・/columns/hates-cuddles/ ・/columns/size-ranking/ ・/columns/night-zoomies/ ・/columns/summer-winter-coat/ ・/columns/voice-gap/
  - hates-cuddles:Salonen 2019 の遺伝率(0.4〜0.53)に合わせ「半分弱」→「半分前後」、「残りの半分以上」→「残りの半分ほど」に修正
  - hates-cuddles の「子猫の生後2〜9週ごろの経験」は出典(AAFP/ISFM指針)の本文を開けず未確認(報告のみ)
  - ほかは事実・表記とも問題なし
- 次回はここから:origin-myths, lookalikes, weight-by-age, summer-room-temp, shedding-matting, celebrities, トップ, /seimei/

## 2026-09-30
- アクセス(GA4 9/23〜9/29):ユーザー75・PV155(前週0=計測開始前)。Direct 85/88セッション、Organic 1。上位は / 107PV、/seimei/ 35PV。Search Console は表示2・クリック0(トップのみ)で検索語データなし
- 追加:/columns/clumsy/(ラグドールは運動音痴なのか 判定:個体差)。選定理由:検索データがまだないため、ネタ元 x-memes の未消化ネタで頻度★3の「運動音痴」を採用(Google サジェストの「弱い」「キャットタワー」とも関連、既存コラムと重複なし)。出典は Yahoo!ニュース エキスパート(2025/4/26)・CFA品種紹介(moderately active、フェッチを覚える、4歳で完成)・アニコム猫のしおり(高い所を飛び跳ねるタイプではない、タワーは安定性)・ピクシー(つっぱり型の高いタワーを推奨=意見が割れている)・International Cat Care(関節炎のサイン:ジャンプをためらう、動画を撮る)・FDA(28匹中 跛行は半数未満、ジャンプを嫌がるのは約4分の3)
- 機械チェック:`site_check.py --live` 26ページ問題0、本番サイトマップ25URLすべて200。外部リンク104件中200以外11件はボット避けの403/203(europepmc・oup・gccf・hills・pubmed)と FDA(ボット判定で404に飛ばされる。WebFetch では本文を確認済み)
- 改行チェック(375/390):新記事に単語途中・行頭NGなし。既存の単語途中(トップ「号|外」ほか、not-a-cat「しれとこ|ともこ」、summer-room-temp「公益財団法人|日本動物愛護協会」)は前回同様、報告のみ。表の横はみ出し(lookalikes 458px など)は横スクロールの想定
- インデックス:/・/columns/allergy/ は登録済み。/columns/・/columns/regret/・/columns/health/・/columns/celebrities/ は「検出 - インデックス未登録」、/seimei/ は「URL が Google に認識されていません」。sitemap-index.xml エラー0
- 目視:/columns/origin-myths/ ・/columns/lookalikes/ ・/columns/celebrities/ ・トップ ・/seimei/ → 事実・表記とも直す箇所なし
  - celebrities:モデルプレス・anan・CREA・ねとらぼの各記事に「ラグドール」と猫の名前(マシュマロ=2026/1/7、ウユ、テト、フジヤマ、フラン)、ねとらぼの551票・1位を確認
  - lookalikes の「FIFe がネヴァマスカレードを2011年に公認」は今回は出典で再確認できず(報告のみ)
- 次回はここから:weight-by-age, summer-room-temp, shedding-matting(9/28 書き直し分)、その後 liquid・follows-to-toilet・not-a-cat・kitten-color-change から2周目
