export default function handler(req, res) {
  // Dev-only diagnostics: never expose tokens.
  if (process.env.NODE_ENV === 'production') {
    res.status(404).end();
    return;
  }

  const adminDomain =
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
  const effectiveAdminDomain = adminDomain || inferredAdminDomain;

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

  const mask = token => {
    if (!token) return null;
    const t = String(token).trim();
    if (t.length <= 10) return '***';
    return `${t.slice(0, 6)}***${t.slice(-4)}`;
  };

  res.status(200).json({
    nodeEnv: process.env.NODE_ENV,
    admin: {
      enabled,
      domain: effectiveAdminDomain,
      domainFromEnv: adminDomain,
      domainInferred: inferredAdminDomain,
      tokenPresent: Boolean(chosenToken),
      tokenLooksLikeAdmin: isLikelyAdminToken(chosenToken),
      tokenMasked: mask(chosenToken),
      tokenSource:
        directToken && directToken !== 'undefined'
          ? 'SHOPIFY_ADMIN_TOKEN*'
          : legacyToken
            ? 'API_shopify/API_SHOPIFY'
            : null,
    },
    storefront: {
      domain: storefrontDomain,
      apiVersion: process.env.SHOPIFY_API_VERSION || null,
      tokenPresent: Boolean(process.env.Storefront_API || process.env.SHOPIFY_STOREFRONT_TOKEN),
    },
    hint: 'If admin.enabled=false, add SHOPIFY_ADMIN_DOMAIN=your-store.myshopify.com and SHOPIFY_ADMIN_TOKEN=shpat_... to .env.local then restart dev server.',
  });
}
