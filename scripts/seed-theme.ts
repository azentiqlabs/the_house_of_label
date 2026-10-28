import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();
const PUBLISHED = "PUBLISHED" as const;

const sections = [
  { sectionKey: "home_hero", title: "Reliable|Label Solutions|for Every Industry", subtitle: "Your trusted label partner", description: "High-quality unprinted and printed labels engineered for performance, precision and premium packaging.", imageUrl: "/theme/image15.png", buttonText: "Request a Quote", buttonUrl: "#contact", sortOrder: 0 },
  { sectionKey: "home_feature_1", title: "High Quality\nMaterials", subtitle: "♧", sortOrder: 1 },
  { sectionKey: "home_feature_2", title: "Consistent\nPerformance", subtitle: "✓", sortOrder: 2 },
  { sectionKey: "home_feature_3", title: "Fast\nDeliveries", subtitle: "↗", sortOrder: 3 },
  { sectionKey: "home_feature_4", title: "Custom Solutions\nfor Your Needs", subtitle: "⚙", sortOrder: 4 },
  { sectionKey: "home_promo", title: "Better labels. Smoother lines. Stronger brands.", subtitle: "From concept to conversion", description: "Printed, unprinted and thermal label solutions designed around your application.", buttonText: "Explore Label Types", buttonUrl: "#products", sortOrder: 5 },
  { sectionKey: "home_about", title: "About The House of Labels", subtitle: "Who we are", description: "The House of Labels is a specialized label manufacturing company delivering high-quality unprinted and printed label solutions for diverse packaging applications across industries.", imageUrl: "/theme/image2.jpeg", buttonText: "Learn More", buttonUrl: "#what-we-do", sortOrder: 6 },
  { sectionKey: "home_vision", title: "Our Vision", description: "To become a trusted partner for brands by delivering reliable, innovative, and performance-driven label solutions.", sortOrder: 7 },
  { sectionKey: "home_mission", title: "Our Mission", description: "To provide labels that run better, look better, and cost better.", sortOrder: 8 },
  { sectionKey: "home_strength", title: "Our Strength", description: "Expertise in adhesives, materials, printing, accurate alignment, die-cutting accuracy, and roll form optimization.", sortOrder: 9 },
  { sectionKey: "home_choose", title: "Why Choose Us?", description: "Strong material knowledge\nApplication-based development\nFocus on machine performance\nConsistent quality\nFast response & deliveries\nCost-optimized solutions", sortOrder: 10 },
  { sectionKey: "home_what_heading", title: "Label solutions made for your application.", subtitle: "What we do", description: "From standard label rolls to custom printed formats, we help match materials, adhesives and label construction to your product and production line.", sortOrder: 11 },
  { sectionKey: "home_what_printed", title: "Printed Labels", subtitle: "▤", description: "Custom artwork and brand-focused pressure-sensitive labels for product packaging.", buttonText: "Explore products", buttonUrl: "#products", sortOrder: 12 },
  { sectionKey: "home_what_unprinted", title: "Unprinted Labels", subtitle: "◉", description: "Label stock for identification, variable information and customer-specific printing.", buttonText: "Explore products", buttonUrl: "#products", sortOrder: 13 },
  { sectionKey: "home_what_thermal", title: "Thermal Labels", subtitle: "▥", description: "Direct thermal and thermal transfer label options for compatible printer systems.", buttonText: "Explore products", buttonUrl: "#products", sortOrder: 14 },
  { sectionKey: "home_what_custom", title: "Custom Label Formats", subtitle: "✳", description: "Application-led discussions around dimensions, roll format, adhesive and use conditions.", buttonText: "Discuss your needs", buttonUrl: "#contact", sortOrder: 15 },
  { sectionKey: "home_products_heading", title: "Our Products", subtitle: "Explore our range", description: "We manufacture and supply a wide range of label solutions for diverse applications.", sortOrder: 16 },
  { sectionKey: "home_machines_heading", title: "Our Machines", subtitle: "Built for precision", description: "Advanced technology for precision, quality and consistency.", sortOrder: 17 },
  { sectionKey: "home_why_heading", title: "Practical expertise. Consistent performance.", subtitle: "Why The House of Labels?", description: "We balance label appearance with how labels behave on your application and production line.", sortOrder: 18 },
  { sectionKey: "home_why_card_1", title: "Material Knowledge", subtitle: "✓", description: "Consideration of facestock, adhesive and liner choices, including suitable standard and specialty stocks.", sortOrder: 19 },
  { sectionKey: "home_why_card_2", title: "Application-led Development", subtitle: "⚙", description: "Label discussions start with the package, environment and application method.", sortOrder: 20 },
  { sectionKey: "home_why_card_3", title: "Line Performance", subtitle: "◎", description: "Focus on dispensing accuracy, roll-form requirements and die-cutting consistency.", sortOrder: 21 },
  { sectionKey: "home_why_card_4", title: "Responsive Support", subtitle: "↗", description: "Cost-conscious options and clear communication throughout the quotation process.", sortOrder: 22 },
  { sectionKey: "home_industries_heading", title: "Industries we serve", subtitle: "Label solutions for every sector", description: "Application-focused label solutions for a wide range of industries.", sortOrder: 23 },
  { sectionKey: "home_gallery_heading", title: "Gallery", subtitle: "A closer look", description: "Explore our products, production equipment and label applications.", sortOrder: 24 },
  { sectionKey: "home_contact_heading", title: "Request a Quote", subtitle: "Let's discuss your requirements", description: "Get the best label solution for your business. Share your requirements and our experts will get back to you.", sortOrder: 25 },
  { sectionKey: "home_customers_heading", title: "Brands we work with", subtitle: "Trusted partnerships", description: "Customer logo strip — replace these sample names with approved customer logos.", sortOrder: 26 },
];

const settingEntries: Array<[string, string]> = [
  ["site_name", "The House of Labels"],
  ["site_tagline", "LABELS THAT RUN BETTER"],
  ["site_logo_url", "/theme/THE_HOUSE_OF_LABEL_LOGO02.png"],
  ["whatsapp_number", ""],
  ["contact_phone", "+91 XXXXX XXXXX (demo)"],
  ["contact_email", "info@thehouseoflabels.example"],
  ["contact_address", "Business address to be added\nCity, State, PIN (demo)"],
  ["footer_note", "All rights reserved."],
  ["nav_home", "Home"],
  ["nav_about", "About Us"],
  ["nav_what_we_do", "What We Do"],
  ["nav_products", "Products"],
  ["nav_machines", "Our Machines"],
  ["nav_industries", "Industries"],
  ["nav_gallery", "Gallery"],
  ["nav_contact", "Contact"],
  ["header_quote_text", "Request a Quote"],
  ["show_customer_sample_note", "1"],
];

const categories = [
  { name: "Printed Labels", slug: "printed-labels" },
  { name: "Unprinted Labels", slug: "unprinted-labels" },
  { name: "Thermal Labels", slug: "thermal-labels" },
  { name: "Custom Labels", slug: "custom-labels" },
];

const products = [
  { name: "Printed Product & Packaging Labels", slug: "printed-product-packaging-labels", category: "printed-labels", shortDescription: "High-quality printed labels for product identification and branding.", description: "High-quality printed labels for product identification and branding.", imageUrl: "/theme/image9.jpeg" },
  { name: "Personal Care Labels", slug: "personal-care-labels", category: "printed-labels", shortDescription: "Professional labels for cosmetic, skincare and personal care products.", description: "Professional labels for cosmetic, skincare and personal care products.", imageUrl: "/theme/image8.jpeg" },
  { name: "Custom Labels & QR Code Stickers", slug: "custom-labels-qr-code-stickers", category: "custom-labels", shortDescription: "Custom label designs with QR codes for branding and product information.", description: "Custom label designs with QR codes for branding and product information.", imageUrl: "/theme/image7.jpeg" },
  { name: "Direct Thermal (DT) Labels", slug: "direct-thermal-labels", category: "thermal-labels", shortDescription: "Thermal labels for barcode printing, retail and everyday labeling.", description: "Thermal labels for barcode printing, retail and everyday labeling.", imageUrl: "/theme/image12.jpeg" },
  { name: "Thermal Shipping Labels", slug: "thermal-shipping-labels", category: "thermal-labels", shortDescription: "Shipping and logistics labels with clear barcode and address printing.", description: "Shipping and logistics labels with clear barcode and address printing.", imageUrl: "/theme/image11.jpeg" },
  { name: "Thermal Transfer (TT) Labels", slug: "thermal-transfer-labels", category: "thermal-labels", shortDescription: "Barcode and identification labels designed for ribbon-based printing.", description: "Barcode and identification labels designed for ribbon-based printing.", imageUrl: "/theme/image10.jpeg" },
];

const machines = [
  { name: "Flexographic Printing Machine", slug: "flexographic-printing-machine", description: "High-speed flexographic printing for premium quality labels, with reliable registration and consistent output.", imageUrl: "/theme/image4.jpeg" },
  { name: "Slitting Machine", slug: "slitting-machine", description: "Precision slitting technology delivers accurate roll widths and clean edges for consistent label finishing.", imageUrl: "/theme/image3.jpeg" },
  { name: "Die-Cutting Machine", slug: "die-cutting-machine", description: "Designed for accurate custom shapes and sizes, helping produce labels with clean cuts and consistent finishing.", imageUrl: "/theme/image5.jpeg" },
  { name: "Rewinding Machine", slug: "rewinding-machine", description: "Reliable rewinding creates neat, uniform label rolls for smooth handling, storage and application.", imageUrl: "/theme/image6.jpeg" },
  { name: "Inspection & Quality Check", slug: "inspection-quality-check", description: "Quality inspection helps identify printing defects and maintain consistent label quality before dispatch.", imageUrl: "/theme/image3.jpeg" },
];

const industries = [
  { name: "Food & Dairy", slug: "food-dairy", description: "Clear, durable product labels for food and dairy packaging." },
  { name: "FMCG", slug: "fmcg", description: "Reliable labels for fast-moving consumer goods." },
  { name: "Home & Personal Care", slug: "home-personal-care", description: "Packaging labels for cosmetics, skincare and household products." },
  { name: "Pharmaceuticals", slug: "pharmaceuticals", description: "Legible information labels for healthcare packaging." },
  { name: "Lubricants & Chemicals", slug: "lubricants-chemicals", description: "Application-focused labels for industrial and chemical containers." },
  { name: "Agro & Pesticides", slug: "agro-pesticides", description: "Product and compliance information labels for agricultural packaging." },
  { name: "Retail & Logistics", slug: "retail-logistics", description: "Barcode, shipping and tracking labels for efficient operations." },
  { name: "Custom Applications", slug: "custom-applications", description: "Made-to-fit label options for specialised product requirements." },
];

const gallery = [
  { title: "Thermal label rolls", imageUrl: "/theme/image10.jpeg", category: "products", altText: "Thermal label rolls", sortOrder: 1 },
  { title: "Personal care product labels", imageUrl: "/theme/image9.jpeg", category: "products", altText: "Custom personal care product labels", sortOrder: 2 },
  { title: "Packaging labels with QR codes", imageUrl: "/theme/image7.jpeg", category: "applications", altText: "Custom packaging labels with QR codes", sortOrder: 3 },
  { title: "Label printing machinery", imageUrl: "/theme/image4.jpeg", category: "machines", altText: "Label printing machinery", sortOrder: 4 },
  { title: "Label converting machine", imageUrl: "/theme/image3.jpeg", category: "machines", altText: "Label converting and slitting machine", sortOrder: 5 },
  { title: "Industrial label machine", imageUrl: "/theme/image5.jpeg", category: "machines", altText: "Industrial label machine", sortOrder: 6 },
  { title: "Thermal paper rolls", imageUrl: "/theme/image12.jpeg", category: "products", altText: "Thermal label paper rolls", sortOrder: 7 },
  { title: "The House of Labels facility", imageUrl: "/theme/image1.jpeg", category: "facility", altText: "The House of Labels facility", sortOrder: 8 },
];

const brands = [
  "FRESHFIELDS|FOOD & DAIRY",
  "PURE HOME|HOME CARE",
  "GREENROOTS|AGRO SOLUTIONS",
  "MEDICORE|HEALTHCARE",
  "VOLTEX|INDUSTRIAL",
  "DAILYDROP|FMCG",
];

async function main() {
  console.log("Seeding The House of Labels CMS theme content…");

  for (const section of sections) {
    await prisma.pageContent.upsert({
      where: { sectionKey: section.sectionKey },
      update: {},
      create: { ...section, status: PUBLISHED },
    });
  }

  const categoryIds = new Map<string, string>();
  for (const category of categories) {
    const saved = await prisma.productCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    categoryIds.set(category.slug, saved.id);
  }

  for (const product of products) {
    const categoryId = categoryIds.get(product.category);
    if (!categoryId) throw new Error(`Missing category for ${product.slug}`);
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        name: product.name,
        slug: product.slug,
        shortDescription: product.shortDescription,
        description: product.description,
        imageUrl: product.imageUrl,
        gallery: [],
        status: PUBLISHED,
        featured: false,
        categoryId,
      },
    });
  }

  for (const machine of machines) {
    await prisma.machine.upsert({ where: { slug: machine.slug }, update: {}, create: { ...machine, status: PUBLISHED } });
  }
  for (const industry of industries) {
    await prisma.industry.upsert({ where: { slug: industry.slug }, update: {}, create: { ...industry, imageUrl: null, status: PUBLISHED } });
  }
  for (const item of gallery) {
    const existing = await prisma.galleryItem.findFirst({ where: { title: item.title } });
    if (!existing) await prisma.galleryItem.create({ data: { ...item, isActive: true } });
  }
  for (let index = 0; index < brands.length; index++) {
    const name = brands[index];
    const existing = await prisma.customerBrand.findFirst({ where: { name } });
    if (!existing) await prisma.customerBrand.create({ data: { name, logoUrl: "/theme/brand-placeholder.svg", sortOrder: index + 1, isActive: true } });
  }
  for (const [key, value] of settingEntries) {
    await prisma.siteSetting.upsert({ where: { key }, update: {}, create: { key, value } });
  }
  await prisma.siteSetting.upsert({
    where: { key: "_system_home_seeded" },
    update: { value: "1" },
    create: { key: "_system_home_seeded", value: "1" },
  });

  console.log("Theme CMS data is ready. Edit it from /admin/dashboard after logging in.");
  console.log("Reminder: replace sample customer names and demo contact details before publishing.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
