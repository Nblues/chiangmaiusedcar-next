// pages/api/health.js
export default function handler(req, res) {
  // Set headers for no cache (2025 standard)
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('X-Timestamp', Date.now().toString());

  const health = {
    status: 'ok',
    timestamp: Date.now(),
    buildTime: process.env.CUSTOM_BUILD_TIME || new Date().toISOString(),
    version: '2025.9.8',
    environment: process.env.NODE_ENV || 'development',
  };

  res.status(200).json(health);
}
