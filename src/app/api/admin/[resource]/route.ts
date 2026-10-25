import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { delegateFor, includeFor, canWriteResource } from "@/lib/admin-resources";
import { schemas, type ResourceKey } from "@/lib/validation";
import { jsonError, parsePositiveInt } from "@/lib/http";

export const runtime = "nodejs";
type Ctx = { params: Promise<{ resource: string }> };
export async function GET(req: NextRequest, { params }: Ctx) {
  const user = await getAdminSession(); if (!user) return jsonError("Authentication required.", 401);
  const { resource } = await params; const db = delegateFor(resource); if (!db) return jsonError("Unknown resource.", 404);
  const page = parsePositiveInt(req.nextUrl.searchParams.get("page"), 1, 100000);
  const limit = parsePositiveInt(req.nextUrl.searchParams.get("limit"), 20, 100);
  const search = req.nextUrl.searchParams.get("q")?.trim().slice(0, 100);
  const where: any = {};
  if (search && ["products", "categories", "machines", "industries", "gallery", "brands", "inquiries", "pages"].includes(resource)) {
    const field = resource === "inquiries" ? "name" : resource === "pages" ? "title" : "name";
    where[field] = { contains: search, mode: "insensitive" };
  }
  try {
    const [items, total] = await Promise.all([db.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { [resource === "settings" || resource === "seo" ? "updatedAt" : "createdAt"]: "desc" }, ...(includeFor[resource as ResourceKey] ? { include: includeFor[resource as ResourceKey] } : {}) }), db.count({ where })]);
    return NextResponse.json({ ok: true, data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch { return jsonError("Could not load records.", 500); }
}
export async function POST(req: NextRequest, { params }: Ctx) {
  const user = await getAdminSession(); if (!user) return jsonError("Authentication required.", 401);
  const { resource } = await params; const db = delegateFor(resource); if (!db) return jsonError("Unknown resource.", 404);
  if (!canWriteResource(user.role, resource as ResourceKey)) return jsonError("You do not have permission to create this record.", 403);
  let body: unknown; try { body = await req.json(); } catch { return jsonError("Invalid JSON."); }
  const schema = schemas[resource as ResourceKey]; const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Validation failed.", details: parsed.error.flatten() }, { status: 422 });
  try { const item = await db.create({ data: parsed.data }); return NextResponse.json({ ok: true, data: item }, { status: 201 }); }
  catch (error: any) { if (error?.code === "P2002") return jsonError("A record with this unique value already exists.", 409); if (error?.code === "P2003") return jsonError("Related record does not exist.", 422); return jsonError("Could not create record.", 500); }
}
