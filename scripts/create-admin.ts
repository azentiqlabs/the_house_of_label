import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, AdminRole } from "../src/generated/prisma/client";
const prisma = new PrismaClient();
async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 12)
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) in the environment.",
    );
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, isActive: true, role: AdminRole.SUPER_ADMIN },
    create: {
      name: process.env.ADMIN_NAME || "Site Administrator",
      email,
      passwordHash,
      role: AdminRole.SUPER_ADMIN,
    },
  });
  console.log(`Admin account created/updated: ${email}`);
}
main().finally(() => prisma.$disconnect());
