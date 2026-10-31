"use client";

import {
  AlertCircle,
  ArrowUpRight,
  Building2,
  Check,
  CheckCircle2,
  CircleHelp,
  ExternalLink,
  Globe2,
  LoaderCircle,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Save,
  Settings2,
  Store,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ImageUploadField } from "@/components/admin/resource-manager";

type SettingRecord = {
  id: string;
  key: string;
  value: string;
  updatedAt?: string;
};
type SettingKind = "text" | "textarea" | "email" | "phone" | "url" | "image" | "toggle";
type SettingField = {
  key: string;
  label: string;
  kind?: SettingKind;
  help: string;
  placeholder?: string;
  defaultValue?: string;
};
type SettingGroup = {
  id: string;
  title: string;
  description: string;
  icon: typeof Building2;
  fields: SettingField[];
};

const defaultValues: Record<string, string> = {
  site_name: "The House of Labels",
  site_tagline: "LABELS THAT RUN BETTER",
  site_logo_url: "/theme/THE_HOUSE_OF_LABEL_LOGO02.png",
  contact_phone: "+91 XXXXX XXXXX (demo)",
  contact_email: "info@thehouseoflabels.example",
  contact_address: "Business address to be added\nCity, State, PIN (demo)",
  whatsapp_number: "",
  nav_home: "Home",
  nav_about: "About Us",
  nav_what_we_do: "What We Do",
  nav_products: "Products",
  nav_machines: "Our Machines",
  nav_industries: "Industries",
  nav_gallery: "Gallery",
  nav_contact: "Contact",
  header_quote_text: "Request a Quote",
  footer_note: "All rights reserved.",
  show_customer_sample_note: "1",
};

const groups: SettingGroup[] = [
  {
    id: "branding",
    title: "Brand & identity",
    description: "These details appear in your website header, browser and brand areas.",
    icon: Building2,
    fields: [
      { key: "site_name", label: "Business name", help: "The name visitors see across the website.", placeholder: "The House of Labels" },
      { key: "site_tagline", label: "Brand tagline", help: "A short sentence that communicates what your business stands for.", placeholder: "Labels that run better" },
      { key: "site_logo_url", label: "Website logo", kind: "image", help: "Upload your logo as a PNG, JPG, WebP or GIF. A transparent PNG works well on a white background." },
    ],
  },
  {
    id: "contact",
    title: "Contact details",
    description: "Keep these details accurate so customers can reach your team.",
    icon: Phone,
    fields: [
      { key: "contact_phone", label: "Business phone number", kind: "phone", help: "Include the country code if you receive enquiries from outside India.", placeholder: "+91 98765 43210" },
      { key: "contact_email", label: "Business email address", kind: "email", help: "The email address shown on the public website.", placeholder: "sales@example.com" },
      { key: "whatsapp_number", label: "WhatsApp number", kind: "phone", help: "Use digits with country code, for example 919876543210. Avoid spaces and the + sign for best compatibility.", placeholder: "919876543210" },
      { key: "contact_address", label: "Business address", kind: "textarea", help: "You can put the street, city, state and PIN on separate lines.", placeholder: "Building / street\nCity, State, PIN" },
    ],
  },
  {
    id: "navigation",
    title: "Website navigation",
    description: "Change the wording in the main menu and the quote button without editing code.",
    icon: Navigation,
    fields: [
      { key: "nav_home", label: "Home menu label", help: "Text shown for the homepage link.", placeholder: "Home" },
      { key: "nav_about", label: "About menu label", help: "Text shown for the About page link.", placeholder: "About Us" },
      { key: "nav_what_we_do", label: "What We Do menu label", help: "Text shown for the services section link.", placeholder: "What We Do" },
      { key: "nav_products", label: "Products menu label", help: "Text shown for the product catalogue link.", placeholder: "Products" },
      { key: "nav_machines", label: "Machines menu label", help: "Text shown for the machinery section link.", placeholder: "Our Machines" },
      { key: "nav_industries", label: "Industries menu label", help: "Text shown for the industries section link.", placeholder: "Industries" },
      { key: "nav_gallery", label: "Gallery menu label", help: "Text shown for the gallery section link.", placeholder: "Gallery" },
      { key: "nav_contact", label: "Contact menu label", help: "Text shown for the contact section link.", placeholder: "Contact" },
      { key: "header_quote_text", label: "Quote button text", help: "Text displayed on the main enquiry button.", placeholder: "Request a Quote" },
    ],
  },
  {
    id: "footer",
    title: "Footer & customer logos",
    description: "Manage the small print and the note shown when sample customer logos are still being used.",
    icon: Globe2,
    fields: [
      { key: "footer_note", label: "Footer note", kind: "textarea", help: "For example, a copyright statement or short legal note.", placeholder: "All rights reserved." },
      { key: "show_customer_sample_note", label: "Show sample-logo disclaimer", kind: "toggle", help: "Keep this enabled until the sample logos have been replaced with approved customer logos." },
    ],
  },
];

const knownKeys = new Set(groups.flatMap((group) => group.fields.map((field) => field.key)));

function humanizeKey(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function asEnabled(value: string | undefined) {
  return ["1", "true", "yes", "on"].includes(String(value ?? "").toLowerCase());
}

export function SiteSettingsManager() {
  const [rows, setRows] = useState<SettingRecord[]>([]);
  const [values, setValues] = useState<Record<string, string>>(defaultValues);
  const [dirtyKeys, setDirtyKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/settings?page=1&limit=100", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load website settings.");
      const nextRows = (Array.isArray(result.data) ? result.data : []) as SettingRecord[];
      const visibleRows = nextRows.filter((row) => row.key && !row.key.startsWith("_system_"));
      setRows(visibleRows);
      setValues({
        ...defaultValues,
        ...Object.fromEntries(visibleRows.map((row) => [row.key, row.value ?? ""])),
      });
      setDirtyKeys(new Set());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load website settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadSettings(); }, [loadSettings]);

  const changedCount = dirtyKeys.size;
  const customRows = useMemo(
    () => rows.filter((row) => !knownKeys.has(row.key) && !row.key.startsWith("_system_")),
    [rows],
  );

  function updateValue(key: string, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setDirtyKeys((current) => new Set(current).add(key));
    setNotice("");
    setError("");
  }

  async function saveChanges() {
    const keysToSave = Array.from(dirtyKeys);
    if (!keysToSave.length || saving) return;
    setSaving(true);
    setError("");
    setNotice("");
    let savedCount = 0;
    try {
      for (const key of keysToSave) {
        const existing = rows.find((row) => row.key === key);
        const response = await fetch(existing ? `/api/admin/settings/${existing.id}` : "/api/admin/settings", {
          method: existing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value: String(values[key] ?? "") }),
        });
        const result = (await response.json()) as { error?: string; data?: SettingRecord };
        if (!response.ok) throw new Error(result.error || `Could not save ${humanizeKey(key).toLowerCase()}.`);
        if (result.data) {
          const savedRow = result.data;
          setRows((current) => [...current.filter((row) => row.key !== key), savedRow]);
        }
        setDirtyKeys((current) => {
          const next = new Set(current);
          next.delete(key);
          return next;
        });
        savedCount += 1;
      }
      setNotice(`${savedCount} change${savedCount === 1 ? "" : "s"} saved. Your website settings are up to date.`);
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Could not save your changes.";
      setError(savedCount > 0 ? `${savedCount} change${savedCount === 1 ? " was" : "s were"} saved, but the remaining changes could not be saved. ${message}` : message);
    } finally {
      setSaving(false);
    }
  }

  const siteName = values.site_name || "Your business name";
  const siteTagline = values.site_tagline || "Your brand tagline will appear here";
  const logoSrc = values.site_logo_url || "/theme/THE_HOUSE_OF_LABEL_LOGO02.png";

  return (
    <div className="hol-settings-page">
      <div className="hol-settings-heading">
        <div>
          <div className="hol-eyebrow">WEBSITE CONFIGURATION</div>
          <h1>Site settings</h1>
          <p>Update your business details, logo and website wording from one place. You do not need to change code or database keys.</p>
        </div>
        <a className="hol-button hol-button-secondary hol-settings-view-site" href="/" target="_blank" rel="noreferrer">
          <ExternalLink size={16} /> View website <ArrowUpRight size={15} />
        </a>
      </div>

      <div className="hol-settings-intro">
        <span className="hol-settings-intro-icon"><Settings2 size={22} /></span>
        <div className="hol-settings-intro-copy">
          <strong>Make your website feel up to date</strong>
          <p>Change the information below, then select <b>Save changes</b>. Your saved details are used across the public website.</p>
        </div>
        <div className={`hol-settings-save-state${changedCount ? " has-changes" : ""}`}>
          {changedCount ? <><span className="hol-settings-dot" /> {changedCount} unsaved change{changedCount === 1 ? "" : "s"}</> : <><CheckCircle2 size={15} /> All changes saved</>}
        </div>
      </div>

      {notice && <div className="hol-alert hol-alert-success" role="status"><Check size={17} />{notice}</div>}
      {error && <div className="hol-alert hol-alert-error" role="alert"><AlertCircle size={17} />{error}<button type="button" onClick={() => setError("")} aria-label="Dismiss message">×</button></div>}

      <div className="hol-settings-layout">
        <div className="hol-settings-sections">
          {groups.map((group) => {
            const GroupIcon = group.icon;
            return (
              <section className="hol-settings-card" key={group.id}>
                <header className="hol-settings-card-header">
                  <span className="hol-settings-card-icon"><GroupIcon size={19} /></span>
                  <div><h2>{group.title}</h2><p>{group.description}</p></div>
                </header>
                <div className="hol-settings-fields">
                  {group.fields.map((field) => {
                    const value = values[field.key] ?? "";
                    const isWide = field.kind === "image" || field.kind === "textarea";
                    return (
                      <div className={`hol-settings-field${isWide ? " is-wide" : ""}${field.kind === "toggle" ? " is-toggle" : ""}`} key={field.key}>
                        {field.kind === "toggle" ? (
                          <label className="hol-settings-toggle">
                            <span className="hol-settings-toggle-copy"><strong>{field.label}</strong><small>{field.help}</small></span>
                            <input type="checkbox" checked={asEnabled(value)} onChange={(event) => updateValue(field.key, event.target.checked ? "1" : "0")} />
                            <span className="hol-settings-switch" aria-hidden="true" />
                          </label>
                        ) : field.kind === "image" ? (
                          <>
                            <div className="hol-settings-logo-field">
                              <ImageUploadField label={field.label} value={value} onChange={(nextValue) => updateValue(field.key, nextValue)} />
                            </div>
                            <p className="hol-settings-help">{field.help}</p>
                          </>
                        ) : (
                          <>
                            <label htmlFor={`site-setting-${field.key}`} className="hol-settings-label">{field.label}</label>
                            {field.kind === "textarea" ? (
                              <textarea id={`site-setting-${field.key}`} className="hol-field hol-settings-textarea" value={value} onChange={(event) => updateValue(field.key, event.target.value)} placeholder={field.placeholder} rows={3} />
                            ) : (
                              <input id={`site-setting-${field.key}`} className="hol-field" type={field.kind === "email" ? "email" : field.kind === "phone" ? "tel" : field.kind === "url" ? "url" : "text"} value={value} onChange={(event) => updateValue(field.key, event.target.value)} placeholder={field.placeholder} />
                            )}
                            <p className="hol-settings-help">{field.help}</p>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {customRows.length > 0 && (
            <details className="hol-settings-advanced">
              <summary><Settings2 size={17} /><span><strong>Additional website options</strong><small>{customRows.length} extra option{customRows.length === 1 ? "" : "s"} available</small></span></summary>
              <p className="hol-settings-advanced-note">These options were already present in your website configuration. They are kept here so existing settings remain editable without crowding the main page.</p>
              <div className="hol-settings-fields">
                {customRows.map((row) => (
                  <div className="hol-settings-field" key={row.key}>
                    <label htmlFor={`site-setting-${row.key}`} className="hol-settings-label">{humanizeKey(row.key)}</label>
                    <input id={`site-setting-${row.key}`} className="hol-field" value={values[row.key] ?? row.value ?? ""} onChange={(event) => updateValue(row.key, event.target.value)} />
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>

        <aside className="hol-settings-aside">
          <section className="hol-settings-preview-card">
            <div className="hol-settings-preview-top"><span className="hol-settings-preview-tag"><Globe2 size={13} /> LIVE BRAND PREVIEW</span><span className="hol-settings-preview-live"><span /> Preview</span></div>
            <div className="hol-settings-brand-preview">
              <div className="hol-settings-preview-logo"><img src={logoSrc} alt="Website logo preview" /></div>
              <strong>{siteName}</strong>
              <p>{siteTagline}</p>
              <div className="hol-settings-preview-divider" />
              <div className="hol-settings-preview-contact"><Phone size={14} /><span>{values.contact_phone || "Business phone will appear here"}</span></div>
              <div className="hol-settings-preview-contact"><Mail size={14} /><span>{values.contact_email || "Business email will appear here"}</span></div>
              {values.whatsapp_number && <div className="hol-settings-preview-contact"><MessageCircle size={14} /><span>{values.whatsapp_number}</span></div>}
              {values.contact_address && <div className="hol-settings-preview-contact"><MapPin size={14} /><span>{values.contact_address.split("\n")[0]}</span></div>}
            </div>
            <p className="hol-settings-preview-footnote">This is a quick preview of your saved branding details, not a full website screenshot.</p>
          </section>

          <section className="hol-settings-help-card">
            <span className="hol-settings-help-icon"><CircleHelp size={18} /></span>
            <h3>Helpful tips</h3>
            <ul>
              <li>Use a clear, high-quality logo with a transparent background if available.</li>
              <li>Keep your phone number, email and WhatsApp number current.</li>
              <li>Use the preview to check your wording before saving.</li>
            </ul>
          </section>

          <section className="hol-settings-mini-card">
            <Store size={17} />
            <div><strong>Website settings</strong><span>{rows.length} saved setting{rows.length === 1 ? "" : "s"} in the CMS</span></div>
          </section>
        </aside>
      </div>

      <div className="hol-settings-savebar">
        <div className="hol-settings-savebar-copy">
          <strong>{changedCount ? "You have unsaved changes" : "Your website details are up to date"}</strong>
          <span>{changedCount ? "Save to apply your changes to the website." : "Edit any field to make an update."}</span>
        </div>
        <button type="button" className="hol-button hol-button-primary" onClick={() => void saveChanges()} disabled={saving || loading || changedCount === 0}>
          {saving ? <><LoaderCircle size={17} className="hol-spin" /> Saving settings…</> : <><Save size={17} /> Save changes {changedCount > 0 ? `(${changedCount})` : ""}</>}
        </button>
      </div>
    </div>
  );
}
