/* eslint-disable prettier/prettier */
// Minimal KV smoke test
// GET /api/admin/test-kv
import { readCarStatuses } from '../../../lib/carStatusStore.js';
import { isAuthenticated } from '../../../middleware/adminAuth';

export default async function handler(req, res) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
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
