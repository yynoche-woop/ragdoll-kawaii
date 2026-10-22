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

## 2026-10-06(月曜分を10/6夜〜10/7未明に実施)
- アクセス(GA4 9/29〜10/5):ユーザー65(前週34)・PV143(前週44)・平均滞在193秒。Direct 31 / Referral 6 / Organic 5。Search Console(9/27〜10/3)は表示109・クリック0・平均順位7.2。表示の98%が /columns/allergy/(107表示・順位7〜8)、検索語はすべてアレルギー系
- 追加:/columns/aggressive/(ラグドールは凶暴化するのか 判定:ウソ寄り)。選定理由:サジェスト「凶暴」「凶暴化」「性格 凶暴」「性格悪い」「性格 変わる」「わがまま」に受け皿なし。出典は Salonen 2019(5,726匹・40品種、ラグドールは攻撃性低めのグループ)・CFA品種紹介(non-aggressive、子猫っぽさが続く)・コーネル大学(遊び/なでられ/転嫁/痛みの攻撃、まず医学的原因を除外)・PetMD(獣医師執筆、急な攻撃は受診が先)・RSPCA(人なつこい猫の攻撃は痛みのサイン)
- 案の残りは ops/backlog.md に記録
- 機械チェック:ビルド警告なし。`site_check.py --live` 27ページ問題0、本番サイトマップ26URLすべて200。外部リンク107件中200以外15件は、403/203のボット避け(europepmc・oup・pubmed・gccf・hills)と、この PC の Python の証明書エラー(time・ens-lyon・hellomagazine・royalcanin は curl で200)、FDA(前回同様ボット判定で404)
- 改行チェック:この PC(LN-YOKOTA)は Playwright WebKit の依存 DLL(brotlienc・libsharpyuv)がなく check-breaks.mjs を実行できず未実施
- インデックス:/・/columns/allergy/ は登録済み。/columns/・/seimei/・/columns/clumsy/・/columns/celebrities/ は「検出 - インデックス未登録」、/columns/health/ は「URL が Google に認識されていません」。sitemap-index.xml エラー0・警告0(旧 sitemap.xml の404は一覧から消えた)
- 目視:/columns/weight-by-age/ ・/columns/summer-room-temp/ ・/columns/shedding-matting/ → 事実・表記とも直す箇所なし(姉妹サイトへのリンク3件も200)
- 次回はここから:2周目 liquid・follows-to-toilet・not-a-cat・kitten-color-change、その後 male-female・names・blue-eyes・price(未巡回)

## 2026-10-08(木曜の毎日ルーティン)
- アクセス(GA4 10/1〜10/7):ユーザー23(前期間 9/24〜9/30 は80)・PV26(同166)・平均滞在32秒(同156秒)。Direct 17 / Organic 6 / Referral 4。前期間は公開直後の確認アクセス(Direct)が多かったぶんの反動とみられる(本番のタグ G-CKBY18KWLF は全ページで出力されていることを確認)。28日(9/10〜10/7):ユーザー102・PV192
- Search Console(9/29〜10/5):表示149・クリック1・CTR0.7%・平均順位7.1。表示148が /columns/allergy/、検索語はすべてアレルギー系
- 追加:/columns/butt-poop/(ラグドールのおしり事件 判定:わりとホント)。選定理由:backlog 1位。サジェスト「うんち臭い」「臭い」「サマーカット」「胸毛 カット」「脇の下 毛玉」に受け皿なし、x-memes #11 ★★。出典は CFA基準PDF(しっぽに向かって長くなる・もつれにくい・下毛が少ない)・VCA長毛のお手入れ(ハサミ禁止・鎮静)・Hepper(Lauren Demos DVM 監修:原因4つ・ふやかして拭く・下痢2日以上で受診・毛づくろいで飲み込む)・ねこちゃんホンポ/エキサイト(2026/5、おしりが臭い原因5つ・受診目安)・VCA 肛門のう(こすりつけ・なめる・腫れ)・週刊女性PRIME(2024/7、皮膚科の獣医師「刈っても涼しくはあまりならない」)
- 機械チェック:ビルド警告なし。`site_check.py --live` 28ページ問題0、本番サイトマップ27URLすべて200。外部リンク111件中200以外11件は従来どおりボット避けの403/203と FDA の404
- 改行チェック(check-breaks.mjs 375/390、この PC で実行可):新記事の単語途中(検索語の「脇の下|毛玉」)と表の横はみ出し(326px)を直して解消。既存の指摘は前回までと同じ
- インデックス(公開前):/・/columns/allergy/ は登録済み。/columns/・/seimei/・/columns/clumsy/ は「検出 - インデックス未登録」、/columns/aggressive/・/columns/health/ は「URL が Google に認識されていません」。sitemap-index.xml エラー0・警告0
- 目視(2周目):/columns/liquid/ ・/columns/follows-to-toilet/ ・/columns/not-a-cat/ ・/columns/kitten-color-change/ → 直す箇所なし
  - follows-to-toilet:ねこのきもち(2026年3月・180人・約9割、岡本獣医師の理由5つ)を出典で再確認
  - not-a-cat:Steam の Ragdoll Runners(8種目・左右の足を別キー)を再確認
- 次回はここから:male-female・names・blue-eyes・price(未巡回)、その後 regret・health・allergy

## 2026-10-12(月曜の毎日ルーティン)
- アクセス(GA4 10/5〜10/11):ユーザー10(前期間 9/28〜10/4 は40)・PV10(同50)・平均滞在14秒(同24秒)。Direct 7 / Organic 3 / Referral 1。28日(9/14〜10/11):ユーザー106・PV196、上位は / 139PV・/seimei/ 38PV
- Search Console(10/3〜10/9):表示101・クリック2・CTR2.0%・平均順位8.6。表示98が /columns/allergy/、検索語はすべてアレルギー系(28日 9/12〜10/9 は表示178・クリック2)
- 追加:/columns/not-fluffy/(ラグドールがもふもふにならない問題 判定:個体差(と成長待ち))。選定理由:backlog 1位、サジェスト「もふもふ に ならない」「毛が伸びない」「毛が短い」「毛量」「短毛」に受け皿なし。summer-winter-coat と重ならないよう「成長・毛質・ミックスの遺伝・毛が薄くなったときの受診目安」の切り口に。出典は CFA基準PDF(毛と色の完成は3歳ごろ、未去勢の成猫と季節の短い毛を許容、下毛少なめ・部位別の長さ)・CFA品種紹介(毛色2歳・体4歳、厚い下毛がない)・GCCF基準PDF(成熟は3〜4歳、ラフとズボンは成猫で、夏の短毛は許容)・LABOKLIN(長毛はFGF5の劣性遺伝、キャリアは短毛)・コーネル大(毛づくろいは1日の30〜50%、まず体の原因を除外)
- 機械チェック:ビルド警告なし。`site_check.py --live` 29ページ問題0、本番サイトマップ28URLすべて200(公開前)。外部リンク113件中200以外11件は従来どおりボット避けの403/203(europepmc・oup・pubmed・gccf・hills)と FDA の404
- 改行チェック(375/390):新記事に単語途中なし。表のセルの「成猫」2文字だけの行を「未去勢・未避妊の成猫」に直した
- インデックス(公開前):/・/columns/allergy/ は登録済み。/columns/・/seimei/・/columns/butt-poop/・/columns/aggressive/ は「検出 - インデックス未登録」、/columns/clumsy/ は「URL が Google に認識されていません」。sitemap-index.xml エラー0・警告0
- 目視:/columns/male-female/ ・/columns/blue-eyes/ ・/columns/names/ → 直す箇所なし
  - male-female:Salonen 2019 本文(Europe PMC)で「最も活動量が少ないのはブリティッシュショートヘア・ラグドール・バーマン」「オスとメスのスコアは猫種内で強く相関したので平均」を確認
  - blue-eyes:CFA基準で「青以外の目」「寄り目」が失格を確認
  - names:アニコム2026年版(54,764頭、2025/2〜2026/1、ムギ7年連続1位、ラグドール4位・10.1%)を確認
- 次回はここから:price・regret・health・allergy、その後 clumsy・aggressive・butt-poop

## 2026-10-15(木曜の毎日ルーティン)
- アクセス(GA4 10/8〜10/14):ユーザー6(前期間 10/1〜10/7 は23)・PV6(同26)・平均滞在23秒(同32秒)。Direct 4 / Organic 1 / Referral 1。28日(9/17〜10/14):ユーザー107・PV198、上位は / 140PV・/seimei/ 38PV
- Search Console(10/6〜10/12):表示38・クリック1・CTR2.6%・平均順位13.4(前回 10/3〜10/9 は表示101)。表示31が /columns/allergy/、検索語はすべてアレルギー系。28日(9/15〜10/12)は表示191・クリック2
- 追加:/columns/living-alone/(ラグドールは一人暮らし・ワンルームでも飼える? 判定:ウソ寄り)。選定理由:サジェスト「一人暮らし」「ワンルーム」「部屋の広さ」「マンション」「留守番」「留守番 ケージ」ほか約10語に受け皿なし。出典は CFA品種紹介(広い住空間は不要・環境になじみやすい・活動量ほどほど)・ALSOK(獣医師 服部幸 監修、健康な成猫は1泊2日程度、慣らしは1〜3時間、子猫は生後3カ月以降)・Cats Protection(上限12時間くらい、毎日は勧めない、子猫は数時間)・de Souza Machado 2020(130人・223匹、13.45%、おもちゃなし・他の動物なしと関連)・VCA(AAFP/ISFM の5つの柱、食器とトイレを離す)・幻冬舎GOLD(獣医師 宮下ひろこ、トイレは体の1.5倍以上)
- 機械チェック:ビルド警告なし。`site_check.py --live` 30ページ問題0、本番サイトマップ29URLすべて200(公開前)。外部リンク118件中200以外11件は従来どおりボット避けの403/203(europepmc・oup・pubmed・gccf・hills)と FDA の404
- 改行チェック(375/390):新記事の単語途中(「留守番|ケージ」、出典名の「獣医師|宮下」)と3文字だけの最終行を直して解消
- インデックス(公開前):/・/columns/allergy/ は登録済み。/seimei/・/columns/not-fluffy/・/columns/butt-poop/ は「検出 - インデックス未登録」、/columns/・/columns/aggressive/ は「URL が Google に認識されていません」。sitemap-index.xml エラー0・警告0
- 目視:/columns/price/ ・/columns/regret/ ・/columns/health/ → 直す箇所なし
  - regret:アニコム損保 2025年の猫1頭の年間支出195,427円(治療費47,130円)、家庭どうぶつ白書2025 の猫の平均寿命14.5歳を確認
  - health:Borgeat 2014(236頭、ホモ12頭の生存中央値5.65年、ヘテロ>16.7年・変異なし>15.2年)、Pesteanu-Somogyi 2006(ラグドール2/13)、ダクタリ(エコーなしの健診は初期を見逃すことがある)を確認。Egenvall 2009 の「上部尿路の死亡率がラグドールで最も高い」は要旨に記載がなく、全文が開けず今回は再確認できず(報告のみ)
  - price:みんなの子猫ブリーダーの成約価格は「2026年9月28日時点」と明記済み。数字は日々変わるので、次に price を見るときに更新を検討
- 次回はここから:allergy・clumsy・aggressive・butt-poop、その後 not-fluffy・living-alone・トップ・/seimei/

## 2026-10-19(月曜の毎日ルーティン)
- アクセス(GA4 10/12〜10/18):ユーザー7(前期間 10/5〜10/11 は10)・PV7(同10)・平均滞在14秒(同14秒)。Direct 5 / Organic 1 / Referral 1。28日(9/21〜10/18):ユーザー112・PV203、上位は / 144PV・/seimei/ 38PV
- Search Console(10/10〜10/16):表示38・クリック0・平均順位13.3。表示30が /columns/allergy/、8がトップ。28日(9/19〜10/16)は表示216・クリック2・CTR0.9%。アレルギー以外の検索語は「ラグドール 種類」(表示1・順位97)と「ラグドール」(順位46〜57)だけ
- 追加:/columns/lifespan/(ラグドールは長生きなのか 判定:国とデータしだい)。選定理由:backlog 1位、サジェスト「寿命」「平均寿命」「メス 寿命」「猫 寿命」「長生き」「老猫」に受け皿なし。出典はアニコム家庭どうぶつ白書 2022年版(2020年度 ラグドール14.9歳)・2023年版(2021年度 15.9歳、20猫種で最長)・2025年版(2023年度 15.1歳、混血猫14.9・日本猫15.3)の各PDF、Teng 2024(英国2019年 7,936匹、ラグドール0歳平均余命10.31年・69匹、雑種11.89年)、O'Neill 2025(英国ラグドール21,358匹、死亡133匹の中央値12.85歳、死因1位は腎臓 18/85、「純血種として典型的」)、コーネル大 CKD(10歳超の最大40%・15歳超の最大80%、多飲多尿など)
- 機械チェック:ビルド警告なし。`site_check.py --live` 31ページ問題0、本番サイトマップ30URLすべて200(公開前)。外部リンク124件中200以外11件は従来どおりボット避けの403/203(europepmc・oup・pubmed・gccf・hills)と FDA の404
- 改行チェック(375/390):新記事の表のセル「契約」「数字」2文字だけの行・「こう|なる。」を直した。表の横はみ出しは6px(横スクロールの想定)
- インデックス(公開前):/・/columns/allergy/ は登録済み。/columns/・/columns/living-alone/・/columns/not-fluffy/・/columns/butt-poop/・/columns/aggressive/ は「検出 - インデックス未登録」、/seimei/ は「URL が Google に認識されていません」。sitemap-index.xml エラー0・警告0
- 目視:/columns/allergy/ ・/columns/clumsy/ ・/columns/aggressive/
  - allergy:Bastien 2019 の要旨で「64匹・ミズーリとオンタリオ・1年」「平均0.4〜35µg/ml」「性別・毛色・体の大きさは無関係、高齢ほど少なめ」を確認。対象が短毛の雑種(domestic shorthair)なので「短毛の雑種の猫64匹」と補った
  - clumsy:CFA品種紹介で moderately active・フェッチと呼ぶと来るを教えられる・オス20ポンド以上も珍しくない・体は4歳で完成を確認
  - aggressive:Salonen 2019 本文でラグドールは攻撃性の低いクラスター、遺伝率はラグドールの攻撃性で0.53を確認。「獣医師のPetMDの記事」を「獣医師が書いたPetMDの記事」に直した
- 次回はここから:butt-poop・not-fluffy・living-alone・lifespan、その後 トップ・/seimei/・hates-cuddles・size-ranking

## 2026-10-22(木曜の毎日ルーティン)
- アクセス(GA4 10/15〜10/21):ユーザー12(前期間 10/8〜10/14 は6)・PV12(同6)・平均滞在14秒(同23秒)。Direct 11 / Organic 1。28日(9/24〜10/21):ユーザー119・PV210、上位は / 150PV・/seimei/ 38PV・/columns/ 6PV・/columns/allergy/ 6PV
- Search Console(10/13〜10/19):表示40・クリック0・平均順位13.8。表示35が /columns/allergy/、5がトップ。28日(9/22〜10/19)は表示231・クリック2・CTR0.9%。アレルギー以外の検索語は「ラグドール 種類」(表示1・順位97)、「ラグドール 短 毛」(表示1・順位81)、「ラグドール」(順位57)
- 追加:/columns/types/(ラグドールの種類は何種類? 判定:品種は1つ、見た目は60〜80通り)。選定理由:backlog 1位、「ラグドール 種類」に受け皿なし、サジェスト「毛色の種類」「色の種類」「模様」「レアカラー」「希少色」「灰色」「茶色」。出典は CFA基準PDF(6色、solid/lynx/tortie/tortie-lynx の計20色名、柄はバイカラー・バン・カラーポイント・ミテッド、青以外の目と記載外の色は失格、毛と色の完成は3歳ごろ・ミテッドの色は2歳以降、年齢で濃くなる)・GCCF基準PDF(3柄、Tabby表記、青以外の目は賞を出さない)・FIFe基準PDF(3柄が大事な特徴、認定色の表)・WCF基準PDF(3柄、青以外の目は失格)・TICA チェルビム紹介(ラグドールと同じグループ、mink・sepia・traditional)。TICA のチェルビム認定の開始日は今回開いたページに記載がなく、本文には書いていない
- 機械チェック:ビルド警告なし。`site_check.py --live` 32ページ問題0、本番サイトマップ31URLすべて200(公開前)。外部リンク125件中200以外20件。従来どおりのボット避け(europepmc・oup・pubmed・gccf・hills・hepper)と FDA の404 に加え、今回は pi-xy.co.jp 2件がメンテナンス中の503、peco-japan・chayagasaka-ah・elleair・min-petlife が503(curl でも503、一時的かボット避けか未確認)、tica.org は Python の TLS が古く接続不可(Chrome では表示を確認)。ananweb.jp/news/181444/(celebrities の出典)はカテゴリページへ転送されるようになっており、記事が消えた可能性(報告のみ、次回も続けば差し替えを検討)
- 改行チェック(375/390、check-breaks.mjs):新記事の最終行2〜3文字・表の横はみ出しを直して指摘0
- インデックス(公開前):/・/columns/allergy/ は登録済み。/columns/・/seimei/・/columns/weight-by-age/・/columns/summer-winter-coat/・/columns/summer-room-temp/・/columns/living-alone/ は「検出 - インデックス未登録」、/columns/voice-gap/・/columns/size-ranking/・/columns/lifespan/ は「URL が Google に認識されていません」。sitemap-index.xml エラー0・警告0
- 目視:/columns/butt-poop/ ・/columns/not-fluffy/ ・/columns/living-alone/ → 直す箇所なし
  - not-fluffy:CFA基準で「毛と色の完成は3歳ごろ」「未去勢の成猫の短い毛と季節の違いを許容」「下毛が少ない・部位で長さが違う」を確認
- 次回はここから:lifespan・types、その後 トップ・/seimei/・hates-cuddles・size-ranking
