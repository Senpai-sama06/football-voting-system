/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/football-voting-system',
  trailingSlash: true,
};

export default nextConfig;
