import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const inquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().max(160).optional().default(""),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(30),
  productType: z.string().trim().max(120).optional().default(""),
  requirements: z.string().trim().min(5).max(5000),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request." },
      { status: 400 },
    );
  }
  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: "Please check the form fields and try again." },
      { status: 400 },
    );

  try {
    const inquiry = await prisma.quoteInquiry.create({ data: parsed.data });
    return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      {
        error:
          "Inquiry storage is not ready. Please configure the database and try again.",
      },
      { status: 503 },
    );
  }
}
