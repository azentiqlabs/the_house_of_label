import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getAdminSession, createAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/http";

export const runtime = "nodejs";

const profileSchema = z
  .object({
    action: z.literal("profile"),
    name: z.string().trim().min(2, "Enter your name.").max(100),
    email: z.string().trim().email("Enter a valid email address.").max(254),
    confirmEmail: z
      .string()
      .trim()
      .email("Confirm your new email address.")
      .max(254),
    currentPassword: z.string().min(1, "Enter your current password.").max(200),
  })
  .refine(
    (data) => data.email.toLowerCase() === data.confirmEmail.toLowerCase(),
    {
      message: "The email addresses do not match.",
      path: ["confirmEmail"],
    },
  );

const passwordSchema = z
  .object({
    action: z.literal("password"),
    currentPassword: z.string().min(1, "Enter your current password.").max(200),
    newPassword: z
      .string()
      .min(12, "Use at least 12 characters for your new password.")
      .max(128),
    confirmPassword: z.string().min(1, "Confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "The new passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message:
      "Choose a new password that is different from your current password.",
    path: ["newPassword"],
  });

export async function GET() {
  const session = await getAdminSession();
  if (!session)
    return jsonError("Your session has expired. Please sign in again.", 401);
  return NextResponse.json({
    ok: true,
    data: {
      id: session.id,
      name: session.name,
      email: session.email,
      role: session.role,
    },
  });
}

export async function PATCH(request: NextRequest) {
  const origin = request.headers.get("origin");
  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();
  const requestHost = forwardedHost || request.headers.get("host");
  if (origin && requestHost) {
    try {
      if (new URL(origin).host !== requestHost)
        return jsonError("Cross-site account updates are not allowed.", 403);
    } catch {
      return jsonError("Invalid request origin.", 403);
    }
  }

  const session = await getAdminSession();
  if (!session)
    return jsonError("Your session has expired. Please sign in again.", 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid request body.");
  }

  const action = (body as { action?: unknown } | null)?.action;
  const parsed =
    action === "profile"
      ? profileSchema.safeParse(body)
      : action === "password"
        ? passwordSchema.safeParse(body)
        : null;

  if (!parsed) return jsonError("Choose a valid account update action.");
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: parsed.error.issues[0]?.message || "Please check the fields.",
      },
      { status: 422 },
    );
  }

  const currentUser = await prisma.adminUser.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      passwordHash: true,
      sessionVersion: true,
    },
  });

  if (!currentUser?.isActive)
    return jsonError("This administrator account is inactive.", 403);
  const currentPassword = parsed.data.currentPassword;
  const passwordMatches = await bcrypt.compare(
    currentPassword,
    currentUser.passwordHash,
  );
  if (!passwordMatches)
    return jsonError("Your current password is incorrect.", 403);

  try {
    let updatedUser;
    let emailChanged = false;
    if (parsed.data.action === "profile") {
      const email = parsed.data.email.toLowerCase();
      emailChanged = email !== currentUser.email;
      updatedUser = await prisma.adminUser.update({
        where: { id: session.id },
        data: {
          name: parsed.data.name,
          email,
          ...(email !== currentUser.email
            ? { sessionVersion: { increment: 1 } }
            : {}),
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          sessionVersion: true,
        },
      });
    } else {
      const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
      updatedUser = await prisma.adminUser.update({
        where: { id: session.id },
        data: { passwordHash, sessionVersion: { increment: 1 } },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          sessionVersion: true,
        },
      });
    }

    // Refresh this browser's session. Password changes also increment sessionVersion,
    // so every other previously issued admin session is rejected on its next request.
    await createAdminSession({
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      sessionVersion: updatedUser.sessionVersion,
    });

    return NextResponse.json({
      ok: true,
      message:
        parsed.data.action === "password"
          ? "Password updated. Other active admin sessions have been signed out."
          : emailChanged
            ? "Sign-in email updated. Other active admin sessions have been signed out."
            : "Account details updated.",
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return jsonError(
        "That email address is already used by another admin account.",
        409,
      );
    }
    console.error("Admin account update failed:", error);
    return jsonError("Could not update your account. Please try again.", 500);
  }
}
