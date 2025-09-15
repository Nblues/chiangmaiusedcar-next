// pages/api/health.js - Ultra fast health check
export default function handler(req, res) {
  // Set optimized headers for fast response
  res.setHeader('Cache-Control', 'public, max-age=30, s-maxage=60');
  res.setHeader('X-Response-Time', Date.now().toString());
  res.setHeader('Server-Timing', 'health;dur=0');

  // Minimal response for fastest possible health check
  res.status(200).json({
    status: 'ok',
    timestamp: Date.now(),
    version: '2025.9.15-performance',
  });
}
