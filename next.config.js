/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 300,
  images: {
    domains: [
      "www.notion.so",
      "notion.so",
      "images.unsplash.com",
      "pbs.twimg.com",
      "s3.us-west-2.amazonaws.com",
    ],
    formats: ["image/avif", "image/webp"],
  },
};
