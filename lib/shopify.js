// lib/shopify.js

const domain = process.env.SHOPIFY_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_TOKEN;

export async function fetchShopify(query, variables = {}) {
  const res = await fetch(`https://${domain}/api/2023-04/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    console.error('Shopify GraphQL errors:', json.errors);
    throw new Error(`Shopify API error: ${json.errors.map(e => e.message).join(', ')}`);
  }
  return json.data;
}

export async function getAllCars() {
  const query = `
  {
    products(first: 250, sortKey: CREATED_AT, reverse: true) {
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
          images(first: 10) {
            edges {
              node {
                url
                altText
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
                selectedOptions {
                  name
                  value
                }
                weight
                weightUnit
              }
            }
          }
          metafields(
            identifiers: [
              {namespace: "spec", key: "year"},
              {namespace: "spec", key: "brand"},
              {namespace: "spec", key: "model"},
              {namespace: "spec", key: "color"},
              {namespace: "spec", key: "mileage"},
              {namespace: "spec", key: "transmission"},
              {namespace: "spec", key: "fuel_type"},
              {namespace: "spec", key: "free_down"},
              {namespace: "spec", key: "low_installment"}
            ]
          ) {
            namespace
            key
            value
            type
            description
          }
        }
      }
    }
  }
  `;
  const data = await fetchShopify(query);
  return data.products.edges.map(e => {
    const n = e.node;
    // images
    const images = Array.isArray(n.images?.edges)
      ? n.images.edges.map(img => ({
          url: img.node.url,
          alt: img.node.altText || n.title,
        }))
      : [];
    // variant
    const variant = n.variants.edges[0]?.node || {};
    const price = variant.price || { amount: 0, currencyCode: 'THB' };
    const compareAtPrice = variant.compareAtPrice || null;
    // metafields
    const metafields = {};
    if (Array.isArray(n.metafields)) {
      n.metafields.forEach(mf => {
        if (mf && typeof mf === 'object' && mf.namespace && mf.key) {
          metafields[`${mf.namespace}:${mf.key}`] = mf.value;
        }
      });
    } else {
      console.error(
        `[Shopify] No metafields array found for product: ${n.handle || n.id}`,
        n.metafields,
      );
    }
    return {
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
      metafields,
      // ขยายตรงนี้ ถ้าอยาก map อื่นเพิ่ม (เช่น model, year, color, ... จาก metafields)
      year: metafields['spec:year'] || null,
      brand: metafields['spec:brand'] || null,
      model: metafields['spec:model'] || null,
      color: metafields['spec:color'] || null,
      mileage: metafields['spec:mileage'] || null,
      transmission: metafields['spec:transmission'] || null,
      fuel_type: metafields['spec:fuel_type'] || null,
      free_down: metafields['spec:free_down'] || null,
      low_installment: metafields['spec:low_installment'] || null,
    };
  });
}
