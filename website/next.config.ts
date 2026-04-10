import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.GITHUB_ACTIONS ? '/autoresearch-genealogy' : '',
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['better-sqlite3'],
};

export default nextConfig;
