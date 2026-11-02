import type { Metadata } from "next";
import "./globals.css";
import "./theme.css";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `The House Of Label | Official Website – Custom Label Printer in Sanaswadi`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // Meta keywords are included for completeness, but Google does not use this
  // tag as a ranking signal. Keep the terms relevant and avoid keyword stuffing.
  keywords: [
    "The House Of Label",
    "The House of Labels",
    "The House Of Label official website",
    "custom label printer Sanaswadi",
    "custom printed labels Maharashtra",
    "product packaging labels",
    "thermal labels",
    "barcode labels",
    "QR code stickers",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `The House Of Label | Official Website – Custom Label Printer in Sanaswadi`,
    description: siteConfig.description,
    url: siteConfig.url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
