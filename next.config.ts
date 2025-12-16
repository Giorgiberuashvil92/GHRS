import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  rewrites: async () => {
    // URL კონფიგურაცია გარემოს მიხედვით
    const apiUrl = process.env.NODE_ENV === 'development'
      ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/:path*")
      : (process.env.NEXT_PUBLIC_API_URL || "https://ghrs-backend.onrender.com/api/:path*");

    return [
      {
        source: "/api/:path*",
        destination: apiUrl,
      },
    ];
  },
  // experimental: {
  //   typedRoutes: true,
  // },
  // webpack: (config) => {
  //   // გამოვრიცხოთ backend ფოლდერი build-ისგან
  //   config.watchOptions = {
  //     ...config.watchOptions,
  //     ignored: /backend/,
  //   };
  //   return config;
  // },
};

export default nextConfig;
