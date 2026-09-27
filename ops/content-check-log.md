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
