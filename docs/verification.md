# Verification record — 6 October 2026

Environment: Windows 11, Python 3.14.7, Node 24.19, PostgreSQL 17.8 (portable binaries; a
dedicated `karivexmaterials` database and role on localhost:5436), Next.js production build
served with `next start`, and Django `runserver`. Docker was not available on this machine, so
the Dockerfiles and production compose file were written but **not built or run**.

## Checks run, and results

| Area | Check | Result |
| --- | --- | --- |
| Backend | `manage.py test`: 35 tests on PostgreSQL (seed idempotency, publish/draft visibility, search synonyms, category counts, sitemap data, redirects, editor vs administrator permissions, admin login required, image validation/downscaling/replacement, enquiry snapshots, idempotency, honeypot, validation, notification failure and "not configured" handling, rate limiting, admin session + CSRF on public submit, site-settings contacts, health) | Pass |
| Backend | `manage.py check` / `check --deploy` with production settings | Only the deliberate HSTS includeSubDomains/preload warnings remain (the app must not impose HSTS on sibling subdomains) |
| Migrations/seed | `migrate`, then `seed_catalog` ×3 and `--update` on the dedicated database | 37 products (30 published, 7 draft), 8 variants, 6 categories, 6 applications; re-runs created nothing |
| Frontend | `npm run lint`, `next build` (includes TypeScript) | Pass |
| HTTP smoke (`scripts/smoke_check.py`) | All 30 published product pages: 200, one H1 = product name, absolute self-canonical on `https://materials.karivexsolutionsltd.com`, no redirect, Product + BreadcrumbList JSON-LD; drafts and unknown slugs → 404 with noindex; categories, applications and static pages canonical/H1; search views noindex,follow with canonical `/products`; `/quote` noindex; sitemap = exactly the published URLs (49), no parameters or drafts; robots allows products and blocks admin/API; header contacts and parent `@id` present; product WhatsApp link carries the product URL | Pass |
| End-to-end (`scripts/e2e_check.py`) | Multi-item quote via the Next `/api/enquiry` → stored with snapshots; duplicate submit returns the same reference with no new row; exactly one notification captured locally with To = info@…, Reply-To = visitor, From = site sender; draft product rejected; an admin-style save is visible on the public page within seconds (on-demand revalidation); uploaded photo rendered with its alt text, served through the Next image optimiser; replaced file deleted | Pass |
| Browser flow (headless Chrome via DevTools) | Variant required message; WhatsApp link updates with product + variant + URL and opens in a new tab (no auto-send); add to basket; badge count; quote page lists items; client validation summary; double-clicked submit → one enquiry, confirmation with reference, basket cleared | Pass |
| Visual | Desktop (1366/1440) and true 390 px mobile screenshots of home, product, category, catalogue, quote and contact pages; no horizontal overflow at 390 px; header logo and division label legible | Inspected |
| Structured data | Parsed every JSON-LD block on home, product, category and application pages: valid JSON; Organization with `parentOrganization` → `https://karivexsolutionsltd.com/#organization`; no offers, prices, ratings or reviews | Pass (local parse only; Google's Rich Results Test was not run because the site is not public) |

## Not verified / limitations

* No deployment: no server, DNS, Cloudflare, SMTP, Search Console or Analytics access. Nothing
  is live, and no external accounts were touched.
* Docker images and the production compose stack were not built here (Docker not installed).
* Real SMTP delivery was not tested. Only the local file capture and the failure paths were.
* Rich results: product pages have descriptive Product markup without `offers`, `review` or
  `aggregateRating`. Google's product snippet rich result requires one of those, so these quote-only
  pages are **not expected to be eligible**, and Search Console may list them as invalid for
  product snippets. That's expected; no price or rating has been invented to qualify. Breadcrumbs
  are eligible.
* No performance scores (Lighthouse/PageSpeed) were measured.
* Text contrast was chosen against WCAG ratios by calculation (navy #021533 on orange #FC7701 ≈ 6.5:1;
  white on WhatsApp green #1f7a43 ≈ 5.6:1; white text is never placed on orange). A full
  assistive-technology audit has not been done.

## Pizza-focus update, 6 October 2026 (later the same day)

| Check | Result |
| --- | --- |
| Backend `manage.py test` (44 tests: pizza focus and hidden products, services API, service requests, FAQ parsing, Offer only with a confirmed price, phone swap) | Pass |
| Migrations + `seed_catalog --update --reset-status` on the local database; re-run creates nothing | Pass: 10 published pizza products, 1 draft, 26 hidden; 4 categories; 4 services |
| `npm run lint`, `next build` | Pass |
| `scripts/smoke_check.py`: 10 product pages, 4 service pages (Service + FAQPage JSON-LD), guide, credits, canonicals, hidden products 404, sitemap = 32 published URLs, floating contact buttons, no Offer without a price | Pass |
| `scripts/e2e_check.py` (quote via Next, idempotency, local mail capture, admin edit refresh, media) | Pass |
| Browser flow (headless Chrome): product WhatsApp link, floating WhatsApp/call (0742 355548)/email, FAQ accordion, basket, quote submit, service request confirmation | Pass |
| Visual: desktop 1280/1440 and 390 px mobile of home (new hero), product, service and guide pages; no horizontal overflow | Inspected |

Bug found and fixed: Next's data cache kept serving a previously cached 200 for a product after
the API started returning 404 (hidden), until on-demand revalidation ran. Single-record lookups
(product, category, application, service, redirect) are now fetched uncached; list data stays
cached and tag-revalidated.

## Header fix, animated hero and roof cyclones, 6 October 2026 (afternoon)

| Check | Result |
| --- | --- |
| Header: brand-name text extent vs nav/basket measured at 13 widths (360–2560 px), plus scrolled state | No overlap at any width (an earlier fix had let the name overflow from 1536 px; corrected) |
| Backend `manage.py test` (44 tests, incl. 6 services, cyclone product published, cyclone search synonyms) | Pass |
| `npm run lint`, `next build` | Pass |
| `scripts/smoke_check.py`: 11 product pages, 6 service pages, guides, sitemap (39 URLs) | Pass |
| `scripts/e2e_check.py` and headless-browser quote + service-request flow | Pass |
| Structured data on the cyclone product (Product + FAQPage + BreadcrumbList), installation/repair services (Service + FAQPage), cyclone guide (Article + FAQPage) | Present and valid JSON |
| Hero: frames at 0.5 s / 2 s / 8 s on desktop and 390 px mobile, plus a reduced-motion render | Inspected; no horizontal scroll; static fallback clean |

Operational note: if `seed_catalog --update` runs while the Next.js server is down, its refresh signal is
lost and list data (e.g. the sitemap) can stay stale for up to 5 minutes. To force a refresh, POST
`{"tags":["catalog","settings"]}` to `/api/revalidate` with the `X-Revalidate-Secret` header.
