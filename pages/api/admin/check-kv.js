/* eslint-disable prettier/prettier */
/**
 * Check KV connectivity (minimal stub)
 * GET /api/admin/check-kv
 */

import { readCarStatuses } from '../../../lib/carStatusStore.js';
import { isAuthenticated } from '../../../middleware/adminAuth';

export default async function handler(req, res) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ success: false, error: 'Not found' });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (!isAuthenticated(req)) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const statuses = await readCarStatuses();
    return res.status(200).json({
      success: true,
      kvConnected: Object.keys(statuses).length >= 0,
      sampleCount: Object.keys(statuses).length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
