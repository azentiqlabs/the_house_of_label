"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { setting: "nav_home", label: "Home", section: "home" },
  { setting: "nav_about", label: "About Us", section: "about" },
  { setting: "nav_what_we_do", label: "What We Do", section: "what-we-do" },
  { setting: "nav_products", label: "Products", section: "products" },
  { setting: "nav_machines", label: "Our Machines", section: "machines" },
  { setting: "nav_industries", label: "Industries", section: "industries" },
  { setting: "nav_gallery", label: "Gallery", section: "gallery" },
  { setting: "nav_contact", label: "Contact", section: "contact" },
];

type Props = { settings: Record<string, string> };

export function Header({ settings }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const siteName = settings.site_name || "The House of Labels";
  const logo = settings.site_logo_url || "/theme/THE_HOUSE_OF_LABEL_LOGO02.png";
  const isHome = pathname === "/";

  return (
    <header className="topbar">
      <div className="container nav">
        <Link className="brand" href="/#home" aria-label={`${siteName} home`} onClick={() => setMenuOpen(false)}>
          <img src={logo} alt={siteName} />
        </Link>
        <nav className={`navlinks ${menuOpen ? "open" : ""}`} id="navlinks" aria-label="Main navigation">
          {navLinks.map((link, index) => (
            <Link
              href={isHome ? `#${link.section}` : `/#${link.section}`}
              key={link.section}
              className={index === 0 && isHome ? "active" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {settings[link.setting] || link.label}
            </Link>
          ))}
        </nav>
        <a className="btn btn-orange header-quote" href={isHome ? "#contact" : "/#contact"}>
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
