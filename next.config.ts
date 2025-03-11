import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['i.ibb.co', 'i.postimg.cc', 'via.placeholder.com', 'cdn.sanity.io','ui-avatars.com' ,'example.com', 'lh3.googleusercontent.com', 'res.cloudinary.com'], // Add the external domain for images
  },
};

export default nextConfig;
