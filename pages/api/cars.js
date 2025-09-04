import { getHomepageCars } from '../../lib/shopify';

export default async function handler(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit || '16', 10) || 16, 32);
    const cars = await getHomepageCars(limit);
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(cars);
  } catch (e) {
    return res.status(500).json({ error: 'failed_to_fetch_cars' });
  }
}
