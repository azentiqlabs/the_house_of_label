import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const staticRoutes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/products", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/machines", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/industries", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/gallery", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");

  try {
    const [seoRows, products] = await Promise.all([
      prisma.seoPage.findMany({
        select: { path: true, noIndex: true, updatedAt: true },
      }),
      prisma.product.findMany({
        where: { status: "PUBLISHED", noIndex: false },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const seoByPath = new Map<string, (typeof seoRows)[number]>(seoRows.map((row) => [row.path, row] as const));
    const noIndexPaths = new Set(seoRows.filter((row) => row.noIndex).map((row) => row.path));

    const publicPages: MetadataRoute.Sitemap = staticRoutes
      .filter((route) => !noIndexPaths.has(route.path))
      .map((route) => {
        const seo = seoByPath.get(route.path);
        return {
          url: `${base}${route.path === "/" ? "" : route.path}`,
          ...(seo?.updatedAt ? { lastModified: seo.updatedAt } : {}),
          changeFrequency: route.changeFrequency,
          priority: route.priority,
        };
      });

    const publicProducts: MetadataRoute.Sitemap = products
      .filter((product) => !noIndexPaths.has(`/products/${product.slug}`))
      .map((product) => ({
        url: `${base}/products/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }));

    return [...publicPages, ...publicProducts];
  } catch (error) {
    console.error("Could not generate the dynamic sitemap:", error);
    // Keep core public pages discoverable during a temporary database outage.
    return staticRoutes
      .filter((route) => !["/admin", "/api"].includes(route.path))
      .map((route) => ({
        url: `${base}${route.path === "/" ? "" : route.path}`,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      }));
  }
}
