// Shopify GraphQL API integration for retrieving car data
// Uses Shopify Storefront API to fetch product data with custom metafields

import { safeFetch } from './safeFetch.js';
import { parseCarData } from './carDataParser.js';

// Base fetch function for Shopify GraphQL using safeFetch
export async function fetchShopify(query, variables = {}) {
  const domain = process.env.SHOPIFY_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN;

  if (!domain || domain === 'undefined') {
    console.error('SHOPIFY_DOMAIN is not set or undefined');
    throw new Error('Shopify domain configuration is missing');
  }

  if (!token || token === 'undefined') {
    console.error('SHOPIFY_STOREFRONT_TOKEN is not set or undefined');
    throw new Error('Shopify token configuration is missing');
  }

  try {
    const url = `https://${domain}/api/2023-04/graphql.json`;
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

    const result = await safeFetch(url, options);

    if (!result) {
      throw new Error('No response from Shopify API');
    }

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    return result.data;
  } catch (error) {
    console.error('Shopify fetch error:', error);
    throw error;
  }
}

// Get all cars for the car listing page
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
        }
      }
    }
  }
  `;
  try {
    const data = await fetchShopify(query);
    return data.products.edges.map(e => {
      const n = e.node;
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

      // Parse car data from title, tags, description
      const parsed = parseCarData(productData);

      return {
        ...parsed,
        // Legacy fields for compatibility
        metafields: {}, // Empty object since metafields don't exist
        year: parsed.year,
        brand: parsed.brand,
        model: parsed.model,
        color: null, // Not parsed yet
        mileage: parsed.mileage,
        transmission: parsed.transmission,
        fuel_type: null, // Not parsed yet
        engine: parsed.engine,
        displacement: null, // Not parsed yet
        seats: null, // Not parsed yet
        province: 'เชียงใหม่',
        free_down: parsed.features.includes('ฟรีดาวน์') ? 'ใช่' : null,
        low_installment: parsed.features.includes('ผ่อนสบาย') ? 'ใช่' : null,
        warranty: null, // Not parsed yet
        condition: parsed.condition,
      };
    });
  } catch (error) {
    console.error('getAllCars error:', error);
    return [];
  }
}

// Get cars for homepage
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

// Get brand counts for homepage
export async function getBrandCounts() {
  const query = `
  {
    products(first: 250) {
      edges {
        node {
          vendor
          availableForSale
        }
      }
    }
  }
  `;
  try {
    const data = await fetchShopify(query);
    const brandCounts = {};

    if (data && data.products && data.products.edges) {
      data.products.edges.forEach(edge => {
        const product = edge.node;

        // Skip if not available for sale
        if (!product.availableForSale) return;

        // Use vendor as brand (simpler approach)
        const brand = product.vendor;

        if (brand && typeof brand === 'string') {
          // Normalize brand name (case insensitive)
          const normalizedBrand = brand.toLowerCase().trim();
          if (normalizedBrand) {
            brandCounts[normalizedBrand] = (brandCounts[normalizedBrand] || 0) + 1;
          }
        }
      });
    }

    return brandCounts;
  } catch (error) {
    console.error('getBrandCounts error:', error);
    return {};
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
          }
        }
      }
      metafields(namespace: "spec", first: 20) {
        edges {
          node {
            namespace
            key
            value
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
    if (Array.isArray(n.metafields?.edges)) {
      n.metafields.edges.forEach(mf => {
        if (mf.node && mf.node.namespace && mf.node.key) {
          metafields[`${mf.node.namespace}:${mf.node.key}`] = mf.node.value;
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
  } catch (error) {
    console.error('getCarByHandle error:', error);
    return null;
  }
}
