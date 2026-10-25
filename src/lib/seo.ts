import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export function buildMetadata(title: string, description: string): Metadata {
  return {
    title: title === siteConfig.name ? title : `${title} | ${siteConfig.name}`,
    description,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      title,
      description,
      siteName: siteConfig.name,
      type: "website",
    },
  };
}
