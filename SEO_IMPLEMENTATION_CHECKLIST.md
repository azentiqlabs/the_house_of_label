# The House Of Label — SEO implementation checklist

Business details used in this release:
- Official business name: The House Of Label
- Business activity: Label printing only
- Address: L & T Phata, Bharat Gass Road, Sanaswadi, Maharashtra 412208, India
- Website: https://thehouseoflabel.com
- Google Business Profile: already created and verified

## Changes made in the code

- Standardized the website brand spelling to `The House Of Label` in SEO metadata and structured data.
- Updated the default homepage SEO title and description for label printing in Sanaswadi.
- Removed the duplicate homepage JSON-LD block; the public site shell now publishes one LocalBusiness + WebSite graph.
- Added the owner-confirmed postal address to LocalBusiness structured data.
- Added relevant label-printing services/topics and Sanaswadi/Maharashtra service area without inventing phone, hours, coordinates, ratings or reviews.
- Added canonical homepage metadata, Open Graph and Twitter preview metadata.
- Normalized legacy CMS title variants that say `The House Of Labels` to the official singular brand spelling in generated metadata.
- Updated default homepage copy to describe label printing, not label manufacturing.
- Kept the sitemap limited to the real public homepage. The current project does not contain public product-detail routes, so listing guessed product URLs would create sitemap errors.
- Kept admin and API paths disallowed in robots.txt.

## Before deployment

1. Confirm the production site loads on `https://thehouseoflabel.com` and redirects any `http://` or `www` version to that canonical HTTPS hostname.
2. Confirm the website's visible header/footer brand name is `The House Of Label` in the CMS Site Settings.
3. In Admin → Home Content, update the Home Hero title to `The House Of Label | Custom Label Printing in Sanaswadi` (or an equivalent natural heading), and ensure the visible H1 contains the brand and label-printing service.
4. In Admin → SEO, edit the `/` entry if one exists. Set title to `The House Of Label | Custom Label Printing in Sanaswadi, Maharashtra`; description to: `The House Of Label provides custom printed product, packaging, personal care, thermal and barcode label solutions in Sanaswadi, Maharashtra. Contact us for label printing enquiries.`; canonical URL to `https://thehouseoflabel.com/`; turn off `noIndex` for the homepage.
5. Check Site Settings for the exact business address: `L & T Phata, Bharat Gass Road, Sanaswadi, Maharashtra 412208, India`.
6. Ensure the phone number, email, opening hours and map pin in the website and Google Business Profile are current and identical. Do not add placeholders.
7. Verify all sample customer logos/content have been replaced or approved before publishing.

## Google Search Console

1. Open https://search.google.com/search-console.
2. Add/verify the Domain property `thehouseoflabel.com` using DNS verification.
3. Submit `https://thehouseoflabel.com/sitemap.xml` under Sitemaps.
4. Use URL Inspection for `https://thehouseoflabel.com/` and request indexing after deployment.
5. Check Page indexing for crawl/indexing errors and Performance → Search results for queries such as `The House Of Label`, `The House Of Label Sanaswadi`, and `label printing Sanaswadi`.
6. Review the results over several weeks. A request for indexing is not a guarantee of immediate indexing or a particular ranking.

## Google Business Profile (already verified)

1. Keep the business name exactly `The House Of Label`, matching the real-world signage and branding. Do not add keywords or location to the business name.
2. Select the most accurate available primary category for the actual label-printing business. Add secondary categories only when they genuinely apply.
3. Confirm the address and map pin: L & T Phata, Bharat Gass Road, Sanaswadi, Maharashtra 412208.
4. Confirm website URL `https://thehouseoflabel.com/`, phone, business hours and service area.
5. Add current real photographs: logo, storefront/exterior, workplace, label samples, printed rolls and printing work. Do not use stock images as business photos.
6. Add/maintain services and products that are actually offered, using natural descriptions (e.g. printed product labels, packaging labels, barcode labels, thermal labels, QR code stickers only if offered).
7. Ask genuine customers for honest reviews after completed work and reply professionally. Never buy reviews or offer incentives for positive reviews.
8. Keep the business name, address and phone consistent on the website and reputable business directories.

## Validation after deployment

- `https://thehouseoflabel.com/robots.txt` loads and points to the sitemap.
- `https://thehouseoflabel.com/sitemap.xml` loads and contains only live, canonical public URLs.
- Homepage source contains one LocalBusiness JSON-LD entity with the exact business name and address.
- Validate structured data with https://validator.schema.org/.
- Test mobile usability and page performance with https://pagespeed.web.dev/.
- Test canonical and indexability in Google Search Console URL Inspection.

## Important scope note

This project currently renders a single public landing page. Product information is presented on that page; public product-detail routes are not implemented in this codebase. Add product URLs to the sitemap only after those public pages exist and return successful, indexable responses. Technical SEO improvements help Google understand the site but cannot guarantee a top position. Branded ranking also depends on crawl/index status, business-profile consistency, reputation, relevance, competition and user location.
