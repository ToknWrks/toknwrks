// next.config.js
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.js$/,
      use: 'babel-loader',
      exclude: /node_modules/,
    });

    // Add alias for font imports
    config.resolve.alias['~@fontsource'] = path.resolve(
      __dirname,
      'node_modules/@fontsource'
    );

    return config;
  },
};

module.exports = nextConfig;
