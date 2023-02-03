/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 300,
  distDir: ".next",
  images: {
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
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/notionhomepage.appspot.com/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "9199",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      child_process: false,
      net: false,
      tls: false,
    };

    return config;
  },
};
