import { buildMetadata } from "@/lib/seo";
import { QuoteForm } from "@/components/forms/quote-form";
export const metadata = buildMetadata(
  "Contact & Request a Quote",
  "Contact The House of Labels about your label requirements and request a quote.",
);
export default function ContactPage() {
  return (
    <section className="section bg-slate-50">
      <div className="container">
        <p className="eyebrow">Let's discuss your requirements</p>
        <h1 className="section-title mt-3">Contact Us</h1>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div id="quote" className="card p-6 md:p-8">
            <h2 className="text-2xl font-bold">Request a Quote</h2>
            <p className="muted mt-2 text-sm">
              Share your requirements and our team can get back to you.
            </p>
            <QuoteForm />
          </div>
          <aside className="card p-6 md:p-8">
            <h2 className="text-xl font-bold">Contact Information</h2>
            <p className="muted mt-4 text-sm leading-7">
              Replace demo contact details with the client's verified business
              phone, email and address before publishing.
            </p>
            <p className="mt-4 text-sm">Email: info@your-domain.com</p>
            <p className="mt-2 text-sm">Phone: Add verified business number</p>
            <p className="mt-2 text-sm">Address: Add business address</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
