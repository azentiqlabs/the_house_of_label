import type { Metadata } from "next";
import { HomePage } from "@/components/website/homepage";
import { getHomeData } from "@/lib/home-content";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomeData();
  let seo: { title: string; description: string; canonicalUrl: string | null; ogImageUrl: string | null; noIndex: boolean } | null = null;
  try {
    seo = await prisma.seoPage.findUnique({ where: { path: "/" }, select: { title: true, description: true, canonicalUrl: true, ogImageUrl: true, noIndex: true } });
  } catch {
    // The public page still renders with its CMS defaults while the database is being set up.
  }
  const hero = data.sections.home_hero;
  const title = seo?.title || data.settings.site_name || siteConfig.name;
  const description = seo?.description || hero?.description || siteConfig.description;
  return {
    title,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : { canonical: "/" },
    robots: seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: { title, description, siteName: data.settings.site_name || siteConfig.name, type: "website", images: seo?.ogImageUrl ? [seo.ogImageUrl] : hero?.imageUrl ? [hero.imageUrl] : undefined },
    twitter: { card: "summary_large_image", title, description, images: seo?.ogImageUrl ? [seo.ogImageUrl] : hero?.imageUrl ? [hero.imageUrl] : undefined },
  };
}

export default async function WebsiteHomePage() {
  const data = await getHomeData();
  return <HomePage data={data} />;
}
