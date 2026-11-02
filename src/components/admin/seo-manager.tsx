"use client";

import {
  AlertCircle,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleHelp,
  Globe2,
  LoaderCircle,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ImageUploadField } from "@/components/admin/resource-manager";

type SeoRecord = {
  id: string;
  path: string;
  title: string;
  description: string;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  noIndex: boolean;
  updatedAt?: string;
};

type SeoDraft = {
  path: string;
  title: string;
  description: string;
  canonicalUrl: string;
  ogImageUrl: string;
  noIndex: boolean;
};

const standardPages = [
  { path: "/", label: "Home page", description: "Your main business and product introduction.", title: "Printed & Custom Label Manufacturer", meta: "The House of Labels provides printed, unprinted and thermal label solutions for product packaging, barcodes, shipping and identification applications." },
  { path: "/about", label: "About us", description: "Your company story, mission, vision and capabilities.", title: "About The House of Labels", meta: "Learn about The House of Labels, our label solutions, production capabilities and approach to customer requirements." },
  { path: "/products", label: "Products", description: "Your product catalogue and label types.", title: "Printed, Unprinted & Thermal Labels", meta: "Explore printed labels, unprinted label rolls, thermal labels and custom label solutions for packaging, product identification and shipping." },
  { path: "/machines", label: "Machines", description: "Your label production and finishing capabilities.", title: "Label Printing & Finishing Machines", meta: "Explore the printing, slitting, die-cutting and rewinding equipment used to support label production and finishing." },
  { path: "/industries", label: "Industries", description: "The industries and applications you serve.", title: "Label Solutions for Different Industries", meta: "Explore label applications for food and dairy, FMCG, personal care, pharmaceuticals, chemicals, retail and logistics." },
  { path: "/gallery", label: "Gallery", description: "Product, machine and facility photographs.", title: "Label Products & Manufacturing Gallery", meta: "View printed product labels, thermal label rolls, production equipment and label application examples from The House of Labels." },
  { path: "/contact", label: "Contact", description: "Contact details and quotation enquiries.", title: "Request a Custom Label Printing Quote", meta: "Contact The House of Labels to discuss printed, unprinted or thermal label requirements and request a quotation." },
];

const initialDraft = (path: string): SeoDraft => {
  const page = standardPages.find((item) => item.path === path);
  return {
    path,
    title: page?.title ?? "",
    description: page?.meta ?? "",
    canonicalUrl: "",
    ogImageUrl: "",
    noIndex: false,
  };
};

function normaliseRoute(value: string) {
  const route = value.trim();
  if (!route) return "";
  const prefixed = route.startsWith("/") ? route : `/${route}`;
  const compact = prefixed.replace(/\/{2,}/g, "/");
  return compact !== "/" ? compact.replace(/\/$/, "") : compact;
}

export function SeoManager() {
  const [records, setRecords] = useState<SeoRecord[]>([]);
  const [activePath, setActivePath] = useState("/");
  const [draft, setDraft] = useState<SeoDraft>(initialDraft("/"));
  const [customMode, setCustomMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/seo?page=1&limit=100", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load SEO settings.");
      setRecords(Array.isArray(result.data) ? result.data as SeoRecord[] : []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load SEO settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  // Populate the editor from saved SEO records on first load and when a page is selected.
  // This prevents an existing custom record from being accidentally overwritten by defaults.
  useEffect(() => {
    if (customMode) return;
    const record = records.find((item) => item.path === activePath);
    setDraft(record ? {
      path: record.path,
      title: record.title,
      description: record.description,
      canonicalUrl: record.canonicalUrl || "",
      ogImageUrl: record.ogImageUrl || "",
      noIndex: record.noIndex,
    } : initialDraft(activePath));
  }, [records, activePath, customMode]);

  const activeRecord = records.find((record) => record.path === activePath);
  const activeLabel = standardPages.find((page) => page.path === activePath)?.label ?? "Custom page";
  const visiblePages = useMemo(() => {
    const known = standardPages.map((page) => ({ path: page.path, label: page.label, description: page.description, custom: false }));
    const custom = records
      .filter((record) => !standardPages.some((page) => page.path === record.path))
      .map((record) => ({ path: record.path, label: record.path, description: "Additional page SEO settings.", custom: true }));
    const all = [...known, ...custom];
    const term = search.trim().toLowerCase();
    return term ? all.filter((page) => `${page.label} ${page.path} ${page.description}`.toLowerCase().includes(term)) : all;
  }, [records, search]);

  function selectPage(path: string) {
    const record = records.find((item) => item.path === path);
    setActivePath(path);
    setCustomMode(false);
    setDraft(record ? {
      path: record.path,
      title: record.title,
      description: record.description,
      canonicalUrl: record.canonicalUrl || "",
      ogImageUrl: record.ogImageUrl || "",
      noIndex: record.noIndex,
    } : initialDraft(path));
    setError("");
    setNotice("");
  }

  function addCustomPage() {
    setActivePath("__custom__");
    setCustomMode(true);
    setDraft({ path: "", title: "", description: "", canonicalUrl: "", ogImageUrl: "", noIndex: false });
    setError("");
    setNotice("");
  }

  function update<K extends keyof SeoDraft>(key: K, value: SeoDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setError("");
    setNotice("");
  }

  async function save() {
    const path = normaliseRoute(draft.path || activePath);
    if (!path || path === "/__custom__" || path.startsWith("//") || path.includes("..") || path.includes("?") || path.includes("#") || path.includes("\\")) {
      setError("Enter a valid page path, for example /about or /products/thermal-labels. Do not include the domain, query string or #.");
      return;
    }
    if (!draft.title.trim()) {
      setError("Add a page title so search engines and visitors know what this page is about.");
      return;
    }
    if (!draft.description.trim()) {
      setError("Add a short page description for the search result preview.");
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const existing = records.find((record) => record.path === path);
      const response = await fetch(existing ? `/api/admin/seo/${existing.id}` : "/api/admin/seo", {
        method: existing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path,
          title: draft.title.trim(),
          description: draft.description.trim(),
          canonicalUrl: draft.canonicalUrl.trim() || null,
          ogImageUrl: draft.ogImageUrl.trim() || null,
          noIndex: draft.noIndex,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save SEO settings.");
      setActivePath(path);
      setCustomMode(false);
      setDraft({ ...draft, path });
      setNotice(`SEO settings saved for ${path}. The public page will use these details.`);
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save SEO settings.");
    } finally {
      setSaving(false);
    }
  }

  async function removeOverride() {
    if (!activeRecord || deleting) return;
    if (!window.confirm(`Remove the custom SEO settings for ${activeRecord.path}? The page will return to its default SEO details.`)) return;
    setDeleting(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/seo/${activeRecord.id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not remove SEO settings.");
      setNotice(`Custom SEO settings removed for ${activePath}. The page will use its default details.`);
      setDraft(initialDraft(activePath));
      await load();
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Could not remove SEO settings.");
    } finally {
      setDeleting(false);
    }
  }

  const pageUrl = `https://thehouseoflabel.com${normaliseRoute(draft.path || activePath)}`;
  const titleLength = draft.title.length;
  const descriptionLength = draft.description.length;

  return (
    <div className="hol-friendly-page hol-seo-manager">
      <div className="hol-friendly-heading">
        <div>
          <div className="hol-eyebrow">GOOGLE & SOCIAL PREVIEWS</div>
          <h1>SEO settings</h1>
          <p>Choose a page and control how it appears when people find it on Google or share it on WhatsApp, Facebook and other apps.</p>
        </div>
        <a className="hol-button hol-button-secondary" href="/" target="_blank" rel="noreferrer"><ArrowUpRight size={16} /> View website</a>
      </div>

      <div className="hol-friendly-tip"><span><CircleHelp size={19} /></span><div><strong>What is SEO?</strong><p>SEO helps search engines understand your pages. A clear title and description help describe each page, but they do not guarantee a higher Google position. Google does not use a hidden meta-keywords field: place your main search phrase naturally in the visible page heading, introduction and useful page content.</p></div></div>
      {notice && <div className="hol-alert hol-alert-success" role="status"><Check size={17} />{notice}</div>}
      {error && <div className="hol-alert hol-alert-error" role="alert"><AlertCircle size={17} />{error}</div>}

      <div className="hol-seo-layout">
        <aside className="hol-seo-page-list hol-admin-card">
          <div className="hol-seo-list-heading"><div><h2>Your website pages</h2><p>Choose which page to edit.</p></div><button className="hol-icon-button" type="button" onClick={() => void load()} disabled={loading} aria-label="Refresh pages"><LoaderCircle size={16} className={loading ? "hol-spin" : ""} /></button></div>
          <label className="hol-search-box hol-seo-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a page…" /></label>
          <div className="hol-seo-page-options">
            {visiblePages.map((page) => {
              const configured = records.some((record) => record.path === page.path);
              return <button type="button" key={page.path} onClick={() => selectPage(page.path)} className={`hol-seo-page-option${activePath === page.path ? " is-active" : ""}`}>
                <span className="hol-seo-page-option-copy"><strong>{page.label}</strong><small>{page.path}</small></span>
                <span className={`hol-seo-config-state${configured ? " is-configured" : ""}`}>{configured ? "Custom" : "Default"}</span>
              </button>;
            })}
            {!visiblePages.length && <p className="hol-seo-no-pages">No matching pages.</p>}
          </div>
          <button type="button" className="hol-button hol-button-secondary hol-seo-add-page" onClick={addCustomPage}><Plus size={16} /> Add SEO for another page</button>
        </aside>

        <section className="hol-seo-editor-column">
          <div className="hol-admin-card hol-seo-editor-card">
            <div className="hol-seo-editor-heading"><div><span className="hol-eyebrow">EDIT PAGE DETAILS</span><h2>{customMode ? "Add page SEO" : activeLabel}</h2><p>{customMode ? "Add metadata for an existing product detail page or another route already created on your website." : `Update how ${activeLabel.toLowerCase()} appears in search results.`}</p></div><span className={`hol-seo-config-pill${activeRecord ? " is-configured" : ""}`}>{activeRecord ? "Custom settings saved" : "Using page defaults"}</span></div>
            <div className="hol-seo-form">
              {customMode ? <div className="hol-seo-field is-wide"><label htmlFor="seo-path">Page address</label><input id="seo-path" className="hol-field" value={draft.path} onChange={(event) => update("path", event.target.value)} placeholder="/about-your-company" /><small>Enter the path after your domain. For a product detail page, use /products/your-product-slug. The website page itself must already exist.</small></div> : <div className="hol-seo-route-display"><Globe2 size={17} /><div><small>Page address</small><strong>thehouseoflabel.com{activePath}</strong></div></div>}

              <div className="hol-seo-field is-wide"><div className="hol-seo-label-row"><label htmlFor="seo-title">Google result title</label><span className={titleLength > 60 ? "is-warning" : ""}>{titleLength}/70</span></div><input id="seo-title" className="hol-field" maxLength={70} value={draft.title} onChange={(event) => update("title", event.target.value)} placeholder="Example: Printed Labels Manufacturer in India" /><small>Use a clear title that describes this page. Around 50–60 characters is a useful target.</small></div>
              <div className="hol-seo-field is-wide"><div className="hol-seo-label-row"><label htmlFor="seo-description">Google result description</label><span className={descriptionLength > 160 ? "is-warning" : ""}>{descriptionLength}/170</span></div><textarea id="seo-description" className="hol-field hol-seo-description" rows={4} maxLength={170} value={draft.description} onChange={(event) => update("description", event.target.value)} placeholder="Briefly explain what visitors will find on this page…" /><small>Write one or two natural sentences. Aim for about 120–160 characters.</small></div>

              <div className="hol-seo-preview-wrap"><div className="hol-seo-preview-heading"><strong><Search size={15} /> Search preview</strong><span>Approximate example</span></div><div className="hol-google-preview"><small>{pageUrl}</small><strong>{draft.title || "Your page title will appear here"}</strong><p>{draft.description || "Your page description will appear here. Write a short explanation to help visitors understand this page."}</p></div></div>

              <div className="hol-seo-field is-wide"><label>Image shown when this page is shared</label><ImageUploadField label="Social sharing image" value={draft.ogImageUrl} onChange={(value) => update("ogImageUrl", value)} /><small>Choose a clear landscape image for WhatsApp, Facebook and other social previews. Recommended: 1200 × 630 pixels.</small></div>

              <details className="hol-seo-advanced"><summary><ChevronDown size={16} /> Advanced options <span>Optional</span></summary><div className="hol-seo-advanced-fields"><div className="hol-seo-field is-wide"><label htmlFor="seo-canonical">Preferred page address (canonical URL)</label><input id="seo-canonical" className="hol-field" type="text" value={draft.canonicalUrl} onChange={(event) => update("canonicalUrl", event.target.value)} placeholder={`https://thehouseoflabel.com${activePath}`} /><small>Most sites can leave this empty. Use it only when the same page is available at more than one URL.</small></div><label className="hol-seo-noindex"><input type="checkbox" checked={draft.noIndex} onChange={(event) => update("noIndex", event.target.checked)} /><span><strong>Hide this page from search results</strong><small>Turn this on only for private, duplicate or unfinished pages. Visitors can still open the page using its URL.</small></span></label></div></details>

              <div className="hol-seo-actions"><div>{activeRecord && <button type="button" className="hol-button hol-button-ghost hol-danger-button" onClick={() => void removeOverride()} disabled={deleting}><Trash2 size={15} /> {deleting ? "Removing…" : "Restore defaults"}</button>}</div><button type="button" className="hol-button hol-button-primary" onClick={() => void save()} disabled={saving || loading}>{saving ? <><LoaderCircle size={16} className="hol-spin" /> Saving…</> : <><Save size={16} /> Save SEO settings</>}</button></div>
            </div>
          </div>
          <div className="hol-seo-note"><ShieldCheck size={17} /><p><strong>Changes are connected to your live website.</strong> Once saved, the page metadata is generated from these settings. Search engines may take time to revisit and show updated details.</p></div>
        </section>
      </div>
    </div>
  );
}
