import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { getUploadDirectory } from "@/lib/upload-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const imageTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

// Uploads are assigned UUID filenames by the authenticated upload endpoint.
// Restricting the route to that format prevents path traversal and arbitrary
// file reads from the server filesystem.
const allowedFilename =
  /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.(?:jpe?g|png|webp|gif)$/i;

type RouteContext = {
  params: Promise<{ filename: string }>;
};

async function handleImageRequest(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  const { filename } = await context.params;

  if (!allowedFilename.test(filename)) {
    return new Response("Not found", { status: 404 });
  }

  const uploadDirectory = getUploadDirectory();
  const filePath = path.resolve(uploadDirectory, filename);

  // Defence in depth: only a direct child of the configured upload directory
  // can be served. The UUID allow-list above also rejects slash characters.
  if (path.dirname(filePath) !== uploadDirectory) {
    return new Response("Not found", { status: 404 });
  }

  const contentType = imageTypes[path.extname(filename).toLowerCase()];
  if (!contentType) {
    return new Response("Unsupported image type", { status: 415 });
  }

  try {
    const fileInfo = await stat(filePath);
    if (!fileInfo.isFile()) {
      return new Response("Not found", { status: 404 });
    }

    const headers = new Headers({
      "Content-Type": contentType,
      "Content-Length": String(fileInfo.size),
      // Filenames are UUIDs and never overwritten, so long-lived caching is safe.
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
    });

    if (request.method === "HEAD") {
      return new Response(null, { status: 200, headers });
    }

    const file = await readFile(filePath);
    return new Response(new Uint8Array(file), { status: 200, headers });
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;

    if (code === "ENOENT" || code === "ENOTDIR") {
      return new Response("Image not found", { status: 404 });
    }

    console.error("Could not serve uploaded image:", error);
    return new Response("Unable to serve image", { status: 500 });
  }
}

export async function GET(request: Request, context: RouteContext) {
  return handleImageRequest(request, context);
}

export async function HEAD(request: Request, context: RouteContext) {
  return handleImageRequest(request, context);
}
