import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['i.ibb.co', 'i.postimg.cc', 'via.placeholder.com', 'cdn.sanity.io','ui-avatars.com' ,'example.com', 'lh3.googleusercontent.com', 'res.cloudinary.com', 'image.url'], // Add the external domain for images
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store, max-age=0, must-revalidate',
        },
      ],
    },
  ],
};

export default nextConfig;