import type { Metadata } from "next";
import "./globals.css";
import "./theme.css";
import { siteConfig } from "@/lib/site";

const homeTitle =  "The House Of Label | Custom Label Printing in Sanaswadi, Maharashtra";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: homeTitle,
    template: `%s | ${siteConfig.name}`,
  },
  applicationName: siteConfig.name,
  description: siteConfig.description,
  keywords: [
    "The House Of Label",
    "The House Of Label Sanaswadi",
    "label printing Sanaswadi",
    "custom label printing Maharashtra",
    "printed product labels",
    "product packaging labels",
    "thermal labels",
    "barcode labels",
    "QR code stickers",
  ],
  alternates: {
    canonical: "/",
  },
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
    locale: "en_IN",
    siteName: siteConfig.name,
    title: homeTitle,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      {
        url: "/theme/THE_HOUSE_OF_LABEL_LOGO02.png",
        alt: "The House Of Label logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: siteConfig.description,
    images: ["/theme/THE_HOUSE_OF_LABEL_LOGO02.png"],
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
