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

function buildMetadataValues(values: SeoFallback): Metadata {
  const fullTitle = values.title === siteConfig.name
    ? values.title
    : `${values.title} | ${siteConfig.name}`;
  const image = values.image || undefined;
  return {
    title: { absolute: fullTitle },
    description: values.description,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: values.canonical || "/" },
    robots: values.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description: values.description,
      siteName: siteConfig.name,
      type: "website",
      url: values.canonical,
      images: image ? [image] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: fullTitle,
      description: values.description,
      images: image ? [image] : undefined,
    },
  };
}

/**
 * Loads a page's editable SEO settings at request time. The SEO admin screen
 * stores one record per public route; when no record exists, route defaults
 * supplied by the page are used instead.
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
        // A page-level noIndex flag is a safety override: SEO records must not
        // accidentally make an explicitly hidden product indexable.
        noIndex: Boolean(record.noIndex || fallback.noIndex),
      });
    }
  } catch {
    // Keep public pages available while the database is being configured.
  }

  return buildMetadataValues({ ...fallback, canonical: fallback.canonical || routePath });
}
