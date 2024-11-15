/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'appfile.medistaff.co.kr',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'testappfile.medistaff.co.kr',
        port: '',
      },
    ],
  },
};

export default nextConfig;
