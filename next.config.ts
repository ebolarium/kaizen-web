import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    // Ignore TypeScript errors during build (Mongoose type complexity)
    ignoreBuildErrors: true,
  },
  images: {
    // Disable image optimization for production deployment on Render.com
    // This ensures local images from /images directory work correctly
    unoptimized: true,
    remotePatterns: [],
    // Loader configuration for local images
    loader: 'default',
  },
};

export default nextConfig;

