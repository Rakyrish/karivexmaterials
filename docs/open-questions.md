# Open questions, sources and missing items

## Contact details — verified sources

Checked on **6 October 2026** against the raw HTML of https://karivexsolutionsltd.com/ and
https://karivexsolutionsltd.com/contact: link destinations plus the sites' own structured data.

| Field | Live value | Where |
| --- | --- | --- |
| Sales telephone | +254 710 851911 (`tel:+254710851911`) | header/contact links, `contactPoint` (sales) |
| Alternative sales telephone | +254 742 355548 (`tel:+254742355548`) | contact links, second `contactPoint` (sales) |
| WhatsApp | `https://wa.me/254710851911` | all WhatsApp buttons |
| Email | info@karivexsolutionsltd.com (`mailto:`) | links and structured data |
| Address | Enterprise Road, Industrial Area, Nairobi, Nairobi County 00400, KE | `PostalAddress` |
| Hours | Mo–Fr 08:00–17:00, Sa 08:00–13:00 | `openingHours` |
| Regions | Kenya, Uganda, Tanzania, Rwanda | `areaServed` |

These match the reference in the brief. **Owner change, 6 Oct 2026:** +254 742 355548 is now
shown as the primary number and +254 710 851911 as the alternative. WhatsApp stays on
254710851911 (the live site's WhatsApp destination) until the owner says otherwise.

Resolved during implementation: the earlier scaffold had the two phone numbers swapped
(+254 742 355548 as primary). It now follows the live site, with +254 710 851911 as the main
sales line.

Minor notes (no action needed):

* The live site's structured data spells the company "Karivex Solutions Ltd" (legalName); the
  brief and logo use "KariVex". This site uses "KariVex" in visible copy and links to the parent
  by its `@id` (`https://karivexsolutionsltd.com/#organization`).
* The supplied logo's lockup reads "KariVex Industrial Solutions" with "Strength Behind Every
  Project". It was used unchanged, and "Industrial Materials Division" is shown as text next to it.

## Product facts awaiting confirmation (draft products)

| Product | Needed before publishing |
| --- | --- |
| Fondu Cement | Manufacturer, grade and bag label/datasheet. Keep separate from MAX-50 and Maxheat. |
| MAX-50 | What product type it is, manufacturer, datasheet |
| Maxheat K / Maxheat A | Identity of each; whether they are different grades of one product |
| Polystyrene sheets | EPS, XPS or both? Then split into separate products. Also: are EPS sheets supplied for packaging? |
| Pharmaceutical cold-chain boxes | Validated thermal performance or supplier certification |
| Cladding materials | Which actual products (profiled sheet, insulated panel…) |

## Published, but specification details still to add

These pages are published with factual product-type descriptions; specific specs are left out until confirmed.

* Brands: whether rock wool is ROCKWOOL™-branded; whether the elastomeric insulation and tape
  are genuine Armaflex (Armacell); the brand of the reflective foil sold as "sisalation".
* Copper pipe rolls: whether 1/4 in (6.35 mm) is OD or ID, the wall thickness, and the roll length.
* Ranges and sizes for variants: thickness/density of wool and foam products, ceramic fibre grades,
  rope sizes, tape widths, ventilator throat sizes, EPS box sizes/capacities, bag sizes for cements,
  castables, vermiculite and perlite.
* Temperature ratings for refractory products, tapes and sealants.
* Voltage class and test documents for the insulating mats.
* Sales units, minimum order quantities and availability (everything currently shows "Availability on enquiry").
* PU spray foam: whether it is supplied as a material only or with an application service.
  The site currently makes no installation claim anywhere.
* Custom EPS boxes: made in-house or through a partner, and any minimum order.

## Pizza services: details to confirm before publishing

* Service area for building, repair and delivery; typical lead times
* Oven fuels covered (wood, gas, other), and whether flue/chimney work, bases and finishing/render are included
* Whether material advice is free (it is not described as free)
* Confirmed prices for any product, to enable Offer markup and product rich results

## Missing assets and credentials

* **Product photography:** none supplied. Pizza products show labelled illustrative stock photos
  (see `/image-credits`) or a neutral placeholder. Upload real photos in the admin.
* **Datasheets:** none supplied.
* **Production SMTP credentials:** not available. Locally, enquiries are captured to `.local-mail/`.
* **Server/SSH access, Cloudflare access, Google Search Console / Analytics accounts:** not available.
  See `docs/deployment.md`.
* **Logo:** supplied (`logo.png` at the project root, 1600×1600 PNG). An identical copy is at
  `assets/logo-source/logo-original.png`.
