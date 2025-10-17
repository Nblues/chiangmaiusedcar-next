// API: GET /api/seo/rich-results?handle={car-handle}
// Purpose: Generate JSON-LD for a given car to test Google Rich Results easily
import { buildEnhancedCarJsonLd, buildLocalBusinessJsonLd } from '../../../lib/seo/jsonld.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { handle } = req.query;
    const site = 'https://www.chiangmaiusedcar.com';

    // Load car data
    let car = null;
    if (handle) {
      const { getCarByHandle, getAllCars } = await import('../../../lib/shopify.mjs');
      const h = String(handle);
      // Try direct by handle first
      car = await getCarByHandle(h);
      // Fallback: search in list (case-insensitive), then fallback to first car
      if (!car) {
        const list = await getAllCars();
        if (Array.isArray(list) && list.length) {
          car =
            list.find(c => String(c.handle).toLowerCase() === h.toLowerCase()) ||
            list.find(c => String(c.handle) === h) ||
            list[0] ||
            null;
        }
      }
    } else {
      const { getAllCars } = await import('../../../lib/shopify.mjs');
      const list = await getAllCars();
      car = Array.isArray(list) && list.length > 0 ? list[0] : null;
    }

    if (!car) {
      return res
        .status(404)
        .json({ success: false, error: 'Car not found', handle: handle || null });
    }

    // Normalize fields
    const title = car.title || `${car.brand || car.vendor || ''} ${car.model || ''}`.trim();
    const description = car.description || `${title} รถมือสองเชียงใหม่ คุณภาพดี ฟรีดาวน์ ผ่อนถูก`;
    const images = (car.images || [])
      .map(img => {
        const url = img.url || img.originalUrl || '';
        if (!url) return null;
        return url.startsWith('http') ? url : `${site}${url.startsWith('/') ? '' : '/'}${url}`;
      })
      .filter(Boolean);

    const priceAmount = car?.price?.amount || car?.variant?.price?.amount || 0;
    const currency = car?.price?.currencyCode || car?.variant?.price?.currencyCode || 'THB';

    const jsonldCar = buildEnhancedCarJsonLd({
      name: title,
      description,
      brand: car.brand || car.vendor,
      year: car.year,
      model: car.model,
      images,
      price: priceAmount,
      currency,
      url: `${site}/car/${car.handle}`,
      sku: car.id || car.handle,
      vin: car.vin,
      mileage: car.mileage,
      transmission: car.transmission || 'Manual',
      fuelType: car.fuel_type || 'Gasoline',
      engineSize: car.engine,
      color: car.color,
      seats: car.seats,
      bodyType: car.body_type,
      availability: car.availableForSale !== false ? 'InStock' : 'OutOfStock',
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      returnPolicy: 'NoReturnRefund',
      shippingCost: 0,
      warrantyPeriod: '1 ปี',
      ratingValue: car?.review?.ratingValue,
      reviewCount: car?.review?.reviewCount,
    });

    const jsonldOrganization = buildLocalBusinessJsonLd();

    return res.status(200).json({
      success: true,
      handle: car.handle,
      url: `${site}/car/${car.handle}`,
      jsonld: [jsonldOrganization, jsonldCar],
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('rich-results error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
