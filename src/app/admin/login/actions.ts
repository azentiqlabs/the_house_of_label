"use server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createAdminSession } from "@/lib/auth";
const schema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(8).max(200) });
export async function loginAction(formData: FormData) {
 const parsed = schema.safeParse({ email: formData.get("email"), password: formData.get("password") });
 if (!parsed.success) redirect("/admin/login?error=invalid");
 const user = await prisma.adminUser.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
 if (!user || !user.isActive || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) redirect("/admin/login?error=invalid");
 await createAdminSession({ id: user.id, email: user.email, role: user.role }); redirect("/admin/dashboard");
}
