import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    unoptimized: true
  },
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs']
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;