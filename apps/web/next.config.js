/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@nooch/db", "@nooch/shared"],
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

module.exports = nextConfig;
