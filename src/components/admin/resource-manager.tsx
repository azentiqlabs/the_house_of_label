"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type FieldType = "text" | "textarea" | "url" | "number" | "checkbox" | "select" | "json";
type Field = {
  key: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  options?: Array<{ value: string; label: string }>;
  defaultValue?: string | number | boolean;
  maxLength?: number;
};
type ResourceDefinition = {
  label: string;
  description: string;
  columns: Array<{ key: string; label: string }>;
  fields: Field[];
  noCreate?: boolean;
  noDelete?: boolean;
};
type RecordData = Record<string, unknown> & { id: string };

const publication = [
  { value: "DRAFT", label: "Draft — hidden on website" },
  { value: "PUBLISHED", label: "Published — visible on website" },
];
const inquiryStatus = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "SPAM", label: "Spam" },
];
const optionalSeo: Field[] = [
  { key: "seoTitle", label: "SEO title", maxLength: 70 },
  { key: "seoDescription", label: "SEO description", type: "textarea", maxLength: 170 },
  { key: "canonicalUrl", label: "Canonical URL", type: "url", help: "Full URL or relative URL path." },
  { key: "ogImageUrl", label: "Open Graph image", type: "url" },
  { key: "noIndex", label: "Hide from search engines", type: "checkbox", defaultValue: false },
];

const definitions: Record<string, ResourceDefinition> = {
  products: {
    label: "Products",
    description: "Manage the product cards, product-detail pages, images, descriptions and publication status.",
    columns: [{ key: "name", label: "Product" }, { key: "slug", label: "Slug" }, { key: "status", label: "Status" }, { key: "featured", label: "Featured" }],
    fields: [
      { key: "name", label: "Product name", required: true, maxLength: 160 },
      { key: "slug", label: "URL slug", required: true, help: "Lowercase words separated with hyphens, e.g. thermal-shipping-labels." },
      { key: "categoryId", label: "Product category", type: "select", required: true, options: [] },
      { key: "shortDescription", label: "Short description", type: "textarea", maxLength: 500 },
      { key: "description", label: "Full description", type: "textarea" },
      { key: "imageUrl", label: "Main image path / URL", type: "url", help: "Use /theme/image10.jpeg for an image in public/theme." },
      { key: "gallery", label: "Additional image paths (JSON array)", type: "json", defaultValue: "[]", help: "Example: [\"/theme/image10.jpeg\", \"https://example.com/label.jpg\"]" },
      { key: "status", label: "Publication status", type: "select", required: true, options: publication, defaultValue: "DRAFT" },
      { key: "featured", label: "Featured product", type: "checkbox", defaultValue: false },
      ...optionalSeo,
    ],
  },
  categories: {
    label: "Categories",
    description: "Product categories used by the product manager and product filters.",
    columns: [{ key: "name", label: "Category" }, { key: "slug", label: "Slug" }],
    fields: [{ key: "name", label: "Category name", required: true, maxLength: 120 }, { key: "slug", label: "URL slug", required: true }],
  },
  machines: {
    label: "Machines",
    description: "Manage the machine list and the interactive machinery showcase on the homepage.",
    columns: [{ key: "name", label: "Machine" }, { key: "slug", label: "Slug" }, { key: "status", label: "Status" }],
    fields: [{ key: "name", label: "Machine name", required: true, maxLength: 160 }, { key: "slug", label: "URL slug", required: true }, { key: "description", label: "Description", type: "textarea" }, { key: "imageUrl", label: "Image path / URL", type: "url" }, { key: "status", label: "Publication status", type: "select", options: publication, defaultValue: "DRAFT" }, ...optionalSeo],
  },
  industries: {
    label: "Industries",
    description: "Manage the industries and application sectors displayed on the homepage.",
    columns: [{ key: "name", label: "Industry" }, { key: "slug", label: "Slug" }, { key: "status", label: "Status" }],
    fields: [{ key: "name", label: "Industry name", required: true, maxLength: 160 }, { key: "slug", label: "URL slug", required: true }, { key: "description", label: "Description", type: "textarea" }, { key: "imageUrl", label: "Image path / URL", type: "url" }, { key: "status", label: "Publication status", type: "select", options: publication, defaultValue: "DRAFT" }, ...optionalSeo],
  },
  gallery: {
    label: "Gallery",
    description: "Add product, machine, facility and application images. Supported categories are products, machines, facility and applications.",
    columns: [{ key: "title", label: "Image title" }, { key: "category", label: "Category" }, { key: "sortOrder", label: "Order" }, { key: "isActive", label: "Visible" }],
    fields: [{ key: "title", label: "Image title", required: true, maxLength: 160 }, { key: "imageUrl", label: "Image path / URL", type: "url", required: true }, { key: "category", label: "Category", required: true, help: "Use products, machines, facility or applications." }, { key: "altText", label: "Accessible image description", maxLength: 250 }, { key: "sortOrder", label: "Display order", type: "number", defaultValue: 0 }, { key: "isActive", label: "Show on website", type: "checkbox", defaultValue: true }],
  },
  brands: {
    label: "Customer Brands",
    description: "Manage the scrolling customer/partner name strip. Use Name|Sector to show a small second line, e.g. FRESHFIELDS|FOOD & DAIRY.",
    columns: [{ key: "name", label: "Brand name" }, { key: "sortOrder", label: "Order" }, { key: "isActive", label: "Visible" }],
    fields: [{ key: "name", label: "Brand name (optionally Name|Sector)", required: true, maxLength: 160 }, { key: "logoUrl", label: "Logo path / URL", type: "url", required: true, help: "The homepage currently uses text logos, but you can store a real logo path for future use." }, { key: "website", label: "Website URL", type: "url" }, { key: "sortOrder", label: "Display order", type: "number", defaultValue: 0 }, { key: "isActive", label: "Show on website", type: "checkbox", defaultValue: true }],
  },
  pages: {
    label: "Page Sections",
    description: "Every home-page headline, description, call-to-action, feature, vision/mission card and section heading is managed here. Section keys beginning with home_ belong to the converted theme.",
    columns: [{ key: "sectionKey", label: "Section key" }, { key: "title", label: "Title / content" }, { key: "status", label: "Status" }, { key: "sortOrder", label: "Order" }],
    fields: [{ key: "sectionKey", label: "Unique section key", required: true, maxLength: 120, help: "Keep the existing key to edit that piece of content. Example: home_hero or home_about." }, { key: "title", label: "Title", required: true, maxLength: 200, help: "For home_hero only, use | between lines to highlight the middle line in blue: Reliable|Label Solutions|for Every Industry." }, { key: "subtitle", label: "Eyebrow / subtitle / icon", type: "textarea", maxLength: 1000 }, { key: "description", label: "Description (use new lines for list items)", type: "textarea" }, { key: "imageUrl", label: "Image path / URL", type: "url" }, { key: "sortOrder", label: "Display order", type: "number", defaultValue: 0 }, { key: "buttonText", label: "Button text", maxLength: 80 }, { key: "buttonUrl", label: "Button URL / section anchor", type: "url", help: "Anchors such as #contact and relative paths such as /products are supported." }, { key: "status", label: "Publication status", type: "select", options: publication, defaultValue: "DRAFT" }, { key: "seoTitle", label: "SEO title", maxLength: 70 }, { key: "seoDescription", label: "SEO description", type: "textarea", maxLength: 170 }],
  },
  seo: {
    label: "SEO Pages",
    description: "Manage title, description, canonical URL, sharing image and search indexing per route. Use / for the homepage.",
    columns: [{ key: "path", label: "Route path" }, { key: "title", label: "SEO title" }, { key: "noIndex", label: "No index" }],
    fields: [{ key: "path", label: "Route path", required: true, maxLength: 300 }, { key: "title", label: "SEO title", required: true, maxLength: 70 }, { key: "description", label: "SEO description", required: true, type: "textarea", maxLength: 170 }, { key: "canonicalUrl", label: "Canonical URL", type: "url" }, { key: "ogImageUrl", label: "Open Graph image path / URL", type: "url" }, { key: "noIndex", label: "Hide from search engines", type: "checkbox", defaultValue: false }],
  },
  inquiries: {
    label: "Quote Inquiries",
    description: "Review requests submitted through the homepage quote form, update the status and leave internal notes.",
    columns: [{ key: "name", label: "Name" }, { key: "company", label: "Company" }, { key: "phone", label: "Phone" }, { key: "productType", label: "Product" }, { key: "status", label: "Status" }, { key: "createdAt", label: "Received" }],
    fields: [{ key: "status", label: "Inquiry status", type: "select", required: true, options: inquiryStatus, defaultValue: "NEW" }, { key: "adminNotes", label: "Internal notes", type: "textarea" }],
    noCreate: true,
  },
  settings: {
    label: "Site Settings",
    description: "Manage the brand name, logo, tagline, WhatsApp number and public contact details. These values appear in the header, footer and quote section.",
    columns: [{ key: "key", label: "Setting key" }, { key: "value", label: "Value" }, { key: "updatedAt", label: "Last updated" }],
    fields: [{ key: "key", label: "Setting key", required: true, maxLength: 120, help: "Known keys include site_name, site_tagline, site_logo_url, whatsapp_number, contact_phone, contact_email, contact_address and footer_note." }, { key: "value", label: "Value", type: "textarea", required: true, help: "For contact_address you can use a newline to create multiple address lines." }],
  },
};

function freshForm(fields: Field[]) {
  return Object.fromEntries(fields.map((field) => [field.key, field.defaultValue ?? (field.type === "checkbox" ? false : field.type === "json" ? "[]" : "")]));
}

function formatCell(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return `${value.length} item(s)`;
  if (typeof value === "object") return JSON.stringify(value);
  const text = String(value);
  return text.length > 90 ? `${text.slice(0, 87)}…` : text;
}

function toFormValue(field: Field, value: unknown) {
  if (field.type === "checkbox") return Boolean(value);
  if (field.type === "json") return JSON.stringify(value ?? [], null, 2);
  if (value === null || value === undefined) return field.defaultValue ?? "";
  return String(value);
}

function makePayload(fields: Field[], form: Record<string, unknown>) {
  const payload: Record<string, unknown> = {};
  for (const field of fields) {
    const raw = form[field.key];
    if (field.type === "checkbox") payload[field.key] = Boolean(raw);
    else if (field.type === "number") payload[field.key] = raw === "" || raw === null || raw === undefined ? field.defaultValue ?? 0 : Number(raw);
    else if (field.type === "json") {
      try {
        payload[field.key] = JSON.parse(String(raw || "[]"));
      } catch {
        throw new Error(`${field.label} must be valid JSON.`);
      }
    } else payload[field.key] = String(raw ?? "").trim();
  }
  return payload;
}

export function ResourceManager({ resource }: { resource: string }) {
  const definition = definitions[resource];
  const [rows, setRows] = useState<RecordData[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const fields = definition?.fields ?? [];

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams({ page: "1", limit: "100" });
      if (search.trim()) query.set("q", search.trim());
      const response = await fetch(`/api/admin/${resource}?${query.toString()}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load records.");
      const nextRows = Array.isArray(result.data) ? result.data as RecordData[] : [];
      setRows(nextRows.filter((row) => !(resource === "settings" && String(row.key || "").startsWith("_system_"))));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load records.");
    } finally {
      setLoading(false);
    }
  }, [resource, search]);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    if (resource !== "products") return;
    fetch("/api/admin/categories?page=1&limit=100", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (response.ok) setCategories((result.data || []).map((item: { id: string; name: string }) => ({ id: item.id, name: item.name })));
      })
      .catch(() => setCategories([]));
  }, [resource]);

  const activeFields = useMemo(() => fields.map((field) => field.key === "categoryId" ? {
    ...field,
    options: categories.map((category) => ({ value: category.id, label: category.name })),
  } : field), [fields, categories]);

  function beginCreate() {
    setEditingId(null);
    setForm(freshForm(activeFields));
    setError(""); setNotice(""); setEditorOpen(true);
  }

  function beginEdit(row: RecordData) {
    setEditingId(row.id);
    const formValues = freshForm(activeFields);
    for (const field of activeFields) formValues[field.key] = toFormValue(field, row[field.key]);
    setForm(formValues);
    setError(""); setNotice(""); setEditorOpen(true);
  }

  function updateField(key: string, value: unknown) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true); setError(""); setNotice("");
    try {
      const payload = makePayload(activeFields, form);
      const response = await fetch(editingId ? `/api/admin/${resource}/${editingId}` : `/api/admin/${resource}`, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        const details = result.details?.fieldErrors ? Object.entries(result.details.fieldErrors).map(([key, value]) => `${key}: ${(value as string[]).join(", ")}`).join("; ") : "";
        throw new Error(details ? `${result.error || "Validation failed."} ${details}` : result.error || "Could not save record.");
      }
      setEditorOpen(false);
      setNotice(editingId ? "Record updated successfully." : "Record created successfully.");
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save record.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(row: RecordData) {
    const label = String(row.name || row.title || row.sectionKey || row.key || row.path || row.id);
    if (!window.confirm(`Delete “${label}”? This cannot be undone.`)) return;
    setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/${resource}/${row.id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not delete record.");
      setNotice("Record deleted successfully.");
      await load();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete record.");
    }
  }

  if (!definition) return <div className="card p-8"><h1 className="text-2xl font-bold">Unknown admin module</h1></div>;

  return (
    <div className="resource-manager">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[.18em] text-orange-600">Content management</p><h1 className="mt-2 text-3xl font-extrabold">{definition.label}</h1><p className="muted mt-2 max-w-3xl text-sm leading-6">{definition.description}</p></div>
        {!definition.noCreate && <button type="button" className="btn btn-primary" onClick={beginCreate}>+ Add {definition.label.replace(/s$/, " item")}</button>}
      </div>

      {notice && <p className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800" role="status">{notice}</p>}
      {error && !editorOpen && <p className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="w-full max-w-md"><label htmlFor="resource-search" className="mb-1 block text-xs font-bold text-slate-600">Search records</label><input id="resource-search" className="field" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${definition.label.toLowerCase()}…`} /></div>
        <p className="text-xs text-slate-500">Showing up to 100 records. Content changes take effect on the public site after the next request.</p>
      </div>

      <div className="card mt-4 overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{definition.columns.map((column) => <th className="border-b border-slate-200 px-4 py-3 font-bold" key={column.key}>{column.label}</th>)}<th className="border-b border-slate-200 px-4 py-3 font-bold">Actions</th></tr></thead>
          <tbody>
            {loading ? <tr><td className="px-4 py-8 text-slate-500" colSpan={definition.columns.length + 1}>Loading records…</td></tr> : rows.length === 0 ? <tr><td className="px-4 py-10 text-center text-slate-500" colSpan={definition.columns.length + 1}>No records found. Use “Add” to create the first record.</td></tr> : rows.map((row) => <tr key={row.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">{definition.columns.map((column) => <td className="max-w-[320px] px-4 py-3 align-top text-slate-700" key={column.key}>{column.key === "status" ? <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${row.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700" : row.status === "DRAFT" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{formatCell(row[column.key])}</span> : formatCell(row[column.key])}</td>)}<td className="whitespace-nowrap px-4 py-3 align-top"><button type="button" className="font-bold text-blue-700 hover:underline" onClick={() => beginEdit(row)}>Edit</button>{!definition.noDelete && <button type="button" className="ml-4 font-bold text-red-600 hover:underline" onClick={() => void remove(row)}>Delete</button>}</td></tr>)}
          </tbody>
        </table>
      </div>

      {editorOpen && <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-950/50 p-4 md:p-8" role="dialog" aria-modal="true" aria-labelledby="resource-editor-title"><div className="my-4 w-full max-w-3xl rounded-2xl bg-white shadow-2xl"><div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5"><div><p className="text-xs font-bold uppercase tracking-widest text-blue-700">{editingId ? "Edit record" : "New record"}</p><h2 id="resource-editor-title" className="mt-1 text-xl font-extrabold">{editingId ? "Update" : "Create"} {definition.label.replace(/s$/, " item")}</h2></div><button type="button" className="rounded-lg px-3 py-1 text-xl text-slate-500 hover:bg-slate-100" onClick={() => setEditorOpen(false)} aria-label="Close editor">×</button></div>
          <form onSubmit={save} className="space-y-5 px-6 py-6">
            {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
            <div className="grid gap-5 md:grid-cols-2">
              {activeFields.map((field) => <div key={field.key} className={field.type === "textarea" || field.type === "json" ? "md:col-span-2" : ""}>
                {field.type === "checkbox" ? <label className="flex items-center gap-3 pt-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={Boolean(form[field.key])} onChange={(event) => updateField(field.key, event.target.checked)} className="h-4 w-4 rounded border-slate-300" />{field.label}</label> : <><label htmlFor={`field-${field.key}`} className="mb-1.5 block text-sm font-bold text-slate-700">{field.label}{field.required ? <span className="ml-1 text-red-500">*</span> : null}</label>{field.type === "textarea" || field.type === "json" ? <textarea id={`field-${field.key}`} className="field min-h-28 font-normal" required={field.required} maxLength={field.maxLength} value={String(form[field.key] ?? "")} onChange={(event) => updateField(field.key, event.target.value)} placeholder={field.placeholder} /> : field.type === "select" ? <select id={`field-${field.key}`} className="field" required={field.required} value={String(form[field.key] ?? "")} onChange={(event) => updateField(field.key, event.target.value)}><option value="">Select…</option>{(field.options || []).map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select> : <input id={`field-${field.key}`} className="field" type={field.type === "number" ? "number" : field.type === "url" ? "text" : "text"} inputMode={field.type === "number" ? "numeric" : undefined} required={field.required} maxLength={field.maxLength} value={String(form[field.key] ?? "")} onChange={(event) => updateField(field.key, event.target.value)} placeholder={field.placeholder} />}</>}
                {field.help && <p className="mt-1.5 text-xs leading-5 text-slate-500">{field.help}</p>}
              </div>)}
            </div>
            {resource === "products" && categories.length === 0 && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Create at least one category in the Categories module before saving a product.</p>}
            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50" onClick={() => setEditorOpen(false)}>Cancel</button><button type="submit" className="btn btn-primary" disabled={saving || (resource === "products" && categories.length === 0)}>{saving ? "Saving…" : editingId ? "Save changes" : "Create record"}</button></div>
          </form>
        </div></div>}
    </div>
  );
}
