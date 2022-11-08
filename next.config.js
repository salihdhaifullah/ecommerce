/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
      HOST: process.env.HOST,
  },
}

module.exports = nextConfig;