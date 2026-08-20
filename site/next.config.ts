import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // O lockfile do projeto vive em site/; sem isto o Turbopack sobe até a home do usuário.
  turbopack: { root: import.meta.dirname },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
