import { isAuthenticated } from '../../../../middleware/adminAuth';
import { getAllCars } from '../../../../lib/shopify.mjs';
import fs from 'fs';
import path from 'path';

/**
 * API: GET /api/admin/cars/list
 * Fetch all cars with their status from Shopify
 * Returns: { success: true, cars: [...] }
 */
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Check authentication
  if (!isAuthenticated(req)) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    // Fetch all products from Shopify
    const cars = await getAllCars();

    // Load status from file storage (fallback)
    let fileStatuses = {};
    try {
      const statusFile = path.join(process.cwd(), 'data', 'car-status.json');
      if (fs.existsSync(statusFile)) {
        const fileContent = fs.readFileSync(statusFile, 'utf8');
        fileStatuses = JSON.parse(fileContent);
      }
    } catch {
      // Silently fail if file doesn't exist
      fileStatuses = {};
    }

    // Transform products to car format with normalized status
    const carsWithStatus = cars.map(car => {
      // Get status from file storage or default to 'available'
      const statusRaw = fileStatuses[car.id]?.status ?? 'available';
      // Normalize status to allowed set: 'available' | 'reserved'
      let status = typeof statusRaw === 'string' ? statusRaw.trim().toLowerCase() : 'available';
      if (status !== 'available' && status !== 'reserved') status = 'available';

      return {
        id: car.id,
        shopifyId: car.id,
        handle: car.handle,
        title: car.title,
        status, // 'available' or 'reserved'
        image: car.images?.[0]?.url || null,
        price: car.price?.amount || '0',
        brand: car.brand || car.vendor,
        model: car.model || '',
        year: car.year || '',
        mileage: car.mileage || '',
        color: car.color || '',
        updatedAt: car.updatedAt,
      };
    });

    // Sort by updatedAt (newest first)
    carsWithStatus.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return res.status(200).json({
      success: true,
      cars: carsWithStatus,
      total: carsWithStatus.length,
      available: carsWithStatus.filter(c => c.status === 'available').length,
      reserved: carsWithStatus.filter(c => c.status === 'reserved').length,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch cars:', error);
    }
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch cars',
      message: error.message,
    });
  }
}
