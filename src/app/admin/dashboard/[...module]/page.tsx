const resources: Record<string, { label: string; api: string; fields: string }> = {
    products: { label: "Products", api: "/api/admin/products", fields: "name, slug, categoryId, descriptions, imageUrl, gallery, publication status and SEO fields" },
    categories: { label: "Categories", api: "/api/admin/categories", fields: "name and unique slug" },
    machines: { label: "Machines", api: "/api/admin/machines", fields: "name, slug, description, image and SEO fields" },
    industries: { label: "Industries", api: "/api/admin/industries", fields: "name, slug, description, image and SEO fields" },
    gallery: { label: "Gallery", api: "/api/admin/gallery", fields: "title, imageUrl, category, altText, sortOrder and active status" },
    brands: { label: "Customer Brands", api: "/api/admin/brands", fields: "name, logoUrl, website, sortOrder and active status" },
    inquiries: { label: "Quote Inquiries", api: "/api/admin/inquiries", fields: "status and adminNotes; submissions are created from the public quote form" },
    pages: { label: "Page Sections", api: "/api/admin/pages", fields: "sectionKey, title, subtitle, description, image, CTA, publication and SEO fields" },
    seo: { label: "SEO Pages", api: "/api/admin/seo", fields: "path, title, description, canonical URL, Open Graph image and noIndex" },
    settings: { label: "Site Settings", api: "/api/admin/settings", fields: "unique key and text value" },
};
export const instant = false;
export default async function AdminModulePage({ params }: { params: Promise<{ module: string[] }> }) {
    const { module } = await params; const key = module[0]; const item = resources[key];
    if (!item || module.length !== 1) return <div className="card p-8"><h1 className="text-2xl font-bold">Module not found</h1><p className="muted mt-2">Choose a module from the sidebar.</p></div>;
    return <div className="card p-8"><p className="text-xs font-bold uppercase tracking-wider text-orange-600">Content management API</p><h1 className="mt-3 text-3xl font-extrabold">{item.label}</h1><p className="muted mt-3">Supported fields: {item.fields}.</p><div className="mt-6 rounded-xl bg-slate-50 p-4"><p className="text-sm font-semibold">Protected API endpoint</p><code className="mt-2 block break-all text-sm">{item.api}</code><p className="muted mt-2 text-sm">GET list · POST create · GET by ID · PATCH update · DELETE by ID</p></div><p className="muted mt-5 text-sm leading-6">This workspace route is a safe module landing page. The REST endpoints are ready for a reusable data-table/form client. Requests require an authenticated admin session; writes are schema-validated and role-checked.</p></div>;
}
