import { Header } from "@/components/website/header";
import { Footer } from "@/components/website/footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
