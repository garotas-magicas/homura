/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compress: false,
};

export default {
  ...nextConfig,
  webpack(webpackConfig) {
    return {
      ...webpackConfig,
      optimization: {
        minimize: false,
      },
    };
  },
};
