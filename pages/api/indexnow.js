/**
 * IndexNow API Route
 * Endpoint for submitting URLs to IndexNow
 *
 * Usage:
 * POST /api/indexnow
 * Body: { "url": "https://www.chiangmaiusedcar.com/car/new-car" }
 *
 * Or batch:
 * POST /api/indexnow
 * Body: { "urls": ["url1", "url2", ...] }
 */

import { submitUrlToIndexNow, submitBatchToIndexNow } from '../../lib/indexnow';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST.',
    });
  }

  try {
    const { url, urls } = req.body;

    // Single URL submission
    if (url) {
      const result = await submitUrlToIndexNow(url);
      return res.status(result.success ? 200 : 500).json(result);
    }

    // Batch submission
    if (urls && Array.isArray(urls)) {
      const result = await submitBatchToIndexNow(urls);
      return res.status(result.success ? 200 : 500).json(result);
    }

    return res.status(400).json({
      success: false,
      message: 'Please provide either "url" (string) or "urls" (array)',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
}
