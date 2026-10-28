# The House of Labels — backend and CMS foundation

This package is based on the supplied Next.js theme project and includes its `src/` and `prisma/` directories, plus the admin bootstrap script and environment example.

## Stack

- Next.js App Router route handlers and server actions
- PostgreSQL + Prisma
- Zod validation
- bcrypt password hashing and signed, HTTP-only, eight-hour admin session cookie (jose)
- Allow-listed, reusable CRUD API for products, categories, machines, industries, gallery, customer brands, page sections, SEO pages, quote inquiries and site settings

## Setup

1. Copy `.env.example` to `.env` and fill in PostgreSQL credentials, a random `AUTH_SECRET` (32+ chars), and a strong admin password.
2. Install packages: `npm install`
3. Generate Prisma client: `npx prisma generate`
4. Apply schema in development: `npx prisma migrate dev --name cms_backend`
5. Create the first admin: `npm run admin:create`
6. Start: `npm run dev`, then open `/admin/login`.

For Prisma 6, the generated client output is configured in `prisma/schema.prisma`. If the project uses a different Prisma major version, align the generator and datasource configuration before generating.

## CRUD API

All admin endpoints require a valid session cookie:

- `GET /api/admin/{resource}?page=1&limit=20&q=search`
- `POST /api/admin/{resource}`
- `GET /api/admin/{resource}/{id}`
- `PATCH /api/admin/{resource}/{id}`
- `DELETE /api/admin/{resource}/{id}`

Resources: `products`, `categories`, `machines`, `industries`, `gallery`, `brands`, `pages`, `seo`, `inquiries`, `settings`.

`POST` and `PATCH` accept the resource's full validated object (not arbitrary partial fields); see `src/lib/validation.ts`. Product records require an existing `categoryId`. Inquiry updates accept `status` and `adminNotes` only. `EDITOR` can edit website content but cannot edit inquiries or settings. `ADMIN` and `SUPER_ADMIN` can write all allow-listed resources.

Public quote submissions continue at `POST /api/inquiries` and do not require an admin session.

## SEO

Product records support `seoTitle`, `seoDescription`, `canonicalUrl`, `ogImageUrl` and `noIndex`; page sections support SEO title/description; `SeoPage` stores path-level canonical/Open Graph/noindex rules. The existing `robots.ts` and `sitemap.ts` remain in place. To fully apply `SeoPage` records to every route, connect them to each route's `generateMetadata` function (metadata for product details already reads product-level SEO title/description).

## Production checklist

- Use HTTPS and a unique production `AUTH_SECRET`; never commit `.env`.
- Add rate limiting and CAPTCHA/honeypot controls to public quote submission.
- Add an object-storage upload flow (e.g. S3-compatible storage) rather than accepting arbitrary upload bytes in route handlers; validate image MIME types and size.
- Add CSRF/origin checks for state-changing API calls if you expose cookie-authenticated APIs to third-party origins. Keep same-site cookies and same-origin usage.
- Add audit logs, database backups, monitoring, error reporting and tests.
- Restrict admin account creation to trusted operators; rotate secrets and enforce strong passwords.
- Admin screens in this package expose module entry pages; the API CRUD endpoints are implemented, but a full interactive CRUD table/form UI and image uploader still need to be wired to them.
