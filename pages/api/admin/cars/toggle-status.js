import { isAuthenticated, verifyCsrf } from '../../../../middleware/adminAuth';

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
      // Fallback: Store in JSON file if no Admin API access
      return handleFileStorage(carId, status, res);
    }

    // Extract product ID from Shopify GID
    const productId = carId.replace('gid://shopify/Product/', '');

    // Update metafield via Shopify Admin API
    const response = await fetch(
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

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      carId,
      status,
      message: 'Status updated successfully',
      metafield: data.metafield,
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

/**
 * Fallback: Store status in JSON file if Shopify Admin API not available
 */
async function handleFileStorage(carId, status, res) {
  const fs = require('fs');
  const path = require('path');

  try {
    const dataDir = path.join(process.cwd(), 'data');
    const statusFile = path.join(dataDir, 'car-status.json');

    // Create data directory if not exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Read existing data
    let carStatuses = {};
    if (fs.existsSync(statusFile)) {
      const fileContent = fs.readFileSync(statusFile, 'utf8');
      carStatuses = JSON.parse(fileContent);
    }

    // Update status
    carStatuses[carId] = {
      status,
      updatedAt: new Date().toISOString(),
    };

    // Write back to file
    fs.writeFileSync(statusFile, JSON.stringify(carStatuses, null, 2), 'utf8');

    return res.status(200).json({
      success: true,
      carId,
      status,
      message: 'Status updated successfully (file storage)',
      storage: 'file',
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('Failed to update status (file storage):', error);
    }
    return res.status(500).json({
      success: false,
      error: 'Failed to update status',
      message: error.message,
    });
  }
}
