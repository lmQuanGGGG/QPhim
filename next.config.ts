import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.ophim.live',
        pathname: '/uploads/movies/**',
      },
    ],
  },
};

export default nextConfig;
