import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
export const metadata = buildMetadata(
  "Gallery",
  "Explore our label products, machines, facility and applications.",
);
export default async function GalleryPage() {
  let items: any[] = [];
  try {
    items = await prisma.galleryItem.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {}
  return (
    <section className="section bg-slate-50">
      <div className="container">
        <p className="eyebrow">A closer look</p>
        <h1 className="section-title mt-3">Gallery</h1>
        {items.length ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <figure className="card" key={item.id}>
                <img
                  src={item.imageUrl}
                  alt={item.altText || item.title}
                  className="aspect-square w-full object-cover"
                />
                <figcaption className="p-3 text-sm font-semibold">
                  {item.title}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <p className="muted mt-6">
            Gallery images will appear here after they are added to the
            database.
          </p>
        )}
      </div>
    </section>
  );
}
