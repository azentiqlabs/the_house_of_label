import Link from "next/link";
import { navLinks, siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-[#071b31] py-8 text-white">
      <div className="container flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <Link href="/" className="text-sm font-extrabold">
          {siteConfig.name}
          <span className="mt-1 block text-[9px] tracking-[.2em] text-slate-300">
            LABELS THAT YOU BETTER
          </span>
        </Link>
        <nav className="flex flex-wrap gap-4">
          {navLinks
            .filter((x) => x.href !== "/")
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-slate-200 hover:text-orange-300"
              >
                {link.label}
              </Link>
            ))}
        </nav>
        <p className="text-xs text-slate-300">
          © {new Date().getFullYear()} The House of Labels.
        </p>
      </div>
    </footer>
  );
}
