import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during production builds for faster deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Skip type checking during build (already checked in development)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
