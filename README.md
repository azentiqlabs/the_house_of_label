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
- **Gallery**: edit image path, title, alt text, category and sort order.
- **Customer Brands**: control the scrolling customer/partner name strip. The seed includes fictional sample names so the design renders; replace them before publishing.
- **Site Settings**: manage company name, logo path, tagline, navigation labels, WhatsApp number, public phone/email/address and footer text.
- **SEO**: manage route-level SEO metadata. The homepage reads the `/` record; product details also use product SEO fields.
- **Quote Inquiries**: review submissions stored from the homepage quote form, change status and add internal notes.

### Image paths

The supplied theme images are in `public/theme/`. For example, set an image field to `/theme/image10.jpeg`. You can replace those files during development or store images at a trusted external URL. The current admin editor stores an image URL/path; it does not yet upload binary files to object storage.

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
