# Administrator guide

Admin address: `https://materials.karivexsolutionsltd.com/admin/` (locally `http://localhost:8000/admin/`).

## Accounts and roles

* The first owner account is created on the server with `python manage.py createsuperuser`.
  It prompts for a username and password; no default credentials exist.
* To add other staff: **Users → Add user**, tick **Staff status**, and add the user to **one** group:

| Group | Can do |
| --- | --- |
| Catalogue Editors | Add and edit products, categories, applications, photos, datasheets and variants. **Cannot publish** or unpublish products, delete products, or see enquiries. |
| Sales | View enquiries and update their status and internal notes. Read-only catalogue. |
| Administrators | Everything above, plus publishing, deleting and Site settings. |

User accounts themselves can only be managed by superusers. Re-run `python manage.py setup_groups`
after upgrades to refresh group permissions.

## Products

* **Status.** *Draft* products are invisible to the public: no page (404), not in the sitemap,
  and they can't be quoted. *Published* products appear everywhere. Administrators publish with
  the Status field or the list actions.
* **Slug.** This is the public address, `/products/<slug>`. If you change the slug of a
  published product, a permanent redirect from the old address is created automatically
  (see **Redirects**).
* **Categories.** Each product has one *primary category*, used for breadcrumbs, and can be in
  *additional categories* and *applications*. It still has only one page.
* **Specifications.** Add rows only for confirmed facts, with units (label / value / unit).
  Leave anything unconfirmed out. Never guess temperature limits, conductivity, voltage ratings,
  fire classes, food-contact or pharmaceutical suitability, or certifications.
* **Variants.** Use these for ordinary options of the same product (thickness, size, diameter,
  box use). Create a separate product when the material or grade is genuinely different.
  Untick *Is active* to hide an option.
* **Photos.** Upload JPEG, PNG or WebP (max 8 MB). Large photos are downscaled automatically.
  Write alt text that describes what the photo actually shows. Mark one photo as primary.
  To replace a photo, choose a new file on the same row; the old file is deleted. Products
  without photos show a neutral "Photo to follow" placeholder. Never upload competitors'
  images or generated images presented as real product photos.
* **Datasheets.** PDF only (max 15 MB). Untick *Is public* to keep a reference document internal.
* **Review / internal notes.** This is where open questions are tracked. It's never shown publicly.
* Changes appear on the public site on the next page load after saving.

## Enquiries

* Every quotation and contact form submission is saved with a reference (`KVM-YYYYMMDD-XXXXXX`)
  and a snapshot of the requested products and options, so later catalogue edits don't change it.
* Set the status as you work: **New → In Progress → Quoted → Closed**. Use *Internal notes* for staff.
* **Notification failures.** If email delivery isn't configured or fails, the list page shows a
  warning. Filter by *Notification: Not delivered*, follow those enquiries up, and use the
  **Retry email notification** action once mail is fixed.
* The visitor's email is set as Reply-To, so replying to the notification email answers the customer.

## Site settings

One record holds the company identity and contact details used across the whole site: phones,
WhatsApp number (digits in international format, e.g. `254710851911`), email, address, hours,
regions served, the Chemical Division link, homepage headline/intro, the optional GA4 ID, and
an option to switch the online forms off. Change contacts here only after checking them against
the company website, and update *Contact verified on*.

## Logo

The header and footer use derivatives of `assets/logo-source/logo-original.png`. To use a new
official logo file, replace that file and run `scripts/make_brand_assets.py`, then redeploy.
Alternatively, upload a header image in **Site settings → Logo header override**.
