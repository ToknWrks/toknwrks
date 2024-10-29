// pages/api/proxy.js
import { createProxyMiddleware } from 'http-proxy-middleware';

export default createProxyMiddleware({
  target: 'https://lcd.cosmos.network',
  changeOrigin: true,
  pathRewrite: {
    '^/api/proxy': '', // Remove /api/proxy from the URL
  },
});
