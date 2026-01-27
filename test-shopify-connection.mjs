// Test script for Shopify API connection
import { fetchShopify, getAllCars, getBrandCounts, getHomepageCars } from './lib/shopify.mjs';

import fs from 'node:fs';
import path from 'node:path';

function loadEnvFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq <= 0) continue;

      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (!process.env[key] && value !== undefined) {
        process.env[key] = value;
      }
    }
  } catch {
    // ignore missing files
  }
}

const root = process.cwd();
loadEnvFromFile(path.join(root, '.env.local'));
loadEnvFromFile(path.join(root, '.env.production.local'));
loadEnvFromFile(path.join(root, '.env'));

// Set environment variables manually
process.env.SHOPIFY_DOMAIN = 'kn-goodcar.com';
if (!process.env.SHOPIFY_STOREFRONT_TOKEN) {
  console.error(
    'Missing SHOPIFY_STOREFRONT_TOKEN. Set it in your environment before running this script.'
  );
  process.exit(1);
}

async function testShopifyConnection() {
  console.log('🔍 Testing Shopify API Connection...\n');

  // Test environment variables
  console.log('📋 Environment Variables:');
  console.log(`SHOPIFY_DOMAIN: ${process.env.SHOPIFY_DOMAIN || 'NOT SET'}`);
  console.log(
    `SHOPIFY_STOREFRONT_TOKEN: ${process.env.SHOPIFY_STOREFRONT_TOKEN ? `${process.env.SHOPIFY_STOREFRONT_TOKEN.substring(0, 10)}...` : 'NOT SET'}`
  );
  console.log('');

  // Test 1: Basic GraphQL query
  console.log('🔧 Test 1: Basic Shop Info Query');
  try {
    const basicQuery = `
      {
        shop {
          name
          description
          primaryDomain {
            url
          }
        }
      }
    `;
    const result = await fetchShopify(basicQuery);
    console.log('✅ Shop Info:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.log('❌ Shop Info Error:', error.message);
  }
  console.log('');

  // Test 2: Product count query
  console.log('🔧 Test 2: Product Count Query');
  try {
    const countQuery = `
      {
        products(first: 1) {
          edges {
            node {
              id
              title
            }
          }
        }
      }
    `;
    const result = await fetchShopify(countQuery);
    console.log('✅ Product Count Test:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.log('❌ Product Count Error:', error.message);
  }
  console.log('');

  // Test 3: Homepage cars
  console.log('🔧 Test 3: Homepage Cars (limit 3)');
  try {
    const cars = await getHomepageCars(3);
    console.log(`✅ Homepage Cars Count: ${cars.length}`);
    if (cars.length > 0) {
      console.log('Sample car:', {
        id: cars[0].id,
        title: cars[0].title,
        handle: cars[0].handle,
        hasImages: cars[0].images.length > 0,
        price: cars[0].price,
      });
    }
  } catch (error) {
    console.log('❌ Homepage Cars Error:', error.message);
  }
  console.log('');

  // Test 4: Brand counts
  console.log('🔧 Test 4: Brand Counts');
  try {
    const brandCounts = await getBrandCounts();
    console.log('✅ Brand Counts:', brandCounts);
    console.log(`Total brands found: ${Object.keys(brandCounts).length}`);
  } catch (error) {
    console.log('❌ Brand Counts Error:', error.message);
  }
  console.log('');

  // Test 5: All cars (limited)
  console.log('🔧 Test 5: All Cars (first 3)');
  try {
    const allCars = await getAllCars();
    console.log(`✅ Total Cars: ${allCars.length}`);
    if (allCars.length > 0) {
      console.log('Sample car details:', {
        title: allCars[0].title,
        brand: allCars[0].brand,
        year: allCars[0].year,
        model: allCars[0].model,
        price: allCars[0].price,
        metafieldsCount: Object.keys(allCars[0].metafields).length,
      });
    }
  } catch (error) {
    console.log('❌ All Cars Error:', error.message);
  }
  console.log('');

  // Test 6: Check metafields specifically
  console.log('🔧 Test 6: Check Metafields (corrected)');
  try {
    const metafieldsQuery = `
      {
        products(first: 1) {
          edges {
            node {
              id
              title
              vendor
              metafields(
                identifiers: [
                  {namespace: "spec", key: "year"},
                  {namespace: "spec", key: "brand"},
                  {namespace: "spec", key: "model"}
                ]
              ) {
                namespace
                key
                value
                type
              }
            }
          }
        }
      }
    `;
    const result = await fetchShopify(metafieldsQuery);
    console.log('✅ Metafields Test:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.log('❌ Metafields Error:', error.message);
  }
  console.log('');

  console.log('🏁 Test completed!');
}

// Run the test
testShopifyConnection().catch(console.error);
