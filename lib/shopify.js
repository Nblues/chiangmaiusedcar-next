// lib/shopify.js

const domain = process.env.SHOPIFY_DOMAIN || 'kn-goodcar.myshopify.com';
const token = process.env.SHOPIFY_STOREFRONT_TOKEN || 'bb70cb008199a94b83c98df0e45ada67';

export async function fetchShopify(query, variables = {}) {
  if (!domain || domain === 'undefined') {
    console.error('SHOPIFY_DOMAIN is not set or undefined');
    throw new Error('Shopify domain configuration is missing');
  }

  if (!token || token === 'undefined') {
    console.error('SHOPIFY_STOREFRONT_TOKEN is not set or undefined');
    throw new Error('Shopify token configuration is missing');
  }

  // Ensure domain has proper format
  const shopifyDomain = domain.includes('.myshopify.com') ? domain : `${domain}.myshopify.com`;

  try {
    const res = await fetch(`https://${shopifyDomain}/api/2024-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    if (json.errors) {
      console.error('Shopify GraphQL errors:', json.errors);
      throw new Error(`Shopify API error: ${json.errors.map(e => e.message).join(', ')}`);
    }
    return json.data;
  } catch (error) {
    console.error('Shopify fetch error:', error);
    throw new Error(`Failed to fetch from Shopify: ${error.message}`);
  }
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
              {namespace: "spec", key: "gear"},
              {namespace: "spec", key: "fuel_type"},
              {namespace: "spec", key: "engine"},
              {namespace: "spec", key: "displacement"},
              {namespace: "spec", key: "seats"},
              {namespace: "spec", key: "province"},
              {namespace: "spec", key: "free_down"},
              {namespace: "spec", key: "low_installment"},
              {namespace: "spec", key: "warranty"},
              {namespace: "spec", key: "condition"}
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
    // images - เพิ่มรูปภาพมากขึ้น
    const images = Array.isArray(n.images?.edges)
      ? n.images.edges.map(img => ({
          url: img.node.url,
          alt: img.node.altText || n.title,
          width: img.node.width || 800,
          height: img.node.height || 600,
        }))
      : [];

    // variant
    const variant = n.variants.edges[0]?.node || {};
    const price = variant.price || { amount: 0, currencyCode: 'THB' };
    const compareAtPrice = variant.compareAtPrice || null;

    // metafields - ปรับปรุงการประมวลผล
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
        n.metafields
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
      // ข้อมูลจำเพาะรถยนต์
      year: metafields['spec:year'] || null,
      brand: metafields['spec:brand'] || n.vendor || null,
      model: metafields['spec:model'] || null,
      color: metafields['spec:color'] || null,
      mileage: metafields['spec:mileage'] || null,
      transmission: metafields['spec:transmission'] || metafields['spec:gear'] || null,
      fuel_type: metafields['spec:fuel_type'] || null,
      engine: metafields['spec:engine'] || null,
      displacement: metafields['spec:displacement'] || null,
      seats: metafields['spec:seats'] || null,
      province: metafields['spec:province'] || 'เชียงใหม่',
      free_down: metafields['spec:free_down'] || null,
      low_installment: metafields['spec:low_installment'] || null,
      warranty: metafields['spec:warranty'] || null,
      condition: metafields['spec:condition'] || 'มือสอง',
    };
  });
}

// Get limited cars for homepage (faster)
export async function getHomepageCars(limit = 8) {
  const query = `
  {
    products(first: ${limit}, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          handle
          title
          tags
          availableForSale
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
    return data.products.edges.map(e => {
      const n = e.node;
      const images =
        Array.isArray(n.images?.edges) && n.images.edges.length > 0
          ? n.images.edges.map(img => ({
              url: img.node.url,
              alt: img.node.altText || n.title,
              width: img.node.width || 800,
              height: img.node.height || 600,
            }))
          : [];

      const variant = n.variants.edges[0]?.node || {};
      const price = variant.price || { amount: 0, currencyCode: 'THB' };

      return {
        id: n.id,
        handle: n.handle,
        title: n.title,
        tags: n.tags || [],
        availableForSale: n.availableForSale,
        images,
        price,
        variant,
      };
    });
  } catch (error) {
    console.error('getHomepageCars error:', error);
    return [];
  }
}

// Get single car by handle for SEO
export async function getCarByHandle(handle) {
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
          {namespace: "spec", key: "gear"},
          {namespace: "spec", key: "fuel_type"},
          {namespace: "spec", key: "engine"},
          {namespace: "spec", key: "displacement"},
          {namespace: "spec", key: "seats"},
          {namespace: "spec", key: "province"},
          {namespace: "spec", key: "free_down"},
          {namespace: "spec", key: "low_installment"},
          {namespace: "spec", key: "warranty"},
          {namespace: "spec", key: "condition"}
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
  `;

  const data = await fetchShopify(query);
  if (!data.productByHandle) {
    return null;
  }

  const n = data.productByHandle;

  // Process the same way as getAllCars
  const images = Array.isArray(n.images?.edges)
    ? n.images.edges.map(img => ({
        url: img.node.url,
        alt: img.node.altText || n.title,
        width: img.node.width || 800,
        height: img.node.height || 600,
      }))
    : [];

  const variant = n.variants.edges[0]?.node || {};
  const price = variant.price || { amount: 0, currencyCode: 'THB' };
  const compareAtPrice = variant.compareAtPrice || null;

  const metafields = {};
  if (Array.isArray(n.metafields)) {
    n.metafields.forEach(mf => {
      if (mf && typeof mf === 'object' && mf.namespace && mf.key) {
        metafields[`${mf.namespace}:${mf.key}`] = mf.value;
      }
    });
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
    // ข้อมูลจำเพาะรถยนต์
    year: metafields['spec:year'] || null,
    brand: metafields['spec:brand'] || n.vendor || null,
    model: metafields['spec:model'] || null,
    color: metafields['spec:color'] || null,
    mileage: metafields['spec:mileage'] || null,
    transmission: metafields['spec:transmission'] || metafields['spec:gear'] || null,
    fuel_type: metafields['spec:fuel_type'] || null,
    engine: metafields['spec:engine'] || null,
    displacement: metafields['spec:displacement'] || null,
    seats: metafields['spec:seats'] || null,
    province: metafields['spec:province'] || 'เชียงใหม่',
    free_down: metafields['spec:free_down'] || null,
    low_installment: metafields['spec:low_installment'] || null,
    warranty: metafields['spec:warranty'] || null,
    condition: metafields['spec:condition'] || 'มือสอง',
  };
}
