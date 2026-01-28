/**
 * Secure Shopify Admin status check (production-safe)
 *
 * GET /api/debug/shopify-admin-status-secure
 *
 * Auth: require DEBUG_ENDPOINT_SECRET via:
 * - Header: x-debug-secret: <secret>
 * - Query:  ?secret=<secret>
 *
 * Optional:
 * - ?verify=1  -> performs a minimal Admin API GraphQL query to validate token access
 *
 * NOTE: Never returns any token values.
 */

import { fetchShopifyAdmin } from '../../../lib/shopify.mjs';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const configuredSecret = process.env.DEBUG_ENDPOINT_SECRET || null;

  // If secret isn't configured, behave like the endpoint doesn't exist.
  if (!configuredSecret) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  const providedSecret =
    (req.headers['x-debug-secret'] ? String(req.headers['x-debug-secret']) : '') ||
    (req.query?.secret ? String(req.query.secret) : '');

  if (!providedSecret || providedSecret !== configuredSecret) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const adminDomainFromEnv =
    process.env.SHOPIFY_ADMIN_DOMAIN ||
    process.env.SHOPIFY_MYSHOPIFY_DOMAIN ||
    process.env.MYSHOPIFY_DOMAIN ||
    null;

  const storefrontDomain =
    process.env.SHOPIFY_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    null;

  const inferMyshopifyDomain = d => {
    if (!d) return null;
    const raw = String(d).trim();
    if (!raw) return null;
    if (raw.includes('myshopify.com')) return raw;
    const host = raw.split('/')[0];
    const store = host.split('.')[0];
    if (!store) return null;
    return `${store}.myshopify.com`;
  };

  const inferredAdminDomain = inferMyshopifyDomain(storefrontDomain);
  const effectiveAdminDomain = adminDomainFromEnv || inferredAdminDomain;

  const directToken =
    process.env.SHOPIFY_ADMIN_TOKEN ||
    process.env.SHOPIFY_ADMIN_ACCESS_TOKEN ||
    process.env.SHOPIFY_ADMIN_API_TOKEN ||
    null;

  const legacyToken = process.env.API_shopify || process.env.API_SHOPIFY || null;

  const isLikelyAdminToken = token => {
    if (!token || token === 'undefined') return false;
    const t = String(token).trim();
    return (
      t.startsWith('shpat_') ||
      t.startsWith('shpca_') ||
      t.startsWith('shpua_') ||
      t.startsWith('shpss_') ||
      t.startsWith('shppa_')
    );
  };

  const chosenToken = directToken && directToken !== 'undefined' ? directToken : legacyToken;

  const enabled =
    Boolean(effectiveAdminDomain) &&
    String(effectiveAdminDomain).includes('myshopify.com') &&
    isLikelyAdminToken(chosenToken);

  const verifyRequested = String(req.query?.verify || '') === '1';

  let verify = {
    requested: verifyRequested,
    attempted: false,
    ok: null,
    shop: null,
    error: null,
  };

  if (verifyRequested && enabled) {
    verify.attempted = true;
    try {
      const data = await fetchShopifyAdmin(
        `query AdminStatusPing { shop { name myshopifyDomain } }`,
        {}
      );
      verify.ok = Boolean(data?.shop?.myshopifyDomain || data?.shop?.name);
      verify.shop = {
        name: data?.shop?.name || null,
        myshopifyDomain: data?.shop?.myshopifyDomain || null,
      };
    } catch (e) {
      verify.ok = false;
      verify.error = (e && e.message) || 'Unknown error';
    }
  }

  res.status(200).json({
    ok: true,
    nodeEnv: process.env.NODE_ENV || null,
    admin: {
      enabled,
      domain: effectiveAdminDomain,
      domainFromEnv: adminDomainFromEnv,
      domainInferred: inferredAdminDomain,
      tokenPresent: Boolean(chosenToken && chosenToken !== 'undefined'),
      tokenLooksLikeAdmin: isLikelyAdminToken(chosenToken),
      tokenSource:
        directToken && directToken !== 'undefined'
          ? 'SHOPIFY_ADMIN_TOKEN*'
          : legacyToken
            ? 'API_shopify/API_SHOPIFY'
            : null,
      apiVersion: process.env.SHOPIFY_ADMIN_API_VERSION || 'unstable',
    },
    storefront: {
      domain: storefrontDomain,
      apiVersion: process.env.SHOPIFY_API_VERSION || null,
      tokenPresent: Boolean(process.env.Storefront_API || process.env.SHOPIFY_STOREFRONT_TOKEN),
    },
    verify,
  });
}
