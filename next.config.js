/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 300,
  distDir: ".next",
  images: {
    loader: "custom",
    loaderFile: "./imageLoader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**notion.so",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
        pathname: "/secure.notion-static.com/**",
      },
    ],
  },
};
