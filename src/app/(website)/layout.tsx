import { SiteShell } from "@/components/website/site-shell";

// Page content and settings are CMS-managed in PostgreSQL, so render the public
// site on each request instead of freezing database content at build time.
export const dynamic = "force-dynamic";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell>{children}</SiteShell>;
}
