/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**'
      }
    ]
  },
  env: {
    NEXT_PUBLIC_VERCEL_BACKEND_URL:
      process.env.vercel_backend_url ||
      process.env.VERCEL_BACKEND_URL ||
      process.env.NEXT_PUBLIC_VERCEL_BACKEND_URL
  }
}

module.exports = nextConfig
