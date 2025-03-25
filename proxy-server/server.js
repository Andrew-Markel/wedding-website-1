const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const targetUrl = 'https://withjoy.com/andrew-and-emma-aug-8/registry'; // The URL of the external server you want to proxy

// Proxy any request to the target URL
app.use('/proxy', createProxyMiddleware({
  target: targetUrl,
  changeOrigin: true,
  cookieDomainRewrite: 'localhost', 
  onProxyRes: (proxyRes, req, res) => {
    // Remove X-Frame-Options or any other restrictive headers
    proxyRes.headers['X-Frame-Options'] = '';
    proxyRes.headers['Content-Security-Policy'] = '';
  }
}));

// Start the proxy server
const port = 3000;
app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});