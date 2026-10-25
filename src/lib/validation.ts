import { z } from "zod";
const text = (max = 5000) => z.string().trim().max(max);
const optionalText = (max = 5000) => text(max).optional().nullable();
const slug = z.string().trim().min(1).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const url = z.string().trim().url().max(2048).or(z.literal("")).optional().nullable();
export const schemas = {
  products: z.object({ name: text(160).min(1), slug, shortDescription: optionalText(500), description: optionalText(), imageUrl: url, gallery: z.array(z.string().trim().url()).max(30).default([]), status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"), featured: z.boolean().default(false), seoTitle: optionalText(70), seoDescription: optionalText(170), canonicalUrl: url, ogImageUrl: url, noIndex: z.boolean().default(false), categoryId: z.string().min(1) }),
  categories: z.object({ name: text(120).min(1), slug }),
  machines: z.object({ name: text(160).min(1), slug, description: optionalText(), imageUrl: url, status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"), seoTitle: optionalText(70), seoDescription: optionalText(170), canonicalUrl: url, ogImageUrl: url, noIndex: z.boolean().default(false) }),
  industries: z.object({ name: text(160).min(1), slug, description: optionalText(), imageUrl: url, status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"), seoTitle: optionalText(70), seoDescription: optionalText(170), canonicalUrl: url, ogImageUrl: url, noIndex: z.boolean().default(false) }),
  gallery: z.object({ title: text(160).min(1), imageUrl: z.string().trim().url(), category: text(100).min(1), altText: optionalText(250), sortOrder: z.coerce.number().int().min(0).default(0), isActive: z.boolean().default(true) }),
  brands: z.object({ name: text(160).min(1), logoUrl: z.string().trim().url(), website: url, sortOrder: z.coerce.number().int().min(0).default(0), isActive: z.boolean().default(true) }),
  pages: z.object({ sectionKey: text(120).min(1), title: text(200).min(1), subtitle: optionalText(1000), description: optionalText(), imageUrl: url, sortOrder: z.coerce.number().int().min(0).default(0), buttonText: optionalText(80), buttonUrl: url, status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"), seoTitle: optionalText(70), seoDescription: optionalText(170) }),
  seo: z.object({ path: text(300).min(1), title: text(70).min(1), description: text(170), canonicalUrl: url, ogImageUrl: url, noIndex: z.boolean().default(false) }),
  inquiries: z.object({ status: z.enum(["NEW", "CONTACTED", "IN_PROGRESS", "COMPLETED", "SPAM"]), adminNotes: optionalText(5000) }),
  settings: z.object({ key: text(120).min(1), value: text(10000) }),
};
export type ResourceKey = keyof typeof schemas;
