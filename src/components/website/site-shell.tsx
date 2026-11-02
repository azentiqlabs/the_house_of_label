import { Footer } from "@/components/website/footer";
import { Header } from "@/components/website/header";
import { getSiteSettings } from "@/lib/home-content";
import { siteConfig } from "@/lib/site";

function cleanSetting(value?: string): string | undefined {
  const text = value?.trim();
  if (!text || /demo|example\.com|xxxxx|to be added|your-domain/i.test(text)) return undefined;
  return text;
}

function toAbsoluteUrl(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    return new URL(value, siteConfig.url).toString();
  } catch {
    return undefined;
  }
}

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const name = cleanSetting(settings.site_name) || siteConfig.name;
  const email = cleanSetting(settings.contact_email);
  const phone = cleanSetting(settings.contact_phone);
  const address = cleanSetting(settings.contact_address);
  const logo = toAbsoluteUrl(cleanSetting(settings.site_logo_url) || "/theme/THE_HOUSE_OF_LABEL_LOGO02.png");

  const organization = {
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name,
    url: siteConfig.url,
    description: siteConfig.description,
    ...(logo ? { logo } : {}),
    ...(address ? { address: { "@type": "PostalAddress", streetAddress: address.replace(/\s*\n\s*/g, ", ") } } : {}),
    ...(email || phone
      ? { contactPoint: [{ "@type": "ContactPoint", contactType: "sales", ...(email ? { email } : {}), ...(phone ? { telephone: phone } : {}) }] }
      : {}),
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name,
        publisher: { "@id": `${siteConfig.url}/#organization` },
        inLanguage: "en-IN",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <Header settings={settings} />
      {children}
      <Footer settings={settings} />
    </>
  );
}
