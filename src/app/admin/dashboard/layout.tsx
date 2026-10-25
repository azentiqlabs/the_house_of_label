import Link from "next/link";
const links = [
  ["Overview", "/admin/dashboard"],
  ["Products", "/admin/dashboard/products"],
  ["Categories", "/admin/dashboard/categories"],
  ["Machines", "/admin/dashboard/machines"],
  ["Industries", "/admin/dashboard/industries"],
  ["Gallery", "/admin/dashboard/gallery"],
  ["Customer Brands", "/admin/dashboard/brands"],
  ["Quote Inquiries", "/admin/dashboard/inquiries"],
  ["Pages", "/admin/dashboard/pages"],
  ["SEO", "/admin/dashboard/seo"],
  ["Settings", "/admin/dashboard/settings"],
];
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <aside className="bg-[#071b31] p-5 text-white md:min-h-screen md:w-64 md:shrink-0">
        <Link href="/" className="text-sm font-extrabold">
          The House of Labels
        </Link>
        <p className="mt-1 text-xs text-slate-400">Admin workspace</p>
        <nav className="mt-8 grid grid-cols-2 gap-2 md:grid-cols-1">
          {links.map(([label, href]) => (
            <Link
              className="rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/10 hover:text-white"
              key={href}
              href={href}
            >
              {label}
            </Link>
          ))}
        </nav>
        <p className="mt-8 text-xs leading-5 text-amber-200">
          Starter UI only. Protect this layout and its APIs before production
          use.
        </p>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="border-b bg-white px-6 py-4">
          <p className="text-sm font-semibold">Admin Dashboard</p>
        </header>
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
