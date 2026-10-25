import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { ProductCard } from "@/components/website/product-card";
export const metadata = buildMetadata(
  "Products",
  "Explore printed, unprinted, thermal and specialty label solutions.",
);
export default async function ProductsPage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {}
  return (
    <section className="section bg-slate-50">
      <div className="container">
        <p className="eyebrow">Explore our range</p>
        <h1 className="section-title mt-3">Our Products</h1>
        <p className="muted mt-3 max-w-2xl">
          Label solutions for diverse applications and packaging needs.
        </p>
        {products.length ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-xl bg-white p-8 text-slate-500">
            No published products yet. Add products through the admin workflow
            once it is configured.
          </p>
        )}
      </div>
    </section>
  );
}
