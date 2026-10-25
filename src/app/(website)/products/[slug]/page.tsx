import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await prisma.product.findFirst({
      where: { slug, status: "PUBLISHED" },
    });
    if (product)
      return {
        title: product.seoTitle || product.name,
        description:
          product.seoDescription ||
          product.shortDescription ||
          product.description ||
          siteConfig.description,
        alternates: { canonical: `/products/${product.slug}` },
        openGraph: {
          title: product.seoTitle || product.name,
          description:
            product.seoDescription ||
            product.shortDescription ||
            siteConfig.description,
          images: product.imageUrl ? [product.imageUrl] : [],
        },
      };
  } catch {}
  return { title: "Product details" };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product = null;
  try {
    product = await prisma.product.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: { category: true },
    });
  } catch {}
  if (!product) notFound();
  return (
    <section className="section">
      <div className="container grid gap-10 md:grid-cols-2">
        <div className="flex min-h-80 items-center justify-center rounded-2xl bg-slate-100 p-8">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-h-[420px] w-full rounded-xl object-cover"
            />
          ) : (
            <span className="text-7xl font-black text-slate-300">H</span>
          )}
        </div>
        <div>
          <p className="eyebrow">{product.category.name}</p>
          <h1 className="section-title mt-3">{product.name}</h1>
          <p className="muted mt-5 leading-7">
            {product.description ||
              product.shortDescription ||
              "Contact us to discuss specifications and availability."}
          </p>
          <Link href="/contact#quote" className="btn btn-primary mt-7">
            Request a Quote ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
