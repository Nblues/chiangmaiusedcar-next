import { fetchShopify } from '../../../lib/shopify.mjs';

const DEFAULT_KEYS = [
  'year',
  'ปี',
  'brand',
  'ยี่ห้อ',
  'model',
  'รุ่น',
  'mileage',
  'odometer',
  'เลขไมล์',
  'transmission',
  'gear',
  'เกียร์',
  'fuel_type',
  'fuel',
  'เชื้อเพลิง',
  'category',
  'vehicle_category',
  'car_category',
  'vehicle_type',
  'car_type',
  'carType',
  'type',
  'หมวดหมู่รถ',
  'ประเภทยานพาหนะ',
  'body_type',
  'bodyType',
];

function sanitizeKey(input) {
  const k = String(input || '').trim();
  if (!k) return null;
  // Allow common metafield key characters + Thai.
  // Disallow quotes and control characters to prevent query injection.
  if (/['"\n\r\t\\]/.test(k)) return null;
  if (k.length > 64) return null;
  return k;
}

function buildMetafieldSelections(keys, prefix) {
  return keys
    .map((k, i) => {
      const alias = `${prefix}_${i}`;
      return `${alias}: metafield(namespace: "spec", key: "${k}") { namespace key type value reference { __typename ... on Metaobject { id handle fields { key value } } } }`;
    })
    .join('\n');
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ ok: false, error: 'Not found' });
  }

  const handle = String(req.query.handle || '').trim();
  const all = String(req.query.all || '').trim();
  const namespace = String(req.query.namespace || '').trim();
  const rawKeys = String(req.query.keys || '').trim();
  const keys = (rawKeys ? rawKeys.split(',') : DEFAULT_KEYS).map(sanitizeKey).filter(Boolean);

  const listAll = all === '1' || namespace === 'spec';
  if (listAll) {
    return res.status(400).json({
      ok: false,
      error:
        'Storefront API does not support listing metafields by namespace. Use /api/debug/shopify-admin-metafields?handle=... instead (Admin API).',
    });
  }

  if (!listAll && keys.length === 0) {
    return res.status(400).json({ ok: false, error: 'No keys to query' });
  }

  const query = handle
    ? `query DebugByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          handle
          ${buildMetafieldSelections(keys, 'p')}
          variants(first: 1) {
            edges {
              node {
                id
                title
                ${buildMetafieldSelections(keys, 'v')}
              }
            }
          }
        }
      }`
    : `query DebugFirstProduct {
        products(first: 1) {
          edges {
            node {
              id
              title
              handle
              ${buildMetafieldSelections(keys, 'p')}
              variants(first: 1) {
                edges {
                  node {
                    id
                    title
                    ${buildMetafieldSelections(keys, 'v')}
                  }
                }
              }
            }
          }
        }
      }`;

  try {
    const data = await fetchShopify(query, handle ? { handle } : {});

    const product = handle ? data?.productByHandle : data?.products?.edges?.[0]?.node;

    if (!product) {
      return res.status(404).json({ ok: false, error: 'Product not found', handle });
    }

    const variant = product?.variants?.edges?.[0]?.node || null;

    const productMetafields = {};
    const variantMetafields = {};

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      productMetafields[key] = product?.[`p_${i}`] ?? null;
      variantMetafields[key] = variant?.[`v_${i}`] ?? null;
    }

    return res.status(200).json({
      ok: true,
      handle: product.handle,
      title: product.title,
      productId: product.id,
      variantId: variant?.id || null,
      mode: 'keys',
      keys,
      productMetafields,
      variantMetafields,
      productSpecMetafields: null,
      variantSpecMetafields: null,
      note: 'If all entries are null, the metafields are either not set on the product/variant OR not exposed to Storefront API via Shopify Admin > Custom data > Storefront access.',
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('shopify-metafields debug error:', e);
    return res.status(500).json({ ok: false, error: e?.message || 'Unknown error' });
  }
}
