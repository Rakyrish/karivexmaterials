# SEO playbook: getting found for pizza ovens and roof cyclones

No one can guarantee first place on Google. Rankings depend on Google's algorithms, competing
sites, links from other websites, reviews and time. The website is now set up to compete well;
the steps in parts 2–4 are what usually moves a local business up the results.

## 1. What the website already does

| Area | Status |
| --- | --- |
| Crawling | `robots.txt` allows everything except `/admin/` and `/api/`, and lists the sitemap. Search/filter pages and the quote basket are `noindex,follow` (not blocked), so Google can read the noindex. |
| Sitemap | `/sitemap.xml` lists only published pages (39 today) with real last-modified dates, image entries, and change-frequency/priority hints. It updates itself when products or services change. |
| Indexing signals | Every page has an absolute self-canonical on `https://materials.karivexsolutionsltd.com`, a unique title (≤ 65 characters) and meta description (70–165), one H1, image alt text, Open Graph and Twitter cards, and `lang="en-KE"`. |
| Structured data | Local business (`HomeAndConstructionBusiness`) with the full Nairobi address, hours, phones, photos, services and parent company; `BreadcrumbList` on every inner page; `Product` + `FAQPage` on products; `Service` + `FAQPage` on services; `Article` + `FAQPage` on both guides; `ItemList` on category pages; `WebSite`. |
| Content | Product, service and guide pages target real searches: "fire bricks Nairobi", "pizza oven builders Nairobi", "pizza oven repair", "refractory cement Kenya", "roof cyclones Kenya", "roof cyclone installation/repair", "turbine ventilator", "whirlybird", with FAQs answering common questions. |
| Speed and mobile | Server-rendered pages, optimised AVIF/WebP images, no heavy scripts; checked at 390 px to 2560 px. |
| Audit | `scripts/seo_audit.py` re-checks all of the above across the sitemap and finds broken internal links. Run it after every content change. |

**Product rich results (prices in Google):** Google shows them only for pages with a real price,
review or rating. Enter confirmed prices in **Admin → Product → Price** to make products eligible.
Never invent prices or reviews.

## 2. After launch: Google Search Console and Bing (needs the owner's accounts)

1. In Search Console, add a URL-prefix property for `https://materials.karivexsolutionsltd.com/`.
2. Verify it, either by:
   - adding the HTML-tag token to `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and redeploying, or
   - adding a DNS TXT record in Cloudflare.
3. Submit `https://materials.karivexsolutionsltd.com/sitemap.xml`.
4. Use URL Inspection → "Request indexing" for the home page, `/categories/roof-cyclones`,
   `/products/roof-ventilators-roof-cyclones`, `/services/pizza-oven-building` and
   `/services/roof-cyclone-installation`.
5. Do the same in Bing Webmaster Tools (`NEXT_PUBLIC_BING_SITE_VERIFICATION`). You can also import
   the site from Search Console.
6. Check the Pages, Sitemaps and Enhancements reports weekly for the first month.

## 3. Google Business Profile (the biggest factor for local "near me" searches)

- Create or claim a profile for the Enterprise Road warehouse. If the company already has one,
  add these products and services to it instead of creating a duplicate listing.
- Categories: for example "Building materials supplier" plus relevant extras (oven/pizza oven
  services, roofing contractor/ventilation).
- Add services ("Pizza oven building", "Roof cyclone installation", "Roof cyclone repair"),
  products (600 mm stainless steel roof cyclones, fire bricks…), hours, phone and this website.
- Upload real photos of stock, completed ovens and installed cyclones, and keep adding them.
- Ask every satisfied customer for a Google review, and reply to all reviews.

## 4. Building authority

- Keep the business name, address and phone identical everywhere (website, Google profile,
  directories, social media).
- Link to this site from the main company site (karivexsolutionsltd.com) and from the company's
  social profiles.
- List the business in reputable Kenyan business and construction directories.
- Publish real project write-ups with your own photos (e.g. "Pizza oven built for a Nairobi
  restaurant", "12 cyclones installed on a Ruiru warehouse").
- Upload your own product photos in the admin to replace the illustrative ones.
- Enter confirmed prices where you're comfortable showing them.

## 5. Routine

- After editing content, run `python -I scripts/seo_audit.py --site https://materials.karivexsolutionsltd.com`.
- Review Search Console monthly: queries with impressions but few clicks often need a better
  title or description.
