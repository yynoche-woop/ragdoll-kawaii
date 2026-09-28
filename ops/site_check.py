"""週次の機械チェック(dist を対象)。403 はボット避けのサイト(europepmc・oup・hills・thermofisher 等)で、ブラウザでは開ける。
使い方: npm run build のあと `PYTHONIOENCODING=utf-8 python ops/site_check.py [--live]`
- title / description の欠落・重複、本文の `**` 残り、サイト内リンク切れ
- --live: 本番サイトマップの全URLが200か、コラム内の外部リンクのステータス
"""
import re, sys, pathlib, collections, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
SITE = "https://shukan-ragdoll.com"
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"}


def status(url, method="HEAD"):
    try:
        req = urllib.request.Request(url, headers=UA, method=method)
        return urllib.request.urlopen(req, timeout=20).status
    except urllib.error.HTTPError as e:
        if method == "HEAD" and e.code in (403, 405):
            return status(url, "GET")
        return e.code
    except Exception as e:
        return str(e)[:60]


pages = sorted(DIST.rglob("*.html"))
titles, descs = collections.defaultdict(list), collections.defaultdict(list)
problems, ext_links = [], set()
for p in pages:
    rel = "/" + p.relative_to(DIST).as_posix().replace("index.html", "")
    h = p.read_text(encoding="utf-8")
    t = re.search(r"<title>(.*?)</title>", h, re.S)
    d = re.search(r'<meta name="description" content="(.*?)"', h)
    if not t or not t.group(1).strip():
        problems.append(f"title欠落 {rel}")
    else:
        titles[t.group(1)].append(rel)
    if not d or not d.group(1).strip():
        if rel != "/404.html":
            problems.append(f"description欠落 {rel}")
    else:
        descs[d.group(1)].append(rel)
    body = re.sub(r"<(script|style)[\s\S]*?</\1>", "", h)
    if "**" in re.sub(r"<[^>]+>", "", body):
        problems.append(f"** 残り {rel}")
    for href in re.findall(r'href="([^"#]+)', h):
        if href.startswith("/") and not href.startswith("//"):
            path = href.split("?")[0]
            f = DIST / path.lstrip("/")
            if not (f.exists() or (f / "index.html").exists()):
                problems.append(f"内部リンク切れ {rel} -> {href}")
        elif href.startswith("http") and "/columns/" in rel and SITE not in href and "fonts.g" not in href:
            ext_links.add(href)
for k, v in titles.items():
    if len(v) > 1:
        problems.append(f"title重複 {v}")
for k, v in descs.items():
    if len(v) > 1:
        problems.append(f"description重複 {v}")
print(f"ページ数 {len(pages)} / 問題 {len(problems)}")
for x in problems:
    print(" -", x)

if "--live" in sys.argv:
    sm = urllib.request.urlopen(urllib.request.Request(SITE + "/sitemap-0.xml", headers=UA)).read().decode()
    urls = re.findall(r"<loc>(.*?)</loc>", sm)
    bad = [(u, s) for u in urls if (s := status(u)) != 200]
    print(f"サイトマップ {len(urls)} URL / 200以外 {len(bad)}")
    for u, s in bad:
        print(" -", s, u)
    ext_bad = [(u, s) for u in sorted(ext_links) if (s := status(u)) != 200]
    print(f"コラム外部リンク {len(ext_links)} / 200以外 {len(ext_bad)}")
    for u, s in ext_bad:
        print(" -", s, u)
