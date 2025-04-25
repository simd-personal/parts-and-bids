/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'parts-and-bids-uploads.s3.us-east-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig 