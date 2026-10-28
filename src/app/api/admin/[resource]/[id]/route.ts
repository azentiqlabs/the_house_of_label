import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import {
  delegateFor,
  includeFor,
  canWriteResource,
} from "@/lib/admin-resources";
import { schemas, type ResourceKey } from "@/lib/validation";
import { jsonError } from "@/lib/http";
export const runtime = "nodejs";
type Ctx = { params: Promise<{ resource: string; id: string }> };
export async function GET(_req: NextRequest, { params }: Ctx) {
  const user = await getAdminSession();
  if (!user) return jsonError("Authentication required.", 401);
  const { resource, id } = await params;
  const db = delegateFor(resource);
  if (!db) return jsonError("Unknown resource.", 404);
  try {
    const data = await db.findUnique({
      where: { id },
      ...(includeFor[resource as ResourceKey]
        ? { include: includeFor[resource as ResourceKey] }
        : {}),
    });
    return data
      ? NextResponse.json({ ok: true, data })
      : jsonError("Record not found.", 404);
  } catch {
    return jsonError("Could not load record.", 500);
  }
}
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const user = await getAdminSession();
  if (!user) return jsonError("Authentication required.", 401);
  const { resource, id } = await params;
  const db = delegateFor(resource);
  if (!db) return jsonError("Unknown resource.", 404);
  if (!canWriteResource(user.role, resource as ResourceKey))
    return jsonError("You do not have permission to update this record.", 403);
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON.");
  }
  const schema = schemas[resource as ResourceKey];
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed.",
        details: parsed.error.flatten(),
      },
      { status: 422 },
    );
  try {
    const data = await db.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ ok: true, data });
  } catch (error: any) {
    if (error?.code === "P2025") return jsonError("Record not found.", 404);
    if (error?.code === "P2002")
      return jsonError("A record with this unique value already exists.", 409);
    if (error?.code === "P2003")
      return jsonError("Related record does not exist.", 422);
    return jsonError("Could not update record.", 500);
  }
}
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const user = await getAdminSession();
  if (!user) return jsonError("Authentication required.", 401);
  const { resource, id } = await params;
  const db = delegateFor(resource);
  if (!db) return jsonError("Unknown resource.", 404);
  if (!canWriteResource(user.role, resource as ResourceKey))
    return jsonError("You do not have permission to delete this record.", 403);
  try {
    await db.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (error?.code === "P2025") return jsonError("Record not found.", 404);
    if (error?.code === "P2003")
      return jsonError("This record is in use and cannot be deleted.", 409);
    return jsonError("Could not delete record.", 500);
  }
}
