import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@babani/db"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      }
    ]
  }
};

export default nextConfig;
