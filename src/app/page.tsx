
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "The House of Labels | Reliable Label Solutions",
  description:
    "Explore high-quality printed, unprinted, thermal and specialty label solutions for every industry.",
};

const features = [
  "High Quality Materials",
  "Consistent Performance",
  "Fast Deliveries",
  "Custom Solutions",
];

const industries = [
  "Food & Dairy",
  "FMCG",
  "Home & Personal Care",
  "Pharmaceuticals",
  "Chemicals",
  "Agro & Pesticides",
  "Retail & Logistics",
  "Custom Applications",
];

export default async function Home() {
  let products: Array<{
    id: string;
    name: string;
    slug: string;
    shortDescription: string | null;
  }> = [];

  try {
    products = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });
  } catch {
    // The homepage can render while the database is being configured.
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="bg-[#071b31] py-16 text-white md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2 md:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
              Your trusted label partner
            </p>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-6xl">
              Reliable{" "}
              <span className="text-orange-500">
                Label Solutions
              </span>{" "}
              for Every Industry
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300">
              High-quality unprinted and printed labels engineered
              for performance, precision and premium packaging.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact#quote"
                className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600"
              >
                Request a Quote ↗
              </Link>

              <Link
                href="/products"
                className="rounded-lg border border-slate-500 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
              >
                View Products
              </Link>
            </div>
          </div>

          <div className="flex min-h-72 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-slate-700 to-slate-900 p-8 text-center">
            <div>
              <div className="text-7xl">🏭</div>
              <p className="mt-4 font-semibold">
                Precision Label Manufacturing
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Replace this placeholder with your approved factory image.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-7xl grid-cols-2 gap-3 px-5 md:grid-cols-4 md:px-8">
          {features.map((feature) => (
            <div
              key={feature}
              className="rounded-lg bg-white p-4 text-center text-sm font-bold text-slate-900"
            >
              <span className="text-orange-500">✦</span>{" "}
              {feature}
            </div>
          ))}
        </div>
      </section>

      {/* Promotional banner */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-400 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 md:flex-row md:items-center md:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest">
              From concept to conversion
            </p>
            <h2 className="mt-2 text-2xl font-extrabold">
              Better labels. Smoother lines. Stronger brands.
            </h2>
          </div>

          <Link
            href="/products"
            className="w-fit rounded-lg border border-white/70 px-5 py-3 text-sm font-bold hover:bg-white/10"
          >
            Explore Label Types ↗
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
            Who we are
          </p>

          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
            About Us
          </h2>

          <h3 className="mt-4 font-bold text-orange-600">
            The House of Labels
          </h3>

          <p className="mt-4 max-w-3xl leading-7 text-slate-600">
            We provide high-quality label solutions for diverse
            packaging applications, focusing on material expertise,
            precision, consistency and reliable support.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Our Vision",
                description:
                  "Become a trusted partner for dependable label solutions.",
              },
              {
                title: "Our Mission",
                description:
                  "Provide labels that look better and work better.",
              },
              {
                title: "Our Strength",
                description:
                  "Expertise in materials, printing and applications.",
              },
              {
                title: "Why Choose Us?",
                description:
                  "Quality, fast delivery and responsive support.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
            Explore our range
          </p>

          <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="text-3xl font-extrabold md:text-4xl">
              Our Products
            </h2>

            <Link
              href="/products"
              className="font-bold text-orange-600 hover:text-orange-700"
            >
              View All Products ↗
            </Link>
          </div>

          <p className="mt-3 text-slate-600">
            Label solutions designed for diverse applications.
          </p>

          {products.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex aspect-[4/3] items-center justify-center bg-slate-100 text-5xl font-extrabold text-slate-300">
                    H
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold">{product.name}</h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {product.shortDescription ||
                        "Explore our label solutions for your application."}
                    </p>

                    <Link
                      href={`/products/${product.slug}`}
                      className="mt-4 inline-block text-sm font-bold text-orange-600"
                    >
                      View Details ↗
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <p className="font-bold">
                Our products will appear here.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Add and publish products in your database to display them.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Industries */}
      <section className="bg-[#071b31] py-20 text-white">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
            Applications and expertise
          </p>

          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
            Industries We Serve
          </h2>

          <p className="mt-4 max-w-2xl text-slate-300">
            We provide label solutions for a wide range of industries.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {industries.map((industry) => (
              <div
                key={industry}
                className="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
              >
                <span className="text-2xl text-orange-400">✦</span>
                <h3 className="mt-3 text-sm font-bold">{industry}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl rounded-2xl bg-orange-500 px-6 py-12 text-center text-white md:px-12">
          <h2 className="text-3xl font-extrabold">
            Need a Custom Label Solution?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7">
            Tell us about your requirements and let us help you find
            the right label for your application.
          </p>

          <Link
            href="/contact#quote"
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-sm font-bold text-orange-600 hover:bg-orange-50"
          >
            Request a Quote ↗
          </Link>
        </div>
      </section>
    </main>
  );
}
