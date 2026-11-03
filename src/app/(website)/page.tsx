import type { Metadata } from "next";
import { HomePage } from "@/components/website/homepage";
import { getHomeData } from "@/lib/home-content";
import { getManagedMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomeData();
  const hero = data.sections.home_hero;
  return getManagedMetadata("/", {
    title:
      hero?.seoTitle?.trim() ||
      "The House Of Label | Custom Label Printer in Sanaswadi",
    description:
      hero?.seoDescription?.trim() ||
      hero?.description ||
      siteConfig.description,
    image: hero?.imageUrl,
    canonical: "/",
  });
}

export default async function WebsiteHomePage() {
  const data = await getHomeData();
  const businessSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        name: "The House Of Label",
        url: `${siteConfig.url}/`,
      },
      {
        "@type": "LocalBusiness",
        "@id": `${siteConfig.url}/#business`,
        name: "The House Of Label",
        url: `${siteConfig.url}/`,
        description: siteConfig.description,
        address: {
          "@type": "PostalAddress",
          streetAddress: "L & T Phata, Bharat Gass Road",
          addressLocality: "Sanaswadi",
          addressRegion: "Maharashtra",
          postalCode: "412208",
          addressCountry: "IN",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(businessSchema).replace(/</g, "\\u003c"),
        }}
      />
      <HomePage data={data} />
    </>
  );
}
