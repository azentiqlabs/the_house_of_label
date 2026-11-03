import { getHomeData } from "@/lib/home-content";
import { getManagedMetadata } from "@/lib/seo";

const toLines = (value?: string | null) =>
  (value || "").split("\n").map((line) => line.trim()).filter(Boolean);

export async function generateMetadata() {
  const data = await getHomeData();
  const about = data.sections.home_about;
  return getManagedMetadata("/about", {
    title: about?.seoTitle?.trim() || "About The House Of Label",
    description:
      about?.seoDescription?.trim() ||
      about?.description ||
      "Learn about The House Of Label, our label solutions, capabilities and approach to customer requirements.",
    image: about?.imageUrl,
  });
}

export default async function AboutPage() {
  const data = await getHomeData();
  const sections = data.sections;
  const about = sections.home_about;
  const values = [
    { key: "home_vision", fallbackTitle: "Our Vision" },
    { key: "home_mission", fallbackTitle: "Our Mission" },
    { key: "home_strength", fallbackTitle: "Our Strength" },
  ] as const;
  const choose = sections.home_choose;

  return (
    <section className="section">
      <div className="container max-w-5xl">
        <p className="eyebrow">{about?.subtitle || "Who we are"}</p>
        <h1 className="section-title mt-3">About The House Of Label</h1>
        <p className="muted mt-5 max-w-4xl leading-8">
          {about?.description ||
            "The House Of Label provides printed, unprinted and thermal label solutions for product packaging, identification and shipping applications."}
        </p>
        {about?.imageUrl && (
          <img
            src={about.imageUrl}
            alt="The House Of Label label products and capabilities"
            className="mt-8 max-h-[440px] w-full rounded-2xl object-cover"
          />
        )}

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {values.map(({ key, fallbackTitle }) => {
            const section = sections[key];
            if (!section || section.status !== "PUBLISHED") return null;
            return (
              <article className="card p-6" key={key}>
                <h2 className="text-xl font-bold">{section?.title || fallbackTitle}</h2>
                <p className="muted mt-3 text-sm leading-7">
                  {section?.description || "Add your approved company information in Admin → Page Sections."}
                </p>
              </article>
            );
          })}
        </div>

        {choose && choose.status === "PUBLISHED" && (
          <section className="card mt-6 p-6 md:p-8">
            <h2 className="text-2xl font-bold">{choose.title || "Why Choose Us?"}</h2>
            {choose.description && choose.description.includes("\n") ? (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {toLines(choose.description).map((line) => (
                  <li className="muted flex gap-2" key={line}>
                    <span aria-hidden="true">✓</span><span>{line}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted mt-3 leading-7">{choose.description}</p>
            )}
          </section>
        )}
      </div>
    </section>
  );
}
