# The House of Labels — backend and CMS

## Stack

- Next.js App Router, React and TypeScript
- PostgreSQL + Prisma
- Zod-validated, allow-listed resource APIs
- bcrypt password hashing and signed, HTTP-only, eight-hour admin session cookie (jose)
- Admin forms/tables for products, categories, machines, industries, gallery, customer brands, page sections, SEO, inquiries and site settings

## Setup

1. Copy `.env.example` to `.env` and fill in `DATABASE_URL`, a random `AUTH_SECRET` (32+ characters), and a strong admin password.
2. Install packages: `npm install`
3. Generate Prisma client and apply migrations:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```
4. Create the admin user: `npm run admin:create`
5. Seed initial theme content: `npm run cms:seed`
6. Run `npm run dev`; sign in at `/admin/login`.

The content seed is idempotent for existing records: it creates missing starter records but does not overwrite rows already in the database. Existing admin edits are therefore preserved when the seed script runs again.

## Admin resources

All `/api/admin/{resource}` endpoints require an authenticated admin session and validate writes against `src/lib/validation.ts`:

- `products`, `categories`, `machines`, `industries`, `gallery`, `brands`, `pages`, `seo`, `inquiries`, `settings`
- `GET /api/admin/{resource}?page=1&limit=20&q=search`
- `POST /api/admin/{resource}`
- `GET /api/admin/{resource}/{id}`
- `PATCH /api/admin/{resource}/{id}`
- `DELETE /api/admin/{resource}/{id}`

`POST` and `PATCH` accept the resource's full validated object, not arbitrary partial fields. Product records require an existing `categoryId`. Inquiry edits accept `status` and `adminNotes` only. `EDITOR` can edit website content but cannot edit inquiries or settings. `ADMIN` and `SUPER_ADMIN` can write all allow-listed resources.

Public quote submissions are stored through `POST /api/inquiries` and do not require an admin session.

## Dynamic homepage content

- `PageContent` rows whose keys start with `home_` control the text sections and card content. Set `status` to `PUBLISHED` to show content; `DRAFT` hides it.
- The `Product`, `Machine`, `Industry`, `GalleryItem` and `CustomerBrand` models control their respective lists.
- `SiteSetting` controls branding, navigation labels and contact details.
- The `_system_home_seeded` flag tells the public page that the starter content has been initialized. The admin UI hides that internal setting.

## SEO and image management

The homepage reads `SeoPage` at path `/`; product details use product-level title/description and image fields. Use a full URL or a public asset path such as `/theme/image10.jpeg` for images. The project does not yet include a binary image-upload service. For production uploads, configure an object-storage provider and enforce file-size/MIME-type validation rather than writing uploads to the app filesystem.

## Production checklist

- Use HTTPS and a unique production `AUTH_SECRET`; do not commit `.env`.
- Replace demo customer names and contact details before public launch.
- Add rate limiting and CAPTCHA/honeypot controls to public quote submission.
- Add object-storage image upload, database backups, audit logs, monitoring, error reporting and automated tests.
- Restrict admin account creation and enforce strong passwords.


## Admin image uploads

The admin editor supports image uploads for product photos, product galleries, machine photos, industry images, gallery items, customer logos, social-sharing images, and the site logo setting. Accepted formats are JPG/JPEG, PNG, WebP, and GIF; each upload is limited to 4 MB. SVG files are intentionally not accepted.

### Local development

If `BLOB_READ_WRITE_TOKEN` is not set, image uploads are saved under `public/uploads/` and returned as `/uploads/<generated-file-name>`. The route requires an authenticated admin session and checks the file signature before saving.

### Vercel deployment

Do not rely on the local filesystem for uploaded media on Vercel. Create a **Public Vercel Blob** store for the project, connect it to the project environment, and make sure `BLOB_READ_WRITE_TOKEN` is available to the server. The upload route will then store images in Blob and save their public URL in the existing CMS fields. The token must remain server-side and must not use a `NEXT_PUBLIC_` prefix. Install the added dependency by running `npm install` after pulling/extracting this version.
