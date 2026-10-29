import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages on the custom domain https://c0ba1t.is-a.dev/
 *
 * - No basePath by default: the site is served from the domain root.
 * - If you ever deploy to https://<user>.github.io/<repo>/ instead, build with
 *   NEXT_PUBLIC_BASE_PATH=/<repo> and everything (assets, links) follows.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
