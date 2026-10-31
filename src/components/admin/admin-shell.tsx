"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ChevronRight,
  ExternalLink,
  Factory,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Package,
  PanelsTopLeft,
  Search,
  Settings2,
  Tags,
  UsersRound,
  X,
} from "lucide-react";
import { useState } from "react";

type AdminShellProps = {
  user: { name: string; email?: string; role: string };
  children: React.ReactNode;
};

const groups = [
  {
    title: "Workspace",
    links: [{ label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Website content",
    links: [
      { label: "Products", href: "/admin/dashboard/products", icon: Package },
      { label: "Categories", href: "/admin/dashboard/categories", icon: Tags },
      { label: "Machines", href: "/admin/dashboard/machines", icon: Factory },
      { label: "Industries", href: "/admin/dashboard/industries", icon: Building2 },
      { label: "Gallery", href: "/admin/dashboard/gallery", icon: Images },
      { label: "Customer brands", href: "/admin/dashboard/brands", icon: UsersRound },
      { label: "Page sections", href: "/admin/dashboard/pages", icon: PanelsTopLeft },
      { label: "Quote inquiries", href: "/admin/dashboard/inquiries", icon: MessageSquareText },
    ],
  },
  {
    title: "Configuration",
    links: [
      { label: "SEO pages", href: "/admin/dashboard/seo", icon: Search },
      { label: "Site settings", href: "/admin/dashboard/settings", icon: Settings2 },
    ],
  },
];

function NavContent({ pathname, close }: { pathname: string; close?: () => void }) {
  return (
    <>
      <div className="hol-admin-brand">
        <Link href="/" className="hol-admin-logo" onClick={close} aria-label="The House of Labels public website">
          <Image src="/theme/THE_HOUSE_OF_LABEL_LOGO02.png" alt="The House of Labels" width={250} height={42} priority />
        </Link>
        <span className="hol-admin-brand-caption">WEBSITE CONTROL ROOM</span>
      </div>

      <nav className="hol-admin-nav" aria-label="Admin navigation">
        {groups.map((group) => (
          <div className="hol-admin-nav-group" key={group.title}>
            <p className="hol-admin-nav-heading">{group.title}</p>
            {group.links.map(({ label, href, icon: Icon }) => {
              const active = href === "/admin/dashboard"
                ? pathname === href
                : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  href={href}
                  key={href}
                  onClick={close}
                  aria-current={active ? "page" : undefined}
                  className={`hol-admin-nav-link${active ? " is-active" : ""}`}
                >
                  <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                  <span>{label}</span>
                  {active && <ChevronRight className="hol-admin-nav-chevron" size={15} aria-hidden="true" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="hol-admin-sidebar-bottom">
        <div className="hol-admin-sidebar-note">
          <span className="hol-admin-sidebar-note-icon"><Settings2 size={17} /></span>
          <div><strong>Need to update the site?</strong><p>Changes here manage your live content.</p></div>
        </div>
        <Link href="/" target="_blank" className="hol-admin-website-link">
          <ExternalLink size={16} aria-hidden="true" /> View public website
        </Link>
      </div>
    </>
  );
}

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeLink = groups.flatMap((group) => group.links).find((link) =>
    link.href === "/admin/dashboard" ? pathname === link.href : pathname === link.href || pathname.startsWith(`${link.href}/`),
  );
  const section = activeLink?.label ?? "Admin";
  const initials = user.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "A";

  return (
    <div className="hol-admin">
      <aside className="hol-admin-sidebar">
        <NavContent pathname={pathname} />
      </aside>

      {mobileOpen && (
        <div className="hol-admin-mobile-layer">
          <button type="button" className="hol-admin-mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />
          <aside className="hol-admin-mobile-sidebar" aria-label="Mobile navigation">
            <button type="button" className="hol-admin-mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={21} /></button>
            <NavContent pathname={pathname} close={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="hol-admin-main">
        <header className="hol-admin-topbar">
          <div className="hol-admin-topbar-left">
            <button type="button" className="hol-admin-menu-button" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={21} /></button>
            <div>
              <div className="hol-admin-breadcrumb"><span>Admin workspace</span><ChevronRight size={14} aria-hidden="true" /><strong>{section}</strong></div>
              <p className="hol-admin-topbar-subtitle">Manage your website content and enquiries</p>
            </div>
          </div>
          <div className="hol-admin-user-menu">
            <div className="hol-admin-user-avatar" aria-hidden="true">{initials}</div>
            <div className="hol-admin-user-copy"><strong>{user.name}</strong><span>{user.role.replaceAll("_", " ")}</span></div>
            <form action="/admin/logout" method="post">
              <button className="hol-admin-logout" type="submit" title="Sign out" aria-label="Sign out"><LogOut size={17} /><span>Sign out</span></button>
            </form>
          </div>
        </header>
        <main className="hol-admin-content" key={pathname}>{children}</main>
        {/* <footer className="hol-admin-footer"><span>© {new Date().getFullYear()} The House of Labels</span><span>Website content management</span></footer> */}
        <footer className="hol-admin-footer"><span>© The House of Labels</span><span>Website content management</span></footer>
      </div>
    </div>
  );
}
