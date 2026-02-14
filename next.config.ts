import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: false,
  images: {
    remotePatterns: [
      {
        protocol:"https",
        hostname:"avatars.githubusercontent.com",
        pathname:"/u/**",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname:"/avatars/**"
      }
    ]
  }
};

export default nextConfig;
