import { getManagedMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/home-content";
import { QuoteForm } from "@/components/forms/quote-form";

const usable = (value?: string) => {
  const text = value?.trim() || "";
  if (!text) return "";
  if (/demo|example\.com|xxxxx|to be added|your-domain/i.test(text)) return "";
  return text;
};

export async function generateMetadata() {
  return getManagedMetadata("/contact", {
    title: "Request a Custom Label Printing Quote",
    description:
      "Contact The House Of Label to discuss printed, unprinted or thermal label requirements and request a quotation.",
  });
}

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const email = usable(settings.contact_email);
  const phone = usable(settings.contact_phone);
  const address = usable(settings.contact_address);

  return (
    <section className="section bg-slate-50">
      <div className="container">
        <p className="eyebrow">Discuss your label requirements</p>
        <h1 className="section-title mt-3">Request a Label Printing Quote</h1>
        <p className="muted mt-3 max-w-2xl leading-7">
          Tell us about the label type, size, material and application you need. Use the form and the team can follow up with you.
        </p>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div id="quote" className="card p-6 md:p-8">
            <h2 className="text-2xl font-bold">Request a Quote</h2>
            <p className="muted mt-2 text-sm">
              Share your requirements so the right label solution can be discussed.
            </p>
            <QuoteForm />
          </div>
          <aside className="card p-6 md:p-8">
            <h2 className="text-xl font-bold">Contact The House Of Label</h2>
            <p className="muted mt-3 text-sm leading-7">
              For product, packaging and label enquiries, send your requirements using the quotation form.
            </p>
            {email && <p className="mt-4 text-sm">Email: <a href={`mailto:${email}`} className="underline">{email}</a></p>}
            {phone && <p className="mt-2 text-sm">Phone: <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="underline">{phone}</a></p>}
            {address && <p className="mt-2 whitespace-pre-line text-sm">Address: {address}</p>}
          </aside>
        </div>
      </div>
    </section>
  );
}
