import type { NextConfig } from "next";

const path = require('path');
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
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default withBundleAnalyzer(nextConfig);
