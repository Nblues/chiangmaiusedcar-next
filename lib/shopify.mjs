// Shopify GraphQL API integration for retrieving car data
// Uses Shopify Storefront API to fetch product data with custom metafields
import { normalizeCarSpec } from './shopify/helpers/normalize.mjs';

import { parseCarData } from './carDataParser.js';
import { optimizeShopifyImage } from './shopifyImageOptimizer.js';
import { getKv, getShopifyStoreKey } from './shopify/helpers/kv.mjs';
import { fetchJsonWithTimeout } from './shopify/helpers/fetch.mjs';
import { hasValue, metafieldsToList, specFromMetafields } from './shopify/helpers/parsers.mjs';
import { needsAdminSpec, getShopifyAdminConfig } from './shopify/helpers/admin.mjs';
import {
  AdminSpecByIdsQuery,
  AllProductsQuery,
  getCarSpecsByHandlesQuery,
  getHomepageProductsQuery,
  BrandCountsQuery,
  getCarByHandleQuery,
} from './shopify/queries.mjs';

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
    return String(v)
      .trim()
      .replace(/^https?:\/\//i, '')
      .replace(/\/+$/, '');
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

  const query = AdminSpecByIdsQuery;

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
  const sanitizeEnvValue = value => {
    if (value == null) return value;
    const s = String(value).trim();
    if (!s || s === 'undefined') return undefined;
    // Prevent invalid characters in HTTP headers (e.g., copied tokens with newlines).
    return s.replace(/[\r\n\t]/g, '');
  };

  const domain = sanitizeEnvValue(
    process.env.SHOPIFY_DOMAIN ||
      process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ||
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
  );

  // Support legacy/alternate env var names some deployments use.
  // Prefer Storefront_API when provided (often the "active" token in Vercel env).
  const token = sanitizeEnvValue(
    process.env.Storefront_API ||
      process.env.SHOPIFY_STOREFRONT_TOKEN ||
      process.env.STOREFRONT_API ||
      process.env.API_shopify ||
      process.env.API_SHOPIFY ||
      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
  );

  // Allow overriding API version via env; default to the project's pinned version
  // (keeps Storefront schema consistent and avoids unexpected query incompatibilities).
  const apiVersion = process.env.SHOPIFY_API_VERSION || '2023-04';

  const isDev = process.env.NODE_ENV === 'development';

  if (!domain) {
    // eslint-disable-next-line no-console
    console.error('SHOPIFY_DOMAIN is not set or undefined');
    throw new Error('Shopify domain configuration is missing');
  }

  if (!token) {
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
      // Dev networks can be slower; keep prod fast but make dev more reliable.
      timeout: isDev ? 8000 : 3000,
      retries: isDev ? 2 : 1,
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
  // In-memory cache to avoid refetching + re-parsing the full product catalog on
  // every SSR request (notably during /all-cars pagination in dev).
  // Note: This is best-effort (serverless instances may not persist).
  const now = Date.now();
  const ttlMs = process.env.NODE_ENV === 'development' ? 300000 : 900000; // 5 mins in dev, 15 mins prod
  if (
    globalThis.__CNX_ALL_CARS_CACHE__?.data &&
    now - globalThis.__CNX_ALL_CARS_CACHE__.ts < ttlMs
  ) {
    return globalThis.__CNX_ALL_CARS_CACHE__.data;
  }
  if (globalThis.__CNX_ALL_CARS_CACHE__?.promise) {
    return globalThis.__CNX_ALL_CARS_CACHE__.promise;
  }

  // Tier-2 cache (production/dev): Vercel KV or Local file.
  const storeKey = getShopifyStoreKey() || 'unknown-store';
  const kvCacheKey = `cache:allcars:v1:${storeKey}`;
  const kvTtlSeconds = 1800; // 30 minutes: reduces cold-miss Shopify refetches (major TTFB savings)

  // Use local file cache in both dev and prod builds (but skip on Vercel)
  const shouldUseLocalFileCache = !process.env.VERCEL;

  const localFileCachePaths = (() => {
    try {
      // Prefer the active Next.js distDir cache folder.
      // On Windows this repo uses `.next-win` (see next.config.js) to avoid EPERM trace locks.
      // Keep a fallback to `.next` for Linux/Vercel parity and older local builds.
      const cwd = process.cwd().replace(/\\/g, '/');
      const winPath = `${cwd}/.next-win/cache/cnx-allcars.v1.json`;
      const nextPath = `${cwd}/.next/cache/cnx-allcars.v1.json`;

      return process.platform === 'win32' ? [winPath, nextPath] : [nextPath, winPath];
    } catch {
      return [];
    }
  })();

  if (process.env.NODE_ENV !== 'development') {
    try {
      const kv = await getKv();
      if (kv) {
        const cached = await kv.get(kvCacheKey);
        if (Array.isArray(cached) && cached.length > 0) {
          globalThis.__CNX_ALL_CARS_CACHE__ = { ts: now, data: cached, promise: null };
          return cached;
        }
      }
    } catch {
      // ignore KV read failures; fall back to live fetch
    }
  }

  // Local (non-Vercel) tier: disk cache to speed up `next start`/Lighthouse.
  if (shouldUseLocalFileCache && localFileCachePaths.length > 0) {
    try {
      const fs = await import('node:fs/promises');
      const fileTtlMs = 10 * 60 * 1000;

      for (const cachePath of localFileCachePaths) {
        try {
          const stat = await fs.stat(cachePath);
          if (now - stat.mtimeMs >= fileTtlMs) continue;

          const raw = await fs.readFile(cachePath, 'utf8');
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            globalThis.__CNX_ALL_CARS_CACHE__ = { ts: now, data: parsed, promise: null };
            return parsed;
          }
        } catch {
          // ignore: try next cache path
        }
      }
    } catch {
      // ignore file-cache failures; fall back to live fetch
    }
  }

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

  const query = AllProductsQuery;

  const fetchAndParse = async () => {
    let allEdges = [];
    let cursor = null;
    let page = 1;
    const maxPages = 50; // safety cap

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
              includeDrivetrain: true,
            })
              ? id
              : null;
          })
          .filter(Boolean);

    const adminSpecById =
      idsNeedingAdmin.length > 0 ? await getAdminSpecByProductIds(idsNeedingAdmin) : {};

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
      image: images[0]?.url || '',
        price,
        compareAtPrice,
        variant,
      };

      // Parse car data for non-spec extras only (do not use it for card specs)
      const parsed = parseCarData(productData);

      const {
        year,
        mileage,
        transmission,
        drivetrain,
        fuelType,
        brand,
        model,
        installment,
        category,
        bodyType,
      } = normalizeCarSpec(mergedSpec, parsed, n.vendor);

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
        drivetrain,
        drive_type: drivetrain,
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
  };

  globalThis.__CNX_ALL_CARS_CACHE__ = {
    ts: now,
    data: globalThis.__CNX_ALL_CARS_CACHE__?.data || null,
    promise: fetchAndParse()
      .then(async list => {
        if (process.env.NODE_ENV !== 'development') {
          try {
            const kv = await getKv();
            if (kv) await kv.set(kvCacheKey, list, { ex: kvTtlSeconds });
          } catch {
            // ignore KV write failures
          }
        }

        if (shouldUseLocalFileCache && localFileCachePaths.length > 0) {
          try {
            const fs = await import('node:fs/promises');
            const primaryPath = localFileCachePaths[0];
            const dir = primaryPath.split('/').slice(0, -1).join('/');
            await fs.mkdir(dir, { recursive: true });
            await fs.writeFile(primaryPath, JSON.stringify(list), 'utf8');
          } catch {
            // ignore local file-cache write failures
          }
        }

        globalThis.__CNX_ALL_CARS_CACHE__ = { ts: Date.now(), data: list, promise: null };
        return list;
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('getAllCars error:', error);
        if (process.env.NODE_ENV !== 'development') {
          // best-effort negative cache to avoid stampede during outages
          getKv()
            .then(kv => (kv ? kv.set(kvCacheKey, [], { ex: 60 }) : null))
            .catch(() => {});
        }
        globalThis.__CNX_ALL_CARS_CACHE__ = { ts: Date.now(), data: null, promise: null };
        return [];
      }),
  };

  return globalThis.__CNX_ALL_CARS_CACHE__.promise;
}

export async function getCarSpecsByHandles(handles) {
  const raw = Array.isArray(handles) ? handles : [];
  const list = raw.map(v => (v == null ? '' : String(v).trim())).filter(Boolean);

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
            { namespace: "spec", key: "drivetrain" }
            { namespace: "spec", key: "drive" }
            { namespace: "spec", key: "drive_type" }
            { namespace: "spec", key: "driveType" }
            { namespace: "spec", key: "wheel_drive" }
            { namespace: "spec", key: "wheelDrive" }
            { namespace: "custom", key: "drive-type" }
            { namespace: "custom", key: "wheel-drive" }
            { namespace: "spec", key: "ระบบขับเคลื่อน" }
            { namespace: "spec", key: "ขับเคลื่อน" }
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
                  { namespace: "spec", key: "drivetrain" }
                  { namespace: "spec", key: "drive" }
                  { namespace: "spec", key: "drive_type" }
                  { namespace: "spec", key: "driveType" }
                  { namespace: "spec", key: "wheel_drive" }
                  { namespace: "spec", key: "wheelDrive" }
                  { namespace: "custom", key: "drive-type" }
                  { namespace: "custom", key: "wheel-drive" }
                  { namespace: "spec", key: "ระบบขับเคลื่อน" }
                  { namespace: "spec", key: "ขับเคลื่อน" }
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

  const query = getCarSpecsByHandlesQuery(varDefs, fields);

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
          includeDrivetrain: true,
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
      const {
        year,
        mileage,
        transmission,
        drivetrain,
        fuelType,
        brand,
        model,
        installment,
        category,
        bodyType,
      } = normalizeCarSpec(mergedSpec, parsed, item.vendor);

      if (hasValue(year)) payload.year = year;
      if (hasValue(mileage)) payload.mileage = mileage;
      if (hasValue(transmission)) payload.transmission = transmission;
      if (hasValue(drivetrain)) {
        payload.drivetrain = drivetrain;
        payload.drive_type = drivetrain;
      }
      if (hasValue(fuelType)) {
        payload.fuelType = fuelType;
        payload.fuel_type = fuelType;
      }
      if (hasValue(installment)) payload.installment = installment;
      if (hasValue(category)) payload.category = category;
      if (hasValue(bodyType)) payload.body_type = bodyType;
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
  const now = Date.now();
  const ttlMs = process.env.NODE_ENV === 'development' ? 60000 : 900000;
  const limitNum = (() => {
    const n = Number(limit);
    const v = Number.isFinite(n) ? Math.trunc(n) : 8;
    return Math.max(1, Math.min(50, v));
  })();
  const cacheKey = `limit:${limitNum}`;

  if (
    globalThis.__CNX_HOMEPAGE_CARS_CACHE__?.key === cacheKey &&
    Array.isArray(globalThis.__CNX_HOMEPAGE_CARS_CACHE__?.data) &&
    now - globalThis.__CNX_HOMEPAGE_CARS_CACHE__.ts < ttlMs
  ) {
    return globalThis.__CNX_HOMEPAGE_CARS_CACHE__.data;
  }
  if (
    globalThis.__CNX_HOMEPAGE_CARS_CACHE__?.key === cacheKey &&
    globalThis.__CNX_HOMEPAGE_CARS_CACHE__?.promise
  ) {
    return globalThis.__CNX_HOMEPAGE_CARS_CACHE__.promise;
  }

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

  const query = getHomepageProductsQuery(limitNum);

  const fetchAndParse = async () => {
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
              includeDrivetrain: true,
            })
              ? id
              : null;
          })
          .filter(Boolean);

    const adminSpecById =
      idsNeedingAdmin.length > 0 ? await getAdminSpecByProductIds(idsNeedingAdmin) : {};

    return edges.map(e => {
      const n = e.node;
      const spec = specFromMetafields(n.metafields);
      const images =
        Array.isArray(n.images?.edges) && n.images.edges.length > 0
          ? n.images.edges.map(img => ({
              url: optimizeShopifyImage(img.node.url, { width: 600 }),
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
      image: images[0]?.url || '',
        price,
        compareAtPrice: null,
        variant,
      };

      // Parse car data for non-spec extras only (do not use it for card specs)
      const parsed = parseCarData(productData);

      const {
        year,
        mileage,
        transmission,
        drivetrain,
        fuelType,
        brand,
        model,
        installment,
        category,
        bodyType,
      } = normalizeCarSpec(mergedSpec, parsed, n.vendor);

      return {
        id: n.id,
        handle: n.handle,
        title: n.title,
        tags: n.tags || [],
        availableForSale: n.availableForSale,
        images,
      image: images[0]?.url || '',
        price,
        variant,
        metafields: { spec: mergedSpec },
        year,
        category,
        mileage,
        transmission,
        drivetrain,
        drive_type: drivetrain,
        fuelType,
        fuel_type: fuelType,
        brand,
        model,
        installment,
        body_type: bodyType,
      };
    });
  };

  globalThis.__CNX_HOMEPAGE_CARS_CACHE__ = {
    key: cacheKey,
    ts: now,
    data: globalThis.__CNX_HOMEPAGE_CARS_CACHE__?.data || null,
    promise: fetchAndParse()
      .then(list => {
        globalThis.__CNX_HOMEPAGE_CARS_CACHE__ = {
          key: cacheKey,
          ts: Date.now(),
          data: list,
          promise: null,
        };
        return list;
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('getHomepageCars error:', error);
        globalThis.__CNX_HOMEPAGE_CARS_CACHE__ = {
          key: cacheKey,
          ts: Date.now(),
          data: null,
          promise: null,
        };
        return [];
      }),
  };

  return globalThis.__CNX_HOMEPAGE_CARS_CACHE__.promise;
}

// Get brand counts for homepage
export async function getBrandCounts() {
  const now = Date.now();
  const ttlMs = process.env.NODE_ENV === 'development' ? 15_000 : 30 * 60 * 1000;
  if (
    globalThis.__CNX_BRAND_COUNTS_CACHE__?.data &&
    now - globalThis.__CNX_BRAND_COUNTS_CACHE__.ts < ttlMs
  ) {
    return globalThis.__CNX_BRAND_COUNTS_CACHE__.data;
  }
  if (globalThis.__CNX_BRAND_COUNTS_CACHE__?.promise) {
    return globalThis.__CNX_BRAND_COUNTS_CACHE__.promise;
  }

  const storeKey = getShopifyStoreKey() || 'unknown-store';
  const kvCacheKey = `cache:brandcounts:v1:${storeKey}`;
  const kvTtlSeconds = 1800;

  const query = BrandCountsQuery;
  const fetchAndCount = async () => {
    if (process.env.NODE_ENV !== 'development') {
      try {
        const kv = await getKv();
        if (kv) {
          const cached = await kv.get(kvCacheKey);
          if (cached && typeof cached === 'object' && !Array.isArray(cached)) {
            return cached;
          }
        }
      } catch {
        // ignore KV read failures; fall back to live fetch
      }
    }

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

    if (process.env.NODE_ENV !== 'development') {
      try {
        const kv = await getKv();
        if (kv) await kv.set(kvCacheKey, brandCounts, { ex: kvTtlSeconds });
      } catch {
        // ignore KV write failures
      }
    }

    return brandCounts;
  };

  globalThis.__CNX_BRAND_COUNTS_CACHE__ = {
    ts: now,
    data: globalThis.__CNX_BRAND_COUNTS_CACHE__?.data || null,
    promise: fetchAndCount()
      .then(counts => {
        globalThis.__CNX_BRAND_COUNTS_CACHE__ = { ts: Date.now(), data: counts, promise: null };
        return counts;
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('getBrandCounts error:', error);
        globalThis.__CNX_BRAND_COUNTS_CACHE__ = { ts: Date.now(), data: null, promise: null };
        return {};
      }),
  };

  return globalThis.__CNX_BRAND_COUNTS_CACHE__.promise;
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

  const query = getCarByHandleQuery(handle);
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
      needsAdminSpec(n.metafields, variant.metafields, {
        includeCategory: true,
        includeBodyType: true,
        includeDrivetrain: true,
      })
        ? await getAdminSpecByProductIds([n.id])
        : {};
    const adminSpec = (adminSpecById && n.id && adminSpecById[n.id]) || {};

    const mergedSpec = { ...specVariant, ...adminSpec, ...spec };

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
      image: images[0]?.url || '',
      price,
      compareAtPrice,
      variant,
    };

    // Parse car data
    const parsed = parseCarData(productData);

    const {
      year,
      mileage,
      transmission,
      drivetrain,
      fuelType,
      brand,
      model,
      installment,
      category,
      bodyType,
    } = normalizeCarSpec(mergedSpec, parsed, n.vendor);

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
      drivetrain,
      drive_type: drivetrain,
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
