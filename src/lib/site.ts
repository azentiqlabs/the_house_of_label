const PRODUCTION_SITE_URL = "https://thehouseoflabel.com";
const LOCAL_SITE_URL = "http://localhost:3000";

function resolveSiteUrl(): string {
  const configured = process.env.SITE_URL?.trim();
  const fallback =
    process.env.NODE_ENV === "production"
      ? PRODUCTION_SITE_URL
      : LOCAL_SITE_URL;

  if (!configured) return fallback;

  try {
    const parsed = new URL(configured);
    const isLocal =
      parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
    // Never publish a local development URL as the production canonical host.
    if (process.env.NODE_ENV === "production" && isLocal)
      return PRODUCTION_SITE_URL;
    if (
      process.env.NODE_ENV === "production" &&
      parsed.hostname.replace(/^www\./, "") === "thehouseoflabel.com"
    ) {
      return PRODUCTION_SITE_URL;
    }
    return parsed.origin;
  } catch {
    return fallback;
  }
}

export const siteConfig = {
  name: "The House Of Label",
  description:
    "The House Of Label is a label printing business based at L & T Phata, Bharat Gass Road, Sanaswadi, Maharashtra 412208, India. Explore custom printed product labels, packaging labels, personal care labels, thermal labels, barcode labels and QR code stickers.",
  url: resolveSiteUrl(),
  address: {
    streetAddress: "L & T Phata, Bharat Gass Road",
    addressLocality: "Sanaswadi",
    addressRegion: "Maharashtra",
    postalCode: "412208",
    addressCountry: "IN",
  },
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
};

export const navLinks = [{ label: "Home", href: "/" }];
