"""週刊ラグドール:直近7日間のアクセス(GA4)と検索流入(Search Console)を集計して表示する。

使い方: python ops/traffic_report.py [日数(既定7)]
認証: C:\\Users\\y.yokota\\Desktop\\ClaudeCode\\.credentials\\sheet-service-account.json
  (このサービスアカウントを GA4 プロパティ 555987687 の「閲覧者」、
   Search Console の sc-domain:shukan-ragdoll.com のユーザーに追加しておく必要がある)
"""
import sys
from datetime import date, timedelta

from google.oauth2 import service_account

KEY = r"C:\Users\y.yokota\Desktop\ClaudeCode\.credentials\sheet-service-account.json"
GA_PROPERTY = "properties/555987687"
SC_SITE = "sc-domain:shukan-ragdoll.com"
DAYS = int(sys.argv[1]) if len(sys.argv) > 1 else 7

end = date.today() - timedelta(days=1)
start = end - timedelta(days=DAYS - 1)
prev_end = start - timedelta(days=1)
prev_start = prev_end - timedelta(days=DAYS - 1)
print(f"# 週刊ラグドール アクセスレポート {start}〜{end}(前期間 {prev_start}〜{prev_end})\n")


def ga():
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, OrderBy, RunReportRequest

    cr = service_account.Credentials.from_service_account_file(KEY, scopes=["https://www.googleapis.com/auth/analytics.readonly"])
    cl = BetaAnalyticsDataClient(credentials=cr)
    rng = [DateRange(start_date=str(start), end_date=str(end)), DateRange(start_date=str(prev_start), end_date=str(prev_end))]

    def run(dims, mets, limit=10, order=None, ranges=rng):
        req = RunReportRequest(property=GA_PROPERTY, date_ranges=ranges, dimensions=[Dimension(name=d) for d in dims],
                               metrics=[Metric(name=m) for m in mets], limit=limit,
                               order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name=order), desc=True)] if order else None)
        return cl.run_report(req)

    tot = run([], ["activeUsers", "sessions", "screenPageViews", "averageSessionDuration"])
    vals = {r.dimension_values[0].value if r.dimension_values else i: [m.value for m in r.metric_values] for i, r in enumerate(tot.rows)}
    cur = tot.rows[0].metric_values if tot.rows else []
    prev = tot.rows[1].metric_values if len(tot.rows) > 1 else []
    names = ["ユーザー", "セッション", "PV", "平均滞在(秒)"]
    print("## GA4 全体")
    for i, n in enumerate(names):
        c = float(cur[i].value) if cur else 0
        p = float(prev[i].value) if prev else 0
        print(f"- {n}: {c:,.0f}(前期間 {p:,.0f})")
    one = [DateRange(start_date=str(start), end_date=str(end))]
    print("\n## 流入チャネル")
    for r in run(["sessionDefaultChannelGroup"], ["sessions"], order="sessions", ranges=one).rows:
        print(f"- {r.dimension_values[0].value}: {r.metric_values[0].value}")
    print("\n## よく見られたページ TOP10")
    for r in run(["pagePath"], ["screenPageViews"], order="screenPageViews", ranges=one).rows:
        print(f"- {r.dimension_values[0].value}: {r.metric_values[0].value} PV")


def sc():
    from googleapiclient.discovery import build

    cr = service_account.Credentials.from_service_account_file(KEY, scopes=["https://www.googleapis.com/auth/webmasters.readonly"])
    svc = build("searchconsole", "v1", credentials=cr, cache_discovery=False)
    # Search Console は2〜3日遅れで確定するため、終了日を3日前にずらす
    s_end = date.today() - timedelta(days=3)
    s_start = s_end - timedelta(days=DAYS - 1)

    def q(dims, limit=10):
        body = {"startDate": str(s_start), "endDate": str(s_end), "dimensions": dims, "rowLimit": limit}
        return svc.searchanalytics().query(siteUrl=SC_SITE, body=body).execute().get("rows", [])

    tot = q([], 1)
    print(f"\n## Search Console({s_start}〜{s_end})")
    if tot:
        t = tot[0]
        print(f"- クリック: {t['clicks']:.0f} / 表示回数: {t['impressions']:.0f} / CTR: {t['ctr']*100:.1f}% / 平均掲載順位: {t['position']:.1f}")
    else:
        print("- まだデータがありません(インデックス待ち)")
    rows = q(["query"], 15)
    if rows:
        print("\n### 検索キーワード TOP15(表示回数順)")
        for r in sorted(rows, key=lambda r: -r["impressions"]):
            print(f"- {r['keys'][0]}: 表示{r['impressions']:.0f} / クリック{r['clicks']:.0f} / 順位{r['position']:.1f}")
    pages = q(["page"], 10)
    if pages:
        print("\n### 検索で表示されたページ TOP10")
        for r in sorted(pages, key=lambda r: -r["impressions"]):
            print(f"- {r['keys'][0].replace('https://shukan-ragdoll.com', '')}: 表示{r['impressions']:.0f} / クリック{r['clicks']:.0f}")


for name, fn in (("GA4", ga), ("Search Console", sc)):
    try:
        fn()
    except Exception as e:  # 権限未設定などは理由を出して続行
        print(f"\n## {name}: 取得できませんでした({type(e).__name__}: {str(e)[:160]})")
