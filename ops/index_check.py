"""インデックス状況の確認(Search Console URL 検査 API + サイトマップのエラー)。
使い方: PYTHONIOENCODING=utf-8 python ops/index_check.py [パス ...]
パスを省略するとトップ・コラム一覧・直近のコラムを検査する。
"""
import os, sys, glob
from google.oauth2 import service_account
from googleapiclient.discovery import build

HERE = os.path.dirname(os.path.abspath(__file__))
CRED_DIR = os.environ.get("CLAUDECODE_CRED_DIR") or os.path.normpath(os.path.join(HERE, "..", "..", ".credentials"))
KEY = os.path.join(CRED_DIR, "sheet-service-account.json")
SC_SITE = "sc-domain:shukan-ragdoll.com"
BASE = "https://shukan-ragdoll.com"

cr = service_account.Credentials.from_service_account_file(KEY, scopes=["https://www.googleapis.com/auth/webmasters"])
svc = build("searchconsole", "v1", credentials=cr, cache_discovery=False)

paths = sys.argv[1:]
if not paths:
    cols = sorted(glob.glob(os.path.join(HERE, "..", "src", "content", "columns", "*.md")), key=os.path.getmtime, reverse=True)[:6]
    paths = ["/", "/columns/", "/seimei/"] + [f"/columns/{os.path.basename(c)[:-3]}/" for c in cols]

for p in paths:
    url = BASE + p
    try:
        r = svc.urlInspection().index().inspect(body={"inspectionUrl": url, "siteUrl": SC_SITE}).execute()
        s = r["inspectionResult"]["indexStatusResult"]
        print(f"{p}\t{s.get('verdict')}\t{s.get('coverageState')}\t最終クロール {s.get('lastCrawlTime', '-')}")
    except Exception as e:
        print(f"{p}\tERROR {str(e)[:120]}")

print("\n## サイトマップ")
for sm in svc.sitemaps().list(siteUrl=SC_SITE).execute().get("sitemap", []):
    print(f"{sm['path']}\t最終送信 {sm.get('lastSubmitted')}\t最終読込 {sm.get('lastDownloaded')}\tエラー {sm.get('errors')}\t警告 {sm.get('warnings')}\t保留 {sm.get('isPending')}")
