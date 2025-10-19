import { isAuthenticated, verifyCsrf } from '../../../../middleware/adminAuth';
import { verifyApiAuth } from '../../../../lib/apiAuth';
import { updateCarStatus } from '../../../../lib/carStatusStore.js';

/**
 * API: POST /api/admin/cars/toggle-status
 * Toggle car availability status (available <-> reserved)
 * Body: { carId: string, status: 'available' | 'reserved' }
 *
 * Storage: Vercel KV (Redis) - ข้อมูลถาวร 100%
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
        const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-10';
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

    // Update status in Vercel KV (our own storage)
    const { statusRecord, storage } = await updateCarStatus(carId, status);

    // Attempt on-demand revalidation for pages showing car listings and specific car page
    const handleToRevalidate = providedHandle || (await getHandleById(carId));
    await revalidatePaths(handleToRevalidate);

    return res.status(200).json({
      success: true,
      carId,
      status: statusRecord.status,
      message: 'Status updated successfully',
      storage, // 'vercel-kv'
      updatedAt: statusRecord.updatedAt,
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
