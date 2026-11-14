import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // AVIF to browsers that take it (about 20% smaller than WebP), WebP to the rest.
  images: { formats: ["image/avif", "image/webp"] },
  // spending.bohubbard.xyz serves /spending at its root. Before files, so the
  // landing page at / doesn't answer first.
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", has: [{ type: "host", value: "spending.bohubbard.xyz" }], destination: "/spending" }],
      afterFiles: [],
      fallback: [],
    };
  },
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
