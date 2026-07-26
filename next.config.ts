import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  allowedDevOrigins: [
    '192.168.1.4',
    '192.168.1.8',
    '192.168.1.1',
    '192.168.1.*',
    '192.168.0.*',
    '192.168.*',
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
  ],
};

export default nextConfig;
