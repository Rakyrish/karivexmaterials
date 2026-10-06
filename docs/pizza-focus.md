# Pizza-oven focus (owner decision, 6 October 2026)

The public site now sells **pizza-oven materials and supplies** and offers **pizza-oven services**.
The name (KariVex Industrial Materials) and address (materials.karivexsolutionsltd.com) are unchanged.

## What is public

**Categories:** Oven Floor & Hearth · Dome, Walls & Bonding · Oven Insulation · Door Seals & Finishing.

**Products (10 published):** fire bricks, hearth materials, refractory castable, refractory cement,
refractory mortar, ceramic fibre blanket, vermiculite, perlite, ceramic fibre rope (door seal),
and high-temperature sealants & adhesives. Fondu cement stays a draft until its identity is confirmed.

**Services (confirmed by the owner):** Pizza Oven Building · Pizza Oven Repair & Relining ·
Material Selection Advice · Delivery of Materials. Each has its own page with a request form
(stored as a "Service request" enquiry), a WhatsApp link and FAQs. Prices, lead times,
guarantees and service area are **not** published; they are confirmed per quotation.

**Oven projects (applications):** New Pizza Oven Builds · Pizza Oven Repair & Relining ·
Pizzerias, Restaurants & Hotels · Home & Garden Pizza Ovens.

**Guide:** `/pizza-oven-guide` covers oven layers, materials, curing and AVPN temperatures, with
references linked inline in the text.

## What is hidden, not deleted

Every other supplied catalogue item (roof insulation, EPS boxes, HVAC, copper pipe, tapes, mats,
furnace-only items) has status **Hidden (outside current focus)**. These items return 404 publicly,
stay out of the sitemap and can't be quoted. To bring one back, set its status to Published in the
admin. The original catalogue mapping in `catalogue-mapping.md` still records where every
supplied item went.

Content sources: `backend/catalog/seed_pizza.py` (structure, copy, services) and
`backend/catalog/seed_pizza_seo.py` (search titles/descriptions and FAQs), merged in
`seed_data.py`. To apply them to an existing database, run `python manage.py seed_catalog --update --reset-status`.
This overwrites seed-managed content, so don't run it after admins have edited content you want to keep.

## Photos

Eleven licensed photographs from Wikimedia Commons are stored in `frontend/src/assets/pizza/`
(re-encoded at up to 1920–2400 px). Licence, author and source page for each are in
`frontend/src/data/image-credits.json` and shown at `/image-credits`. They are labelled
"Illustrative photo" wherever they stand in for a product, because they are not photos of
KariVex stock. Uploading a real photo in the admin replaces the illustration for that product,
category, application or service.

Excluded on purpose: images uploaded by oven manufacturers (competitor imagery), and one image
credited as "own work" that appears to be a recirculated stock photo (licence uncertain).

## Search and rich results

* Every product, category and service has a unique search title and description aimed at
  pizza-oven searches in Nairobi/Kenya, an absolute canonical, Open Graph/Twitter cards (with a
  photo) and BreadcrumbList data.
* FAQs are visible on products, services and the guide, and marked up as `FAQPage`. Google
  currently shows FAQ rich results only for a small set of authoritative sites, so expect the FAQs
  to help content and AI/answer surfaces rather than produce FAQ snippets.
* **Product rich results:** Google requires a real price (Offer), review or rating. Products are
  quote-only today, so no Offer is published and product snippets are **not expected**. When you
  enter a confirmed price in **Admin → Product → Price**, the page shows it and publishes an `Offer`
  (price, KES, condition, valid-until, availability), which makes the page eligible. Never enter
  estimated prices, and never add fake reviews or ratings.
* The guide has `Article` markup. The organisation markup lists the four services
  (`hasOfferCatalog`) and the verified sales hours on each contact point.
* The sitemap lists only published URLs, with image entries. Search/filter views are noindex
  with a canonical to the clean page.

## Contacts

At the owner's request, the primary number is now **+254 742 355548** and the alternative is
**+254 710 851911** (data migration `sitesettings/0005`). WhatsApp still uses `wa.me/254710851911`,
the destination used by the live company site. Change it in **Site settings** if WhatsApp should
move to 0742 355548 too. Floating call, WhatsApp and email buttons appear on every page.

## Roof cyclones (added 6 October 2026)

At the owner's request the site also covers **roof cyclones** (turbine roof ventilators,
"whirlybirds"). Confirmed by the owner: stock is **600 mm stainless steel** cyclones, and the
business **supplies, installs and repairs** them.

* Category `/categories/roof-cyclones`; product `/products/roof-ventilators-roof-cyclones` (the
  original catalogue item, now published with new copy, search text and FAQs).
* Services `/services/roof-cyclone-installation` (supply and fitting, base matched to the roof
  profile and sealed) and `/services/roof-cyclone-repair` (bearings, heads, base reseals, new
  cyclone fitted where needed).
* Product specifications: throat diameter 600 mm, stainless steel, wind-driven; one option
  "600 mm stainless steel".
* Project page `/applications/roof-ventilation`; guide `/roof-cyclone-guide` (Article + FAQ markup,
  references linked inline); guides index `/guides`.
* Homepage: cyclone section with photos, a "Roof cyclones" hero tag and ticker items; the hero's
  rotating line includes "We supply / repair roof cyclones".
* Photos: two Wikimedia Commons images (plus one cropped detail); see `/image-credits`.
  These were the only freely licensed roof-cyclone photos on Commons. Upload your own in the admin.
* Content source: `backend/catalog/seed_cyclones.py`.

Not published until confirmed: base types, prices, and the installation/repair service area.

## Animated hero

The homepage hero is CSS-animated: a crossfading slow-zoom photo slideshow, rising embers, a
fire-gradient headline, rotating service sentences, a turning pizza (a cut-out derivative of a
licensed photo), floating tags, count-up stats and a ticker. Visitors with "reduce motion"
enabled get a static version.


## Pizza ovens and roof cyclones, balanced; learning centre (6 October 2026)

* Homepage headline: "Pizza Ovens & Roof Cyclones, Supplied, Built & Repaired". The hero slideshow,
  badge, buttons and stats now cover both. The cyclone section sits directly after the categories,
  and a "Learn before you buy" section replaces the pizza-only guide teaser.
* Learning centre (`/guides`, driven by `frontend/src/lib/articles.ts`):
  * Pizza ovens: how ovens are built, choosing fire bricks, wood vs gas, care and maintenance.
  * Roof cyclones: the cyclone guide, cyclones vs electric extractor fans, ventilating hot metal roofs.
  * Reference: a glossary (DefinedTermSet markup) and an FAQ page (one combined FAQPage).
  * Every article has Article markup, a topic call to action, related articles, and sources linked
    inline in the text.
* Testimonials: real, consented customer feedback only (see `docs/admin-guide.md`). Locked
  placeholders exist in the admin; the public section invites reviews until real ones are
  published. No review structured data is emitted, because self-published reviews are not
  eligible for Google review snippets.
