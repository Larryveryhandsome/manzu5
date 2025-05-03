/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      },
    ],
  },
  // 基本配置
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  // GitHub Pages 的基本路徑配置
  basePath: '/manzu5',
  assetPrefix: '/manzu5',
}

module.exports = nextConfig
