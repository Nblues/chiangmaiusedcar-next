
/**
 * Proxy configuration for WebSocket HMR forwarding
 * Use this with your reverse proxy (nginx, Apache, etc.)
 */

module.exports = {
  // For nginx
  nginx: {
    location: '/_next/webpack-hmr',
    config: `
      proxy_pass http://localhost:3000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_cache_bypass $http_upgrade;
    `
  },
  
  // For Apache
  apache: {
    config: `
      ProxyPreserveHost On
      ProxyRequests Off
      
      # WebSocket HMR support
      RewriteEngine on
      RewriteCond %{HTTP:UPGRADE} ^WebSocket$ [NC]
      RewriteCond %{HTTP:CONNECTION} Upgrade$ [NC]
      RewriteRule /_next/webpack-hmr(.*) ws://localhost:3000/_next/webpack-hmr$1 [P,L]
      
      # Regular proxy
      ProxyPass /_next/webpack-hmr http://localhost:3000/_next/webpack-hmr
      ProxyPassReverse /_next/webpack-hmr http://localhost:3000/_next/webpack-hmr
    `
  },
  
  // For Node.js proxy
  nodejs: {
    target: 'http://localhost:3000',
    changeOrigin: true,
    ws: true, // Enable WebSocket proxying
    pathRewrite: {
      '^/_next/webpack-hmr': '/_next/webpack-hmr'
    }
  }
};
