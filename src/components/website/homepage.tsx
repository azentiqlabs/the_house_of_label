"use client";

import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import type {
  HomeBrand,
  HomeData,
  HomeMachine,
  HomeProduct,
  HomeSection,
} from "@/lib/home-content";

type Props = { data: HomeData };

const visible = (section?: HomeSection) => Boolean(section && section.status === "PUBLISHED");
const sectionText = (section: HomeSection | undefined, fallback = "") => section?.description || fallback;
const sectionHref = (section: HomeSection | undefined, fallback: string) => section?.buttonUrl || fallback;
const lines = (value: string) => value.split("\n").map((part) => part.trim()).filter(Boolean);
const safeImage = (src: string | null | undefined, fallback = "/theme/image15.png") => src || fallback;

function productGroup(product: HomeProduct) {
  const value = `${product.category.slug} ${product.category.name} ${product.name}`.toLowerCase();
  if (value.includes("thermal")) return "thermal";
  if (value.includes("custom") || value.includes("qr")) return "custom";
  if (value.includes("printed") || value.includes("personal care")) return "printed";
  return "other";
}

function brandParts(brand: HomeBrand) {
  const [name, sector] = brand.name.split("|");
  return { name, sector };
}

export function HomePage({ data }: Props) {
  const { sections, settings } = data;
  const [productFilter, setProductFilter] = useState("all");
  const [galleryFilter, setGalleryFilter] = useState("all");
  const [activeMachineId, setActiveMachineId] = useState(data.machines[0]?.id || "");
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsAppFollowUp, setWhatsAppFollowUp] = useState("");

  const get = (key: string) => sections[key];
  const hero = get("home_hero");
  const promo = get("home_promo");
  const about = get("home_about");
  const whatHeading = get("home_what_heading");
  const productsHeading = get("home_products_heading");
  const machinesHeading = get("home_machines_heading");
  const whyHeading = get("home_why_heading");
  const industriesHeading = get("home_industries_heading");
  const galleryHeading = get("home_gallery_heading");
  const contactHeading = get("home_contact_heading");
  const customersHeading = get("home_customers_heading");

  const activeMachine = useMemo<HomeMachine | undefined>(
    () => data.machines.find((machine) => machine.id === activeMachineId) || data.machines[0],
    [activeMachineId, data.machines],
  );

  const shownProducts = data.products.filter((product) => productFilter === "all" || productGroup(product) === productFilter);
  const shownGallery = data.gallery.filter((item) => galleryFilter === "all" || item.category.toLowerCase().replace(/\s+/g, "-") === galleryFilter);
  const phone = (settings.whatsapp_number || "").replace(/\D/g, "");
  const whatsAppUrl = phone.length >= 10 ? `https://wa.me/${phone}?text=${encodeURIComponent("Hello The House of Labels, I would like to discuss my label requirements and request a quotation.")}` : "#contact";
  const logoUrl = settings.site_logo_url || "/theme/THE_HOUSE_OF_LABEL_LOGO02.png";
  const companyName = settings.site_name || "The House of Labels";
  const tagline = settings.site_tagline || "LABELS THAT RUN BETTER";

  async function submitQuote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFormMessage("");
    setWhatsAppFollowUp("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || ""),
      company: String(formData.get("company") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      productType: String(formData.get("product") || ""),
      requirements: String(formData.get("requirements") || ""),
    };
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to submit your inquiry.");
      setFormMessage("Thank you. Your request has been saved, and our team can follow up with you.");
      form.reset();
      if (phone.length >= 10) {
        const message = [
          `Hello ${companyName}, I would like to request a quotation.`,
          "",
          `Name: ${payload.name}`,
          `Company: ${payload.company || "Not provided"}`,
          `Email: ${payload.email}`,
          `Phone: ${payload.phone}`,
          `Product: ${payload.productType || "Not selected"}`,
          `Requirements: ${payload.requirements || "Not provided"}`,
        ].join("\n");
        setWhatsAppFollowUp(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
      }
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : "Unable to submit your inquiry.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="hol-home">
      <main>
        {visible(hero) && (
          <section className="hero hero-light" id="home">
            <div className="hero-decoration hero-decoration-one" aria-hidden="true" />
            <div className="hero-decoration hero-decoration-two" aria-hidden="true" />
            <div className="hero-dots" aria-hidden="true" />
            <div className="container hero-grid">
              <div className="hero-copy">
                <div className="eyebrow">{hero?.subtitle || "Your trusted label partner"}</div>
                <h1>
                  {(() => {
                    const rawTitle = hero?.title || "Reliable|Label Solutions|for Every Industry";
                    const titleParts = rawTitle.split("|");
                    if (titleParts.length < 3) return <>{rawTitle.split("\n").map((part, index, parts) => <Fragment key={`${part}-${index}`}>{index === 1 ? <span>{part}</span> : part}{index < parts.length - 1 ? <br /> : null}</Fragment>)}</>;
                    return <>{titleParts[0]}<br /><span>{titleParts[1]}</span><br />{titleParts.slice(2).join(" ")}</>;
                  })()}
                </h1>
                <p>{sectionText(hero, "High-quality unprinted and printed labels engineered for performance, precision and premium packaging.")}</p>
                <div className="hero-actions">
                  <a className="btn btn-orange" href={sectionHref(hero, "#contact")}>{hero?.buttonText || "Request a Quote"} <span aria-hidden="true">→</span></a>
                  <a className="btn btn-dark" href="#products">View Products</a>
                </div>
              </div>
              <div className="hero-image">
                <img src={safeImage(hero?.imageUrl)} alt="Thermal label rolls and shipping labels" fetchPriority="high" />
              </div>
            </div>
            <div className="container hero-feature-container">
              <div className="feature-strip">
                {[1, 2, 3, 4].map((index) => {
                  const feature = get(`home_feature_${index}`);
                  if (!visible(feature)) return null;
                  return <div className="feature" key={feature?.sectionKey}><span className="feature-icon" aria-hidden="true">{feature?.subtitle || "✦"}</span><span>{lines(feature?.title || "").map((part, lineIndex) => <span key={`${part}-${lineIndex}`}>{part}{lineIndex < lines(feature?.title || "").length - 1 ? <br /> : null}</span>)}</span></div>;
                })}
              </div>
            </div>
          </section>
        )}

        {visible(promo) && (
          <section className="promo-banner" aria-label="Label solutions banner">
            <div className="container promo-banner-inner">
              <div>
                <span className="eyebrow">{promo?.subtitle || "From concept to conversion"}</span>
                <h2>{promo?.title}</h2>
                {promo?.description && <p>{promo.description}</p>}
              </div>
              <a className="btn btn-dark" href={sectionHref(promo, "#products")}>{promo?.buttonText || "Explore Label Types"} <span aria-hidden="true">↗</span></a>
            </div>
          </section>
        )}

        {visible(about) && (
          <section className="section white about-reference" id="about">
            <div className="container about-reference-inner">
              <div className="about-reference-top">
                <div className="about-reference-copy">
                  <div className="about-kicker"><span />{about?.subtitle || "Who we are"}</div>
                  <h2>{about?.title?.startsWith("About The House of ") ? <>About The House of <em>Labels</em></> : about?.title}</h2>
                  <p>{sectionText(about)}</p>
                  {about?.buttonText && <a className="about-learn-link" href={sectionHref(about, "#what-we-do")}>{about.buttonText} <span aria-hidden="true">→</span></a>}
                </div>
                <div className="about-reference-photo">
                  <img src={safeImage(about?.imageUrl, "/theme/image2.jpeg")} alt="The House of Labels manufacturing facility" loading="lazy" />
                </div>
              </div>
              <div className="about-reference-values">
                {([
                  { key: "home_vision", kind: "vision", fallback: "Our Vision", icon: <><path d="M4 24s7-13 20-13 20 13 20 13-7 13-20 13S4 24 4 24Z" /><circle cx="24" cy="24" r="7" /></> },
                  { key: "home_mission", kind: "mission", fallback: "Our Mission", icon: <><path d="M27 29c7-5 12-14 12-23-9 0-18 5-23 12L9 19l-4 9 12-1M19 29l-1 12 9-4 1-7" /><circle cx="29" cy="16" r="4" /><path d="m9 34-4 4m11-2-3 6" /></> },
                  { key: "home_strength", kind: "strength", fallback: "Our Strength", icon: <><path d="M24 5v5m0 28v5M5 24h5m28 0h5M10.5 10.5l3.6 3.6m19.8 19.8 3.6 3.6m0-27-3.6 3.6m-19.8 19.8-3.6 3.6" /><circle cx="24" cy="24" r="14" /><circle cx="24" cy="24" r="7" /></> },
                  { key: "home_choose", kind: "choose", fallback: "Why Choose Us?", icon: <><path d="M24 4 40 10v12c0 10-7 17-16 22C15 39 8 32 8 22V10l16-6Z" /><path d="m16 24 5 5 11-12" /></> },
                ] as const).map((item) => {
                  const content = get(item.key);
                  if (!visible(content)) return null;
                  return (
                    <article className={`about-reference-card ${item.kind === "choose" ? "about-choose-card" : ""}`} key={item.key}>
                      <div className="about-reference-icon" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none">{item.icon}</svg></div>
                      <div className="about-reference-card-body">
                        <h3>{content?.title || item.fallback}</h3><span className="about-card-rule" />
                        {item.kind === "choose" ? <ul className="about-reference-checks">{lines(sectionText(content)).map((line) => <li key={line}>{line}</li>)}</ul> : <p>{sectionText(content)}</p>}
                      </div>
                      <a className="about-card-arrow" href={item.kind === "strength" ? "#machines" : item.kind === "choose" ? "#contact" : "#what-we-do"} aria-label={`Explore ${content?.title || item.fallback}`}>→</a>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {visible(whatHeading) && (
          <section className="section what-we-do-reference" id="what-we-do">
            <div className="container">
              <div className="section-heading">
                <div><div className="eyebrow">{whatHeading?.subtitle || "What we do"}</div><h2>{whatHeading?.title}</h2></div>
                <p>{sectionText(whatHeading)}</p>
              </div>
              <div className="what-grid">
                {["home_what_printed", "home_what_unprinted", "home_what_thermal", "home_what_custom"].map((key) => {
                  const item = get(key);
                  if (!visible(item)) return null;
                  return <article className="what-card" key={key}><span>{item?.subtitle || "✦"}</span><h3>{item?.title}</h3><p>{sectionText(item)}</p><a href={sectionHref(item, "#products")}>{item?.buttonText || "Explore products"} ↗</a></article>;
                })}
              </div>
            </div>
          </section>
        )}

        {visible(productsHeading) && (
          <section className="section soft" id="products">
            <div className="container">
              <div className="section-head"><div><div className="eyebrow">{productsHeading?.subtitle || "Explore our range"}</div><h2>{productsHeading?.title || "Our Products"}</h2><p>{sectionText(productsHeading)}</p></div><a href="#contact" className="btn btn-orange">Need a custom label? →</a></div>
              <div className="filters" aria-label="Filter products">
                {[{ value: "all", label: "All" }, { value: "printed", label: "Printed Labels" }, { value: "thermal", label: "Thermal Labels" }, { value: "custom", label: "Custom Labels" }].map((filter) => <button type="button" key={filter.value} className={`filter ${productFilter === filter.value ? "active" : ""}`} onClick={() => setProductFilter(filter.value)} aria-pressed={productFilter === filter.value}>{filter.label}</button>)}
              </div>
              <div className="product-grid">
                {shownProducts.map((product) => <article className="product-card" data-category={productGroup(product)} key={product.id}><img src={safeImage(product.imageUrl, "/theme/image10.jpeg")} alt={product.name} loading="lazy" /><div className="product-info"><h3>{product.name}</h3><p>{product.shortDescription || product.description || "High-quality label solutions for your application."}</p><Link className="btn btn-outline btn-small" href={`/products/${product.slug}`}>View Details</Link></div></article>)}
                {shownProducts.length === 0 && <p className="empty-content">No products are currently published in this category.</p>}
              </div>
            </div>
          </section>
        )}

        {visible(machinesHeading) && (
          <section className="section white" id="machines">
            <div className="container">
              <div className="section-head"><div><div className="eyebrow">{machinesHeading?.subtitle || "Built for precision"}</div><h2>{machinesHeading?.title || "Our Machines"}</h2><p>{sectionText(machinesHeading)}</p></div></div>
              <div className="machines-layout">
                {activeMachine && <article className="machine-feature"><img src={safeImage(activeMachine.imageUrl, "/theme/image4.jpeg")} alt={activeMachine.name} loading="lazy" /><div className="machine-feature-content"><span className="machine-label">OUR MACHINERY</span><h3>{activeMachine.name}</h3><p>{activeMachine.description || "Precision machinery supporting consistent label production."}</p></div></article>}
                <div className="machine-list">
                  {data.machines.map((machine) => <button type="button" className={`machine-row ${activeMachine?.id === machine.id ? "active" : ""}`} key={machine.id} onClick={() => setActiveMachineId(machine.id)} aria-pressed={activeMachine?.id === machine.id}><img src={safeImage(machine.imageUrl, "/theme/image4.jpeg")} alt={machine.name} loading="lazy" /><div><h3>{machine.name}</h3><p>{machine.description?.split(/[.!?]/)[0] || "Precision equipment for label production."}</p></div><span className="machine-arrow">↗</span></button>)}
                  {data.machines.length === 0 && <p className="empty-content">No machines are currently published.</p>}
                </div>
              </div>
            </div>
          </section>
        )}

        {visible(whyHeading) && (
          <section className="section soft" id="why-us">
            <div className="container">
              <div className="section-heading"><div><div className="eyebrow">{whyHeading?.subtitle || "Why The House of Labels?"}</div><h2>{whyHeading?.title}</h2></div><p>{sectionText(whyHeading)}</p></div>
              <div className="what-grid">
                {[1, 2, 3, 4].map((number) => {
                  const item = get(`home_why_card_${number}`);
                  if (!visible(item)) return null;
                  return <article className="what-card" key={item?.sectionKey}><span>{item?.subtitle || "✦"}</span><h3>{item?.title}</h3><p>{sectionText(item)}</p></article>;
                })}
              </div>
            </div>
          </section>
        )}

        {visible(industriesHeading) && (
          <section className="section industries-section" id="industries">
            <div className="container">
              <div className="industries-heading-row"><div className="section-head industries-section-head"><div><div className="eyebrow">{industriesHeading?.subtitle || "Label solutions for every sector"}</div><h2>{industriesHeading?.title || "Industries We Serve"}</h2><p>{sectionText(industriesHeading)}</p></div></div><a className="industries-all-link" href="#contact">Discuss your requirements <span aria-hidden="true">↗</span></a></div>
              <div className="industry-grid industry-grid-no-images">
                {data.industries.map((industry, index) => <a className={`industry-card${industry.imageUrl ? " has-industry-image" : ""}`} href="#contact" key={industry.id}><span className="industry-card-top">{industry.imageUrl ? <img className="industry-photo" src={safeImage(industry.imageUrl)} alt={industry.name} loading="lazy" /> : <span className="industry-icon" aria-hidden="true">{["◉", "▤", "✦", "✚", "⚗", "♧", "▣", "◎"][index % 8]}</span>}<span className="industry-number">{String(index + 1).padStart(2, "0")}</span></span><h3>{industry.name}</h3><p>{industry.description || "Application-specific label solutions for this sector."}</p><span className="industry-card-link">Explore solutions <span aria-hidden="true">↗</span></span></a>)}
              </div>
              <div className="industries-bottom-note"><span className="industries-note-mark" aria-hidden="true">✓</span><p><strong>Need something specific?</strong> We can help you choose the right label format, finish and material for your application.</p><a href="#contact">Let’s talk <span aria-hidden="true">→</span></a></div>
            </div>
          </section>
        )}

        {visible(galleryHeading) && (
          <section className="section soft" id="gallery">
            <div className="container">
              <div className="section-head"><div><div className="eyebrow">{galleryHeading?.subtitle || "A closer look"}</div><h2>{galleryHeading?.title || "Gallery"}</h2><p>{sectionText(galleryHeading)}</p></div></div>
              <div className="filters" aria-label="Filter gallery">
                {[{ value: "all", label: "All" }, { value: "products", label: "Products" }, { value: "machines", label: "Machines" }, { value: "facility", label: "Our Facility" }, { value: "applications", label: "Applications" }].map((filter) => <button type="button" key={filter.value} className={`filter ${galleryFilter === filter.value ? "active" : ""}`} onClick={() => setGalleryFilter(filter.value)} aria-pressed={galleryFilter === filter.value}>{filter.label}</button>)}
              </div>
              <div className="gallery-grid">
                {shownGallery.map((item) => <img data-gallery-item={item.category} key={item.id} src={item.imageUrl} alt={item.altText || item.title} title={item.title} loading="lazy" />)}
                {shownGallery.length === 0 && <p className="empty-content">No gallery images are currently published in this category.</p>}
              </div>
            </div>
          </section>
        )}

        {visible(contactHeading) && (
          <section className="section quote-section" id="contact">
            <div className="container quote-layout">
              <form className="quote-form" onSubmit={submitQuote}>
                <h2>{contactHeading?.title || "Request a Quote"}</h2>
                <p>{sectionText(contactHeading, "Get the best label solution for your business. Share your requirements and our experts will get back to you.")}</p>
                <div className="form-grid">
                  <input name="name" placeholder="Your Name*" required minLength={2} maxLength={120} />
                  <input name="company" placeholder="Company Name" maxLength={160} />
                  <input type="email" name="email" placeholder="Email Address*" required maxLength={254} />
                  <input name="phone" placeholder="Phone Number*" required minLength={7} maxLength={30} />
                  <select name="product" className="wide" defaultValue="" required><option value="">Product Type*</option><option>Unprinted Labels</option><option>Printed Labels</option><option>Thermal Labels</option><option>Speciality Labels</option><option>Custom Labels</option></select>
                  <textarea name="requirements" className="wide" placeholder="Your Requirements" required minLength={5} maxLength={5000} />
                  <button className="btn btn-orange wide" type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting…" : "☏  Send Request →"}</button>
                </div>
                {formMessage && <p className="form-message" role="status">{formMessage}</p>}
                {whatsAppFollowUp && <a className="form-whatsapp-followup" href={whatsAppFollowUp} target="_blank" rel="noreferrer">Send a copy on WhatsApp ↗</a>}
              </form>
              <aside className="contact-card">
                <h3>Or Chat Directly</h3><p>Have a question? Chat with our team on WhatsApp.</p><a className="whatsapp" href={whatsAppUrl} target={phone.length >= 10 ? "_blank" : undefined} rel={phone.length >= 10 ? "noreferrer" : undefined}>◉ &nbsp; Chat on WhatsApp</a>
                <hr />
                <h3>Contact Information</h3>
                <div className="contact-line"><b>☎</b><span>{settings.contact_phone || "Add verified business phone"}</span></div>
                <div className="contact-line"><b>✉</b><span>{settings.contact_email || "Add verified business email"}</span></div>
                <div className="contact-line"><b>⌖</b><span>{lines(settings.contact_address || "Business address to be added").map((part, index) => <span key={`${part}-${index}`}>{part}{index < lines(settings.contact_address || "Business address to be added").length - 1 ? <br /> : null}</span>)}</span></div>
                <p className="contact-note">Replace demo contact details with verified business information before publishing.</p>
              </aside>
            </div>
          </section>
        )}
      {visible(customersHeading) && (
        <section className="customer-strip section" id="customers" aria-label="Our customers">
          <div className="container">
            <div className="section-head"><div><div className="kicker">{customersHeading?.subtitle || "Trusted partnerships"}</div><h2>{customersHeading?.title || "Brands we work with"}</h2></div><p>{sectionText(customersHeading)}</p></div>
            <div className="logo-marquee" role="region" aria-label="Scrolling customer logos"><div className="logo-track">
              {[...data.brands, ...data.brands].map((brand, index) => {
                const { name, sector } = brandParts(brand);
                return <div className={`customer-logo${brand.logoUrl ? " has-customer-logo-image" : ""}`} key={`${brand.id}-${index}`}>{brand.logoUrl ? <img className="customer-logo-image" src={safeImage(brand.logoUrl)} alt={`${name} logo`} loading="lazy" /> : <span className="customer-symbol" aria-hidden="true">{["✦", "◈", "●", "✚", "▰", "◉"][index % 6]}</span>}<span className="customer-logo-name">{name}<small>{sector || "BRAND PARTNER"}</small></span></div>;
              })}
            </div></div>
            {settings.show_customer_sample_note !== "0" && <p className="sample-note">Demo logos only — these are fictional sample brands, not confirmed customers. Replace them with approved customer names or logos before launch.</p>}
          </div>
        </section>
      )}


      </main>
      <a className="to-top" href="#home" aria-label="Back to top">↑</a>
      <a className="wa-float" href={whatsAppUrl} target={phone.length >= 10 ? "_blank" : undefined} rel={phone.length >= 10 ? "noreferrer" : undefined} aria-label="Chat on WhatsApp">◉</a>
    </div>
  );
}
