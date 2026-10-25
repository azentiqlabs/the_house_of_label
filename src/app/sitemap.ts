import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/products",
    "/machines",
    "/industries",
    "/gallery",
    "/contact",
  ];
  const base = siteConfig.url.replace(/\/$/, "");
  let productRoutes: { slug: string; updatedAt: Date }[] = [];
  try {
    productRoutes = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });
  } catch {}
  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...productRoutes.map((product) => ({
      url: `${base}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
