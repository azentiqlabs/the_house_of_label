import { Footer } from "@/components/website/footer";
import { Header } from "@/components/website/header";
import { getSiteSettings } from "@/lib/home-content";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <>
      <Header settings={settings} />
      {children}
      <Footer settings={settings} />
    </>
  );
}
