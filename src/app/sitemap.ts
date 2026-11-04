import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/**
 * The current public site is a single-page website. Product information is
 * displayed on the homepage and there are no public product-detail routes yet.
 * Add a URL here only after a corresponding public, indexable route exists.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteConfig.url.replace(/\/$/, "")}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
