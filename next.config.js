/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // 設置為 true 以支援靜態導出
    loader: 'custom',
    loaderFile: './image-loader.js',
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
