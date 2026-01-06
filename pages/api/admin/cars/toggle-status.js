import { isAuthenticated, verifyCsrf } from '../../../../middleware/adminAuth';
import { verifyApiAuth } from '../../../../lib/apiAuth';
import { updateCarStatus } from '../../../../lib/carStatusStore.js';

// Ensure Node.js runtime and JSON body parsing
export const config = {
  runtime: 'nodejs',
  api: { bodyParser: true, externalResolver: true },
};

/**
 * API: POST /api/admin/cars/toggle-status
 * Toggle car availability status (available <-> reserved)
 * Body: { carId: string, status: 'available' | 'reserved' }
 *
 * Storage: Vercel KV (Redis) - ข้อมูลถาวร 100%
 */
export default async function handler(req, res) {
  // Set no-cache headers
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
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
    const resolveShopifyAdminDomain = () => {
      const explicit = process.env.SHOPIFY_ADMIN_DOMAIN;
      if (explicit && typeof explicit === 'string' && explicit.trim()) return explicit.trim();

      const storefrontDomainRaw = process.env.SHOPIFY_DOMAIN;
      if (!storefrontDomainRaw || typeof storefrontDomainRaw !== 'string') return null;

      const storefrontHost = storefrontDomainRaw
        .replace(/^https?:\/\//i, '')
        .split('/')[0]
        .trim()
        .replace(/^www\./i, '');

      // If already a myshopify host, use it.
      if (storefrontHost.endsWith('.myshopify.com')) return storefrontHost;

      // Heuristic: custom domain often matches shop name (e.g., kn-goodcar.com -> kn-goodcar.myshopify.com)
      const shopName = storefrontHost.split('.')[0];
      if (!shopName) return null;
      return `${shopName}.myshopify.com`;
    };

    const updateShopifyReservedTag = async (productId, nextStatus) => {
      const adminToken = process.env.SHOPIFY_ADMIN_TOKEN;
      const adminDomain = resolveShopifyAdminDomain();
      if (!adminToken || !adminDomain) {
        return {
          ok: false,
          skipped: true,
          reason: 'Missing SHOPIFY_ADMIN_TOKEN or resolvable admin domain',
          hasAdminToken: !!adminToken,
          adminDomain: adminDomain || null,
        };
      }

      const apiVersion =
        process.env.SHOPIFY_ADMIN_API_VERSION || process.env.SHOPIFY_API_VERSION || '2024-10';
      const endpoint = `https://${adminDomain}/admin/api/${apiVersion}/graphql.json`;

      const reservedTag = 'reserved';
      const shouldHaveReserved = nextStatus === 'reserved';

      const queryResp = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminToken,
        },
        body: JSON.stringify({
          query: `query ProductTags($id: ID!) { product(id: $id) { id tags } }`,
          variables: { id: productId },
        }),
      });

      if (!queryResp.ok) {
        const text = await queryResp.text().catch(() => '');
        return {
          ok: false,
          error: `Shopify tags query failed (${queryResp.status})`,
          details: text,
          adminDomain,
          apiVersion,
        };
      }

      const queryJson = await queryResp.json();
      const tags = queryJson?.data?.product?.tags;
      if (!Array.isArray(tags)) {
        return { ok: false, error: 'Shopify tags query returned no tags', adminDomain, apiVersion };
      }

      const hasReserved = tags.includes(reservedTag);
      const nextTags = shouldHaveReserved
        ? hasReserved
          ? tags
          : [...tags, reservedTag]
        : tags.filter(t => t !== reservedTag);

      // No changes needed
      if (nextTags.length === tags.length && hasReserved === shouldHaveReserved) {
        return { ok: true, changed: false, tagsCount: tags.length, adminDomain, apiVersion };
      }

      const mutResp = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminToken,
        },
        body: JSON.stringify({
          query: `mutation ProductUpdate($input: ProductInput!) { productUpdate(input: $input) { product { id tags } userErrors { field message } } }`,
          variables: { input: { id: productId, tags: nextTags } },
        }),
      });

      if (!mutResp.ok) {
        const text = await mutResp.text().catch(() => '');
        return {
          ok: false,
          error: `Shopify productUpdate failed (${mutResp.status})`,
          details: text,
          adminDomain,
          apiVersion,
        };
      }

      const mutJson = await mutResp.json();
      const errs = mutJson?.data?.productUpdate?.userErrors;
      if (Array.isArray(errs) && errs.length > 0) {
        return {
          ok: false,
          error: 'Shopify productUpdate userErrors',
          userErrors: errs,
          adminDomain,
          apiVersion,
        };
      }

      return {
        ok: true,
        changed: true,
        tagsCount: mutJson?.data?.productUpdate?.product?.tags?.length || null,
        adminDomain,
        apiVersion,
      };
    };

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
      } catch (revalidateError) {
        // Log revalidation errors but don't fail the request
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.warn('Revalidation failed:', revalidateError.message);
        }
      }
    };

    // Helper: fetch product handle from Shopify Storefront API if not provided
    const getHandleById = async id => {
      if (!id) return null;
      try {
        const domain = process.env.SHOPIFY_DOMAIN;
        const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
        if (!domain || !token) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn('Shopify credentials not configured for handle lookup');
          }
          return null;
        }
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
        if (!resp.ok) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn(`Shopify API error: ${resp.status}`);
          }
          return null;
        }
        const data = await resp.json();
        return data?.data?.node?.handle || null;
      } catch (shopifyError) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.warn('Failed to fetch handle from Shopify:', shopifyError.message);
        }
        return null;
      }
    };

    // Update status in Vercel KV (our own storage)
    let result;
    try {
      result = await updateCarStatus(carId, status);
    } catch (kvError) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('KV Update Error:', kvError);
      }
      return res.status(500).json({
        success: false,
        error: 'Failed to update car status in database',
        details: kvError.message,
        timestamp: new Date().toISOString(),
      });
    }

    const { statusRecord, storage, warning } = result;

    // If KV didn't persist (e.g., Upstash max requests exceeded), fallback to Shopify tags for persistence
    let shopifyTag = null;
    if (storage !== 'vercel-kv') {
      try {
        shopifyTag = await updateShopifyReservedTag(carId, statusRecord.status);
      } catch (shopifyError) {
        shopifyTag = { ok: false, error: shopifyError?.message || 'Shopify tag update failed' };
      }
    }

    // Log success
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(
        `✅ Status updated: ${carId} → ${status} (storage: ${storage})${warning ? ` WARNING: ${warning}` : ''}`
      );
    }

    // Attempt on-demand revalidation for pages showing car listings and specific car page
    const handleToRevalidate = providedHandle || (await getHandleById(carId));
    await revalidatePaths(handleToRevalidate);

    return res.status(200).json({
      success: true,
      carId,
      status: statusRecord.status,
      message: 'Status updated successfully',
      storage, // 'vercel-kv' or 'memory-only'
      updatedAt: statusRecord.updatedAt,
      revalidated: true,
      revalidatedHandle: handleToRevalidate || undefined,
      authedBy,
      warning: warning || undefined,
      shopifyTag: shopifyTag || undefined,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('❌ Toggle Status API Error:', error);
    }
    return res.status(500).json({
      success: false,
      error: 'Failed to update status',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
