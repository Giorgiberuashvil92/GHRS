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
    // ✅ FIXED: Type errors resolved, strict mode enabled
    ignoreBuildErrors: false,
  },
  rewrites: async () => {
    // ✅ Fixed: Removed :path* from destination URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 
      (process.env.NODE_ENV === 'development'
        ? "http://localhost:4000"
        : "https://ghrs-backend.onrender.com");

    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`, // ✅ Correct syntax
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
