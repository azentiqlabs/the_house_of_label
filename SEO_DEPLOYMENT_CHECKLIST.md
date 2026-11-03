# House of Labels — SEO launch checklist

## Required CloudNinza environment variable

Set the production environment variable to the canonical HTTPS domain:

```env
SITE_URL=https://thehouseoflabel.com
```

Do not leave `SITE_URL=http://localhost:3000` in production. The source code now falls back to the production domain when a production deployment is accidentally configured with localhost, but the environment variable should still be set explicitly.

## Verify after deployment

Open these public URLs:

- `https://thehouseoflabel.com/robots.txt`
- `https://thehouseoflabel.com/sitemap.xml`
- `https://thehouseoflabel.com/`

Confirm that canonical URLs and sitemap entries use `https://thehouseoflabel.com`, not localhost or another domain. Sitemap entries should not include pages marked noindex or products with `noIndex=true`.

## Google Search Console

1. Add and verify the **Domain** property `thehouseoflabel.com` using the DNS TXT record provided by Google Search Console.
2. Submit `https://thehouseoflabel.com/sitemap.xml`.
3. Inspect the homepage and key product URLs with URL Inspection.
4. Run **Test Live URL** and check that crawling is allowed and indexing is allowed.
5. Request indexing for the homepage and key product pages. Do not repeatedly request the same URL; monitor the Page Indexing report.

## Content work that requires approved business facts

- Replace all demo contact details with the real public phone, email and business address.
- Add the approved company story, actual production capabilities, materials and label types.
- Make each published product page unique: product name, application, material/adhesive options, printer/application compatibility and genuine specifications where relevant.
- Replace fictional customer examples and demo labels with approved customer information or remove them.
- Add the real city/region to titles and visible copy only after confirming the business location and service area.
- Keep the business name consistent: use the exact public brand name on the website, Google Business Profile and social profiles.

## Keyword guidance

Google does not use the `meta keywords` tag for ranking. Use one main search intent per page and include it naturally in the visible title, H1, introduction, useful product details and image alt text. Do not repeat terms unnaturally.

Examples to validate with the business owner and real products:

- printed labels
- unprinted label rolls
- thermal labels
- custom product labels
- barcode and shipping labels
- label manufacturer / label supplier + the actual service city or region

A sitemap, metadata or structured data does not guarantee indexing or a top ranking. Rankings depend on relevance, useful and original content, links/reputation, location and other systems outside the website code.
