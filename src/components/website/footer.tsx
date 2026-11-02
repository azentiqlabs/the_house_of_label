import Link from "next/link";

type Props = { settings: Record<string, string> };

export function Footer({ settings }: Props) {
  const siteName = settings.site_name || "The House of Labels";
  const note = settings.footer_note || "All rights reserved.";
  const logo = settings.site_logo_url || "/theme/THE_HOUSE_OF_LABEL_LOGO02.png";

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Link href="/" className="brand" aria-label={`${siteName} home`}>
            <img src={logo} alt={siteName} />
        </Link>
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/products">Products</a>
          <a href="/machines">Machines</a>
          <a href="/industries">Industries</a>
          <a href="/contact">Contact</a>
        </div>
        {/* <span>© {new Date().getFullYear()} {siteName}. {note}</span> */}
        <span>© {siteName}. {note}</span>
      </div>
    </footer>
  );
}

