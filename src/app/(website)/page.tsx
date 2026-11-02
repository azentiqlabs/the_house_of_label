import type { Metadata } from "next";
import { HomePage } from "@/components/website/homepage";
import { getHomeData } from "@/lib/home-content";
import { getManagedMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomeData();
  const hero = data.sections.home_hero;
  return getManagedMetadata("/", {
    title: data.settings.site_name || siteConfig.name,
    description: hero?.description || siteConfig.description,
    image: hero?.imageUrl,
    canonical: "/",
  });
}

export default async function WebsiteHomePage() {
  const data = await getHomeData();
  return <HomePage data={data} />;
}
