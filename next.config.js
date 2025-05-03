/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  output: 'export'
}

module.exports = nextConfig
