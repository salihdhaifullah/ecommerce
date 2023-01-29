/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['uyowzupacsoabvqjpfah.supabase.co', 'avatars.dicebear.com'],
  },
  env: {
      HOST: process.env.HOST,
  },
}

module.exports = nextConfig;
