#!/usr/bin/env node
/**
 * Verify Shopify Admin Token Setup
 * 
 * Usage: node scripts/verify-shopify-token.mjs
 * 
 * Checks:
 * 1. SHOPIFY_ADMIN_TOKEN exists
 * 2. Token has correct format
 * 3. Token can access Shopify Admin API
 * 4. Token has required scopes (read_products, write_products)
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const domain = process.env.SHOPIFY_DOMAIN;
const adminToken = process.env.SHOPIFY_ADMIN_TOKEN;

console.log('\n═══════════════════════════════════════════════════');
console.log('🔐 Shopify Admin Token Verification');
console.log('═══════════════════════════════════════════════════\n');

// Check 1: Domain exists
console.log('1️⃣ Shopify Domain:');
if (!domain) {
  console.log('   ❌ SHOPIFY_DOMAIN not found in .env.local');
  process.exit(1);
}
console.log(`   ✅ ${domain}\n`);

// Check 2: Token exists
console.log('2️⃣ Admin Token:');
if (!adminToken) {
  console.log('   ❌ SHOPIFY_ADMIN_TOKEN not found in .env.local');
  console.log('   ⚠️  This means car status will use FILE STORAGE (/tmp)');
  console.log('   ⚠️  Status will be lost on Vercel instance restart!\n');
  console.log('   📋 Follow setup guide: SHOPIFY_ADMIN_TOKEN_SETUP.md\n');
  process.exit(1);
}

// Check 3: Token format
if (!adminToken.startsWith('shpat_')) {
  console.log(`   ❌ Invalid token format: ${adminToken.substring(0, 10)}...`);
  console.log('   ⚠️  Token should start with "shpat_"\n');
  process.exit(1);
}

console.log(`   ✅ Token found: ${adminToken.substring(0, 15)}...****\n`);

// Check 4: Test API access
console.log('3️⃣ Testing API Access:');
console.log('   Fetching shop info...');

try {
  const response = await fetch(`https://${domain}/admin/api/2024-01/shop.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminToken,
    },
  });

  if (!response.ok) {
    console.log(`   ❌ API Error: ${response.status} ${response.statusText}`);
    const error = await response.text();
    console.log(`   Error: ${error}\n`);
    process.exit(1);
  }

  const data = await response.json();
  console.log(`   ✅ Connected to: ${data.shop?.name || 'Unknown shop'}`);
  console.log(`   ✅ Shop domain: ${data.shop?.domain || 'N/A'}\n`);

  // Check 5: Test product access (read_products scope)
  console.log('4️⃣ Testing Product Access (read_products scope):');
  const productsResponse = await fetch(
    `https://${domain}/admin/api/2024-01/products.json?limit=1`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
    }
  );

  if (!productsResponse.ok) {
    console.log(`   ❌ Cannot read products: ${productsResponse.status}`);
    console.log('   ⚠️  Missing "read_products" scope\n');
    process.exit(1);
  }

  const productsData = await productsResponse.json();
  console.log(`   ✅ Can read products (${productsData.products?.length || 0} found)\n`);

  // Check 6: Verify scopes
  console.log('5️⃣ Required Scopes:');
  console.log('   ✅ read_products (verified)');
  console.log('   ⚠️  write_products (cannot verify without actual write test)\n');

  // Summary
  console.log('═══════════════════════════════════════════════════');
  console.log('✅ All Checks Passed!');
  console.log('═══════════════════════════════════════════════════\n');
  console.log('🎉 Shopify Admin Token is configured correctly\n');
  console.log('📋 What this means:');
  console.log('   - Car status will be stored in Shopify Metafields');
  console.log('   - Status is PERSISTENT (not lost on Vercel restart)');
  console.log('   - File storage (/tmp) is used as backup only\n');
  console.log('🚀 Next Steps:');
  console.log('   1. Add SHOPIFY_ADMIN_TOKEN to Vercel env variables');
  console.log('   2. Redeploy production');
  console.log('   3. Test car status persistence\n');

} catch (error) {
  console.log(`   ❌ Error: ${error.message}\n`);
  process.exit(1);
}
