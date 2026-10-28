import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function safeCount(fn: () => Promise<number>) {
  try {
    return await fn();
  } catch {
    return null;
  }
}
export default async function DashboardPage() {
  const [products, inquiries, gallery, brands] = await Promise.all([
    safeCount(() => prisma.product.count()),
    safeCount(() => prisma.quoteInquiry.count({ where: { status: "NEW" } })),
    safeCount(() => prisma.galleryItem.count()),
    safeCount(() => prisma.customerBrand.count()),
  ]);
  const stats = [
    ["Products", products],
    ["New inquiries", inquiries],
    ["Gallery items", gallery],
    ["Customer brands", brands],
  ];
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[.18em] text-orange-600">
        Overview
      </p>
      <h1 className="mt-2 text-3xl font-extrabold">Dashboard</h1>
      <p className="muted mt-2">
        Manage the content displayed on your public website.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <div className="card p-5" key={String(label)}>
            <p className="muted text-sm">{label}</p>
            <p className="mt-3 text-3xl font-extrabold">
              {value === null ? "—" : value}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-bold">Next steps</h2>
          <p className="muted mt-2 text-sm leading-6">
            Use the authenticated resource API to manage content, page SEO and
            inquiries.
          </p>
          <Link
            className="mt-4 inline-block font-bold text-orange-600"
            href="/admin/login"
          >
            View login screen ↗
          </Link>
        </div>
        <div className="card p-6">
          <h2 className="font-bold">Production readiness</h2>
          <p className="muted mt-2 text-sm leading-6">
            Content APIs now require an admin session and validate all writes.
            Configure image storage, backups, rate limiting and production
            secrets before launch.
          </p>
        </div>
      </div>
    </div>
  );
}
