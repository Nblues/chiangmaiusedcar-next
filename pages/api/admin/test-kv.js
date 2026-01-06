/* eslint-disable prettier/prettier */
// Minimal KV smoke test
// GET /api/admin/test-kv
import { readCarStatuses } from '../../../lib/carStatusStore.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const statuses = await readCarStatuses();
    return res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      carsCount: Object.keys(statuses).length,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
