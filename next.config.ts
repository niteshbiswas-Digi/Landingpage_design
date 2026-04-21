import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  staticPageGenerationTimeout: 60,
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
};

export default nextConfig;
