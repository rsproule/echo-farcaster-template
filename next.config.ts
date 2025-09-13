import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Skip ESLint during production builds (CI) to avoid blocking on lint warnings/errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
