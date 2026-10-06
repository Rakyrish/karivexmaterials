# Deployment — materials.karivexsolutionsltd.com

**Status (6 October 2026): not deployed.** This environment has no SSH key,
server credentials or Cloudflare access, so nothing was changed on any server
or DNS zone. Follow the steps below on the server.

## What was observed (read-only)

| Check | Result |
| --- | --- |
| `karivexsolutionsltd.com` A record | `78.159.126.224`, apparently DNS-only (the origin answers directly, not through Cloudflare) |
| Nameservers | Cloudflare (`lennox.ns.cloudflare.com`, `sarah.ns.cloudflare.com`) |
| Origin web server header | `Server: nginx` |
| `materials.karivexsolutionsltd.com` | does not exist yet (NXDOMAIN) |

Confirm that 78.159.126.224 is the intended VPS before using it. If the materials site
will run on a different server or a managed host, use that destination instead.

## 1. Inspect the server first (no changes)

```sh
ssh <user>@<server>
docker ps --format '{{.Names}}\t{{.Ports}}'      # existing apps and their ports
ss -ltnp                                         # who owns 80/443 and which loopback ports are free
sudo nginx -T | less                             # active nginx config (or: caddy / traefik)
df -h && free -m
```

* Keep using whatever already owns ports 80/443 (probably nginx). Do not start a second proxy.
* Pick free loopback ports for this app. The defaults are 3410 (web) and 8410 (Django);
  change `MATERIALS_WEB_PORT` / `MATERIALS_API_PORT` if they are taken.

## 2. Install the application

```sh
sudo mkdir -p /opt/karivex-materials && sudo chown $USER /opt/karivex-materials
git clone https://github.com/Rakyrish/karivexmaterials.git /opt/karivex-materials
cd /opt/karivex-materials
cp .env.example .env.production
chmod 600 .env.production
```

Edit `.env.production`. Required production values:

```
DJANGO_DEBUG=False
DJANGO_SECRET_KEY=<generate>
REVALIDATE_SECRET=<generate>
POSTGRES_PASSWORD=<generate; dedicated to this app>
DJANGO_ALLOWED_HOSTS=materials.karivexsolutionsltd.com,backend,127.0.0.1,localhost
CSRF_TRUSTED_ORIGINS=https://materials.karivexsolutionsltd.com
TRUST_X_FORWARDED_FOR=True            # nginx/Caddy config in deploy/ overwrites X-Forwarded-For
CACHE_URL=dbcache://django_cache
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=...  EMAIL_PORT=587  EMAIL_USE_TLS=True  EMAIL_HOST_USER=...  EMAIL_HOST_PASSWORD=...
DEFAULT_FROM_EMAIL=KariVex Industrial Materials <address the SMTP provider may send for>
NEXT_PUBLIC_NOINDEX=false
```

Remove or blank `DATABASE_URL`, `API_BASE_URL` and `FRONTEND_REVALIDATE_URL`; the compose file sets them.
Generate secrets with `python3 -c "import secrets; print(secrets.token_urlsafe(50))"`.

```sh
docker compose -f deploy/docker-compose.prod.yml --env-file .env.production up -d --build
docker compose -f deploy/docker-compose.prod.yml --env-file .env.production ps
curl -s http://127.0.0.1:8410/healthz            # {"status": "ok"}
curl -sI http://127.0.0.1:3410/ | head -1        # 200
```

On every start the backend runs `migrate` (it never resets data), `setup_groups`,
and `seed_catalog` (it only creates missing records; set `RUN_SEED=false` to skip).

Create the first administrator interactively. No default credentials exist:

```sh
docker compose -f deploy/docker-compose.prod.yml --env-file .env.production exec backend python manage.py createsuperuser
```

## 3. Reverse proxy and certificate

**nginx (the likely setup):** install `deploy/nginx-materials.conf` as a new site file.
Don't edit the parent site's server block.

```sh
sudo cp deploy/nginx-materials.conf /etc/nginx/sites-available/materials.karivexsolutionsltd.com
sudo ln -s ../sites-available/materials.karivexsolutionsltd.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Rollback: `sudo rm /etc/nginx/sites-enabled/materials.karivexsolutionsltd.com && sudo nginx -t && sudo systemctl reload nginx`.

**Caddy (only if Caddy is the active proxy):** add `deploy/Caddyfile.materials`, then run
`caddy validate` and `caddy reload`. Caddy obtains its own certificate when the record is DNS-only.

Choose one certificate approach:

* **Cloudflare-proxied (orange cloud), recommended:** create a Cloudflare Origin CA
  certificate for `materials.karivexsolutionsltd.com` (SSL/TLS → Origin Server). Install it at
  `/etc/ssl/karivex-materials/origin.pem` and `.key` (`chmod 600` on the key). Set SSL mode
  **Full (strict)** for this hostname only, with a Configuration Rule matching
  `http.host eq "materials.karivexsolutionsltd.com"`, so the zone-wide SSL mode for the
  parent site is untouched. Check the zone's current mode first. Never use Flexible.
  Restore visitor IPs with nginx `set_real_ip_from` (Cloudflare ranges) and
  `real_ip_header CF-Connecting-IP`.
* **DNS-only (grey cloud, like the parent site today):** start with only the
  port-80 server block enabled, run `sudo certbot --nginx -d materials.karivexsolutionsltd.com`,
  and point the `ssl_certificate` lines at the certbot paths.

## 4. DNS (Cloudflare)

First check whether a `materials` record exists (it did not on 6 October 2026), then add:

| Type | Name | Content | TTL | Proxy |
| --- | --- | --- | --- | --- |
| A | `materials` | the VPS IPv4 (78.159.126.224 if confirmed) | Auto | Proxied (with Origin CA + Full strict), or DNS-only (with certbot) |

If a managed host supplies a target hostname, use its CNAME instead. Leave the apex, `www`,
MX, SPF, DKIM and DMARC records exactly as they are. Don't redirect or change the main domain.

## 5. Smoke checks after go-live

```sh
curl -sI https://materials.karivexsolutionsltd.com/ | head -1
curl -s  https://materials.karivexsolutionsltd.com/robots.txt
curl -s  https://materials.karivexsolutionsltd.com/sitemap.xml | head
curl -sI https://materials.karivexsolutionsltd.com/products/max-50 | head -1     # 404 (draft)
curl -sI https://karivexsolutionsltd.com/ | head -1                              # parent site still OK
python3 -I scripts/smoke_check.py --site https://materials.karivexsolutionsltd.com --api http://127.0.0.1:8410
```

Then send one test enquiry, clearly marked as a test, and confirm it arrives at
info@karivexsolutionsltd.com. Coordinate this with the sales team first, and delete
or close the test enquiry in the admin afterwards.

## 6. Email

See `docs/email-setup.md`. The company domain uses Cloudflare Email Routing, which only receives mail,
so the site needs Gmail SMTP or a transactional provider to send enquiry notifications to info@.
Verify with `python manage.py send_test_email`.


* Use the company mail provider's SMTP (or a transactional provider) with credentials only in
  `.env.production`.
* `DEFAULT_FROM_EMAIL` must be an address the provider is authorised to send for (SPF/DKIM).
  If you send as `no-reply@materials.karivexsolutionsltd.com`, the provider must be set up for
  that subdomain. Otherwise use an authorised address on the main domain. Visitors'
  addresses are only ever used as Reply-To.
* If SMTP is missing or failing, enquiries are still saved. The admin enquiry list shows a
  warning and the "Not delivered" filter; fix the settings, then use **Retry email notification**.

## 7. Search Console

These steps haven't been done; they need the owner's Google account.

1. Add a **URL-prefix property** for `https://materials.karivexsolutionsltd.com/`. Verify it with
   the HTML-tag method (add the tag via a small code change) or with DNS. A Cloudflare TXT
   record is the simplest option and doesn't affect mail.
2. Submit `https://materials.karivexsolutionsltd.com/sitemap.xml` under Sitemaps.
3. Use URL Inspection on the homepage and two product pages.
4. A **Domain property** for `karivexsolutionsltd.com` (DNS-verified) also includes data for
   all subdomains, including `materials.`. The URL-prefix property gives this site its own reports.

Expect Google to treat the subdomain as a separate site, but it doesn't automatically rank
independently of the parent domain. Indexing takes time and can't be forced.

## 8. Analytics (optional)

Paste a GA4 measurement ID (`G-…`) into **Admin → Site settings → Analytics**. GA loads only
after a visitor accepts the consent banner. Events: `generate_lead`, `add_to_quote`,
`remove_from_quote`, `click_phone`, `click_email` and `click_whatsapp`, carrying only product
slugs and placements, never personal data.

## 9. Backups and restore

```sh
deploy/backup.sh /var/backups/karivex-materials      # DB dump + media tarball
deploy/restore.sh <db.dump> <media.tar.gz>           # asks for confirmation; this app only
```

Schedule the backup nightly (cron) and copy the files off the server. Test a restore on a
staging copy periodically.

## 10. Updating

```sh
cd /opt/karivex-materials && git pull
deploy/backup.sh /var/backups/karivex-materials
docker compose -f deploy/docker-compose.prod.yml --env-file .env.production up -d --build
```

Rollback: `git checkout <previous tag>` and rebuild. If a migration has to be reversed, restore
the pre-update backup. Never drop the production database to make a migration pass.

## 11. Staging

For a staging copy, build with `NEXT_PUBLIC_NOINDEX=true`, use a different hostname, and put it
behind authentication (nginx `auth_basic` or Cloudflare Access). Noindex alone is not access control.

## Suggested reciprocal link on the Chemical Division site

The existing site's repository was not in scope and wasn't changed. Suggestion for its owner:
add a header or footer link, e.g. "Industrial Materials Division → https://materials.karivexsolutionsltd.com/".
