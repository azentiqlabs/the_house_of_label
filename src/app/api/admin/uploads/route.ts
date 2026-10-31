import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const allowedTypes = new Map([
  ["image/jpeg", { extension: "jpg", signature: (data: Buffer) => data.length > 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff }],
  ["image/png", { extension: "png", signature: (data: Buffer) => data.length > 8 && data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) }],
  ["image/webp", { extension: "webp", signature: (data: Buffer) => data.length > 12 && data.toString("ascii", 0, 4) === "RIFF" && data.toString("ascii", 8, 12) === "WEBP" }],
  ["image/gif", { extension: "gif", signature: (data: Buffer) => data.length > 6 && ["GIF87a", "GIF89a"].includes(data.toString("ascii", 0, 6)) }],
]);

export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  let body: FormData;
  try {
    body = await request.formData();
  } catch {
    return NextResponse.json({ error: "Please choose an image file." }, { status: 400 });
  }

  const file = body.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Please choose an image file." }, { status: 400 });
  }
  if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Images must be smaller than 4 MB." }, { status: 413 });
  }

  const type = allowedTypes.get(file.type);
  if (!type) {
    return NextResponse.json({ error: "Use a JPG, PNG, WebP or GIF image." }, { status: 415 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  if (!type.signature(bytes)) {
    return NextResponse.json({ error: "The selected file does not appear to be a valid image." }, { status: 415 });
  }

  // Prefer persistent object storage for production deployments. Public access is
  // appropriate because these are public website images, not private documents.
  const filename = `${randomUUID()}.${type.extension}`;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(`house-of-labels/${filename}`, bytes, {
        access: "public",
        addRandomSuffix: true,
        contentType: file.type,
        cacheControlMaxAge: 60 * 60 * 24 * 30,
      });
      return NextResponse.json({ ok: true, imageUrl: blob.url }, { status: 201 });
    } catch {
      return NextResponse.json({ error: "The image could not be saved to media storage. Check the Blob store connection and token." }, { status: 502 });
    }
  }

  // Local filesystem is a convenient development fallback. Vercel's function
  // filesystem is ephemeral/read-only for public assets, so require Blob there.
  if (process.env.VERCEL === "1") {
    return NextResponse.json({ error: "Connect a Vercel Blob store to enable persistent image uploads. Add BLOB_READ_WRITE_TOKEN to this project's environment, then redeploy." }, { status: 503 });
  }

  const uploadDirectory = path.join(process.cwd(), "public", "uploads");
  try {
    await mkdir(uploadDirectory, { recursive: true });
    await writeFile(path.join(uploadDirectory, filename), bytes, { flag: "wx" });
  } catch {
    return NextResponse.json({ error: "Image storage is not writable on this server. Configure persistent media storage before deploying." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, imageUrl: `/uploads/${filename}` }, { status: 201 });
}
