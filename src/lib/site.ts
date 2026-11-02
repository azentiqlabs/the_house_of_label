const PRODUCTION_SITE_URL = "https://thehouseoflabel.com";
const LOCAL_SITE_URL = "http://localhost:3000";

function resolveSiteUrl(): string {
  const configured = process.env.SITE_URL?.trim();
  const fallback = process.env.NODE_ENV === "production"
    ? PRODUCTION_SITE_URL
    : LOCAL_SITE_URL;

  if (!configured) return fallback;

  try {
    const parsed = new URL(configured);
    const isLocal = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
    // A copied .env.example must never publish localhost as the production canonical host.
    if (process.env.NODE_ENV === "production" && isLocal) return PRODUCTION_SITE_URL;
    if (process.env.NODE_ENV === "production" && parsed.hostname === "thehouseoflabel.com") {
      return PRODUCTION_SITE_URL;
    }
    return parsed.origin;
  } catch {
    return fallback;
  }
}

export const siteConfig = {
  name: "The House of Labels",
  description:
    "The House of Labels is a custom label printer in Sanaswadi, Maharashtra, providing printed label solutions for product packaging, barcodes, shipping and identification applications.",
  url: resolveSiteUrl(),
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Machines", href: "/machines" },
  { label: "Industries", href: "/industries" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];
