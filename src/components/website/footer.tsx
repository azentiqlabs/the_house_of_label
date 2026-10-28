import Link from "next/link";

type Props = { settings: Record<string, string> };

export function Footer({ settings }: Props) {
  const siteName = settings.site_name || "The House of Labels";
  const tagline = settings.site_tagline || "LABELS THAT RUN BETTER";
  const note = settings.footer_note || "All rights reserved.";

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Link href="/#home" className="brand" aria-label={`${siteName} home`}>
          <span className="brand-mark">H</span>
          <span className="brand-name">{siteName}<small>{tagline}</small></span>
        </Link>
        <div className="footer-links">
          <a href="/#about">About</a>
          <a href="/#products">Products</a>
          <a href="/#machines">Machines</a>
          <a href="/#industries">Industries</a>
          <a href="/#contact">Contact</a>
        </div>
        <span>© {new Date().getFullYear()} {siteName}. {note}</span>
      </div>
    </footer>
  );
}
