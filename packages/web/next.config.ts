import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const apiGatewayOrigin =
      process.env.API_GATEWAY_ORIGIN ?? "http://localhost:3006";

    return {
      beforeFiles: [],
      afterFiles: [
        {
          source: "/api/:path*",
          destination: `${apiGatewayOrigin}/:path*`,
        },
      ],
      fallback: [],
    };
  },
};

export default nextConfig;
