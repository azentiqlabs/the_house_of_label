import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ExternalLink,
  Factory,
  Images,
  MessageSquareText,
  Package,
  PanelsTopLeft,
  Search,
  Tags,
  UsersRound,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

async function safeCount(fn: () => Promise<number>) {
  try { return await fn(); } catch { return null; }
}

async function safeRecentInquiries() {
  try {
    return await prisma.quoteInquiry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, company: true, productType: true, status: true, createdAt: true },
    });
  } catch {
    return [];
  }
}

const moduleCards = [
  { label: "Products", description: "Manage product photos, details and visibility.", href: "/admin/dashboard/products", icon: Package },
  { label: "Categories", description: "Keep your catalogue grouped and organised.", href: "/admin/dashboard/categories", icon: Tags },
  { label: "Machines", description: "Show your equipment and production capabilities.", href: "/admin/dashboard/machines", icon: Factory },
  { label: "Industries", description: "Update the sectors your labels support.", href: "/admin/dashboard/industries", icon: Building2 },
  { label: "Gallery", description: "Upload product and facility photographs.", href: "/admin/dashboard/gallery", icon: Images },
  { label: "Customer brands", description: "Manage customer and partner logos.", href: "/admin/dashboard/brands", icon: UsersRound },
  { label: "Page sections", description: "Edit homepage headings, copy and images.", href: "/admin/dashboard/pages", icon: PanelsTopLeft },
  { label: "SEO pages", description: "Manage search previews and indexing options.", href: "/admin/dashboard/seo", icon: Search },
];

function formattedDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function statusClass(status: string) {
  if (status === "COMPLETED") return "is-green";
  if (status === "NEW" || status === "IN_PROGRESS") return "is-blue";
  if (status === "SPAM") return "is-amber";
  return "is-neutral";
}

export default async function DashboardPage() {
  const [products, inquiries, gallery, brands, recentInquiries] = await Promise.all([
    safeCount(() => prisma.product.count()),
    safeCount(() => prisma.quoteInquiry.count({ where: { status: "NEW" } })),
    safeCount(() => prisma.galleryItem.count()),
    safeCount(() => prisma.customerBrand.count()),
    safeRecentInquiries(),
  ]);

  const stats = [
    { label: "Products", value: products, note: "Catalogue records", icon: Package, tone: "is-strong", href: "/admin/dashboard/products" },
    { label: "New enquiries", value: inquiries, note: "Waiting for follow-up", icon: MessageSquareText, tone: "is-warm", href: "/admin/dashboard/inquiries" },
    { label: "Gallery photos", value: gallery, note: "Media library records", icon: Images, tone: "", href: "/admin/dashboard/gallery" },
    { label: "Customer brands", value: brands, note: "Logo records", icon: UsersRound, tone: "", href: "/admin/dashboard/brands" },
  ];

  return (
    <div className="hol-dashboard">
      <section className="hol-dashboard-hero">
        <div className="hol-dashboard-hero-copy">
          <div className="hol-eyebrow">THE HOUSE OF LABELS · ADMIN</div>
          <h1>Your website, all in one place.</h1>
          <p>Keep your product catalogue, brand imagery, website pages and customer enquiries up to date—without editing code.</p>
          <div className="hol-dashboard-actions">
            <Link href="/admin/dashboard/products" className="hol-button hol-button-primary"><Package size={16} /> Manage products</Link>
            <Link href="/admin/dashboard/inquiries" className="hol-button hol-button-secondary"><MessageSquareText size={16} /> View enquiries</Link>
          </div>
        </div>
        <img className="hol-dashboard-product-image" src="/theme/image15.png" alt="House of Labels product label rolls" />
      </section>

      <div className="hol-dashboard-stats">
        {stats.map(({ label, value, note, icon: Icon, tone, href }) => (
          <Link className="hol-stat-card" href={href} key={label}>
            <span className={`hol-stat-icon ${tone}`}><Icon size={21} strokeWidth={1.8} /></span>
            <span className="hol-stat-copy"><span>{label}</span><strong>{value === null ? "—" : value}</strong><small>{note}</small></span>
          </Link>
        ))}
      </div>

      <div className="hol-dashboard-section-heading">
        <div><h2>Website management</h2><p>Choose the area you want to update.</p></div>
        <Link href="/" target="_blank" className="hol-dashboard-link">View public website <ExternalLink size={13} style={{ display: "inline", verticalAlign: "-2px" }} /></Link>
      </div>
      <div className="hol-dashboard-module-grid">
        {moduleCards.map(({ label, description, href, icon: Icon }) => (
          <Link className="hol-dashboard-module" href={href} key={label}>
            <span className="hol-dashboard-module-icon"><Icon size={19} strokeWidth={1.8} /></span>
            <strong>{label}</strong><p>{description}</p><ArrowRight size={15} aria-hidden="true" />
          </Link>
        ))}
      </div>

      <div className="hol-dashboard-bottom-grid">
        <section className="hol-dashboard-panel">
          <div className="hol-dashboard-panel-header"><div><h2>Latest enquiries</h2><p>Recent quotation requests from your website.</p></div><Link className="hol-dashboard-link" href="/admin/dashboard/inquiries">View all <ArrowRight size={13} style={{ display: "inline", verticalAlign: "-2px" }} /></Link></div>
          {recentInquiries.length === 0 ? <div className="hol-dashboard-empty">No enquiries have arrived yet. New quote requests will appear here.</div> : <div className="hol-recent-list">
            {recentInquiries.map((inquiry) => (
              <div className="hol-recent-item" key={inquiry.id}>
                <span className="hol-recent-avatar">{inquiry.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "C"}</span>
                <div className="hol-recent-main"><strong>{inquiry.name}{inquiry.company ? ` · ${inquiry.company}` : ""}</strong><p>{inquiry.productType || "General enquiry"}</p></div>
                <div className="hol-recent-meta"><span className={`hol-status ${statusClass(inquiry.status)}`}>{inquiry.status.replaceAll("_", " ")}</span><span className="hol-recent-date">{formattedDate(inquiry.createdAt)}</span></div>
              </div>
            ))}
          </div>}
        </section>

        <section className="hol-dashboard-panel">
          <div className="hol-dashboard-panel-header"><div><h2>Quick guidance</h2><p>A simple workflow for keeping pages fresh.</p></div><CheckCircle2 size={19} color="#0876bd" /></div>
          <div className="hol-dashboard-guide">
            <div className="hol-dashboard-guide-item"><span className="hol-guide-number">01</span><div><strong>Upload your images</strong><p>Use Products, Gallery or Page Sections to upload real images with previews.</p></div></div>
            <div className="hol-dashboard-guide-item"><span className="hol-guide-number">02</span><div><strong>Review before publishing</strong><p>Check the title, description, URL slug and publication status.</p></div></div>
            <div className="hol-dashboard-guide-item"><span className="hol-guide-number">03</span><div><strong>Keep enquiries moving</strong><p>Update the status and record private notes in <Link href="/admin/dashboard/inquiries">Quote Inquiries</Link>.</p></div></div>
            <div className="hol-dashboard-guide-item"><span className="hol-guide-number">04</span><div><strong>Maintain business details</strong><p>Set the correct logo and contact information in <Link href="/admin/dashboard/settings">Site Settings</Link>.</p></div></div>
          </div>
        </section>
      </div>
    </div>
  );
}
