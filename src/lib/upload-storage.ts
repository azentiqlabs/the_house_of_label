import path from "node:path";

/**
 * Returns the persistent directory used for public CMS image uploads.
 *
 * On CloudNinza, set UPLOAD_DIR to the shared directory so uploaded files
 * survive release-based deployments. Local development falls back to
 * <project>/public/uploads.
 */
export function getUploadDirectory(): string {
  const configuredDirectory = process.env.UPLOAD_DIR?.trim();

  return path.resolve(
    configuredDirectory || path.join(process.cwd(), "public", "uploads"),
  );
}
