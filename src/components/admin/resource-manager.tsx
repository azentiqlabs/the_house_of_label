"use client";

import {
  Check,
  ChevronDown,
  CircleAlert,
  FileImage,
  ImagePlus,
  LoaderCircle,
  MessageSquareText,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type FieldType = "text" | "textarea" | "url" | "number" | "checkbox" | "select" | "json" | "image" | "images";
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
  { value: "DRAFT", label: "Draft — hidden from the website" },
  { value: "PUBLISHED", label: "Published — visible on the website" },
];
const inquiryStatus = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "SPAM", label: "Spam" },
];
const optionalSeo: Field[] = [
  { key: "seoTitle", label: "SEO title", maxLength: 70, help: "Aim for a clear title under 70 characters." },
  { key: "seoDescription", label: "SEO description", type: "textarea", maxLength: 170 },
  { key: "canonicalUrl", label: "Canonical URL", type: "url", help: "Optional full URL or a site-relative route." },
  { key: "ogImageUrl", label: "Social sharing image", type: "image", help: "Image shown when this page is shared." },
  { key: "noIndex", label: "Hide from search engines", type: "checkbox", defaultValue: false },
];

const definitions: Record<string, ResourceDefinition> = {
  products: {
    label: "Products",
    description: "Manage the product catalogue, images, descriptions, SEO and which products are visible on the public website.",
    columns: [{ key: "imageUrl", label: "Image" }, { key: "name", label: "Product" }, { key: "slug", label: "URL slug" }, { key: "status", label: "Status" }, { key: "featured", label: "Featured" }],
    fields: [
      { key: "name", label: "Product name", required: true, maxLength: 160 },
      { key: "slug", label: "URL slug", required: true, help: "Lowercase words separated by hyphens, e.g. thermal-shipping-labels." },
      { key: "categoryId", label: "Product category", type: "select", required: true, options: [] },
      { key: "shortDescription", label: "Short description", type: "textarea", maxLength: 500 },
      { key: "description", label: "Full description", type: "textarea" },
      { key: "imageUrl", label: "Main product image", type: "image", help: "Upload the photo used on product cards and detail pages." },
      { key: "gallery", label: "Additional product photos", type: "images", defaultValue: "[]", help: "Upload several photos for this product. Remove a thumbnail to exclude it." },
      { key: "status", label: "Publication status", type: "select", required: true, options: publication, defaultValue: "DRAFT" },
      { key: "featured", label: "Feature this product on the website", type: "checkbox", defaultValue: false },
      ...optionalSeo,
    ],
  },
  categories: {
    label: "Categories",
    description: "Keep product categories organised. Products use these categories for grouping and filtering.",
    columns: [{ key: "name", label: "Category" }, { key: "slug", label: "URL slug" }, { key: "createdAt", label: "Created" }],
    fields: [{ key: "name", label: "Category name", required: true, maxLength: 120 }, { key: "slug", label: "URL slug", required: true, help: "Use lowercase letters and hyphens only." }],
  },
  machines: {
    label: "Machines",
    description: "Manage production equipment shown in the machinery showcase, including the machine photo and description.",
    columns: [{ key: "imageUrl", label: "Photo" }, { key: "name", label: "Machine" }, { key: "slug", label: "URL slug" }, { key: "status", label: "Status" }],
    fields: [{ key: "name", label: "Machine name", required: true, maxLength: 160 }, { key: "slug", label: "URL slug", required: true }, { key: "description", label: "Description", type: "textarea" }, { key: "imageUrl", label: "Machine photo", type: "image" }, { key: "status", label: "Publication status", type: "select", options: publication, defaultValue: "DRAFT" }, ...optionalSeo],
  },
  industries: {
    label: "Industries",
    description: "Manage the industry sectors and application areas shown on the website.",
    columns: [{ key: "imageUrl", label: "Image" }, { key: "name", label: "Industry" }, { key: "slug", label: "URL slug" }, { key: "status", label: "Status" }],
    fields: [{ key: "name", label: "Industry name", required: true, maxLength: 160 }, { key: "slug", label: "URL slug", required: true }, { key: "description", label: "Description", type: "textarea" }, { key: "imageUrl", label: "Industry image", type: "image" }, { key: "status", label: "Publication status", type: "select", options: publication, defaultValue: "DRAFT" }, ...optionalSeo],
  },
  gallery: {
    label: "Gallery",
    description: "Upload product, machine, facility and application photos. The photos you save here are used in the public gallery.",
    columns: [{ key: "imageUrl", label: "Photo" }, { key: "title", label: "Image title" }, { key: "category", label: "Category" }, { key: "sortOrder", label: "Display order" }, { key: "isActive", label: "Visible" }],
    fields: [{ key: "title", label: "Image title", required: true, maxLength: 160 }, { key: "imageUrl", label: "Gallery photo", type: "image", required: true }, { key: "category", label: "Category", type: "select", required: true, options: [{ value: "products", label: "Products" }, { value: "machines", label: "Machines" }, { value: "facility", label: "Facility" }, { value: "applications", label: "Applications" }] }, { key: "altText", label: "Accessible image description", maxLength: 250, help: "Describe the photo for visitors using screen readers." }, { key: "sortOrder", label: "Display order", type: "number", defaultValue: 0 }, { key: "isActive", label: "Show on website", type: "checkbox", defaultValue: true }],
  },
  brands: {
    label: "Customer Brands",
    description: "Manage customer or partner logos displayed on the website. Upload the logo file instead of typing a file path.",
    columns: [{ key: "logoUrl", label: "Logo" }, { key: "name", label: "Brand name" }, { key: "website", label: "Website" }, { key: "sortOrder", label: "Order" }, { key: "isActive", label: "Visible" }],
    fields: [{ key: "name", label: "Brand name", required: true, maxLength: 160 }, { key: "logoUrl", label: "Customer logo", type: "image", required: true }, { key: "website", label: "Website URL", type: "url" }, { key: "sortOrder", label: "Display order", type: "number", defaultValue: 0 }, { key: "isActive", label: "Show on website", type: "checkbox", defaultValue: true }],
  },
  pages: {
    label: "Page Sections",
    description: "Edit homepage headings, descriptions, calls to action, mission and vision cards, and their images. Keep the existing section key when editing a section.",
    columns: [{ key: "imageUrl", label: "Image" }, { key: "sectionKey", label: "Section" }, { key: "title", label: "Headline" }, { key: "status", label: "Status" }, { key: "sortOrder", label: "Order" }],
    fields: [{ key: "sectionKey", label: "Unique section key", required: true, maxLength: 120, help: "Examples: home_hero, home_about. Do not change a key unless you intend to create a new section." }, { key: "title", label: "Title / headline", required: true, maxLength: 200, help: "For the hero heading, use | to separate the lines, for example Reliable|Label Solutions|for Every Industry." }, { key: "subtitle", label: "Eyebrow / subtitle", type: "textarea", maxLength: 1000 }, { key: "description", label: "Description", type: "textarea", help: "New lines can be used for list items in supported sections." }, { key: "imageUrl", label: "Section image", type: "image" }, { key: "sortOrder", label: "Display order", type: "number", defaultValue: 0 }, { key: "buttonText", label: "Button text", maxLength: 80 }, { key: "buttonUrl", label: "Button URL or section anchor", type: "url", help: "Examples: #contact or /products." }, { key: "status", label: "Publication status", type: "select", options: publication, defaultValue: "DRAFT" }, { key: "seoTitle", label: "SEO title", maxLength: 70 }, { key: "seoDescription", label: "SEO description", type: "textarea", maxLength: 170 }],
  },
  seo: {
    label: "SEO Pages",
    description: "Manage search titles, descriptions, canonical URLs, sharing images and indexing for each route. Use / for the homepage.",
    columns: [{ key: "path", label: "Page route" }, { key: "title", label: "SEO title" }, { key: "noIndex", label: "Hidden from search" }, { key: "updatedAt", label: "Last updated" }],
    fields: [{ key: "path", label: "Page route", required: true, maxLength: 300, placeholder: "/" }, { key: "title", label: "SEO title", required: true, maxLength: 70 }, { key: "description", label: "SEO description", required: true, type: "textarea", maxLength: 170 }, { key: "canonicalUrl", label: "Canonical URL", type: "url" }, { key: "ogImageUrl", label: "Social sharing image", type: "image" }, { key: "noIndex", label: "Hide from search engines", type: "checkbox", defaultValue: false }],
  },
  inquiries: {
    label: "Quote Inquiries",
    description: "Review quotation requests, check the customer’s requirements, update enquiry status and leave private notes for your team.",
    columns: [{ key: "name", label: "Contact" }, { key: "company", label: "Company" }, { key: "phone", label: "Phone" }, { key: "productType", label: "Product" }, { key: "status", label: "Status" }, { key: "createdAt", label: "Received" }],
    fields: [{ key: "status", label: "Inquiry status", type: "select", required: true, options: inquiryStatus, defaultValue: "NEW" }, { key: "adminNotes", label: "Internal notes", type: "textarea", help: "These notes are private to the admin panel." }],
    noCreate: true,
  },
  settings: {
    label: "Site Settings",
    description: "Manage the public business name, logo, tagline, WhatsApp number and contact details used throughout the website.",
    columns: [{ key: "key", label: "Setting" }, { key: "value", label: "Current value" }, { key: "updatedAt", label: "Last updated" }],
    fields: [{ key: "key", label: "Setting key", required: true, maxLength: 120, help: "Known keys include site_name, site_tagline, site_logo_url, whatsapp_number, contact_phone, contact_email, contact_address and footer_note." }, { key: "value", label: "Setting value", type: "textarea", required: true, help: "Use a line break for multiple address lines. For the site_logo_url key, upload a logo image instead." }],
  },
};

function freshForm(fields: Field[]) {
  return Object.fromEntries(fields.map((field) => [field.key, field.defaultValue ?? (field.type === "checkbox" ? false : field.type === "json" || field.type === "images" ? "[]" : "")]));
}

function parseImageList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string" && Boolean(item));
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string" && Boolean(item)) : [];
  } catch {
    return [];
  }
}

function formatCell(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return `${value.length} photo${value.length === 1 ? "" : "s"}`;
  if (typeof value === "object") return JSON.stringify(value);
  const text = String(value);
  if (/^\d{4}-\d{2}-\d{2}T/.test(text)) {
    const date = new Date(text);
    return Number.isNaN(date.getTime()) ? text : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }
  return text.length > 72 ? `${text.slice(0, 69)}…` : text;
}

function toFormValue(field: Field, value: unknown) {
  if (field.type === "checkbox") return Boolean(value);
  if (field.type === "json" || field.type === "images") return JSON.stringify(value ?? [], null, 2);
  if (value === null || value === undefined) return field.defaultValue ?? "";
  return String(value);
}

function makePayload(fields: Field[], form: Record<string, unknown>) {
  const payload: Record<string, unknown> = {};
  for (const field of fields) {
    const raw = form[field.key];
    if (field.type === "checkbox") payload[field.key] = Boolean(raw);
    else if (field.type === "number") payload[field.key] = raw === "" || raw === null || raw === undefined ? field.defaultValue ?? 0 : Number(raw);
    else if (field.type === "json" || field.type === "images") {
      try {
        payload[field.key] = JSON.parse(String(raw || "[]"));
      } catch {
        throw new Error(`${field.label} must be a valid list of items.`);
      }
    } else payload[field.key] = String(raw ?? "").trim();
  }
  return payload;
}

export function ImageUploadField({
  label,
  value,
  multiple = false,
  onChange,
}: {
  label: string;
  value: unknown;
  multiple?: boolean;
  onChange: (value: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragging, setDragging] = useState(false);
  const currentValue = String(value ?? "");
  const images = multiple ? parseImageList(currentValue) : (currentValue ? [currentValue] : []);

  async function uploadFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    if (!files.length) return;
    setUploading(true);
    setUploadError("");
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const body = new FormData();
        body.append("file", file);
        const response = await fetch("/api/admin/uploads", { method: "POST", body });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || `Could not upload ${file.name}.`);
        if (typeof result.imageUrl === "string") uploaded.push(result.imageUrl);
      }
      if (multiple) onChange(JSON.stringify([...images, ...uploaded], null, 2));
      else if (uploaded[0]) onChange(uploaded[0]);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(image: string) {
    const next = images.filter((item, index) => !(item === image && images.indexOf(item) === index));
    onChange(multiple ? JSON.stringify(next, null, 2) : "");
  }

  return (
    <div className="hol-upload-field">
      <div className="hol-upload-label-row"><span className="hol-upload-title">{label}</span><span className="hol-upload-types">JPG, PNG, WebP or GIF · Max 4 MB</span></div>
      {images.length > 0 && (
        <div className={`hol-upload-preview-list${multiple ? " is-multiple" : ""}`}>
          {images.map((image, index) => (
            <div className="hol-upload-preview" key={`${image}-${index}`}>
              {/* The URL comes from the authenticated upload route or a pre-existing site asset. */}
              <img src={image} alt={`${label} preview ${index + 1}`} />
              <div className="hol-upload-preview-meta"><span title={image}>{image.split("/").pop() || image}</span><button type="button" onClick={() => removeImage(image)} aria-label={`Remove ${label} ${index + 1}`} title="Remove image"><X size={14} /></button></div>
            </div>
          ))}
        </div>
      )}
      <label
        className={`hol-upload-dropzone${dragging ? " is-dragging" : ""}${uploading ? " is-uploading" : ""}`}
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); if (!uploading) void uploadFiles(event.dataTransfer.files); }}
      >
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple={multiple} disabled={uploading} onChange={(event) => { if (event.target.files) void uploadFiles(event.target.files); event.currentTarget.value = ""; }} />
        <span className="hol-upload-icon">{uploading ? <LoaderCircle size={21} className="hol-spin" /> : images.length ? <Upload size={21} /> : <ImagePlus size={22} />}</span>
        <span className="hol-upload-prompt"><strong>{uploading ? "Uploading image…" : images.length ? (multiple ? "Add more images" : "Replace image") : "Choose an image to upload"}</strong><small>Click to browse or drag and drop here</small></span>
      </label>
      {!multiple && <details className="hol-upload-url"><summary><ChevronDown size={14} /> Use an existing image URL or site path</summary><input value={currentValue} onChange={(event) => onChange(event.target.value)} placeholder="/theme/image15.png or https://…" aria-label={`${label} URL or site path`} /></details>}
      {multiple && <p className="hol-upload-hint">Uploaded images are added to the product gallery. Use the × on a thumbnail to remove one.</p>}
      {uploadError && <p className="hol-field-error" role="alert"><CircleAlert size={15} />{uploadError}</p>}
    </div>
  );
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
      setNotice(editingId ? "Changes saved. The website content has been updated." : "New record created successfully.");
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

  function renderCell(row: RecordData, key: string) {
    const value = row[key];
    const isImageColumn = ["imageUrl", "logoUrl", "ogImageUrl"].includes(key) || (resource === "settings" && key === "value" && row.key === "site_logo_url");
    if (isImageColumn && typeof value === "string" && value) {
      return <div className="hol-table-image-wrap"><img className="hol-table-image" src={value} alt="" /><span title={value}>{formatCell(value)}</span></div>;
    }
    if (key === "status") {
      const status = String(value || "").toUpperCase();
      const style = status === "PUBLISHED" || status === "COMPLETED" ? "is-green" : status === "NEW" || status === "IN_PROGRESS" ? "is-blue" : status === "SPAM" || status === "DRAFT" ? "is-amber" : "is-neutral";
      return <span className={`hol-status ${style}`}>{formatCell(value)}</span>;
    }
    if (typeof value === "boolean" && (key === "isActive" || key === "featured" || key === "noIndex")) {
      return <span className={`hol-status ${value ? "is-green" : "is-neutral"}`}>{value ? "Yes" : "No"}</span>;
    }
    if (key === "phone" && value) return <a className="hol-table-link" href={`tel:${String(value).replace(/[^+\d]/g, "")}`}>{formatCell(value)}</a>;
    if (key === "website" && value) return <a className="hol-table-link" href={String(value)} target="_blank" rel="noreferrer">{formatCell(value)}</a>;
    return formatCell(value);
  }

  if (!definition) return <div className="hol-admin-card hol-admin-empty"><h1>Unknown admin module</h1><p>Choose a module from the sidebar.</p></div>;

  return (
    <div className="hol-resource-manager">
      <div className="hol-page-heading">
        <div><div className="hol-eyebrow">WEBSITE CONTENT</div><h1>{definition.label}</h1><p>{definition.description}</p></div>
        {!definition.noCreate && <button type="button" className="hol-button hol-button-primary" onClick={beginCreate}><Plus size={17} /> Add {resource === "seo" ? "SEO page" : resource === "pages" ? "section" : resource === "settings" ? "setting" : resource === "brands" ? "brand" : resource === "categories" ? "category" : resource === "gallery" ? "photo" : resource === "products" ? "product" : resource === "machines" ? "machine" : "industry"}</button>}
      </div>

      {notice && <div className="hol-alert hol-alert-success" role="status"><Check size={17} />{notice}<button type="button" onClick={() => setNotice("")} aria-label="Dismiss message"><X size={15} /></button></div>}
      {error && !editorOpen && <div className="hol-alert hol-alert-error" role="alert"><CircleAlert size={17} />{error}<button type="button" onClick={() => setError("")} aria-label="Dismiss message"><X size={15} /></button></div>}

      <div className="hol-resource-toolbar">
        <label className="hol-search-box"><Search size={18} aria-hidden="true" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${definition.label.toLowerCase()}…`} aria-label={`Search ${definition.label}`} /><kbd>Search</kbd></label>
        <div className="hol-toolbar-right"><span>{loading ? "Loading…" : `${rows.length} record${rows.length === 1 ? "" : "s"}`}</span><button type="button" className="hol-icon-button" onClick={() => void load()} disabled={loading} aria-label="Refresh records" title="Refresh records"><RefreshCw size={17} className={loading ? "hol-spin" : ""} /></button></div>
      </div>

      <div className="hol-admin-card hol-table-card">
        <div className="hol-table-scroll"><table className="hol-data-table">
          <thead><tr>{definition.columns.map((column) => <th key={column.key}>{column.label}</th>)}<th className="hol-action-heading">Actions</th></tr></thead>
          <tbody>
            {loading ? <tr><td className="hol-table-empty" colSpan={definition.columns.length + 1}><LoaderCircle className="hol-spin" size={23} /><span>Loading your content…</span></td></tr>
              : rows.length === 0 ? <tr><td colSpan={definition.columns.length + 1}><div className="hol-empty-state"><span className="hol-empty-icon"><FileImage size={25} /></span><strong>{search ? "No matching records" : `No ${definition.label.toLowerCase()} yet`}</strong><p>{search ? "Try a different search term." : "Add your first item to start managing this section of the website."}</p>{!search && !definition.noCreate && <button type="button" className="hol-button hol-button-secondary" onClick={beginCreate}><Plus size={16} /> Add first item</button>}</div></td></tr>
              : rows.map((row) => <tr key={row.id}>{definition.columns.map((column) => <td key={column.key} className={`hol-cell-${column.key}`}>{renderCell(row, column.key)}</td>)}<td className="hol-row-actions"><button type="button" className="hol-row-action hol-row-edit" onClick={() => beginEdit(row)}><Pencil size={15} /> Edit</button>{!definition.noDelete && <button type="button" className="hol-row-action hol-row-delete" onClick={() => void remove(row)}><Trash2 size={15} /> Delete</button>}</td></tr>)}
          </tbody>
        </table></div>
        <div className="hol-table-footer"><span>Showing up to 100 records</span><span>Saved changes appear on the public website</span></div>
      </div>

      {editorOpen && <div className="hol-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditorOpen(false); }}><section className="hol-editor-modal" role="dialog" aria-modal="true" aria-labelledby="resource-editor-title">
        <div className="hol-editor-header"><div><span className="hol-editor-kicker">{editingId ? "EDIT EXISTING ITEM" : "ADD TO WEBSITE"}</span><h2 id="resource-editor-title">{editingId ? "Edit " : "Add "}{resource === "seo" ? "SEO page" : resource === "pages" ? "page section" : resource === "settings" ? "site setting" : resource === "brands" ? "customer brand" : resource === "categories" ? "category" : resource === "gallery" ? "gallery photo" : resource === "products" ? "product" : resource === "machines" ? "machine" : resource === "industries" ? "industry" : "inquiry"}</h2><p>Complete the relevant fields, then save your changes.</p></div><button type="button" className="hol-icon-button" onClick={() => setEditorOpen(false)} aria-label="Close editor"><X size={19} /></button></div>
        <form onSubmit={save} className="hol-editor-form">
          {error && <div className="hol-alert hol-alert-error" role="alert"><CircleAlert size={17} />{error}</div>}
          {resource === "inquiries" && editingId && (() => {
            const inquiry = rows.find((row) => row.id === editingId);
            if (!inquiry) return null;
            return <section className="hol-inquiry-summary" aria-label="Customer enquiry details">
              <div className="hol-inquiry-summary-heading"><MessageSquareText size={17} /><span>Customer enquiry</span></div>
              <div className="hol-inquiry-summary-grid"><div><small>Customer</small><strong>{String(inquiry.name || "—")}</strong></div><div><small>Company</small><strong>{String(inquiry.company || "—")}</strong></div><div><small>Email</small><strong>{String(inquiry.email || "—")}</strong></div><div><small>Phone</small><strong>{String(inquiry.phone || "—")}</strong></div><div><small>Product interest</small><strong>{String(inquiry.productType || "Not specified")}</strong></div><div><small>Received</small><strong>{formatCell(inquiry.createdAt)}</strong></div></div>
              <div className="hol-inquiry-requirements"><small>Requirements</small><p>{String(inquiry.requirements || "No requirements supplied.")}</p></div>
            </section>;
          })()}
          <div className="hol-editor-fields">
            {activeFields.map((field) => {
              const isSiteLogo = resource === "settings" && field.key === "value" && String(form.key || "") === "site_logo_url";
              const fieldType = isSiteLogo ? "image" : field.type;
              return <div key={field.key} className={`hol-form-field${fieldType === "textarea" || fieldType === "json" || fieldType === "image" || fieldType === "images" ? " is-wide" : ""}${fieldType === "checkbox" ? " is-checkbox" : ""}`}>
                {fieldType === "checkbox" ? <label className="hol-checkbox-label"><input type="checkbox" checked={Boolean(form[field.key])} onChange={(event) => updateField(field.key, event.target.checked)} /><span className="hol-checkbox-custom" /><span><strong>{field.label}</strong>{field.help && <small>{field.help}</small>}</span></label> : <>
                  <label htmlFor={`field-${field.key}`} className="hol-field-label">{field.label}{field.required && <span className="hol-required"> *</span>}</label>
                  {fieldType === "image" || fieldType === "images" ? <ImageUploadField label={field.label} value={form[field.key]} multiple={fieldType === "images"} onChange={(value) => updateField(field.key, value)} />
                    : fieldType === "textarea" || fieldType === "json" ? <textarea id={`field-${field.key}`} className="hol-field hol-textarea" required={field.required} maxLength={field.maxLength} value={String(form[field.key] ?? "")} onChange={(event) => updateField(field.key, event.target.value)} placeholder={field.placeholder} rows={fieldType === "json" ? 5 : 4} />
                    : fieldType === "select" ? <select id={`field-${field.key}`} className="hol-field" required={field.required} value={String(form[field.key] ?? "")} onChange={(event) => updateField(field.key, event.target.value)}><option value="">Choose an option…</option>{(field.options || []).map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select>
                    : <input id={`field-${field.key}`} className="hol-field" type={fieldType === "number" ? "number" : fieldType === "url" ? "text" : "text"} inputMode={fieldType === "number" ? "numeric" : undefined} required={field.required} maxLength={field.maxLength} value={String(form[field.key] ?? "")} onChange={(event) => updateField(field.key, event.target.value)} placeholder={field.placeholder} />}
                  {field.help && fieldType !== "image" && fieldType !== "images" && <p className="hol-field-help">{field.help}</p>}
                </>}
              </div>;
            })}
          </div>
          {resource === "products" && categories.length === 0 && <div className="hol-alert hol-alert-warn"><CircleAlert size={17} />Create a category first, then you can add products.</div>}
          <div className="hol-editor-footer"><button type="button" className="hol-button hol-button-ghost" onClick={() => setEditorOpen(false)}>Cancel</button><button type="submit" className="hol-button hol-button-primary" disabled={saving || (resource === "products" && categories.length === 0)}>{saving ? <><LoaderCircle size={17} className="hol-spin" /> Saving…</> : <><Check size={17} /> {editingId ? "Save changes" : "Create item"}</>}</button></div>
        </form>
      </section></div>}
    </div>
  );
}
