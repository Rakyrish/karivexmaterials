"""HTTP smoke checks for a running KariVex Industrial Materials site.

Checks every published product/category/application page renders with the
expected <h1>, an absolute self-referencing canonical on the production
origin, no redirect to Contact or the chemical site; drafts and unknown
slugs return 404; the sitemap contains only published canonical URLs.

Usage:
    python -I scripts/smoke_check.py --site http://localhost:3000 --api http://127.0.0.1:8000
"""

import argparse
import html
import json
import re
import sys
import urllib.error
import urllib.request

ORIGIN = "https://materials.karivexsolutionsltd.com"


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


OPENER = urllib.request.build_opener(NoRedirect)


def get(url):
    try:
        with OPENER.open(url, timeout=30) as response:
            return response.status, response.headers, response.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as error:
        return error.code, error.headers, error.read().decode("utf-8", "replace")


def get_json(url):
    with urllib.request.urlopen(url, timeout=30) as response:
        return json.loads(response.read())


def canonical(body):
    match = re.search(r'<link rel="canonical" href="([^"]+)"', body)
    return match.group(1) if match else None


def h1(body):
    matches = re.findall(r"<h1[^>]*>(.*?)</h1>", body, re.S)
    return [html.unescape(re.sub(r"<[^>]+>", "", m)).strip() for m in matches]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--site", default="http://localhost:3000")
    parser.add_argument("--api", default="http://127.0.0.1:8000")
    args = parser.parse_args()
    failures = []

    def check(condition, message):
        if not condition:
            failures.append(message)

    products = get_json(f"{args.api}/api/v1/products/?page_size=100")["results"]
    for product in products:
        path = f"/products/{product['slug']}"
        status, _, body = get(args.site + path)
        check(status == 200, f"{path}: status {status}")
        check(canonical(body) == ORIGIN + path, f"{path}: canonical {canonical(body)}")
        headings = h1(body)
        check(headings == [product["name"]], f"{path}: h1 {headings}")
        check("noindex" not in body.split("</head>")[0], f"{path}: unexpected noindex")
        check('"@type":"Product"' in body, f"{path}: missing Product JSON-LD")
        check('"@type":"BreadcrumbList"' in body, f"{path}: missing BreadcrumbList")
    print(f"checked {len(products)} published product pages")

    for slug in ["max-50", "maxheat-k", "fondu-cement", "pharmaceutical-cold-chain-boxes", "eps-boxes", "no-such-product"]:
        status, headers, body = get(f"{args.site}/products/{slug}")
        check(status == 404, f"/products/{slug}: expected 404, got {status} {headers.get('Location')}")
        check("noindex" in body, f"/products/{slug}: 404 page should be noindex")

    for kind in ["categories", "applications"]:
        for item in get_json(f"{args.api}/api/v1/{kind}/"):
            path = f"/{kind}/{item['slug']}"
            status, _, body = get(args.site + path)
            check(status == 200, f"{path}: status {status}")
            check(canonical(body) == ORIGIN + path, f"{path}: canonical {canonical(body)}")
            check(len(h1(body)) == 1, f"{path}: h1 count {len(h1(body))}")

    for service in get_json(f"{args.api}/api/v1/services/"):
        path = f"/services/{service['slug']}"
        status, _, body = get(args.site + path)
        check(status == 200, f"{path}: status {status}")
        check(canonical(body) == ORIGIN + path, f"{path}: canonical {canonical(body)}")
        check(len(h1(body)) == 1, f"{path}: h1 count {len(h1(body))}")
        check('"@type":"Service"' in body and '"@type":"FAQPage"' in body, f"{path}: Service/FAQ JSON-LD")

    for path in ["/", "/products", "/categories", "/applications", "/services", "/pizza-oven-guide",
                 "/about", "/contact", "/privacy", "/image-credits"]:
        status, _, body = get(args.site + path)
        check(status == 200, f"{path}: status {status}")
        check(canonical(body) == (ORIGIN + path).rstrip("/") or canonical(body) == ORIGIN + path, f"{path}: canonical {canonical(body)}")
        check(len(h1(body)) == 1, f"{path}: h1 count {len(h1(body))}")

    status, _, body = get(args.site + "/products?q=fiber")
    check('name="robots" content="noindex, follow"' in body, "/products?q=: should be noindex,follow")
    check(canonical(body) == ORIGIN + "/products", "/products?q=: canonical should be /products")
    status, _, body = get(args.site + "/quote")
    check('content="noindex, follow"' in body, "/quote should be noindex")

    status, _, sitemap = get(args.site + "/sitemap.xml")
    check(status == 200, f"sitemap status {status}")
    urls = re.findall(r"<loc>([^<]+)</loc>", sitemap)
    check(all(u.startswith(ORIGIN + "/") for u in urls), "sitemap has non-production URLs")
    product_urls = {u for u in urls if "/products/" in u}
    check(product_urls == {f"{ORIGIN}/products/{p['slug']}" for p in products}, "sitemap products != published")
    check(not any("max-50" in u or "?" in u for u in urls), "sitemap includes draft or parameter URLs")
    print(f"sitemap: {len(urls)} URLs")

    status, _, robots = get(args.site + "/robots.txt")
    check("Disallow: /admin/" in robots and f"Sitemap: {ORIGIN}/sitemap.xml" in robots, "robots.txt content")
    check("Disallow: /products" not in robots, "robots must not block product pages")

    status, _, home = get(args.site + "/")
    for needle in ["tel:+254742355548", "tel:+254710851911", "mailto:info@karivexsolutionsltd.com",
                   "https://wa.me/254710851911", 'aria-label="Quick contact"']:
        check(needle in home, f"homepage missing {needle}")
    check("karivexsolutionsltd.com/#organization" in home, "parentOrganization reference missing")

    status, _, page = get(args.site + "/products/fire-bricks-refractory-bricks")
    check("wa.me/254710851911?text=" in page and "products%2Ffire-bricks-refractory-bricks" in page,
          "product WhatsApp link missing product URL")
    check('"@type":"FAQPage"' in page, "product FAQ JSON-LD missing")
    check('"offers"' not in page, "product without confirmed price must not publish offers")

    if failures:
        print(f"{len(failures)} FAILURE(S):")
        for failure in failures:
            print(" -", failure)
        sys.exit(1)
    print("all smoke checks passed")


if __name__ == "__main__":
    main()
