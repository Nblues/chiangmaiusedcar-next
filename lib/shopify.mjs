// Shopify GraphQL API integration for retrieving car data
// Uses Shopify Storefront API to fetch product data with custom metafields

import { safeFetch } from './safeFetch.js';
import { parseCarData } from './carDataParser.js';
import { optimizeShopifyImage } from './shopifyImageOptimizer.js';

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
            url: optimizeShopifyImage(img.node.url, { width: 600 }), // Auto-optimize for card display
            originalUrl: img.node.url, // Keep original for reference
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
        // Use parsed data only (metafields not available in Storefront API without specific keys)
        year: parsed.year,
        brand: parsed.brand || n.vendor,
        model: parsed.model,
        color: parsed.color,
        mileage: parsed.mileage,
        transmission: parsed.transmission,
        fuel_type: parsed.fuel_type,
        engine: parsed.engine,
        displacement: parsed.displacement,
        seats: parsed.seats,
        body_type: parsed.body_type,
        vin: parsed.vin,
        province: parsed.province || 'เชียงใหม่',
        free_down: parsed.features.includes('ฟรีดาวน์') ? 'ใช่' : null,
        low_installment: parsed.features.includes('ผ่อนสบาย') ? 'ใช่' : null,
        warranty: parsed.warranty,
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
              url: optimizeShopifyImage(img.node.url, { width: 600 }), // Auto-optimize for homepage cards
              originalUrl: img.node.url,
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

    return {
      ...parsed,
      // Use parsed data only
      year: parsed.year,
      brand: parsed.brand || n.vendor,
      model: parsed.model,
      color: parsed.color,
      mileage: parsed.mileage,
      transmission: parsed.transmission,
      fuel_type: parsed.fuel_type,
      engine: parsed.engine,
      displacement: parsed.displacement,
      seats: parsed.seats,
      body_type: parsed.body_type,
      vin: parsed.vin,
      province: parsed.province || 'เชียงใหม่',
      free_down: parsed.features?.includes('ฟรีดาวน์') ? 'ใช่' : null,
      low_installment: parsed.features?.includes('ผ่อนสบาย') ? 'ใช่' : null,
      warranty: parsed.warranty,
      condition: parsed.condition || 'มือสอง',
    };
  } catch (error) {
    console.error('getCarByHandle error:', error);
    return null;
  }
}
