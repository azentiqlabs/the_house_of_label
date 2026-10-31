# The House of Labels — Next.js CMS Website

The supplied HTML/CSS theme is now integrated into the Next.js App Router project using TypeScript, PostgreSQL and Prisma. The public homepage keeps the supplied light-blue theme, imagery, product/gallery filters, machinery selector, scrolling partner strip and responsive navigation.

## Start locally

1. Copy `.env.example` to `.env` and enter your PostgreSQL connection string, a strong `AUTH_SECRET`, and admin account values.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate the Prisma client and apply the existing migrations:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```
4. Create the admin account and populate the starter content:
   ```bash
   npm run admin:create
   npm run cms:seed
   ```
5. Start Next.js:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:3000` for the website and `http://localhost:3000/admin/login` for the admin area.

## Manage the theme from the admin area

- **Pages**: edit homepage text, headings, feature cards, vision/mission/strength cards, section visibility and button links. Theme section keys start with `home_`; edit the existing key rather than creating a new one if you want to replace existing content.
- **Products / Categories**: edit product names, descriptions, images, category and publication status.
- **Machines** and **Industries**: edit the homepage machine selector and industry cards.
- **Gallery**: upload photos, set titles and accessible descriptions, choose a category, and set display order.
- **Customer Brands**: upload customer or partner logos and control their order. The seed includes fictional sample names so the design renders; replace them before publishing.
- **Site Settings**: manage company name, upload the site logo, and edit tagline, navigation labels, WhatsApp number, public phone/email/address and footer text.
- **SEO**: manage route-level SEO metadata. The homepage reads the `/` record; product details also use product SEO fields.
- **Quote Inquiries**: review submissions stored from the homepage quote form, change status and add internal notes.

### Images and uploads

The supplied theme images are in `public/theme/`. In the admin editor, use the image upload area to choose a JPG, PNG, WebP or GIF file, drag a file into the upload area, preview it, replace it, or remove it. Uploaded images are stored locally in `public/uploads/` during development. When deployed to Vercel, connect a Public Vercel Blob store and configure `BLOB_READ_WRITE_TOKEN` so uploaded files remain available after deployment. Existing theme assets and trusted image URLs can still be used through the optional image URL field.

### Before publishing

Replace the sample contact details, configure a real WhatsApp number in Site Settings, and replace/remove the fictional customer strip names. Verify that product descriptions, imagery, factory/machinery photos and all business claims are approved by the client.

## Useful commands

- `npm run dev` — local development server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npx prisma generate` — regenerate the typed Prisma client
- `npx prisma migrate deploy` — apply committed migrations
- `npm run admin:create` — create/update the configured admin account
- `npm run cms:seed` — insert missing starter content without overwriting content already edited in the database


## Admin image uploads

The admin panel includes file upload and image previews for image fields. Run `npm install` to install the Vercel Blob SDK added for persistent uploads. For local development, uploads fall back to `public/uploads/`. For Vercel, create a Public Blob store and configure the server-only `BLOB_READ_WRITE_TOKEN`; see `BACKEND_SETUP.md`.
