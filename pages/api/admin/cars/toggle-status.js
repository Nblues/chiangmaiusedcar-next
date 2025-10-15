import { isAuthenticated, verifyCsrf } from '../../../../middleware/adminAuth';
import { updateCarStatus } from '../../../../lib/carStatusStore.js';

/**
 * API: POST /api/admin/cars/toggle-status
 * Toggle car availability status (available <-> reserved)
 * Body: { carId: string, status: 'available' | 'reserved' }
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Check authentication
  if (!isAuthenticated(req)) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  // CSRF protection
  if (!verifyCsrf(req)) {
    return res.status(403).json({ success: false, error: 'Invalid CSRF token' });
  }

  const { carId, status } = req.body;

  // Validate input
  if (!carId || !status) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: carId, status',
    });
  }

  if (!['available', 'reserved'].includes(status)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid status. Must be "available" or "reserved"',
    });
  }

  try {
    // Use Shopify Admin API to update product metafield
    const shopifyDomain = process.env.SHOPIFY_DOMAIN;
    const adminToken = process.env.SHOPIFY_ADMIN_TOKEN;

    if (!adminToken) {
      const { statusRecord, path: filePath } = updateCarStatus(carId, status);
      return res.status(200).json({
        success: true,
        carId,
        status: statusRecord.status,
        message: 'Status updated successfully (file storage)',
        storage: 'file',
        filePath,
      });
    }

    // Extract product ID from Shopify GID
    const productId = carId.replace('gid://shopify/Product/', '');

    // Try to locate an existing metafield so we can update instead of creating duplicates
    const metafieldLookup = await fetch(
      `https://${shopifyDomain}/admin/api/2024-01/products/${productId}/metafields.json?namespace=custom&key=status`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminToken,
        },
      }
    );

    if (!metafieldLookup.ok) {
      throw new Error(`Shopify metafield lookup failed: ${metafieldLookup.statusText}`);
    }

    const lookupPayload = await metafieldLookup.json();
    const existingMetafield = Array.isArray(lookupPayload?.metafields)
      ? lookupPayload.metafields[0]
      : null;

    let apiResponse;

    if (existingMetafield?.id) {
      apiResponse = await fetch(
        `https://${shopifyDomain}/admin/api/2024-01/metafields/${existingMetafield.id}.json`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': adminToken,
          },
          body: JSON.stringify({
            metafield: {
              id: existingMetafield.id,
              value: status,
              type: 'single_line_text_field',
            },
          }),
        }
      );
    } else {
      apiResponse = await fetch(
        `https://${shopifyDomain}/admin/api/2024-01/products/${productId}/metafields.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': adminToken,
          },
          body: JSON.stringify({
            metafield: {
              namespace: 'custom',
              key: 'status',
              value: status,
              type: 'single_line_text_field',
            },
          }),
        }
      );
    }

    if (!apiResponse.ok) {
      const bodyText = await apiResponse.text();
      throw new Error(`Shopify API error: ${apiResponse.status} ${bodyText}`);
    }

    const payload = await apiResponse.json();

    return res.status(200).json({
      success: true,
      carId,
      status,
      message: 'Status updated successfully',
      metafield: payload.metafield,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('Failed to update car status:', error);
    }
    return res.status(500).json({
      success: false,
      error: 'Failed to update status',
      message: error.message,
    });
  }
}
