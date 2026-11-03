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
    // A copied .env.example must never publish localhost as the production canonical host.
    if (process.env.NODE_ENV === "production" && isLocal)
      return PRODUCTION_SITE_URL;
    if (
      process.env.NODE_ENV === "production" &&
      parsed.hostname === "thehouseoflabel.com"
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
    "The House Of Label is a custom label printing business in Sanaswadi, Maharashtra, India, offering printed product packaging labels, personal care labels, QR code stickers, thermal labels, barcode labels, shipping labels, and identification labels.",
  url: resolveSiteUrl(),
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
};

export const navLinks = [{ label: "Home", href: "/" }];
