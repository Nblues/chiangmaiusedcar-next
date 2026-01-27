// Shopify GraphQL API integration for retrieving car data
// Uses Shopify Storefront API to fetch product data with custom metafields

import { safeFetch } from './safeFetch.js';
import { parseCarData } from './carDataParser.js';
import { optimizeShopifyImage } from './shopifyImageOptimizer.js';
import https from 'node:https';
import { URL } from 'node:url';

async function fetchJsonWithTimeout(url, options) {
  const {
    timeout = 3000,
    headers = {},
    method = 'POST',
    body = null,
    validateJson = true,
    maxBytes = 5 * 1024 * 1024,
    maxRedirects = 0,
  } = options || {};

  // Server-only: Storefront/Admin tokens must not be used client-side.
  if (typeof window !== 'undefined') {
    throw new Error('Shopify GraphQL fetch is server-only');
  }

  // IMPORTANT:
  // Using Node's built-in fetch (undici) can crash on Windows for some Shopify API versions.
  // We use node:https to avoid that class of issues.
  const requestOnce = targetUrl => {
    const u = new URL(targetUrl);
    const payload = body ? JSON.stringify(body) : '';
    const requestHeaders = {
      'Content-Type': 'application/json',
      'Accept-Encoding': 'identity',
      ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      ...headers,
    };

    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          method,
          hostname: u.hostname,
          path: `${u.pathname}${u.search}`,
          headers: requestHeaders,
        },
        res => {
          const statusCode = res.statusCode || 0;
          const statusMessage = res.statusMessage || '';
          const location = res.headers?.location || null;

          let bytes = 0;
          const chunks = [];

          res.on('data', chunk => {
            bytes += chunk.length;
            if (maxBytes && bytes > maxBytes) {
              req.destroy(new Error(`Response too large (${bytes} bytes)`));
              return;
            }
            chunks.push(chunk);
          });

          res.on('end', () => {
            const text = Buffer.concat(chunks).toString('utf8');
            resolve({ statusCode, statusMessage, location, text });
          });
        }
      );

      req.on('error', reject);

      req.setTimeout(timeout, () => {
        req.destroy(new Error(`Request timeout after ${timeout}ms`));
      });

      if (payload) req.write(payload);
      req.end();
    });
  };

  let currentUrl = url;
  let redirectsLeft = Math.max(0, Number(maxRedirects) || 0);

  // Follow redirects only when explicitly enabled.
  // Keep method/headers/body the same; Shopify redirects are typically host normalization.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { statusCode, statusMessage, location, text } = await requestOnce(currentUrl);

    if ([301, 302, 307, 308].includes(statusCode) && location && redirectsLeft > 0) {
      currentUrl = new URL(location, currentUrl).toString();
      redirectsLeft -= 1;
      continue;
    }

    if (statusCode < 200 || statusCode >= 300) {
      throw new Error(
        `HTTP ${statusCode}: ${statusMessage}${text ? ` - ${text.slice(0, 300)}` : ''}`
      );
    }

    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      throw new Error(`Invalid JSON response: ${(e && e.message) || 'parse error'}`);
    }

    if (validateJson && (data === null || data === undefined)) {
      throw new Error('Invalid JSON response: null or undefined');
    }

    return data;
  }
}

const hasValue = v => v != null && String(v).trim() !== '';

const metafieldsToList = raw => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.edges)) return raw.edges.map(e => e?.node).filter(Boolean);
  return [];
};

const metaobjectToDisplayValue = ref => {
  if (!ref) return null;
  const fields = Array.isArray(ref.fields) ? ref.fields : [];
  const byKey = key => fields.find(f => f?.key === key)?.value;
  return (
    byKey('label') ||
    byKey('name') ||
    byKey('title') ||
    byKey('value') ||
    ref.handle ||
    null
  );
};

const metafieldToDisplayValue = m => {
  if (!m) return null;

  const rawValue = m.value;
  const rawType = m.type ? String(m.type) : '';

  const looksLikeMetaobjectGid = v =>
    typeof v === 'string' && /^gid:\/\/shopify\/Metaobject\//.test(v.trim());

  // If it's a list of references, join them (preferred for list.metaobject_reference).
  const refs = Array.isArray(m.references?.edges)
    ? m.references.edges.map(e => e?.node).filter(Boolean)
    : [];

  if (refs.length > 0) {
    const values = refs
      .map(r => {
        if (r?.__typename === 'Metaobject') return metaobjectToDisplayValue(r);
        return null;
      })
      .filter(Boolean);

    if (values.length > 0) return values.join(', ');
  }

  // Normalize list values stored as JSON arrays (common for list.* types).
  if (typeof rawValue === 'string') {
    const trimmed = rawValue.trim();
    const looksLikeJsonArray = trimmed.startsWith('[') && trimmed.endsWith(']');

    if (looksLikeJsonArray && (rawType.startsWith('list.') || rawType === '')) {
      try {
        const arr = JSON.parse(trimmed);
        if (Array.isArray(arr)) {
          // Storefront often returns list.metaobject_reference as raw GIDs without `references`.
          // Treat that as "missing" so Admin fallback can resolve labels.
          if (rawType === 'list.metaobject_reference' && arr.every(v => looksLikeMetaobjectGid(v))) {
            return null;
          }

          const values = arr
            .map(v => (v == null ? '' : String(v).trim()))
            .filter(Boolean);
          if (values.length > 0) return values.join(', ');
        }
      } catch {
        // ignore JSON parse errors and fall back to raw handling
      }
    }

    // Normalize numbers like "150000.0" -> "150000".
    if (rawType.startsWith('number_') && /^\d+\.0+$/.test(trimmed)) {
      return trimmed.replace(/\.0+$/, '');
    }
  }

  // If it's a metaobject reference, prefer a human-readable label.
  const ref = m.reference;
  if (ref && ref.__typename === 'Metaobject') {
    return metaobjectToDisplayValue(ref) || m.value || null;
  }

  // Storefront sometimes returns a single metaobject_reference as a raw GID without `reference`.
  if (rawType === 'metaobject_reference' && looksLikeMetaobjectGid(rawValue)) {
    return null;
  }

  return rawValue ?? null;
};

const specFromMetafields = raw => {
  const list = metafieldsToList(raw);
  return list
    .filter(
      m =>
        m &&
        (m.namespace === 'spec' || m.namespace === 'custom' || m.namespace === 'shopify') &&
        typeof m.key === 'string'
    )
    .reduce((acc, m) => {
      acc[m.key] = metafieldToDisplayValue(m);
      return acc;
    }, {});
};

const needsAdminSpec = (productMetafields, variantMetafields, options = {}) => {
  const specProduct = specFromMetafields(productMetafields);
  const specVariant = specFromMetafields(variantMetafields);

  const includeCategory = Boolean(options.includeCategory);
  const includeBodyType = Boolean(options.includeBodyType);

  const getAny = keys => {
    for (const k of keys) {
      if (hasValue(specProduct[k])) return specProduct[k];
      if (hasValue(specVariant[k])) return specVariant[k];
    }
    return null;
  };

  const year = getAny(['year', 'ปี']);
  const mileage = getAny(['mileage', 'odometer', 'เลขไมล์', 'ไมล์', 'ระยะทาง', 'เลขไมล์แท้']);
  const transmission = getAny([
    'transmission',
    'gear',
    'transmission_type',
    'transmission-type',
    'transmissionType',
    'gear_type',
    'gear-type',
    'gearType',
    'เกียร์',
  ]);
  const fuel = getAny(['fuel_type', 'fuel', 'fuel-type', 'fuel-supply', 'เชื้อเพลิง']);

  const category = includeCategory
    ? getAny([
        'category',
        'car-type',
        'vehicle_category',
        'car_category',
        'vehicle_type',
        'car_type',
        'carType',
        'type',
        'ประเภทรถ',
        'หมวดหมู่',
        'ประเภท',
        'หมวดหมู่รถ',
        'ประเภทยานพาหนะ',
      ])
    : null;
  const bodyType = includeBodyType
    ? getAny(['body_type', 'bodyType', 'body-type', 'body', 'body_style', 'bodyStyle', 'ประเภทตัวถัง'])
    : null;

  // If any core listing spec is missing, try Admin fallback.
  return (
    !hasValue(year) ||
    !hasValue(mileage) ||
    !hasValue(transmission) ||
    !hasValue(fuel) ||
    (includeCategory && !hasValue(category)) ||
    (includeBodyType && !hasValue(bodyType))
  );
};

const getShopifyAdminDomain = () => {
  const direct =
    process.env.SHOPIFY_ADMIN_DOMAIN ||
    process.env.SHOPIFY_MYSHOPIFY_DOMAIN ||
    process.env.MYSHOPIFY_DOMAIN;
  if (direct && direct !== 'undefined') return String(direct).trim();

  const storefrontDomain =
    process.env.SHOPIFY_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  if (!storefrontDomain || storefrontDomain === 'undefined') return null;

  const d = String(storefrontDomain).trim();
  if (d.includes('myshopify.com')) return d;

  // Heuristic: if storefront domain is a custom domain (e.g. kn-goodcar.com),
  // infer store handle as the first hostname segment -> kn-goodcar.myshopify.com
  const host = d.split('/')[0];
  const store = host.split('.')[0];
  if (!store) return null;
  return `${store}.myshopify.com`;
};

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

const getShopifyAdminToken = () => {
  const direct =
    process.env.SHOPIFY_ADMIN_TOKEN ||
    process.env.SHOPIFY_ADMIN_ACCESS_TOKEN ||
    process.env.SHOPIFY_ADMIN_API_TOKEN;
  if (direct && direct !== 'undefined') return String(direct).trim();

  // Legacy env var: only treat as admin token when it matches known admin token formats.
  const legacy = process.env.API_shopify || process.env.API_SHOPIFY;
  if (isLikelyAdminToken(legacy)) return String(legacy).trim();

  return null;
};

const getShopifyAdminConfig = () => {
  const domain = getShopifyAdminDomain();
  const token = getShopifyAdminToken();
  const enabled = Boolean(domain) && String(domain).includes('myshopify.com') && Boolean(token);
  return { enabled, domain, token };
};

export async function fetchShopifyAdmin(query, variables = {}) {
  // IMPORTANT: Admin API token must never be used client-side.
  if (typeof window !== 'undefined') {
    throw new Error('Shopify Admin API is server-only');
  }

  const { domain: adminDomain, token: adminToken } = getShopifyAdminConfig();
  // Admin API versions get retired over time; default to 'unstable' unless explicitly pinned.
  const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION || 'unstable';

  if (!adminDomain || adminDomain === 'undefined') {
    throw new Error(
      'Shopify Admin API requires SHOPIFY_ADMIN_DOMAIN=your-store.myshopify.com (not the storefront domain)'
    );
  }

  if (!String(adminDomain).includes('myshopify.com')) {
    throw new Error(
      'Shopify Admin API requires a myshopify.com domain. Set SHOPIFY_ADMIN_DOMAIN=your-store.myshopify.com'
    );
  }

  if (!adminToken || adminToken === 'undefined') {
    throw new Error('Shopify admin token configuration is missing');
  }

  const normalizeHost = v => {
    if (!v || v === 'undefined') return null;
    return String(v).trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '');
  };

  const adminHost = normalizeHost(adminDomain);
  const storefrontHost = normalizeHost(
    process.env.SHOPIFY_DOMAIN ||
      process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ||
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
  );

  const hostsToTry = [adminHost];
  if (storefrontHost && storefrontHost !== adminHost) hostsToTry.push(storefrontHost);

  let lastError = null;
  for (const host of hostsToTry) {
    const url = `https://${host}/admin/api/${apiVersion}/graphql.json`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
      body: { query, variables },
      timeout: 5000,
      retries: 1,
      validateJson: true,
      maxRedirects: 2,
      fallback: null,
    };

    try {
      const result = await fetchJsonWithTimeout(url, options);
      if (!result) throw new Error('No response from Shopify Admin API');
      if (result.errors) {
        // eslint-disable-next-line no-console
        console.error('Admin GraphQL errors:', result.errors);
        throw new Error(`Admin GraphQL errors: ${JSON.stringify(result.errors)}`);
      }
      return result.data;
    } catch (e) {
      lastError = e;
      const msg = (e && e.message) || '';
      // Only retry on Not Found; for auth/permission/network errors, fail fast.
      if (!msg.includes('HTTP 404')) throw e;
    }
  }

  throw lastError || new Error('Shopify Admin API request failed');
}

async function getAdminSpecByProductIds(ids) {
  const adminCfg = getShopifyAdminConfig();
  if (!adminCfg.enabled) return {};

  const metafieldRefSelection = `
            reference {
              __typename
              ... on Metaobject {
                id
                handle
                type
                fields {
                  key
                  value
                }
              }
            }
            references(first: 20) {
              edges {
                node {
                  __typename
                  ... on Metaobject {
                    id
                    handle
                    type
                    fields {
                      key
                      value
                    }
                  }
                }
              }
            }
  `;

  const query = `
    query AdminSpecByIds($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          id
          shopifyMetafields: metafields(first: 100, namespace: "shopify") {
            edges {
              node {
                namespace
                key
                value
                type
                ${metafieldRefSelection}
              }
            }
          }
          specMetafields: metafields(first: 100, namespace: "spec") {
            edges {
              node {
                namespace
                key
                value
                type
                ${metafieldRefSelection}
              }
            }
          }
          customMetafields: metafields(first: 100, namespace: "custom") {
            edges {
              node {
                namespace
                key
                value
                type
                ${metafieldRefSelection}
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                shopifyMetafields: metafields(first: 100, namespace: "shopify") {
                  edges {
                    node {
                      namespace
                      key
                      value
                      type
                      ${metafieldRefSelection}
                    }
                  }
                }
                specMetafields: metafields(first: 100, namespace: "spec") {
                  edges {
                    node {
                      namespace
                      key
                      value
                      type
                      ${metafieldRefSelection}
                    }
                  }
                }
                customMetafields: metafields(first: 100, namespace: "custom") {
                  edges {
                    node {
                      namespace
                      key
                      value
                      type
                      ${metafieldRefSelection}
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await fetchShopifyAdmin(query, { ids });
    const nodes = Array.isArray(data?.nodes) ? data.nodes : [];
    const out = {};

    for (const node of nodes) {
      if (!node?.id) continue;
      const productMetafields = [
        ...metafieldsToList(node.shopifyMetafields),
        ...metafieldsToList(node.specMetafields),
        ...metafieldsToList(node.customMetafields),
      ];
      const productSpec = specFromMetafields(productMetafields);
      const variantNode = node?.variants?.edges?.[0]?.node || null;
      const variantMetafields = [
        ...metafieldsToList(variantNode?.shopifyMetafields),
        ...metafieldsToList(variantNode?.specMetafields),
        ...metafieldsToList(variantNode?.customMetafields),
      ];
      const variantSpec = specFromMetafields(variantMetafields);
      out[node.id] = { ...variantSpec, ...productSpec };
    }

    return out;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('getAdminSpecByProductIds error:', error);
    return {};
  }
}

// Base fetch function for Shopify GraphQL using safeFetch
export async function fetchShopify(query, variables = {}) {
  const domain =
    process.env.SHOPIFY_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;

  // Support legacy/alternate env var names some deployments use.
  // Prefer Storefront_API when provided (often the "active" token in Vercel env).
  const token =
    process.env.Storefront_API ||
    process.env.SHOPIFY_STOREFRONT_TOKEN ||
    process.env.STOREFRONT_API ||
    process.env.API_shopify ||
    process.env.API_SHOPIFY ||
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  // Allow overriding API version via env; default to the project's pinned version
  // (keeps Storefront schema consistent and avoids unexpected query incompatibilities).
  const apiVersion = process.env.SHOPIFY_API_VERSION || '2023-04';

  if (!domain || domain === 'undefined') {
    // eslint-disable-next-line no-console
    console.error('SHOPIFY_DOMAIN is not set or undefined');
    throw new Error('Shopify domain configuration is missing');
  }

  if (!token || token === 'undefined') {
    // eslint-disable-next-line no-console
    console.error('SHOPIFY_STOREFRONT_TOKEN is not set or undefined');
    throw new Error('Shopify token configuration is missing');
  }

  try {
    const url = `https://${domain}/api/${apiVersion}/graphql.json`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: { query, variables },
      timeout: 3000, // Reduce timeout to 3 seconds for better performance
      retries: 1, // Reduce retries for faster failure
      validateJson: true,
      fallback: null,
    };

    // NOTE: We intentionally avoid safeFetch(response.json()) here due to a
    // reproducible V8 "Fatal process out of memory: Zone" crash on Windows
    // when calling fetchShopify multiple times in a single Node process.
    const result = await fetchJsonWithTimeout(url, options);

    if (!result) {
      throw new Error('No response from Shopify API');
    }

    if (result.errors) {
      // eslint-disable-next-line no-console
      console.error('GraphQL errors:', result.errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    return result.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Shopify fetch error:', error);
    throw error;
  }
}

// Get all cars for the car listing page (with pagination)
export async function getAllCars() {
  const metafieldRefSelection = `
              reference {
                __typename
                ... on Metaobject {
                  id
                  handle
                  type
                  fields {
                    key
                    value
                  }
                }
              }
  `;

  const query = `
    query GetProducts($cursor: String) {
      products(first: 250, sortKey: CREATED_AT, reverse: true, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            handle
            title
            description
            productType
            vendor
            tags
            createdAt
            updatedAt
            availableForSale
            metafields(
              identifiers: [
                { namespace: "spec", key: "year" }
                { namespace: "spec", key: "ปี" }
                { namespace: "spec", key: "mileage" }
                { namespace: "spec", key: "odometer" }
                { namespace: "spec", key: "เลขไมล์" }
                { namespace: "spec", key: "ไมล์" }
                { namespace: "spec", key: "ระยะทาง" }
                { namespace: "spec", key: "เลขไมล์แท้" }
                { namespace: "spec", key: "transmission" }
                { namespace: "spec", key: "gear" }
                { namespace: "spec", key: "เกียร์" }
                { namespace: "spec", key: "fuel_type" }
                { namespace: "spec", key: "fuel" }
                { namespace: "spec", key: "เชื้อเพลิง" }
                { namespace: "spec", key: "installment" }
                { namespace: "spec", key: "category" }
                { namespace: "spec", key: "vehicle_category" }
                { namespace: "spec", key: "car_category" }
                { namespace: "spec", key: "ประเภทรถ" }
                { namespace: "spec", key: "หมวดหมู่" }
                { namespace: "spec", key: "ประเภท" }
                { namespace: "spec", key: "body_type" }
                { namespace: "spec", key: "bodyType" }
                { namespace: "spec", key: "ประเภทตัวถัง" }
                { namespace: "spec", key: "brand" }
                { namespace: "spec", key: "model" }
              ]
            ) {
              namespace
              key
              value
              type
              ${metafieldRefSelection}
            }
            images(first: 25) {
              edges {
                node {
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  sku
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  metafields(
                    identifiers: [
                      { namespace: "spec", key: "year" }
                      { namespace: "spec", key: "ปี" }
                      { namespace: "spec", key: "mileage" }
                      { namespace: "spec", key: "odometer" }
                      { namespace: "spec", key: "เลขไมล์" }
                      { namespace: "spec", key: "ไมล์" }
                      { namespace: "spec", key: "ระยะทาง" }
                      { namespace: "spec", key: "เลขไมล์แท้" }
                      { namespace: "spec", key: "transmission" }
                      { namespace: "spec", key: "gear" }
                      { namespace: "spec", key: "เกียร์" }
                      { namespace: "spec", key: "fuel_type" }
                      { namespace: "spec", key: "fuel" }
                      { namespace: "spec", key: "เชื้อเพลิง" }
                      { namespace: "spec", key: "installment" }
                      { namespace: "spec", key: "category" }
                      { namespace: "spec", key: "vehicle_category" }
                      { namespace: "spec", key: "car_category" }
                      { namespace: "spec", key: "ประเภทรถ" }
                      { namespace: "spec", key: "หมวดหมู่" }
                      { namespace: "spec", key: "ประเภท" }
                      { namespace: "spec", key: "body_type" }
                      { namespace: "spec", key: "bodyType" }
                      { namespace: "spec", key: "ประเภทตัวถัง" }
                      { namespace: "spec", key: "brand" }
                      { namespace: "spec", key: "model" }
                    ]
                  ) {
                    namespace
                    key
                    value
                    type
                    ${metafieldRefSelection}
                  }
                  selectedOptions {
                    name
                    value
                  }
                  weight
                  weightUnit
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    let allEdges = [];
    let cursor = null;
    let page = 1;
    const maxPages = 50; // safety cap - increased to handle 75 cars

    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-console
      console.log(`📦 Fetching Shopify products page ${page} (cursor=${cursor || 'START'})`);
      const data = await fetchShopify(query, { cursor });
      const edges = data?.products?.edges || [];
      const pageInfo = data?.products?.pageInfo || { hasNextPage: false };

      allEdges = allEdges.concat(edges);

      // eslint-disable-next-line no-console
      console.log('📊 Accumulated products:', allEdges.length);
      // eslint-disable-next-line no-console
      console.log('📄 PageInfo:', pageInfo);

      if (!pageInfo.hasNextPage) break;
      cursor = pageInfo.endCursor;
      page += 1;
      if (page > maxPages) {
        // eslint-disable-next-line no-console
        console.warn(`Reached max pages (${maxPages}), stopping pagination early.`);
        break;
      }
    }

    const adminEnabled = getShopifyAdminConfig().enabled;

    const idsNeedingAdmin = !adminEnabled
      ? []
      : allEdges
          .map(e => {
            const id = e?.node?.id;
            const productMf = e?.node?.metafields;
            const variantMf = e?.node?.variants?.edges?.[0]?.node?.metafields;
            if (!id) return null;
            return needsAdminSpec(productMf, variantMf, {
              includeCategory: true,
              includeBodyType: true,
            })
              ? id
              : null;
          })
          .filter(Boolean);

    const adminSpecById = idsNeedingAdmin.length > 0 ? await getAdminSpecByProductIds(idsNeedingAdmin) : {};

    return allEdges.map(e => {
      const n = e.node;
      const spec = specFromMetafields(n.metafields);
      const images = Array.isArray(n.images?.edges)
        ? n.images.edges.map(img => ({
            url: optimizeShopifyImage(img.node.url, { width: 600 }), // Auto-optimize for card display
            originalUrl: img.node.url, // Keep original for reference
            alt: img.node.altText || n.title,
            width: img.node.width || 800,
            height: img.node.height || 600,
          }))
        : [];
      const variant = n.variants?.edges?.[0]?.node || {};
      const price = variant.price || { amount: 0, currencyCode: 'THB' };
      const compareAtPrice = variant.compareAtPrice || null;

      const specVariant = specFromMetafields(variant.metafields);
      const adminSpec = (adminSpecById && n.id && adminSpecById[n.id]) || {};

      // Prefer Storefront product metafields; fall back to Admin; then variant metafields.
      const mergedSpec = { ...specVariant, ...adminSpec, ...spec };
      const hasAnySpec = Object.values(mergedSpec).some(hasValue);

      // Convert to our format for parsing
      const productData = {
        id: n.id,
        handle: n.handle,
        title: n.title,
        description: n.description,
        productType: n.productType,
        vendor: n.vendor,
        tags: n.tags,
        createdAt: n.createdAt,
        updatedAt: n.updatedAt,
        availableForSale: n.availableForSale,
        images,
        price,
        compareAtPrice,
        variant,
      };

      // Parse car data for non-spec extras only (do not use it for card specs)
      const parsed = parseCarData(productData);

      const getAny = keys => {
        for (const k of keys) {
          if (hasValue(mergedSpec[k])) return mergedSpec[k];
        }
        return null;
      };

      // Prefer Shopify metafields (Storefront/Admin/variant). If missing, fall back to
      // conservative parsing from title/description so older inventory still renders
      // usable cards on list pages (page 2+).
      const year = getAny(['year', 'ปี']) || parsed.year;
      const mileage =
        getAny(['mileage', 'odometer', 'เลขไมล์', 'ไมล์', 'ระยะทาง', 'เลขไมล์แท้']) || parsed.mileage;
      const transmission = getAny([
        'transmission',
        'gear',
        'transmission_type',
        'transmission-type',
        'transmissionType',
        'gear_type',
        'gear-type',
        'gearType',
        'เกียร์',
      ]);
      const fuelType = getAny(['fuel_type', 'fuel', 'fuel-type', 'fuel-supply', 'เชื้อเพลิง']);
      const brand = hasValue(mergedSpec.brand) ? mergedSpec.brand : n.vendor;
      const model = hasValue(mergedSpec.model) ? mergedSpec.model : null;
      const installment = hasValue(mergedSpec.installment) ? mergedSpec.installment : null;

      const category = getAny([
        'category',
        'car-type',
        'vehicle_category',
        'car_category',
        'vehicle_type',
        'car_type',
        'carType',
        'type',
        'ประเภทรถ',
        'หมวดหมู่',
        'ประเภท',
        'หมวดหมู่รถ',
        'ประเภทยานพาหนะ',
      ]);

      const bodyType = getAny(['body_type', 'bodyType', 'body', 'body_style', 'bodyStyle', 'ประเภทตัวถัง']);

      return {
        ...parsed,
        metafields: { spec: mergedSpec },
        year,
        category,
        brand,
        model,
        color: parsed.color,
        mileage,
        transmission,
        fuelType,
        fuel_type: fuelType,
        installment,
        engine: parsed.engine,
        displacement: parsed.displacement,
        seats: parsed.seats,
        body_type: bodyType,
        vin: parsed.vin,
        province: parsed.province || 'เชียงใหม่',
        free_down: parsed.features?.includes('ฟรีดาวน์') ? 'ใช่' : null,
        low_installment: parsed.features?.includes('ผ่อนสบาย') ? 'ใช่' : null,
        warranty: parsed.warranty,
        condition: parsed.condition,
      };
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('getAllCars error:', error);
    return [];
  }
}

export async function getCarSpecsByHandles(handles) {
  const raw = Array.isArray(handles) ? handles : [];
  const list = raw
    .map(v => (v == null ? '' : String(v).trim()))
    .filter(Boolean);

  const adminEnabled = getShopifyAdminConfig().enabled;

  const unique = [];
  const seen = new Set();
  for (const h of list) {
    if (seen.has(h)) continue;
    seen.add(h);
    unique.push(h);
  }

  // Avoid generating huge queries.
  unique.length = Math.min(unique.length, 50);

  if (unique.length === 0) return {};

  const metafieldRefSelection = `
            reference {
              __typename
              ... on Metaobject {
                id
                handle
                type
                fields {
                  key
                  value
                }
              }
            }
            references(first: 20) {
              edges {
                node {
                  __typename
                  ... on Metaobject {
                    id
                    handle
                    type
                    fields {
                      key
                      value
                    }
                  }
                }
              }
            }
  `;

  const varDefs = unique.map((_, i) => `$h${i}: String!`).join(', ');

  const fields = unique
    .map(
      (_, i) => `
      p${i}: productByHandle(handle: $h${i}) {
        id
        handle
        title
        vendor
        productType
        tags
        description
        metafields(
          identifiers: [
            { namespace: "spec", key: "year" }
            { namespace: "custom", key: "year" }
            { namespace: "spec", key: "ปี" }
            { namespace: "spec", key: "mileage" }
            { namespace: "custom", key: "mileage" }
            { namespace: "spec", key: "odometer" }
            { namespace: "spec", key: "เลขไมล์" }
            { namespace: "spec", key: "ไมล์" }
            { namespace: "spec", key: "ระยะทาง" }
            { namespace: "spec", key: "เลขไมล์แท้" }
            { namespace: "spec", key: "transmission" }
            { namespace: "custom", key: "transmission" }
            { namespace: "shopify", key: "transmission-type" }
            { namespace: "spec", key: "gear" }
            { namespace: "spec", key: "เกียร์" }
            { namespace: "spec", key: "fuel_type" }
            { namespace: "custom", key: "fuel-type" }
            { namespace: "shopify", key: "fuel-supply" }
            { namespace: "spec", key: "fuel" }
            { namespace: "spec", key: "เชื้อเพลิง" }
            { namespace: "spec", key: "installment" }
            { namespace: "spec", key: "category" }
            { namespace: "custom", key: "car-type" }
            { namespace: "shopify", key: "car-type" }
            { namespace: "spec", key: "vehicle_category" }
            { namespace: "spec", key: "car_category" }
            { namespace: "spec", key: "vehicle_type" }
            { namespace: "spec", key: "car_type" }
            { namespace: "spec", key: "carType" }
            { namespace: "spec", key: "type" }
            { namespace: "spec", key: "ประเภทรถ" }
            { namespace: "spec", key: "หมวดหมู่" }
            { namespace: "spec", key: "ประเภท" }
            { namespace: "spec", key: "หมวดหมู่รถ" }
            { namespace: "spec", key: "ประเภทยานพาหนะ" }
            { namespace: "spec", key: "body_type" }
            { namespace: "custom", key: "body-type" }
            { namespace: "spec", key: "bodyType" }
            { namespace: "spec", key: "ประเภทตัวถัง" }
            { namespace: "spec", key: "brand" }
            { namespace: "custom", key: "brand" }
            { namespace: "spec", key: "model" }
            { namespace: "custom", key: "model" }
          ]
        ) {
          namespace
          key
          value
          type
          ${metafieldRefSelection}
        }
        variants(first: 1) {
          edges {
            node {
              title
              metafields(
                identifiers: [
                  { namespace: "spec", key: "year" }
                  { namespace: "custom", key: "year" }
                  { namespace: "spec", key: "ปี" }
                  { namespace: "spec", key: "mileage" }
                  { namespace: "custom", key: "mileage" }
                  { namespace: "spec", key: "odometer" }
                  { namespace: "spec", key: "เลขไมล์" }
                  { namespace: "spec", key: "ไมล์" }
                  { namespace: "spec", key: "ระยะทาง" }
                  { namespace: "spec", key: "เลขไมล์แท้" }
                  { namespace: "spec", key: "transmission" }
                  { namespace: "custom", key: "transmission" }
                  { namespace: "shopify", key: "transmission-type" }
                  { namespace: "spec", key: "gear" }
                  { namespace: "spec", key: "เกียร์" }
                  { namespace: "spec", key: "fuel_type" }
                  { namespace: "custom", key: "fuel-type" }
                  { namespace: "shopify", key: "fuel-supply" }
                  { namespace: "spec", key: "fuel" }
                  { namespace: "spec", key: "เชื้อเพลิง" }
                  { namespace: "spec", key: "installment" }
                  { namespace: "spec", key: "category" }
                  { namespace: "custom", key: "car-type" }
                  { namespace: "shopify", key: "car-type" }
                  { namespace: "spec", key: "vehicle_category" }
                  { namespace: "spec", key: "car_category" }
                  { namespace: "spec", key: "vehicle_type" }
                  { namespace: "spec", key: "car_type" }
                  { namespace: "spec", key: "carType" }
                  { namespace: "spec", key: "type" }
                  { namespace: "spec", key: "ประเภทรถ" }
                  { namespace: "spec", key: "หมวดหมู่" }
                  { namespace: "spec", key: "ประเภท" }
                  { namespace: "spec", key: "หมวดหมู่รถ" }
                  { namespace: "spec", key: "ประเภทยานพาหนะ" }
                  { namespace: "spec", key: "body_type" }
                  { namespace: "custom", key: "body-type" }
                  { namespace: "spec", key: "bodyType" }
                  { namespace: "spec", key: "ประเภทตัวถัง" }
                  { namespace: "spec", key: "brand" }
                  { namespace: "custom", key: "brand" }
                  { namespace: "spec", key: "model" }
                  { namespace: "custom", key: "model" }
                ]
              ) {
                namespace
                key
                value
                type
                ${metafieldRefSelection}
              }
            }
          }
        }
      }`
    )
    .join('\n');

  const query = `
    query CarSpecsByHandles(${varDefs}) {
      ${fields}
    }
  `;

  const variables = {};
  for (let i = 0; i < unique.length; i += 1) {
    variables[`h${i}`] = unique[i];
  }

  try {
    const out = {};

    const data = await fetchShopify(query, variables);

    const items = [];
    const idsNeedingAdmin = [];

    for (let i = 0; i < unique.length; i += 1) {
      const n = data?.[`p${i}`];
      const handle = n?.handle;
      if (!handle) continue;

      const id = n?.id || null;
      const variantNode = n?.variants?.edges?.[0]?.node || null;

      if (
        adminEnabled &&
        id &&
        needsAdminSpec(n?.metafields, variantNode?.metafields, {
          includeCategory: true,
          includeBodyType: true,
        })
      ) {
        idsNeedingAdmin.push(id);
      }

      items.push({
        id,
        handle,
        title: n?.title || null,
        vendor: n?.vendor || null,
        productType: n?.productType || null,
        tags: Array.isArray(n?.tags) ? n.tags : [],
        description: n?.description || null,
        productMetafields: n?.metafields,
        variantMetafields: variantNode?.metafields,
      });
    }

    const adminSpecById =
      adminEnabled && idsNeedingAdmin.length > 0
        ? await getAdminSpecByProductIds(idsNeedingAdmin)
        : {};

    for (const item of items) {
      const spec = specFromMetafields(item.productMetafields);
      const specVariant = specFromMetafields(item.variantMetafields);
      const adminSpec = (item.id && adminSpecById && adminSpecById[item.id]) || {};

      // Prefer Admin fallback when Storefront is missing core keys.
      // NOTE: Storefront metafields may include explicit nulls; merge Admin last so it isn't overwritten.
      // Prefer product metafields; fall back to variant metafields.
      const mergedSpec = { ...specVariant, ...spec, ...adminSpec };

      const getAny = keys => {
        for (const k of keys) {
          if (hasValue(mergedSpec[k])) return mergedSpec[k];
        }
        return null;
      };

      const parsed = parseCarData({
        id: item.id,
        handle: item.handle,
        title: item.title || '',
        description: item.description || '',
        vendor: item.vendor || undefined,
        productType: item.productType || undefined,
        tags: Array.isArray(item.tags) ? item.tags : [],
      });

      const payload = {};
      const year = getAny(['year', 'ปี']) || parsed?.year;
      const mileage =
        getAny(['mileage', 'odometer', 'เลขไมล์', 'ไมล์', 'ระยะทาง', 'เลขไมล์แท้']) ||
        parsed?.mileage;
      const transmission = getAny([
        'transmission',
        'gear',
        'transmission_type',
        'transmission-type',
        'transmissionType',
        'gear_type',
        'gear-type',
        'gearType',
        'เกียร์',
      ]);
      const fuelType = getAny(['fuel_type', 'fuel', 'fuel-type', 'fuel-supply', 'เชื้อเพลิง']);
      const installment = getAny(['installment']);
      const category = getAny([
        'category',
        'car-type',
        'vehicle_category',
        'car_category',
        'vehicle_type',
        'car_type',
        'carType',
        'type',
        'ประเภทรถ',
        'หมวดหมู่',
        'ประเภท',
        'หมวดหมู่รถ',
        'ประเภทยานพาหนะ',
      ]);
      const bodyType = getAny([
        'body_type',
        'bodyType',
        'body-type',
        'body',
        'body_style',
        'bodyStyle',
        'ประเภทตัวถัง',
      ]);

      // API: prefer metafields/Admin; allow conservative parse fallback for year/mileage.
      if (hasValue(year)) payload.year = year;
      if (hasValue(mileage)) payload.mileage = mileage;
      if (hasValue(transmission)) payload.transmission = transmission;

      if (hasValue(fuelType)) {
        payload.fuelType = fuelType;
        payload.fuel_type = fuelType;
      }

      if (hasValue(installment)) payload.installment = installment;
      if (hasValue(category)) payload.category = category;
      if (hasValue(bodyType)) payload.body_type = bodyType;

      const brand = getAny(['brand', 'ยี่ห้อ']);
      const model = getAny(['model', 'รุ่น']);
      if (hasValue(brand)) payload.brand = brand;
      if (hasValue(model)) payload.model = model;

      out[item.handle] = payload;
    }

    return out;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('getCarSpecsByHandles error:', error);
    return {};
  }
}

// Get cars for homepage
export async function getHomepageCars(limit = 8) {
  const metafieldRefSelection = `
              reference {
                __typename
                ... on Metaobject {
                  id
                  handle
                  type
                  fields {
                    key
                    value
                  }
                }
              }
  `;

  const query = `
  {
    products(first: ${limit}, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          handle
          title
          description
          vendor
          tags
          availableForSale
          metafields(
            identifiers: [
              { namespace: "spec", key: "year" }
              { namespace: "spec", key: "ปี" }
              { namespace: "spec", key: "mileage" }
              { namespace: "spec", key: "odometer" }
              { namespace: "spec", key: "เลขไมล์" }
              { namespace: "spec", key: "transmission" }
              { namespace: "spec", key: "gear" }
              { namespace: "spec", key: "เกียร์" }
              { namespace: "spec", key: "fuel_type" }
              { namespace: "spec", key: "fuel" }
              { namespace: "spec", key: "เชื้อเพลิง" }
              { namespace: "spec", key: "installment" }
              { namespace: "spec", key: "category" }
              { namespace: "spec", key: "vehicle_category" }
              { namespace: "spec", key: "car_category" }
              { namespace: "spec", key: "ประเภทรถ" }
              { namespace: "spec", key: "หมวดหมู่" }
              { namespace: "spec", key: "ประเภท" }
              { namespace: "spec", key: "body_type" }
              { namespace: "spec", key: "bodyType" }
              { namespace: "spec", key: "ประเภทตัวถัง" }
              { namespace: "spec", key: "brand" }
              { namespace: "spec", key: "model" }
            ]
          ) {
            namespace
            key
            value
            type
            ${metafieldRefSelection}
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                price {
                  amount
                  currencyCode
                }
                metafields(
                  identifiers: [
                    { namespace: "spec", key: "year" }
                    { namespace: "spec", key: "ปี" }
                    { namespace: "spec", key: "mileage" }
                    { namespace: "spec", key: "odometer" }
                    { namespace: "spec", key: "เลขไมล์" }
                    { namespace: "spec", key: "transmission" }
                    { namespace: "spec", key: "gear" }
                    { namespace: "spec", key: "เกียร์" }
                    { namespace: "spec", key: "fuel_type" }
                    { namespace: "spec", key: "fuel" }
                    { namespace: "spec", key: "เชื้อเพลิง" }
                    { namespace: "spec", key: "installment" }
                    { namespace: "spec", key: "category" }
                    { namespace: "spec", key: "vehicle_category" }
                    { namespace: "spec", key: "car_category" }
                    { namespace: "spec", key: "ประเภทรถ" }
                    { namespace: "spec", key: "หมวดหมู่" }
                    { namespace: "spec", key: "ประเภท" }
                    { namespace: "spec", key: "body_type" }
                    { namespace: "spec", key: "bodyType" }
                    { namespace: "spec", key: "ประเภทตัวถัง" }
                    { namespace: "spec", key: "brand" }
                    { namespace: "spec", key: "model" }
                  ]
                ) {
                  namespace
                  key
                  value
                  type
                  ${metafieldRefSelection}
                }
              }
            }
          }
        }
      }
    }
  }
  `;
  try {
    const data = await fetchShopify(query);
    const edges = Array.isArray(data?.products?.edges) ? data.products.edges : [];

    const adminEnabled = getShopifyAdminConfig().enabled;

    const idsNeedingAdmin = !adminEnabled
      ? []
      : edges
          .map(e => {
            const id = e?.node?.id;
            const productMf = e?.node?.metafields;
            const variantMf = e?.node?.variants?.edges?.[0]?.node?.metafields;
            if (!id) return null;
            return needsAdminSpec(productMf, variantMf, {
              includeCategory: true,
              includeBodyType: true,
            })
              ? id
              : null;
          })
          .filter(Boolean);

    const adminSpecById = idsNeedingAdmin.length > 0 ? await getAdminSpecByProductIds(idsNeedingAdmin) : {};

    return edges.map(e => {
      const n = e.node;
      const spec = specFromMetafields(n.metafields);
      const images =
        Array.isArray(n.images?.edges) && n.images.edges.length > 0
          ? n.images.edges.map(img => ({
              url: optimizeShopifyImage(img.node.url, { width: 600 }), // Auto-optimize for homepage cards
              originalUrl: img.node.url,
              alt: img.node.altText || n.title,
              width: img.node.width || 800,
              height: img.node.height || 600,
            }))
          : [];
      const variant = n.variants.edges[0]?.node || {};
      const price = variant.price || { amount: 0, currencyCode: 'THB' };

      const specVariant = specFromMetafields(variant.metafields);
      const adminSpec = (adminSpecById && n.id && adminSpecById[n.id]) || {};
      const mergedSpec = { ...specVariant, ...adminSpec, ...spec };
      const hasAnySpec = Object.values(mergedSpec).some(hasValue);

      const productData = {
        id: n.id,
        handle: n.handle,
        title: n.title,
        description: n.description,
        vendor: n.vendor,
        tags: n.tags,
        createdAt: null,
        updatedAt: null,
        availableForSale: n.availableForSale,
        images,
        price,
        compareAtPrice: null,
        variant,
      };

      // Parse car data for non-spec extras only (do not use it for card specs)
      parseCarData(productData);

      const getAny = keys => {
        for (const k of keys) {
          if (hasValue(mergedSpec[k])) return mergedSpec[k];
        }
        return null;
      };

      // Strict: show specs ONLY when coming from Shopify metafields.
      const year = getAny(['year', 'ปี']);
      const mileage = getAny(['mileage', 'odometer', 'เลขไมล์', 'ไมล์', 'ระยะทาง', 'เลขไมล์แท้']);
      const transmission = getAny([
        'transmission',
        'gear',
        'transmission_type',
        'transmission-type',
        'transmissionType',
        'gear_type',
        'gear-type',
        'gearType',
        'เกียร์',
      ]);
      const fuelType = getAny(['fuel_type', 'fuel', 'fuel-type', 'fuel-supply', 'เชื้อเพลิง']);
      const brand = hasValue(mergedSpec.brand) ? mergedSpec.brand : null;
      const model = hasValue(mergedSpec.model) ? mergedSpec.model : null;
      const installment = hasValue(mergedSpec.installment) ? mergedSpec.installment : null;

      const category = getAny([
        'category',
        'vehicle_category',
        'car_category',
        'ประเภทรถ',
        'หมวดหมู่',
        'ประเภท',
      ]);

      const bodyType = getAny(['body_type', 'bodyType', 'ประเภทตัวถัง']);

      return {
        id: n.id,
        handle: n.handle,
        title: n.title,
        tags: n.tags || [],
        availableForSale: n.availableForSale,
        images,
        price,
        variant,
        metafields: { spec: mergedSpec },
        year,
        category,
        mileage,
        transmission,
        fuelType,
        fuel_type: fuelType,
        brand,
        model,
        installment,
        body_type: bodyType,
      };
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('getHomepageCars error:', error);
    return [];
  }
}

// Get brand counts for homepage
export async function getBrandCounts() {
  const query = `
  {
    products(first: 250) {
      edges {
        node {
          vendor
          availableForSale
          metafield(namespace: "spec", key: "brand") { value }
        }
      }
    }
  }
  `;
  try {
    const data = await fetchShopify(query);
    const brandCounts = {};

    // Normalize vendor variations to canonical brand keys used in UI
    const normalizeBrandName = brandRaw => {
      if (!brandRaw || typeof brandRaw !== 'string') return '';
      const s = brandRaw.toLowerCase().trim();
      // strip punctuation; keep letters, numbers, thai chars and spaces
      const t = s
        .replace(/[^a-z0-9ก-๙\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      // Thai synonyms mapping and loose includes
      if (t.includes('toyota') || t.includes('โตโยต้า')) return 'toyota';
      if (t.includes('honda') || t.includes('ฮอนด้า') || t.includes('ฮอนดา')) return 'honda';
      if (t.includes('nissan') || t.includes('นิสสัน') || t.includes('นิสสันน์')) return 'nissan';
      if (t.includes('mazda') || t.includes('มาสด้า') || t.includes('มาสดา')) return 'mazda';
      if (t.includes('mitsubishi') || t.includes('มิตซูบิชิ') || t.includes('มิตซู'))
        return 'mitsubishi';
      if (t.includes('isuzu') || t.includes('อีซูซุ') || t.includes('อิซูซุ')) return 'isuzu';
      if (t.includes('ford') || t.includes('ฟอร์ด') || t.includes('ฟอรด')) return 'ford';
      if (t.includes('hyundai') || t.includes('ฮุนได') || t.includes('ฮุนไดย์')) return 'hyundai';
      return s; // fallback to normalized lowercase vendor
    };

    if (data && data.products && data.products.edges) {
      data.products.edges.forEach(edge => {
        const product = edge.node;

        // Skip if not available for sale
        if (!product.availableForSale) return;

        // Use vendor as brand (simpler approach)
        // Prefer metafield spec.brand; fallback to vendor
        const brandSource = (product.metafield && product.metafield.value) || product.vendor;
        const canonical = normalizeBrandName(brandSource);
        if (canonical) {
          brandCounts[canonical] = (brandCounts[canonical] || 0) + 1;
        }
      });
    }

    return brandCounts;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('getBrandCounts error:', error);
    return {};
  }
}

// Get single car by handle for SEO
export async function getCarByHandle(handle) {
  const metafieldRefSelection = `
            reference {
              __typename
              ... on Metaobject {
                id
                handle
                type
                fields {
                  key
                  value
                }
              }
            }
  `;

  const query = `
  {
    productByHandle(handle: "${handle}") {
      id
      handle
      title
      description
      productType
      vendor
      tags
      createdAt
      updatedAt
      availableForSale
      metafields(
        identifiers: [
          { namespace: "spec", key: "year" }
          { namespace: "spec", key: "ปี" }
          { namespace: "spec", key: "mileage" }
          { namespace: "spec", key: "odometer" }
          { namespace: "spec", key: "เลขไมล์" }
          { namespace: "spec", key: "transmission" }
          { namespace: "spec", key: "gear" }
          { namespace: "spec", key: "เกียร์" }
          { namespace: "spec", key: "fuel_type" }
          { namespace: "spec", key: "fuel" }
          { namespace: "spec", key: "เชื้อเพลิง" }
          { namespace: "spec", key: "installment" }
          { namespace: "spec", key: "category" }
          { namespace: "spec", key: "vehicle_category" }
          { namespace: "spec", key: "car_category" }
          { namespace: "spec", key: "ประเภทรถ" }
          { namespace: "spec", key: "หมวดหมู่" }
          { namespace: "spec", key: "ประเภท" }
          { namespace: "spec", key: "body_type" }
          { namespace: "spec", key: "bodyType" }
          { namespace: "spec", key: "ประเภทตัวถัง" }
          { namespace: "spec", key: "brand" }
          { namespace: "spec", key: "model" }
        ]
      ) {
        namespace
        key
        value
        type
        ${metafieldRefSelection}
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 1) {
        edges {
          node {
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            metafields(
              identifiers: [
                { namespace: "spec", key: "year" }
                { namespace: "spec", key: "ปี" }
                { namespace: "spec", key: "mileage" }
                { namespace: "spec", key: "odometer" }
                { namespace: "spec", key: "เลขไมล์" }
                { namespace: "spec", key: "transmission" }
                { namespace: "spec", key: "gear" }
                { namespace: "spec", key: "เกียร์" }
                { namespace: "spec", key: "fuel_type" }
                { namespace: "spec", key: "fuel" }
                { namespace: "spec", key: "เชื้อเพลิง" }
                { namespace: "spec", key: "installment" }
                { namespace: "spec", key: "category" }
                { namespace: "spec", key: "vehicle_category" }
                { namespace: "spec", key: "car_category" }
                { namespace: "spec", key: "ประเภทรถ" }
                { namespace: "spec", key: "หมวดหมู่" }
                { namespace: "spec", key: "ประเภท" }
                { namespace: "spec", key: "body_type" }
                { namespace: "spec", key: "bodyType" }
                { namespace: "spec", key: "ประเภทตัวถัง" }
                { namespace: "spec", key: "brand" }
                { namespace: "spec", key: "model" }
              ]
            ) {
              namespace
              key
              value
              type
              ${metafieldRefSelection}
            }
          }
        }
      }
    }
  }
  `;
  try {
    const data = await fetchShopify(query);
    const n = data.productByHandle;
    if (!n) return null;
    const images = Array.isArray(n.images?.edges)
      ? n.images.edges.map(img => ({
          url: optimizeShopifyImage(img.node.url, { width: 1000 }), // Auto-optimize for detail page (larger)
          originalUrl: img.node.url,
          alt: img.node.altText || n.title,
          width: img.node.width || 800,
          height: img.node.height || 600,
        }))
      : [];
    const variant = n.variants.edges[0]?.node || {};
    const price = variant.price || { amount: 0, currencyCode: 'THB' };
    const compareAtPrice = variant.compareAtPrice || null;

    const spec = specFromMetafields(n.metafields);
    const specVariant = specFromMetafields(variant.metafields);

    const adminEnabled = getShopifyAdminConfig().enabled;
    const adminSpecById =
      adminEnabled &&
      needsAdminSpec(n.metafields, variant.metafields, { includeCategory: true, includeBodyType: true })
        ? await getAdminSpecByProductIds([n.id])
        : {};
    const adminSpec = (adminSpecById && n.id && adminSpecById[n.id]) || {};

    const mergedSpec = { ...specVariant, ...adminSpec, ...spec };
    const hasAnySpec = Object.values(mergedSpec).some(hasValue);

    // Convert to format for parsing
    const productData = {
      id: n.id,
      handle: n.handle,
      title: n.title,
      description: n.description,
      productType: n.productType,
      vendor: n.vendor,
      tags: n.tags,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
      availableForSale: n.availableForSale,
      images,
      price,
      compareAtPrice,
      variant,
    };

    // Parse car data
    const parsed = parseCarData(productData);

    const getAny = keys => {
      for (const k of keys) {
        if (hasValue(mergedSpec[k])) return mergedSpec[k];
      }
      return null;
    };

    // Strict: show specs ONLY when coming from Shopify metafields.
    const year = getAny(['year', 'ปี']);
    const mileage = getAny(['mileage', 'odometer', 'เลขไมล์', 'ไมล์', 'ระยะทาง', 'เลขไมล์แท้']);
    const transmission = getAny([
      'transmission',
      'gear',
      'transmission_type',
      'transmission-type',
      'transmissionType',
      'gear_type',
      'gear-type',
      'gearType',
      'เกียร์',
    ]);
    const fuelType = getAny(['fuel_type', 'fuel', 'fuel-type', 'fuel-supply', 'เชื้อเพลิง']);
    const brand = hasValue(mergedSpec.brand) ? mergedSpec.brand : n.vendor;
    const model = hasValue(mergedSpec.model) ? mergedSpec.model : null;
    const installment = hasValue(mergedSpec.installment) ? mergedSpec.installment : null;

    const category = getAny([
      'category',
      'vehicle_category',
      'car_category',
      'vehicle_type',
      'car_type',
      'carType',
      'type',
      'ประเภทรถ',
      'หมวดหมู่',
      'ประเภท',
      'หมวดหมู่รถ',
      'ประเภทยานพาหนะ',
    ]);
    const bodyType = getAny(['body_type', 'bodyType', 'body', 'body_style', 'bodyStyle', 'ประเภทตัวถัง']);

    return {
      ...parsed,
      metafields: { spec: mergedSpec },
      year,
      category,
      brand,
      model,
      color: parsed.color,
      mileage,
      transmission,
      fuelType,
      fuel_type: fuelType,
      installment,
      engine: parsed.engine,
      displacement: parsed.displacement,
      seats: parsed.seats,
      body_type: bodyType,
      vin: parsed.vin,
      province: parsed.province || 'เชียงใหม่',
      free_down: parsed.features?.includes('ฟรีดาวน์') ? 'ใช่' : null,
      low_installment: parsed.features?.includes('ผ่อนสบาย') ? 'ใช่' : null,
      warranty: parsed.warranty,
      condition: parsed.condition || 'มือสอง',
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('getCarByHandle error:', error);
    return null;
  }
}
