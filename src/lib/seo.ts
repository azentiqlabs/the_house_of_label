import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";

export type SeoFallback = {
  title: string;
  description: string;
  image?: string | null;
  canonical?: string;
  noIndex?: boolean;
};

/** Metadata defaults used by public routes when an SEO entry has not been created yet. */
export function buildMetadata(
  title: string,
  description: string,
  options: { canonical?: string; image?: string; noIndex?: boolean } = {},
): Metadata {
  return buildMetadataValues({
    title,
    description,
    image: options.image,
    canonical: options.canonical,
    noIndex: options.noIndex,
  });
}

function normalizeBrandName(value: string): string {
  return value.replace(/the house of labels/gi, siteConfig.name);
}

function buildMetadataValues(values: SeoFallback): Metadata {
  const cleanTitle = normalizeBrandName(values.title.trim());
  const fullTitle =
    cleanTitle.toLowerCase() === siteConfig.name.toLowerCase() ||
    cleanTitle.toLowerCase().includes(siteConfig.name.toLowerCase())
      ? cleanTitle
      : `${cleanTitle} | ${siteConfig.name}`;
  const image = values.image || "/theme/THE_HOUSE_OF_LABEL_LOGO02.png";
  const canonical = values.canonical || "/";

  return {
    title: { absolute: fullTitle },
    description: normalizeBrandName(values.description),
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical },
    robots: values.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description: normalizeBrandName(values.description),
      siteName: siteConfig.name,
      type: "website",
      url: canonical,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: normalizeBrandName(values.description),
      images: [image],
    },
  };
}

/**
 * Loads editable SEO settings for a public route. The configured brand spelling
 * is normalized so legacy CMS entries cannot publish a plural brand variant.
 */
export async function getManagedMetadata(
  routePath: string,
  fallback: SeoFallback,
): Promise<Metadata> {
  try {
    const record = await prisma.seoPage.findUnique({
      where: { path: routePath },
      select: {
        title: true,
        description: true,
        canonicalUrl: true,
        ogImageUrl: true,
        noIndex: true,
      },
    });

    if (record) {
      return buildMetadataValues({
        title: record.title || fallback.title,
        description: record.description || fallback.description,
        image: record.ogImageUrl || fallback.image,
        canonical: record.canonicalUrl || fallback.canonical || routePath,
        noIndex: Boolean(record.noIndex || fallback.noIndex),
      });
    }
  } catch {
    // Keep public pages available while the database is being configured.
  }

  return buildMetadataValues({
    ...fallback,
    canonical: fallback.canonical || routePath,
  });
}
