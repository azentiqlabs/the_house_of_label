import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CMS content is read from PostgreSQL at request time. Keep the conventional
  // App Router rendering model here; cacheComponents requires explicit cache
  // and Suspense boundaries around every uncached data read.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
