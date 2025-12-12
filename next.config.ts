import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // keep if you want, but not required when using remotePatterns
    // domains: ["images.unsplash.com", "plus.unsplash.com"],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
