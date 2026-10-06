# KariVex Industrial Materials

Pizza-oven materials and services website for **KariVex Industrial Materials**,
the Industrial Materials Division of KariVex Solutions Ltd. Intended production
address: `https://materials.karivexsolutionsltd.com`. Since 6 October 2026 the
public site focuses on pizza ovens. See `docs/pizza-focus.md`.

| Part | Stack |
| --- | --- |
| `frontend/` | Next.js 16.3 (App Router, TypeScript, Tailwind CSS 4), React 19.2. Server-rendered pages, quote basket, SEO. |
| `backend/` | Django 5.2 LTS + Django REST Framework 3.18, PostgreSQL 17. Catalogue, enquiries, site settings, admin. |
| `deploy/` | Production Docker Compose, nginx/Caddy site config, backup/restore scripts. |
| `scripts/` | Logo derivative generator, smoke and end-to-end checks. |
| `docs/` | Deployment, admin guide, catalogue mapping, open content questions, verification record. |

Lockfiles: `frontend/package-lock.json`, `backend/requirements.txt` (fully pinned).
Local development used Node 24, Python 3.14 and PostgreSQL 17.8; the production
images use Node 22 LTS and Python 3.13.

## How it fits together

```
browser ──► reverse proxy (nginx/Caddy, TLS)
              ├─ /admin, /static, /media, /healthz ─► Django (gunicorn)
              └─ everything else ───────────────────► Next.js
                                                         └─ server-side ─► Django /api/v1 (private)
```

* Every public page is rendered on the server from the database through the
  Django API; there is no hardcoded product list. Data fetches are cached and
  refreshed immediately when an admin saves (Django calls `/api/revalidate`),
  with a 5-minute time-based fallback.
* The quote basket lives in the visitor's browser until submitted. Enquiries are
  stored in PostgreSQL first and then emailed, so mail problems never lose a request.
* Contact details are stored once in **Site settings** (admin) and used in the header,
  footer, contact page, quote flow, WhatsApp links and structured data.

## Local setup

Prerequisites: Python 3.12+, Node 20.9+ (22 LTS recommended), PostgreSQL 16+ (or Docker).

```sh
# 1. Database — either Docker…
docker compose -f deploy/docker-compose.dev.yml up -d        # Postgres on localhost:5436
# …or any local Postgres with a dedicated database/role.

# 2. Environment
cp .env.example .env      # set DJANGO_SECRET_KEY, REVALIDATE_SECRET and DATABASE_URL
                          # (dev compose password: karivexmaterials_dev_only)

# 3. Backend
cd backend
python -m venv .venv
.venv/bin/pip install -r requirements.txt       # Windows: .venv\Scripts\pip
.venv/bin/python manage.py migrate
.venv/bin/python manage.py setup_groups
.venv/bin/python manage.py seed_catalog
.venv/bin/python manage.py createsuperuser      # prompts; no default credentials exist
.venv/bin/python manage.py runserver 8000

# 4. Frontend (second terminal)
cd frontend
npm ci
npm run dev                # http://localhost:3000   (admin: http://localhost:8000/admin/)
```

Local email: with `EMAIL_BACKEND=django.core.mail.backends.filebased.EmailBackend`
every notification is written to `.local-mail/` and nothing is sent. Never point
local or test submissions at the live company inbox.

### Catalogue seeding

`python manage.py seed_catalog` creates any missing categories, applications,
products, variants and specifications from `backend/catalog/seed_data.py`. It is
safe to re-run and never overwrites admin edits. `--update` refreshes
seed-managed content (still leaving publish status alone); `--update --reset-status`
also resets draft/published status.

### Regenerating logo derivatives

```sh
backend/.venv/bin/python -I scripts/make_brand_assets.py
```

Source: `assets/logo-source/logo-original.png` (an identical copy of the supplied
`logo.png`). The script only crops and scales — see `docs/admin-guide.md` for replacing it.

## Checks

```sh
cd backend && .venv/bin/python manage.py test                 # 44 backend tests (Postgres)
cd frontend && npm run lint && npm run build                   # lint + type-check + production build
# with both servers running:
backend/.venv/bin/python -I scripts/smoke_check.py             # pages, canonicals, 404s, sitemap, robots
cd backend && .venv/bin/python -I ../scripts/e2e_check.py      # quote flow, mail capture, revalidation, media
```

See `docs/verification.md` for what was actually run and the results.

## Documentation

* `docs/pizza-focus.md` — what is public, services, photos and licences, SEO and rich results
* `docs/deployment.md` — server, DNS, TLS, proxy, email, Search Console, backups, rollback
* `docs/admin-guide.md` — creating staff accounts, editing the catalogue, handling enquiries
* `docs/catalogue-mapping.md` — where every supplied catalogue item ended up
* `docs/open-questions.md` — unresolved product facts, contact verification, missing assets
* `docs/verification.md` — checks performed and known limitations
