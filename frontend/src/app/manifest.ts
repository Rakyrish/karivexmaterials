import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KariVex Industrial Materials",
    short_name: "KariVex",
    description: "Pizza oven materials, oven building and repair, and roof cyclones — supplied, installed and repaired in Kenya.",
    start_url: "/",
    display: "standalone",
    background_color: "#fefefe",
    theme_color: "#021533",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
