/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'canvas' }]
    return config
  },
}

export default nextConfig
