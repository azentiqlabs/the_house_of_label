import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "hol_admin_session";
const secret = process.env.AUTH_SECRET;
function key() {
  if (!secret || secret.length < 32) throw new Error("AUTH_SECRET must be at least 32 characters.");
  return new TextEncoder().encode(secret);
}
export async function createAdminSession(user: { id: string; email: string; role: string }) {
  const token = await new SignJWT({ email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" }).setSubject(user.id)
    .setIssuedAt().setExpirationTime("8h").sign(key());
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 8 * 60 * 60 });
}
export async function getAdminSession() {
  try {
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, key());
    if (!payload.sub || typeof payload.email !== "string") return null;
    const user = await prisma.adminUser.findUnique({ where: { id: payload.sub }, select: { id: true, name: true, email: true, role: true, isActive: true } });
    if (!user?.isActive) return null;
    return user;
  } catch { return null; }
}
export async function requireAdmin() {
  const user = await getAdminSession();
  if (!user) redirect("/admin/login");
  return user;
}
export async function destroyAdminSession() {
  (await cookies()).delete(COOKIE_NAME);
}
