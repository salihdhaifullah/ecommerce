/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,

  images: {
    dangerouslyAllowSVG: true,
    domains: ['uyowzupacsoabvqjpfah.supabase.co', 'api.dicebear.com', 'flagcdn.com'],
  },
  env: {
      HOST: process.env.HOST,
  },
}

module.exports = nextConfig;
