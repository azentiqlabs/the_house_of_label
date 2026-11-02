# The House of Labels — SEO code audit

## Source-code findings

1. `SITE_URL` defaulted to `http://localhost:3000`. If that value is copied into CloudNinza production, canonical URLs and the sitemap can point to localhost instead of the public domain. Production now falls back to `https://thehouseoflabel.com` when `SITE_URL` is absent or set to localhost. Set it explicitly in CloudNinza anyway.
2. The sitemap listed all published products and all static routes, including pages/products configured with `noIndex`. The updated sitemap is dynamic and filters those entries.
3. The About page used static placeholder wording and did not read the Mission, Vision and Strength content from the homepage CMS. It now reads those approved sections from the same PostgreSQL-backed CMS.
4. The Contact page contained visible demo text and example contact details. It now reads Site Settings and omits placeholder contact values.
5. The header/footer primarily linked to homepage anchors, even though separate `/about`, `/products`, `/machines`, `/industries`, `/gallery` and `/contact` routes exist. Navigation now links to those public routes, while the What We Do item remains a homepage section link.
6. Organization and WebSite structured data were not present. A safe JSON-LD graph is now emitted using configured business details only; demo/example values are omitted.
7. `PageContent.seoTitle` and `seoDescription` were stored but not returned by `getHomeData` or used as homepage/About metadata fallbacks. Those fields are now passed through and used as fallbacks where applicable.
8. Product-level `noIndex=true` could be overridden by an SEO-page record with `noIndex=false`. A product's explicit `noIndex` setting now remains a safety override.

## Important SEO clarification

There is intentionally no `meta keywords` tag. Google says it does not use that tag for indexing or ranking. Search phrases should appear naturally in visible page titles, headings, introductory copy, detailed product descriptions and image alt text where relevant.

## What source code cannot do by itself

- It cannot guarantee a first-place Google ranking.
- It cannot submit URLs to Google without the site owner using Search Console.
- It cannot invent the business's actual city, address, manufacturing capabilities, customer references or certifications. Those facts must be supplied and approved by the business.
- It cannot prove whether Google has indexed the current live site. Use Search Console URL Inspection and Page Indexing reports for that.

## Suggested search-intent groups to validate with the business

- printed labels / custom printed labels
- unprinted label rolls
- thermal labels / thermal transfer labels
- barcode labels / shipping labels
- product and packaging labels
- label manufacturer / label supplier + the actual service city or region

Do not use a city modifier until the business's real location and service area have been confirmed.
