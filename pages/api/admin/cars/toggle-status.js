import { isAuthenticated, verifyCsrf } from '../../../../middleware/adminAuth';
import { verifyApiAuth } from '../../../../lib/apiAuth';
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

  // Check authentication: allow admin session OR API auth
  let authedBy = 'session';
  if (!isAuthenticated(req)) {
    const apiAuth = verifyApiAuth(req, { requireHmac: true });
    if (!apiAuth.ok) {
      res.setHeader(
        'WWW-Authenticate',
        'APIKey realm="chiangmaiusedcar", headers="X-API-Key, X-Timestamp, X-Signature"'
      );
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    authedBy = 'api';
  }

  // CSRF protection
  if (authedBy === 'session' && !verifyCsrf(req)) {
    return res.status(403).json({ success: false, error: 'Invalid CSRF token' });
  }

  const { carId, status, handle: providedHandle } = req.body || {};

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
    // Helper: attempt to revalidate common paths and specific car handle
    const revalidatePaths = async handleToRevalidate => {
      try {
        if (typeof res.revalidate === 'function') {
          await res.revalidate('/');
          await res.revalidate('/all-cars');
          if (handleToRevalidate && typeof handleToRevalidate === 'string') {
            await res.revalidate(`/car/${encodeURIComponent(handleToRevalidate)}`);
          }
        }
      } catch {
        // ignore revalidation errors to avoid failing the main request
      }
    };

    // Helper: fetch product handle from Shopify Storefront API if not provided
    const getHandleById = async id => {
      if (!id) return null;
      try {
        const domain = process.env.SHOPIFY_DOMAIN;
        const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
        if (!domain || !token) return null;
  const apiVersion = process.env.SHOPIFY_API_VERSION || '2025-01';
  const resp = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': token,
          },
          body: JSON.stringify({
            query: `query NodeHandle($id: ID!) { node(id: $id) { ... on Product { handle } } }`,
            variables: { id },
          }),
        });
        if (!resp.ok) return null;
        const data = await resp.json();
        return data?.data?.node?.handle || null;
      } catch {
        return null;
      }
    };

    // Use Shopify Admin API to update product metafield
    const shopifyDomain = process.env.SHOPIFY_DOMAIN;
    const adminToken = process.env.SHOPIFY_ADMIN_TOKEN;

    if (!adminToken) {
      // File-based status update for environments without Shopify Admin API token
      const { statusRecord, path: filePath } = updateCarStatus(carId, status);
      // Attempt on-demand revalidation for pages showing car listings and specific car page
      const handleToRevalidate = providedHandle || (await getHandleById(carId));
      await revalidatePaths(handleToRevalidate);
      return res.status(200).json({
        success: true,
        carId,
        status: statusRecord.status,
        message: 'Status updated successfully (file storage)',
        storage: 'file',
        filePath,
        revalidated: true,
        revalidatedHandle: handleToRevalidate || undefined,
        authedBy,
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

    // Mirror status to file store as well for immediate frontend reflection
    const mirror = updateCarStatus(carId, status);

    // Attempt on-demand revalidation for pages showing car listings and specific car page
    const handleToRevalidate = providedHandle || (await getHandleById(carId));
    await revalidatePaths(handleToRevalidate);

    return res.status(200).json({
      success: true,
      carId,
      status,
      message: 'Status updated successfully',
      metafield: payload.metafield,
      mirrored: { storage: 'file', path: mirror.path },
      revalidated: true,
      revalidatedHandle: handleToRevalidate || undefined,
      authedBy,
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
