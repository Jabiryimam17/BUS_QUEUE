/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_VERCEL_BACKEND_URL:
      process.env.vercel_backend_url ||
      process.env.VERCEL_BACKEND_URL ||
      process.env.NEXT_PUBLIC_VERCEL_BACKEND_URL
  }
}

module.exports = nextConfig
