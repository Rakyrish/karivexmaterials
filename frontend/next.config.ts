import path from "node:path";

import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

// One shared .env at the repository root serves both Django and Next.js.
// forceReload: Next has already loaded frontend/ (which has no .env) and caches it.
loadEnvConfig(path.resolve(__dirname, ".."), process.env.NODE_ENV !== "production", console, true);

const API_BASE_URL = (process.env.API_BASE_URL || "http://localhost:8000").replace(/\/+$/, "");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  images: {
    // Uploaded media is served by Django under /media (proxied below in
    // development; routed by the reverse proxy in production).
    localPatterns: [
      { pathname: "/media/**", search: "" },
      { pathname: "/brand/**", search: "" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
  },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      // Only reached when no page matches, i.e. /media/* in local dev.
      fallback: [{ source: "/media/:path*", destination: `${API_BASE_URL}/media/:path*` }],
    };
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
