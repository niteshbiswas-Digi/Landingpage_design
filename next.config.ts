import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Ensure public assets are served correctly
  staticPageGenerationTimeout: 60,
  // Enable static optimization
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
};

export default nextConfig;
