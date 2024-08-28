import { createProxyMiddleware } from 'http-proxy-middleware';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_PINATA_API_KEY: process.env.NEXT_PUBLIC_PINATA_API_KEY,
    NEXT_PUBLIC_PINATA_API_SECRET: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
    NEXT_PUBLIC_PINATA_JWT: process.env.NEXT_PUBLIC_PINATA_JWT,
  },
  async rewrites() {
    return [
      {
        source: '/api/starknet/:path*',
        destination: 'https://starknet-testnet.public.blastapi.io/:path*',
      },
    ];
  },
};

export default nextConfig;

// Custom middleware to apply proxy in Next.js
export function middleware(req, res) {
  if (req.url.startsWith('/api/starknet')) {
    const proxyMiddleware = createProxyMiddleware({
      target: 'https://starknet-testnet.public.blastapi.io',
      changeOrigin: true,
      pathRewrite: { '^/api/starknet': '' }, // Adjust this if necessary
    });
    return proxyMiddleware(req, res, (result) => {
      if (result instanceof Error) {
        throw result;
      }
    });
  }
}