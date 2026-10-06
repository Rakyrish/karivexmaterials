"""On-page SEO audit of every URL in the sitemap.

Checks per page: HTTP 200, indexable (no noindex), absolute self-canonical
on the production origin, title 20-65 chars, meta description 70-165
chars, exactly one <h1>, every <img> has an alt attribute, Open Graph
title/image, valid JSON-LD, and that every internal link resolves.

    python -I scripts/seo_audit.py --site http://localhost:3000
"""

import argparse
import html
import json
import re
import sys
import urllib.error
import urllib.request
from collections import defaultdict
from urllib.parse import urljoin, urlparse

ORIGIN = "https://materials.karivexsolutionsltd.com"


def fetch(url):
    try:
        with urllib.request.urlopen(url, timeout=30) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, ""


def meta(body, attr, name):
    m = re.search(rf'<meta[^>]+{attr}="{re.escape(name)}"[^>]+content="([^"]*)"', body)
    if not m:
        m = re.search(rf'<meta[^>]+content="([^"]*)"[^>]+{attr}="{re.escape(name)}"', body)
    return html.unescape(m.group(1)) if m else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--site", default="http://localhost:3000")
    args = ap.parse_args()
    site = args.site.rstrip("/")

    _, sitemap = fetch(site + "/sitemap.xml")
    urls = re.findall(r"<loc>([^<]+)</loc>", sitemap)
    issues = defaultdict(list)
    links = set()
    titles = {}

    for url in urls:
        path = url.replace(ORIGIN, "") or "/"
        status, body = fetch(site + path)
        if status != 200:
            issues[path].append(f"status {status}")
            continue
        head = body.split("</head>")[0]
        title = html.unescape(re.search(r"<title>(.*?)</title>", head, re.S).group(1)) if "<title>" in head else ""
        titles.setdefault(title, []).append(path)
        if not 20 <= len(title) <= 65:
            issues[path].append(f"title length {len(title)}: {title!r}")
        desc = meta(head, "name", "description") or ""
        if not 70 <= len(desc) <= 165:
            issues[path].append(f"description length {len(desc)}")
        robots = meta(head, "name", "robots") or ""
        if "noindex" in robots:
            issues[path].append("noindex on a sitemap URL")
        canon = re.search(r'<link rel="canonical" href="([^"]+)"', head)
        expected = ORIGIN + path
        if not canon or canon.group(1).rstrip("/") != expected.rstrip("/"):
            issues[path].append(f"canonical {canon.group(1) if canon else None}")
        h1s = re.findall(r"<h1[\s>]", body)
        if len(h1s) != 1:
            issues[path].append(f"{len(h1s)} h1 elements")
        for img in re.findall(r"<img\b[^>]*>", body):
            if " alt=" not in img:
                issues[path].append("img without alt attribute")
                break
        if not meta(head, "property", "og:title") or not meta(head, "property", "og:image"):
            issues[path].append("missing og:title/og:image")
        for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', body, re.S):
            try:
                json.loads(block)
            except ValueError:
                issues[path].append("invalid JSON-LD")
        if 'lang="en' not in body[:300]:
            issues[path].append("missing html lang")
        for href in re.findall(r'<a[^>]+href="([^"#]+)', body):
            full = urljoin(site + path, html.unescape(href))
            if urlparse(full).netloc == urlparse(site).netloc:
                links.add(urlparse(full)._replace(fragment="").geturl())

    for title, paths in titles.items():
        if len(paths) > 1:
            issues[", ".join(paths)].append(f"duplicate title {title!r}")

    broken = []
    for link in sorted(links):
        if "/api/" in link:
            continue
        status, _ = fetch(link)
        if status != 200:
            broken.append((link, status))

    print(f"audited {len(urls)} sitemap URLs, {len(links)} internal links")
    for link, status in broken:
        print(f"BROKEN LINK {status}: {link}")
    for path, problems in sorted(issues.items()):
        for p in problems:
            print(f"{path}: {p}")
    if issues or broken:
        sys.exit(1)
    print("SEO audit passed")


if __name__ == "__main__":
    main()
