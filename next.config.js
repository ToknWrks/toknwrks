/** @type {import('next').NextConfig} */


const nextConfig = {};

module.exports = {
  // ... other configurations ...
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.js$/,
      use: 'babel-loader',
      exclude: /node_modules/,
    });

    return config;
  },
};

