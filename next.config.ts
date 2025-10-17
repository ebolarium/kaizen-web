import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    unoptimized: true
  },
  serverExternalPackages: ['bcryptjs'],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;