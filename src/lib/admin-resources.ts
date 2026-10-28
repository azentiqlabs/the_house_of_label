import { prisma } from "@/lib/prisma";
import type { ResourceKey } from "@/lib/validation";
// Resource names are an allow-list; never accept arbitrary Prisma model names from requests.
const delegates: Record<ResourceKey, any> = {
  products: prisma.product,
  categories: prisma.productCategory,
  machines: prisma.machine,
  industries: prisma.industry,
  gallery: prisma.galleryItem,
  brands: prisma.customerBrand,
  pages: prisma.pageContent,
  seo: prisma.seoPage,
  inquiries: prisma.quoteInquiry,
  settings: prisma.siteSetting,
};
export const writableResources: ResourceKey[] = [
  "products",
  "categories",
  "machines",
  "industries",
  "gallery",
  "brands",
  "pages",
  "seo",
  "inquiries",
  "settings",
];
export function delegateFor(resource: string) {
  return writableResources.includes(resource as ResourceKey)
    ? delegates[resource as ResourceKey]
    : null;
}
export function canWriteResource(role: string, resource: ResourceKey) {
  if (role === "SUPER_ADMIN" || role === "ADMIN") return true;
  return (
    role === "EDITOR" &&
    [
      "products",
      "categories",
      "machines",
      "industries",
      "gallery",
      "brands",
      "pages",
      "seo",
    ].includes(resource)
  );
}
export const includeFor: Partial<Record<ResourceKey, any>> = {
  products: { category: true },
};
