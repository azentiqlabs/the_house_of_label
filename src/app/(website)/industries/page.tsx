import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
export const metadata = buildMetadata(
  "Industries We Serve",
  "Label solutions for food, personal care, pharmaceuticals, chemicals and more.",
);
export default async function IndustriesPage() {
  let industries: any[] = [];
  try {
    industries = await prisma.industry.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
    });
  } catch {}
  return (
    <section className="section bg-[#071b31] text-white">
      <div className="container">
        <p className="eyebrow">Applications and expertise</p>
        <h1 className="section-title mt-3">Industries We Serve</h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Application-specific label solutions across a range of industries.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industries.length
            ? industries.map((i) => (
                <article
                  className="rounded-xl border border-white/10 bg-white/5 p-5"
                  key={i.id}
                >
                  {i.imageUrl && (
                    <img
                      src={i.imageUrl}
                      alt={i.name}
                      className="mb-4 aspect-video w-full rounded-lg object-cover"
                    />
                  )}
                  <h2 className="font-bold">{i.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {i.description}
                  </p>
                </article>
              ))
            : [
                "Food & Dairy",
                "FMCG",
                "Home & Personal Care",
                "Pharmaceuticals",
                "Lubricants & Chemicals",
                "Agro & Pesticides",
                "Retail & Logistics",
                "Custom Applications",
              ].map((i) => (
                <article
                  className="rounded-xl border border-white/10 bg-white/5 p-5"
                  key={i}
                >
                  <h2 className="font-bold">{i}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Label solutions designed for your application.
                  </p>
                </article>
              ))}
        </div>
      </div>
    </section>
  );
}
