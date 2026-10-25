import Link from "next/link";

export type ProductCardData = {
  name: string;
  slug: string;
  shortDescription?: string | null;
  imageUrl?: string | null;
  category?: { name: string } | null;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <article className="card">
      <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-6 text-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full rounded-lg object-cover"
          />
        ) : (
          <span className="text-5xl font-black text-slate-300">H</span>
        )}
      </div>
      <div className="p-5">
        {product.category && (
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-orange-600">
            {product.category.name}
          </p>
        )}
        <h3 className="font-bold text-slate-900">{product.name}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
          {product.shortDescription ||
            "Explore our label solutions for your application."}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="mt-4 inline-block text-sm font-bold text-orange-600"
        >
          View details ↗
        </Link>
      </div>
    </article>
  );
}
