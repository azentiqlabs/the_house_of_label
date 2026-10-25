import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
export function buildMetadata(title: string, description: string, options: { canonical?: string; image?: string; noIndex?: boolean } = {}): Metadata {
 const fullTitle = title === siteConfig.name ? title : `${title} | ${siteConfig.name}`;
 return { title: fullTitle, description, metadataBase: new URL(siteConfig.url), alternates: options.canonical ? { canonical: options.canonical } : undefined,
 robots: options.noIndex ? { index: false, follow: false } : { index: true, follow: true },
 openGraph: { title: fullTitle, description, siteName: siteConfig.name, type: "website", images: options.image ? [options.image] : undefined },
 twitter: { card: options.image ? "summary_large_image" : "summary", title: fullTitle, description, images: options.image ? [options.image] : undefined } };
}
