/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    serverActions: true,
  },

  webpack: (config) => {
    config.externals.push({
      "react-native-sqlite-storage": "commonjs react-native-sqlite-storage",
    });
    return config;
  },
};

module.exports = nextConfig;
