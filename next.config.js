/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'lh3.googleusercontent.com'],
  },
  experimental: {
    serverActions: true
  }
};

module.exports = nextConfig;