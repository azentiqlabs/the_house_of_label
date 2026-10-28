import { prisma } from "@/lib/prisma";

export type HomeSection = {
  id?: string;
  sectionKey: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder?: number;
  buttonText?: string | null;
  buttonUrl?: string | null;
  status: string;
};

export type HomeProduct = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description?: string | null;
  imageUrl: string | null;
  category: { name: string; slug: string };
};

export type HomeMachine = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
};

export type HomeIndustry = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
};

export type HomeGalleryItem = {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  altText: string | null;
};

export type HomeBrand = {
  id: string;
  name: string;
  logoUrl: string | null;
  website: string | null;
};

export type HomeData = {
  initialized: boolean;
  sections: Record<string, HomeSection>;
  settings: Record<string, string>;
  products: HomeProduct[];
  machines: HomeMachine[];
  industries: HomeIndustry[];
  gallery: HomeGalleryItem[];
  brands: HomeBrand[];
};

const defaultSections: HomeSection[] = [
  {
    sectionKey: "home_hero",
    title: "Reliable|Label Solutions|for Every Industry",
    subtitle: "Your trusted label partner",
    description:
      "High-quality unprinted and printed labels engineered for performance, precision and premium packaging.",
    imageUrl: "/theme/image15.png",
    buttonText: "Request a Quote",
    buttonUrl: "#contact",
    status: "PUBLISHED",
    sortOrder: 0,
  },
  { sectionKey: "home_feature_1", title: "High Quality\nMaterials", subtitle: "♧", status: "PUBLISHED", sortOrder: 1 },
  { sectionKey: "home_feature_2", title: "Consistent\nPerformance", subtitle: "✓", status: "PUBLISHED", sortOrder: 2 },
  { sectionKey: "home_feature_3", title: "Fast\nDeliveries", subtitle: "↗", status: "PUBLISHED", sortOrder: 3 },
  { sectionKey: "home_feature_4", title: "Custom Solutions\nfor Your Needs", subtitle: "⚙", status: "PUBLISHED", sortOrder: 4 },
  {
    sectionKey: "home_promo",
    title: "Better labels. Smoother lines. Stronger brands.",
    subtitle: "From concept to conversion",
    description: "Printed, unprinted and thermal label solutions designed around your application.",
    buttonText: "Explore Label Types",
    buttonUrl: "#products",
    status: "PUBLISHED",
    sortOrder: 5,
  },
  {
    sectionKey: "home_about",
    title: "About The House of Labels",
    subtitle: "Who we are",
    description:
      "The House of Labels is a specialized label manufacturing company delivering high-quality unprinted and printed label solutions for diverse packaging applications across industries.",
    imageUrl: "/theme/image2.jpeg",
    buttonText: "Learn More",
    buttonUrl: "#what-we-do",
    status: "PUBLISHED",
    sortOrder: 6,
  },
  {
    sectionKey: "home_vision",
    title: "Our Vision",
    description: "To become a trusted partner for brands by delivering reliable, innovative, and performance-driven label solutions.",
    status: "PUBLISHED",
    sortOrder: 7,
  },
  {
    sectionKey: "home_mission",
    title: "Our Mission",
    description: "To provide labels that run better, look better, and cost better.",
    status: "PUBLISHED",
    sortOrder: 8,
  },
  {
    sectionKey: "home_strength",
    title: "Our Strength",
    description: "Expertise in adhesives, materials, printing, accurate alignment, die-cutting accuracy, and roll form optimization.",
    status: "PUBLISHED",
    sortOrder: 9,
  },
  {
    sectionKey: "home_choose",
    title: "Why Choose Us?",
    description: "Strong material knowledge\nApplication-based development\nFocus on machine performance\nConsistent quality\nFast response & deliveries\nCost-optimized solutions",
    status: "PUBLISHED",
    sortOrder: 10,
  },
  {
    sectionKey: "home_what_heading",
    title: "Label solutions made for your application.",
    subtitle: "What we do",
    description: "From standard label rolls to custom printed formats, we help match materials, adhesives and label construction to your product and production line.",
    status: "PUBLISHED",
    sortOrder: 11,
  },
  { sectionKey: "home_what_printed", title: "Printed Labels", subtitle: "▤", description: "Custom artwork and brand-focused pressure-sensitive labels for product packaging.", buttonText: "Explore products", buttonUrl: "#products", status: "PUBLISHED", sortOrder: 12 },
  { sectionKey: "home_what_unprinted", title: "Unprinted Labels", subtitle: "◉", description: "Label stock for identification, variable information and customer-specific printing.", buttonText: "Explore products", buttonUrl: "#products", status: "PUBLISHED", sortOrder: 13 },
  { sectionKey: "home_what_thermal", title: "Thermal Labels", subtitle: "▥", description: "Direct thermal and thermal transfer label options for compatible printer systems.", buttonText: "Explore products", buttonUrl: "#products", status: "PUBLISHED", sortOrder: 14 },
  { sectionKey: "home_what_custom", title: "Custom Label Formats", subtitle: "✳", description: "Application-led discussions around dimensions, roll format, adhesive and use conditions.", buttonText: "Discuss your needs", buttonUrl: "#contact", status: "PUBLISHED", sortOrder: 15 },
  { sectionKey: "home_products_heading", title: "Our Products", subtitle: "Explore our range", description: "We manufacture and supply a wide range of label solutions for diverse applications.", status: "PUBLISHED", sortOrder: 16 },
  { sectionKey: "home_machines_heading", title: "Our Machines", subtitle: "Built for precision", description: "Advanced technology for precision, quality and consistency.", status: "PUBLISHED", sortOrder: 17 },
  { sectionKey: "home_why_heading", title: "Practical expertise. Consistent performance.", subtitle: "Why The House of Labels?", description: "We balance label appearance with how labels behave on your application and production line.", status: "PUBLISHED", sortOrder: 18 },
  { sectionKey: "home_why_card_1", title: "Material Knowledge", subtitle: "✓", description: "Consideration of facestock, adhesive and liner choices, including suitable standard and specialty stocks.", status: "PUBLISHED", sortOrder: 19 },
  { sectionKey: "home_why_card_2", title: "Application-led Development", subtitle: "⚙", description: "Label discussions start with the package, environment and application method.", status: "PUBLISHED", sortOrder: 20 },
  { sectionKey: "home_why_card_3", title: "Line Performance", subtitle: "◎", description: "Focus on dispensing accuracy, roll-form requirements and die-cutting consistency.", status: "PUBLISHED", sortOrder: 21 },
  { sectionKey: "home_why_card_4", title: "Responsive Support", subtitle: "↗", description: "Cost-conscious options and clear communication throughout the quotation process.", status: "PUBLISHED", sortOrder: 22 },
  { sectionKey: "home_industries_heading", title: "Industries we serve", subtitle: "Label solutions for every sector", description: "Application-focused label solutions for a wide range of industries.", status: "PUBLISHED", sortOrder: 23 },
  { sectionKey: "home_gallery_heading", title: "Gallery", subtitle: "A closer look", description: "Explore our products, production equipment and label applications.", status: "PUBLISHED", sortOrder: 24 },
  { sectionKey: "home_contact_heading", title: "Request a Quote", subtitle: "Let's discuss your requirements", description: "Get the best label solution for your business. Share your requirements and our experts will get back to you.", status: "PUBLISHED", sortOrder: 25 },
  { sectionKey: "home_customers_heading", title: "Brands we work with", subtitle: "Trusted partnerships", description: "Customer logo strip — replace these sample names with approved customer logos.", status: "PUBLISHED", sortOrder: 26 },
];

const defaultSettings: Record<string, string> = {
  site_name: "The House of Labels",
  site_tagline: "LABELS THAT RUN BETTER",
  site_logo_url: "/theme/THE_HOUSE_OF_LABEL_LOGO02.png",
  whatsapp_number: "",
  contact_phone: "+91 XXXXX XXXXX (demo)",
  contact_email: "info@thehouseoflabels.example",
  contact_address: "Business address to be added\nCity, State, PIN (demo)",
  footer_note: "All rights reserved.",
  nav_home: "Home",
  nav_about: "About Us",
  nav_what_we_do: "What We Do",
  nav_products: "Products",
  nav_machines: "Our Machines",
  nav_industries: "Industries",
  nav_gallery: "Gallery",
  nav_contact: "Contact",
  header_quote_text: "Request a Quote",
  show_customer_sample_note: "1",
};

const defaultProducts: HomeProduct[] = [
  { id: "demo-product-1", name: "Printed Product & Packaging Labels", slug: "printed-product-packaging-labels", shortDescription: "High-quality printed labels for product identification and branding.", imageUrl: "/theme/image9.jpeg", category: { name: "Printed Labels", slug: "printed-labels" } },
  { id: "demo-product-2", name: "Personal Care Labels", slug: "personal-care-labels", shortDescription: "Professional labels for cosmetic, skincare and personal care products.", imageUrl: "/theme/image8.jpeg", category: { name: "Printed Labels", slug: "printed-labels" } },
  { id: "demo-product-3", name: "Custom Labels & QR Code Stickers", slug: "custom-labels-qr-code-stickers", shortDescription: "Custom label designs with QR codes for branding and product information.", imageUrl: "/theme/image7.jpeg", category: { name: "Custom Labels", slug: "custom-labels" } },
  { id: "demo-product-4", name: "Direct Thermal (DT) Labels", slug: "direct-thermal-labels", shortDescription: "Thermal labels for barcode printing, retail and everyday labeling.", imageUrl: "/theme/image12.jpeg", category: { name: "Thermal Labels", slug: "thermal-labels" } },
  { id: "demo-product-5", name: "Thermal Shipping Labels", slug: "thermal-shipping-labels", shortDescription: "Shipping and logistics labels with clear barcode and address printing.", imageUrl: "/theme/image11.jpeg", category: { name: "Thermal Labels", slug: "thermal-labels" } },
  { id: "demo-product-6", name: "Thermal Transfer (TT) Labels", slug: "thermal-transfer-labels", shortDescription: "Barcode and identification labels designed for ribbon-based printing.", imageUrl: "/theme/image10.jpeg", category: { name: "Thermal Labels", slug: "thermal-labels" } },
];

const defaultMachines: HomeMachine[] = [
  { id: "demo-machine-1", name: "Flexographic Printing Machine", slug: "flexographic-printing-machine", description: "High-speed flexographic printing for premium quality labels, with reliable registration and consistent output.", imageUrl: "/theme/image4.jpeg" },
  { id: "demo-machine-2", name: "Slitting Machine", slug: "slitting-machine", description: "Precision slitting technology delivers accurate roll widths and clean edges for consistent label finishing.", imageUrl: "/theme/image3.jpeg" },
  { id: "demo-machine-3", name: "Die-Cutting Machine", slug: "die-cutting-machine", description: "Designed for accurate custom shapes and sizes, helping produce labels with clean cuts and consistent finishing.", imageUrl: "/theme/image5.jpeg" },
  { id: "demo-machine-4", name: "Rewinding Machine", slug: "rewinding-machine", description: "Reliable rewinding creates neat, uniform label rolls for smooth handling, storage and application.", imageUrl: "/theme/image6.jpeg" },
  { id: "demo-machine-5", name: "Inspection & Quality Check", slug: "inspection-quality-check", description: "Quality inspection helps identify printing defects and maintain consistent label quality before dispatch.", imageUrl: "/theme/image3.jpeg" },
];

const defaultIndustries: HomeIndustry[] = [
  { id: "demo-industry-1", name: "Food & Dairy", slug: "food-dairy", description: "Clear, durable product labels for food and dairy packaging.", imageUrl: null },
  { id: "demo-industry-2", name: "FMCG", slug: "fmcg", description: "Reliable labels for fast-moving consumer goods.", imageUrl: null },
  { id: "demo-industry-3", name: "Home & Personal Care", slug: "home-personal-care", description: "Packaging labels for cosmetics, skincare and household products.", imageUrl: null },
  { id: "demo-industry-4", name: "Pharmaceuticals", slug: "pharmaceuticals", description: "Legible information labels for healthcare packaging.", imageUrl: null },
  { id: "demo-industry-5", name: "Lubricants & Chemicals", slug: "lubricants-chemicals", description: "Application-focused labels for industrial and chemical containers.", imageUrl: null },
  { id: "demo-industry-6", name: "Agro & Pesticides", slug: "agro-pesticides", description: "Product and compliance information labels for agricultural packaging.", imageUrl: null },
  { id: "demo-industry-7", name: "Retail & Logistics", slug: "retail-logistics", description: "Barcode, shipping and tracking labels for efficient operations.", imageUrl: null },
  { id: "demo-industry-8", name: "Custom Applications", slug: "custom-applications", description: "Made-to-fit label options for specialised product requirements.", imageUrl: null },
];

const defaultGallery: HomeGalleryItem[] = [
  { id: "demo-gallery-1", title: "Thermal label rolls", imageUrl: "/theme/image10.jpeg", category: "products", altText: "Thermal label rolls" },
  { id: "demo-gallery-2", title: "Personal care product labels", imageUrl: "/theme/image9.jpeg", category: "products", altText: "Custom personal care product labels" },
  { id: "demo-gallery-3", title: "Packaging labels with QR codes", imageUrl: "/theme/image7.jpeg", category: "applications", altText: "Custom packaging labels with QR codes" },
  { id: "demo-gallery-4", title: "Label printing machinery", imageUrl: "/theme/image4.jpeg", category: "machines", altText: "Label printing machinery" },
  { id: "demo-gallery-5", title: "Label converting machine", imageUrl: "/theme/image3.jpeg", category: "machines", altText: "Label converting and slitting machine" },
  { id: "demo-gallery-6", title: "Industrial label machine", imageUrl: "/theme/image5.jpeg", category: "machines", altText: "Industrial label machine" },
  { id: "demo-gallery-7", title: "Thermal paper rolls", imageUrl: "/theme/image12.jpeg", category: "products", altText: "Thermal label paper rolls" },
  { id: "demo-gallery-8", title: "The House of Labels facility", imageUrl: "/theme/image1.jpeg", category: "facility", altText: "The House of Labels facility" },
];

const defaultBrands: HomeBrand[] = [
  { id: "demo-brand-1", name: "FRESHFIELDS|FOOD & DAIRY", logoUrl: null, website: null },
  { id: "demo-brand-2", name: "PURE HOME|HOME CARE", logoUrl: null, website: null },
  { id: "demo-brand-3", name: "GREENROOTS|AGRO SOLUTIONS", logoUrl: null, website: null },
  { id: "demo-brand-4", name: "MEDICORE|HEALTHCARE", logoUrl: null, website: null },
  { id: "demo-brand-5", name: "VOLTEX|INDUSTRIAL", logoUrl: null, website: null },
  { id: "demo-brand-6", name: "DAILYDROP|FMCG", logoUrl: null, website: null },
];

async function safeQuery<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch {
    return fallback;
  }
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  const rows = await safeQuery(() => prisma.siteSetting.findMany(), []);
  const settings = { ...defaultSettings };
  for (const setting of rows) settings[setting.key] = setting.value;
  return settings;
}

export async function getHomeData(): Promise<HomeData> {
  const [pageRows, settingRows, productRows, machineRows, industryRows, galleryRows, brandRows] = await Promise.all([
    safeQuery(() => prisma.pageContent.findMany({ where: { sectionKey: { startsWith: "home_" } }, orderBy: { sortOrder: "asc" } }), []),
    safeQuery(() => prisma.siteSetting.findMany(), []),
    safeQuery(() => prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "asc" } }), []),
    safeQuery(() => prisma.machine.findMany({ orderBy: { createdAt: "asc" } }), []),
    safeQuery(() => prisma.industry.findMany({ orderBy: { createdAt: "asc" } }), []),
    safeQuery(() => prisma.galleryItem.findMany({ orderBy: { sortOrder: "asc" } }), []),
    safeQuery(() => prisma.customerBrand.findMany({ orderBy: { sortOrder: "asc" } }), []),
  ]);

  const settings = { ...defaultSettings };
  for (const setting of settingRows) settings[setting.key] = setting.value;
  const initialized = settings._system_home_seeded === "1";
  const sections: Record<string, HomeSection> = {};
  if (!initialized) {
    for (const section of defaultSections) sections[section.sectionKey] = section;
  }
  for (const section of pageRows) {
    sections[section.sectionKey] = {
      id: section.id,
      sectionKey: section.sectionKey,
      title: section.title,
      subtitle: section.subtitle,
      description: section.description,
      imageUrl: section.imageUrl,
      sortOrder: section.sortOrder,
      buttonText: section.buttonText,
      buttonUrl: section.buttonUrl,
      status: section.status,
    };
  }

  const products: HomeProduct[] = productRows.length || initialized
    ? productRows.filter((row) => row.status === "PUBLISHED").map((row) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        shortDescription: row.shortDescription,
        description: row.description,
        imageUrl: row.imageUrl,
        category: { name: row.category.name, slug: row.category.slug },
      }))
    : defaultProducts;
  const machines: HomeMachine[] = machineRows.length || initialized
    ? machineRows.filter((row) => row.status === "PUBLISHED").map((row) => ({ id: row.id, name: row.name, slug: row.slug, description: row.description, imageUrl: row.imageUrl }))
    : defaultMachines;
  const industries: HomeIndustry[] = industryRows.length || initialized
    ? industryRows.filter((row) => row.status === "PUBLISHED").map((row) => ({ id: row.id, name: row.name, slug: row.slug, description: row.description, imageUrl: row.imageUrl }))
    : defaultIndustries;
  const gallery: HomeGalleryItem[] = galleryRows.length || initialized
    ? galleryRows.filter((row) => row.isActive).map((row) => ({ id: row.id, title: row.title, imageUrl: row.imageUrl, category: row.category.toLowerCase(), altText: row.altText }))
    : defaultGallery;
  const brands: HomeBrand[] = brandRows.length || initialized
    ? brandRows.filter((row) => row.isActive).map((row) => ({ id: row.id, name: row.name, logoUrl: row.logoUrl, website: row.website }))
    : defaultBrands;

  return { initialized, sections, settings, products, machines, industries, gallery, brands };
}
