import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['i.ibb.co', 'i.postimg.cc', 'via.placeholder.com', 'cdn.sanity.io'], // Add the external domain for images
  },
};

export default nextConfig;
