import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  output: "export",
  experimental: {
    optimizePackageImports: ['firebase', 'framer-motion', '@mux/mux-player-react'],
  },
  images: {
    unoptimized: true,
  }
};

export default withBundleAnalyzer(nextConfig);
