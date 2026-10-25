import { buildMetadata } from "@/lib/seo";
export const metadata = buildMetadata(
  "About Us",
  "Learn about The House of Labels and our label manufacturing capabilities.",
);
export default function AboutPage() {
  return (
    <section className="section">
      <div className="container max-w-4xl">
        <p className="eyebrow">Who we are</p>
        <h1 className="section-title mt-3">About The House of Labels</h1>
        <p className="muted mt-5 leading-8">
          We provide label solutions for diverse packaging applications. Add the
          approved company story, capabilities, vision, mission and strengths
          here, then manage this content through the CMS.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            [
              "Our Vision",
              "Become a trusted partner for dependable label solutions.",
            ],
            ["Our Mission", "Provide labels that look better and work better."],
            [
              "Our Strength",
              "Application knowledge, material expertise and consistent quality.",
            ],
          ].map(([a, b]) => (
            <article className="card p-5" key={a}>
              <h2 className="font-bold">{a}</h2>
              <p className="muted mt-2 text-sm leading-6">{b}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
