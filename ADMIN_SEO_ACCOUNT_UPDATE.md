# Admin UX, SEO and account settings update

This update adds:

- A friendly SEO editor with standard page presets, Google-style search preview, social sharing image upload, canonical URL and no-index controls.
- Request-time SEO metadata on the homepage, About, Products, Machines, Industries, Gallery, Contact, and product detail routes. SEO records saved in `SeoPage` are now used by public page metadata.
- A visual Page Sections editor that groups homepage content into understandable sections and hides internal `sectionKey` values.
- Account Settings for changing the admin display name, sign-in email, and password. Changes require the current password.
- Session versioning. A password change invalidates other existing admin sessions while refreshing the session in the browser making the change.

## Deployment steps

1. Back up the production PostgreSQL database and keep a copy of the current release.
2. Deploy these source changes to the project.
3. Install dependencies using the existing lockfile: `npm ci`.
4. Apply the database migration: `npx prisma migrate deploy` (or `npm run prisma:migrate:deploy`).
5. Regenerate Prisma Client: `npx prisma generate`.
6. Build and publish the new Next.js release: `npm run build`, then restart the application using the hosting provider's normal deployment workflow.
7. Sign in again. Existing admin sessions created before this update are intentionally retired once because the session token now includes a session version.
8. Open `/admin/dashboard/seo`, `/admin/dashboard/pages`, and `/admin/dashboard/account` to use the new screens.

## Account security notes

- The current password is required for changing the profile email/name and for changing the password.
- New passwords must contain at least 12 characters.
- Changing a password increments `AdminUser.sessionVersion`, invalidating previously issued admin tokens.
- Email changes take effect immediately after current-password confirmation and the new address must be entered twice. Changing the email also invalidates other sessions. Email ownership verification is not included because the project does not currently have an email-verification workflow configured. Add a verification flow before using self-service email changes in a high-security environment.

## SEO notes

- Standard page defaults are used until a custom `SeoPage` record is saved.
- SEO settings take effect through Next.js metadata generation on the next request after deployment/database save.
- Search engine re-crawling can take time; metadata changes do not guarantee rankings or immediate search snippet changes.
- Product detail pages can have route-specific SEO overrides by adding a path such as `/products/printed-labels` in SEO settings. Product-level SEO fields remain available in the product editor as fallbacks.
