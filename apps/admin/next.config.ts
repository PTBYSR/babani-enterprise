import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@babani/db"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  }
};

export default nextConfig;
