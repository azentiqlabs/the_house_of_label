import Link from "next/link";
import { navLinks, siteConfig } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="container flex min-h-20 items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label={siteConfig.name}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-lg font-black text-white">
            H
          </span>
          <span>
            <span className="block text-sm font-extrabold text-slate-900">
              The House of Labels
            </span>
            <span className="block text-[9px] font-bold tracking-[.22em] text-slate-500">
              LABELS THAT YOU BETTER
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-5 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-semibold text-slate-700 transition hover:text-orange-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/contact#quote" className="btn btn-primary text-xs">
          Request a Quote ↗
        </Link>
      </div>
    </header>
  );
}
