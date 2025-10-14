// Test Shopify API connection
import { getAllCars } from '../../lib/shopify';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { limit = 3 } = req.query;
    const limitNum = parseInt(limit, 10);

    // Check environment variables
    const hasShopifyConfig = !!(process.env.SHOPIFY_DOMAIN && process.env.SHOPIFY_STOREFRONT_TOKEN);

    if (!hasShopifyConfig) {
      return res.status(400).json({
        success: false,
        error: 'Shopify configuration missing',
        details: {
          domain: !!process.env.SHOPIFY_DOMAIN,
          token: !!process.env.SHOPIFY_STOREFRONT_TOKEN,
        },
      });
    }

    // Try to fetch cars
    const carsData = await getAllCars();

    // getAllCars() returns an array directly, not an object with .cars property
    if (!carsData || !Array.isArray(carsData)) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch cars from Shopify',
        data: carsData,
      });
    }

    const limitedCars = carsData.slice(0, limitNum);

    return res.status(200).json({
      success: true,
      totalCars: carsData.length,
      cars: limitedCars,
      metadata: {
        domain: process.env.SHOPIFY_DOMAIN,
        apiVersion: '2023-04',
        hasToken: !!process.env.SHOPIFY_STOREFRONT_TOKEN,
      },
    });
  } catch (error) {
    console.error('Shopify test error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}
