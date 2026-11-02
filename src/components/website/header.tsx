"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { setting: "nav_home", label: "Home", href: "/" },
  { setting: "nav_about", label: "About Us", href: "/about" },
  { setting: "nav_what_we_do", label: "What We Do", href: "/#what-we-do" },
  { setting: "nav_products", label: "Products", href: "/products" },
  { setting: "nav_machines", label: "Our Machines", href: "/machines" },
  { setting: "nav_industries", label: "Industries", href: "/industries" },
  { setting: "nav_gallery", label: "Gallery", href: "/gallery" },
  { setting: "nav_contact", label: "Contact", href: "/contact" },
];

type Props = { settings: Record<string, string> };

export function Header({ settings }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const siteName = settings.site_name || "The House of Labels";
  const logo = settings.site_logo_url || "/theme/THE_HOUSE_OF_LABEL_LOGO02.png";

  return (
    <header className="topbar">
      <div className="container nav">
        <Link className="brand" href="/" aria-label={`${siteName} home`} onClick={() => setMenuOpen(false)}>
          <img src={logo} alt={siteName} />
        </Link>
        <nav className={`navlinks ${menuOpen ? "open" : ""}`} id="navlinks" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className={pathname === link.href ? "active" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {settings[link.setting] || link.label}
            </Link>
          ))}
        </nav>
        <a className="btn btn-orange header-quote" href="/contact#quote">
          {settings.header_quote_text || "Request a Quote"} <span aria-hidden="true">→</span>
        </a>
        <button
          type="button"
          className="menu-toggle"
          id="menuToggle"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </div>
    </header>
  );
}
