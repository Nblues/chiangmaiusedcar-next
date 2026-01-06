/* eslint-disable prettier/prettier */
/**
 * Check KV connectivity (minimal stub)
 * GET /api/admin/check-kv
 */

import { readCarStatuses } from '../../../lib/carStatusStore.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
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
