const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  console.log('Setting up proxy to backend:', process.env.REACT_APP_BACKEND_URL);

  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_BACKEND_URL,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',  // Remove /api prefix before forwarding the request to backend
      }
    })
  );
};