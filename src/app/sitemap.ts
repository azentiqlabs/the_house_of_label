import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The public website is a single landing page plus individual product detail
 * pages. Only include those real, indexable URLs in the sitemap.
 *
 * Do not list CMS/admin routes or placeholder pages such as About, Gallery,
 * Machines, Industries, Contact, or a Products index unless those pages are
 * intentionally published as separate SEO landing pages.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");

  const homepage: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  try {
    const products = await prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        noIndex: false,
      },
      select: {
        slug: true,
        updatedAt: true,
        canonicalUrl: true,
      },
    });

    const productPages: MetadataRoute.Sitemap = products
      .filter((product) => product.slug?.trim())
      .map((product) => ({
        // Keep the sitemap URL aligned with the product page canonical.
        url: product.canonicalUrl?.trim()
          ? product.canonicalUrl.trim()
          : `${base}/products/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: "monthly",
        priority: 0.8,
      }));

    return [...homepage, ...productPages];
  } catch (error) {
    console.error("Could not generate product sitemap entries:", error);
    // The homepage remains discoverable if the product database is unavailable.
    return homepage;
  }
}
