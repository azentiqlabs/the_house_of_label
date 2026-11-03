"use client";

import {
  AlertCircle,
  ArrowUpRight,
  Check,
  Eye,
  EyeOff,
  FileText,
  ImageIcon,
  LoaderCircle,
  Pencil,
  Search,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ImageUploadField } from "@/components/admin/resource-manager";

type SectionRecord = {
  id: string;
  sectionKey: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  buttonText: string | null;
  buttonUrl: string | null;
  status: "DRAFT" | "PUBLISHED";
  seoTitle: string | null;
  seoDescription: string | null;
  updatedAt?: string;
};

type SectionInfo = { label: string; group: string; help: string };
type SectionDraft = Omit<SectionRecord, "id" | "updatedAt">;

const sectionInfo: Record<string, SectionInfo> = {
  home_hero: {
    label: "Main banner",
    group: "First impression",
    help: "The large banner visitors see when they open your homepage.",
  },
  home_feature_1: {
    label: "Benefit 1",
    group: "Quick benefits",
    help: "A short benefit shown below the main banner.",
  },
  home_feature_2: {
    label: "Benefit 2",
    group: "Quick benefits",
    help: "A short benefit shown below the main banner.",
  },
  home_feature_3: {
    label: "Benefit 3",
    group: "Quick benefits",
    help: "A short benefit shown below the main banner.",
  },
  home_feature_4: {
    label: "Benefit 4",
    group: "Quick benefits",
    help: "A short benefit shown below the main banner.",
  },
  home_promo: {
    label: "Promotional message",
    group: "First impression",
    help: "A highlighted message and button between homepage sections.",
  },
  home_about: {
    label: "About the company",
    group: "Company information",
    help: "Introduce The House Of Label and explain what makes the company useful to customers.",
  },
  home_vision: {
    label: "Our vision",
    group: "Company information",
    help: "Explain what the company aims to become.",
  },
  home_mission: {
    label: "Our mission",
    group: "Company information",
    help: "Explain the company's purpose and what it works to deliver.",
  },
  home_strength: {
    label: "Our strength",
    group: "Company information",
    help: "Describe your experience, production knowledge and key capabilities.",
  },
  home_choose: {
    label: "Why choose us?",
    group: "Company information",
    help: "Use short lines to list the reasons customers should work with you.",
  },
  home_what_heading: {
    label: "What we do – introduction",
    group: "Our solutions",
    help: "The heading and introduction for your label solutions.",
  },
  home_what_printed: {
    label: "Printed labels",
    group: "Our solutions",
    help: "Describe your printed label offering.",
  },
  home_what_unprinted: {
    label: "Unprinted labels",
    group: "Our solutions",
    help: "Describe your unprinted label offering.",
  },
  home_what_thermal: {
    label: "Thermal labels",
    group: "Our solutions",
    help: "Describe your thermal label offering.",
  },
  home_what_custom: {
    label: "Custom label formats",
    group: "Our solutions",
    help: "Describe special sizes, shapes or label requirements you can discuss with customers.",
  },
  home_products_heading: {
    label: "Products heading",
    group: "Product and machine sections",
    help: "The heading and introduction above the products displayed on the homepage.",
  },
  home_machines_heading: {
    label: "Machines heading",
    group: "Product and machine sections",
    help: "The heading and introduction above the machinery section.",
  },
  home_why_heading: {
    label: "Why choose us – introduction",
    group: "Our strengths",
    help: "The main heading above your company strengths.",
  },
  home_why_card_1: {
    label: "Strength 1 – Material knowledge",
    group: "Our strengths",
    help: "Describe one strength of your business.",
  },
  home_why_card_2: {
    label: "Strength 2 – Application development",
    group: "Our strengths",
    help: "Describe one strength of your business.",
  },
  home_why_card_3: {
    label: "Strength 3 – Production performance",
    group: "Our strengths",
    help: "Describe one strength of your business.",
  },
  home_why_card_4: {
    label: "Strength 4 – Customer support",
    group: "Our strengths",
    help: "Describe one strength of your business.",
  },
  home_industries_heading: {
    label: "Industries heading",
    group: "Other homepage sections",
    help: "The heading and introduction above the industries you serve.",
  },
  home_gallery_heading: {
    label: "Gallery heading",
    group: "Other homepage sections",
    help: "The heading and introduction above your photo gallery.",
  },
  home_contact_heading: {
    label: "Contact / quote heading",
    group: "Other homepage sections",
    help: "The text shown above the customer quotation form.",
  },
  home_customers_heading: {
    label: "Customer brands heading",
    group: "Other homepage sections",
    help: "The heading and introduction above customer or partner logos.",
  },
};

function infoFor(section: SectionRecord): SectionInfo {
  if (sectionInfo[section.sectionKey]) return sectionInfo[section.sectionKey];
  const label = section.sectionKey
    .replace(/^home_/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
  return {
    label: label || section.title,
    group: "Other sections",
    help: "Edit the wording and visibility for this homepage section.",
  };
}

function draftFrom(section: SectionRecord): SectionDraft {
  return {
    sectionKey: section.sectionKey,
    title: section.title || "",
    subtitle: section.subtitle || "",
    description: section.description || "",
    imageUrl: section.imageUrl || "",
    sortOrder: section.sortOrder ?? 0,
    buttonText: section.buttonText || "",
    buttonUrl: section.buttonUrl || "",
    status: section.status || "DRAFT",
    seoTitle: section.seoTitle || "",
    seoDescription: section.seoDescription || "",
  };
}

export function PageSectionsManager() {
  const [sections, setSections] = useState<SectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<SectionRecord | null>(null);
  const [draft, setDraft] = useState<SectionDraft | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/pages?page=1&limit=100", {
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Could not load homepage sections.");
      setSections(
        Array.isArray(result.data) ? (result.data as SectionRecord[]) : [],
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load homepage sections.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...sections]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .filter((section) => {
        if (!query) return true;
        const info = infoFor(section);
        return `${info.label} ${info.group} ${section.title} ${section.subtitle || ""} ${section.description || ""}`
          .toLowerCase()
          .includes(query);
      });
  }, [sections, search]);

  const grouped = useMemo(() => {
    const groups = new Map<string, SectionRecord[]>();
    for (const section of filtered) {
      const group = infoFor(section).group;
      groups.set(group, [...(groups.get(group) || []), section]);
    }
    return Array.from(groups.entries());
  }, [filtered]);

  function openEditor(section: SectionRecord) {
    setActive(section);
    setDraft(draftFrom(section));
    setError("");
    setNotice("");
  }

  function update<K extends keyof SectionDraft>(
    key: K,
    value: SectionDraft[K],
  ) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
    setError("");
    setNotice("");
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!active || !draft || saving) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/pages/${active.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionKey: draft.sectionKey,
          title: draft.title.trim(),
          subtitle: draft.subtitle?.trim() || null,
          description: draft.description?.trim() || null,
          imageUrl: draft.imageUrl?.trim() || null,
          sortOrder: Number(draft.sortOrder) || 0,
          buttonText: draft.buttonText?.trim() || null,
          buttonUrl: draft.buttonUrl?.trim() || null,
          status: draft.status,
          seoTitle: draft.seoTitle?.trim() || null,
          seoDescription: draft.seoDescription?.trim() || null,
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Could not save this section.");
      setNotice(
        "Section updated. Your homepage will show the new content according to its visibility setting.",
      );
      setActive(null);
      setDraft(null);
      await load();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save this section.",
      );
    } finally {
      setSaving(false);
    }
  }

  const publishedCount = sections.filter(
    (item) => item.status === "PUBLISHED",
  ).length;

  return (
    <div className="hol-friendly-page hol-sections-manager">
      <div className="hol-friendly-heading">
        <div>
          <div className="hol-eyebrow">HOMEPAGE CONTENT</div>
          <h1>Page sections</h1>
          <p>
            Edit the text, photos and buttons that appear in different parts of
            your homepage. Select a section to make changes—no database keys or
            code required.
          </p>
        </div>
        <a
          className="hol-button hol-button-secondary"
          href="/"
          target="_blank"
          rel="noreferrer"
        >
          <ArrowUpRight size={16} /> View website
        </a>
      </div>

      <div className="hol-section-summary">
        <div>
          <span className="hol-section-summary-icon">
            <FileText size={19} />
          </span>
          <span>
            <strong>{sections.length}</strong>
            <small>Homepage sections</small>
          </span>
        </div>
        <div>
          <span className="hol-section-summary-icon is-green">
            <Eye size={19} />
          </span>
          <span>
            <strong>{publishedCount}</strong>
            <small>Visible on website</small>
          </span>
        </div>
        <div>
          <span className="hol-section-summary-icon is-muted">
            <EyeOff size={19} />
          </span>
          <span>
            <strong>{sections.length - publishedCount}</strong>
            <small>Draft / hidden</small>
          </span>
        </div>
      </div>

      {notice && (
        <div className="hol-alert hol-alert-success" role="status">
          <Check size={17} />
          {notice}
        </div>
      )}
      {error && (
        <div className="hol-alert hol-alert-error" role="alert">
          <AlertCircle size={17} />
          {error}
        </div>
      )}

      <div className="hol-section-toolbar">
        <label className="hol-search-box">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by section name or content…"
          />
        </label>
        <span>
          {loading ? "Loading sections…" : `${filtered.length} sections shown`}
        </span>
      </div>

      {loading ? (
        <div className="hol-admin-card hol-sections-loading">
          <LoaderCircle size={22} className="hol-spin" /> Loading your homepage
          content…
        </div>
      ) : grouped.length === 0 ? (
        <div className="hol-admin-card hol-empty-state">
          <span className="hol-empty-icon">
            <FileText size={24} />
          </span>
          <strong>No sections found</strong>
          <p>
            Try another search term. The original homepage sections will appear
            here once they have been added to the CMS.
          </p>
        </div>
      ) : (
        grouped.map(([group, items]) => (
          <section className="hol-section-group" key={group}>
            <div className="hol-section-group-heading">
              <h2>{group}</h2>
              <span>
                {items.length} section{items.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="hol-section-card-grid">
              {items.map((section) => {
                const info = infoFor(section);
                return (
                  <article className="hol-section-card" key={section.id}>
                    <div className="hol-section-card-image">
                      {section.imageUrl ? (
                        <img src={section.imageUrl} alt="" />
                      ) : (
                        <span>
                          <ImageIcon size={24} />
                        </span>
                      )}
                      <span
                        className={`hol-status ${section.status === "PUBLISHED" ? "is-green" : "is-amber"}`}
                      >
                        {section.status === "PUBLISHED" ? "Visible" : "Hidden"}
                      </span>
                    </div>
                    <div className="hol-section-card-content">
                      <div className="hol-section-card-meta">
                        <span>ORDER {section.sortOrder}</span>
                        <span>{info.label}</span>
                      </div>
                      <h3>
                        {section.title
                          .replaceAll("|", " ")
                          .replaceAll("\n", " ") || info.label}
                      </h3>
                      {section.subtitle && (
                        <p className="hol-section-card-subtitle">
                          {section.subtitle}
                        </p>
                      )}
                      <p className="hol-section-card-description">
                        {section.description || info.help}
                      </p>
                      <button
                        type="button"
                        className="hol-button hol-button-secondary hol-section-edit"
                        onClick={() => openEditor(section)}
                      >
                        <Pencil size={15} /> Edit this section
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))
      )}

      {active && draft && (
        <div
          className="hol-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setActive(null);
              setDraft(null);
            }
          }}
        >
          <section
            className="hol-editor-modal hol-section-editor-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="section-editor-title"
          >
            <div className="hol-editor-header">
              <div>
                <span className="hol-editor-kicker">HOMEPAGE SECTION</span>
                <h2 id="section-editor-title">Edit {infoFor(active).label}</h2>
                <p>{infoFor(active).help}</p>
              </div>
              <button
                type="button"
                className="hol-icon-button"
                onClick={() => {
                  setActive(null);
                  setDraft(null);
                }}
                disabled={saving}
                aria-label="Close editor"
              >
                <X size={19} />
              </button>
            </div>
            <form onSubmit={save} className="hol-editor-form">
              {error && (
                <div className="hol-alert hol-alert-error" role="alert">
                  <AlertCircle size={17} />
                  {error}
                </div>
              )}
              <div className="hol-section-editor-intro">
                <strong>Update the wording visitors see</strong>
                <p>
                  The section name is fixed so the homepage keeps its design.
                  You can change the text, image, button and visibility below.
                </p>
              </div>
              <div className="hol-section-editor-fields">
                <div className="hol-form-field is-wide">
                  <label htmlFor="section-title" className="hol-field-label">
                    Main heading <span className="hol-required">*</span>
                  </label>
                  <input
                    id="section-title"
                    className="hol-field"
                    required
                    maxLength={200}
                    value={draft.title}
                    onChange={(event) => update("title", event.target.value)}
                    placeholder="Write a short, clear heading"
                  />
                  <p className="hol-field-help">
                    For the main banner, use | between lines if you want a line
                    break in the large heading.
                  </p>
                </div>
                <div className="hol-form-field is-wide">
                  <label htmlFor="section-subtitle" className="hol-field-label">
                    Small heading / short label
                  </label>
                  <input
                    id="section-subtitle"
                    className="hol-field"
                    maxLength={1000}
                    value={draft.subtitle || ""}
                    onChange={(event) => update("subtitle", event.target.value)}
                    placeholder="Example: Who we are"
                  />
                </div>
                <div className="hol-form-field is-wide">
                  <label
                    htmlFor="section-description"
                    className="hol-field-label"
                  >
                    Description / paragraph
                  </label>
                  <textarea
                    id="section-description"
                    className="hol-field hol-textarea"
                    rows={5}
                    value={draft.description || ""}
                    onChange={(event) =>
                      update("description", event.target.value)
                    }
                    placeholder="Explain this part of your business in simple, customer-friendly language…"
                  />
                  <p className="hol-field-help">
                    Keep sentences short and easy for website visitors to
                    understand.
                  </p>
                </div>
                <div className="hol-form-field is-wide">
                  <ImageUploadField
                    label="Section photo (optional)"
                    value={draft.imageUrl || ""}
                    onChange={(value) => update("imageUrl", value)}
                  />
                </div>
                <div className="hol-form-field">
                  <label
                    htmlFor="section-button-text"
                    className="hol-field-label"
                  >
                    Button label (optional)
                  </label>
                  <input
                    id="section-button-text"
                    className="hol-field"
                    maxLength={80}
                    value={draft.buttonText || ""}
                    onChange={(event) =>
                      update("buttonText", event.target.value)
                    }
                    placeholder="Example: Learn more"
                  />
                </div>
                <div className="hol-form-field">
                  <label
                    htmlFor="section-button-url"
                    className="hol-field-label"
                  >
                    Where should the button go?
                  </label>
                  <input
                    id="section-button-url"
                    className="hol-field"
                    value={draft.buttonUrl || ""}
                    onChange={(event) =>
                      update("buttonUrl", event.target.value)
                    }
                    placeholder="Example: /contact or #products"
                  />
                  <p className="hol-field-help">
                    Enter a page address or a section link beginning with #.
                  </p>
                </div>
                <div className="hol-form-field">
                  <label htmlFor="section-order" className="hol-field-label">
                    Display order
                  </label>
                  <input
                    id="section-order"
                    className="hol-field"
                    type="number"
                    min={0}
                    value={draft.sortOrder}
                    onChange={(event) =>
                      update("sortOrder", Number(event.target.value))
                    }
                  />
                  <p className="hol-field-help">
                    Lower numbers appear earlier where the homepage uses this
                    order.
                  </p>
                </div>
                <div className="hol-form-field">
                  <label htmlFor="section-status" className="hol-field-label">
                    Website visibility
                  </label>
                  <select
                    id="section-status"
                    className="hol-field"
                    value={draft.status}
                    onChange={(event) =>
                      update(
                        "status",
                        event.target.value as SectionDraft["status"],
                      )
                    }
                  >
                    <option value="PUBLISHED">Visible on website</option>
                    <option value="DRAFT">Hidden (draft)</option>
                  </select>
                  <p className="hol-field-help">
                    Draft sections are kept in admin but are not shown by CMS
                    sections that respect publication status.
                  </p>
                </div>
              </div>
              <div className="hol-editor-footer">
                <button
                  type="button"
                  className="hol-button hol-button-ghost"
                  onClick={() => {
                    setActive(null);
                    setDraft(null);
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="hol-button hol-button-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <LoaderCircle size={16} className="hol-spin" /> Saving…
                    </>
                  ) : (
                    <>
                      <Check size={16} /> Save section
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
