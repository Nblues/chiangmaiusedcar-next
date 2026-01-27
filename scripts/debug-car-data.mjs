#!/usr/bin/env node
/**
 * Debug script to check car data completeness from Shopify
 *
 * Note: Next.js auto-loads .env files, but plain Node scripts do not.
 * We load .env.local and .env here so SHOPIFY_DOMAIN / SHOPIFY_STOREFRONT_TOKEN work.
 */

import fs from 'node:fs';
import path from 'node:path';

function parseEnvLine(line) {
  const trimmed = String(line || '').trim();
  if (!trimmed || trimmed.startsWith('#')) return null;

  const eq = trimmed.indexOf('=');
  if (eq <= 0) return null;

  const key = trimmed.slice(0, eq).trim();
  let value = trimmed.slice(eq + 1).trim();

  // Strip inline comments for unquoted values
  const isQuoted =
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"));
  if (!isQuoted) {
    const hash = value.indexOf(' #');
    if (hash !== -1) value = value.slice(0, hash).trim();
  }

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return { key, value };
}

function loadEnvFile(filePath, { override = false, allowKey = null } = {}) {
  try {
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    content.split(/\r?\n/).forEach(line => {
      const parsed = parseEnvLine(line);
      if (!parsed) return;

      if (typeof allowKey === 'function' && !allowKey(parsed.key)) return;

      if (override || process.env[parsed.key] === undefined) process.env[parsed.key] = parsed.value;
    });
  } catch {
    // ignore env load errors in debug tooling
  }
}

function loadLocalEnv() {
  const root = process.cwd();
  loadEnvFile(path.join(root, '.env.local'));
  loadEnvFile(path.join(root, '.env'));
}

function loadProductionShopifyEnv() {
  const root = process.cwd();
  const allowKey = key =>
    key === 'SHOPIFY_DOMAIN' ||
    key === 'SHOPIFY_STOREFRONT_TOKEN' ||
    key === 'SHOPIFY_ADMIN_TOKEN' ||
    key === 'SHOPIFY_ADMIN_DOMAIN' ||
    key === 'SHOPIFY_API_VERSION' ||
    key === 'SHOPIFY_ADMIN_API_VERSION' ||
    key === 'Storefront_API' ||
    key === 'API_shopify' ||
    key === 'StorefrontApi' ||
    key === 'SHOPIFY_STOREFRONT_API';

  loadEnvFile(path.join(root, '.env.production.local'), { override: true, allowKey });
  loadEnvFile(path.join(root, '.env.production'), { override: true, allowKey });
}

function applyEnvAliases() {
  // Some env exports use different key names; map them to what the code expects.
  if (!process.env.SHOPIFY_STOREFRONT_TOKEN) {
    process.env.SHOPIFY_STOREFRONT_TOKEN =
      process.env.Storefront_API || process.env.SHOPIFY_STOREFRONT_API || process.env.StorefrontApi;
  }
  if (!process.env.SHOPIFY_ADMIN_TOKEN) {
    process.env.SHOPIFY_ADMIN_TOKEN = process.env.API_shopify;
  }
}

function loadEnvFileFromArg() {
  const envFile = getArgValue('--env-file');
  if (!envFile) return;

  const allowAll = () => true;
  loadEnvFile(path.resolve(process.cwd(), envFile), { override: true, allowKey: allowAll });
}

function getArgValue(name) {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return null;
  const v = process.argv[idx + 1];
  return v && !v.startsWith('-') ? v : null;
}

async function dumpMetafieldsForHandle(handle) {
  if (!handle) return;
  const adminDomain = process.env.SHOPIFY_ADMIN_DOMAIN || process.env.SHOPIFY_DOMAIN;
  const adminToken = process.env.SHOPIFY_ADMIN_TOKEN;
  const adminApiVersion = process.env.SHOPIFY_ADMIN_API_VERSION || '2024-01';

  // Prefer Admin API: can list ALL metafields (no need to know keys ahead of time)
  if (adminDomain && adminToken && String(adminDomain).includes('myshopify.com')) {
    try {
      const adminUrl = `https://${adminDomain}/admin/api/${adminApiVersion}/graphql.json`;
      const adminQuery = `
      query DumpMetafields($handle: String!) {
        productByHandle(handle: $handle) {
          id
          handle
          title
          metafields(first: 100) {
            edges {
              node {
                namespace
                key
                value
                type
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                metafields(first: 100) {
                  edges {
                    node {
                      namespace
                      key
                      value
                      type
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

      const res = await fetch(adminUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminToken,
        },
        body: JSON.stringify({ query: adminQuery, variables: { handle } }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) {
        const msg = json?.errors ? JSON.stringify(json.errors) : `${res.status} ${res.statusText}`;
        throw new Error(`Admin API error: ${msg}`);
      }
      if (json?.errors) {
        throw new Error(`Admin GraphQL errors: ${JSON.stringify(json.errors)}`);
      }

      const product = json?.data?.productByHandle || null;
      const productNodes = Array.isArray(product?.metafields?.edges)
        ? product.metafields.edges.map(e => e.node).filter(Boolean)
        : [];
      const variants = Array.isArray(product?.variants?.edges)
        ? product.variants.edges
            .map(e => e?.node)
            .filter(Boolean)
            .map(v => ({
              id: v.id,
              title: v.title,
              metafields: Array.isArray(v?.metafields?.edges)
                ? v.metafields.edges.map(e => e.node).filter(Boolean)
                : [],
            }))
        : [];
      return { product, metafields: productNodes, variants, source: 'admin' };
    } catch (e) {
      // Token might be invalid or missing permissions; fall back to storefront.
      console.log('⚠️  Admin API access failed; falling back to Storefront API.');
      console.log(`   Reason: ${e?.message || 'unknown error'}`);
    }
  }

  if (adminDomain && adminToken && !String(adminDomain).includes('myshopify.com')) {
    console.log('⚠️  Skipping Admin API: set SHOPIFY_ADMIN_DOMAIN=your-store.myshopify.com');
  }

  // Fallback: Storefront API can only return metafields if you provide identifiers.
  const { fetchShopify } = await import('../lib/shopify.mjs');
  const storefrontQuery = `
    query DumpMetafields($handle: String!) {
      productByHandle(handle: $handle) {
        id
        handle
        title
        metafields(
          identifiers: [
            { namespace: "spec", key: "year" }
            { namespace: "spec", key: "mileage" }
            { namespace: "spec", key: "transmission" }
            { namespace: "spec", key: "fuel_type" }
            { namespace: "spec", key: "fuel" }
            { namespace: "spec", key: "brand" }
            { namespace: "spec", key: "model" }
            { namespace: "spec", key: "installment" }
          ]
        ) {
          namespace
          key
          value
          type
        }
      }
    }
  `;
  const data = await fetchShopify(storefrontQuery, { handle });
  const product = data?.productByHandle || null;
  const raw = Array.isArray(product?.metafields) ? product.metafields : [];
  const nodes = raw.filter(Boolean);
  const nullCount = raw.length - nodes.length;
  return {
    product,
    metafields: nodes,
    variants: [],
    source: 'storefront',
    storefrontRequestedCount: raw.length,
    storefrontNullCount: nullCount,
  };
}

async function main() {
  try {
    // Default: behave like Next.js local dev (loads .env.local/.env)
    // Optional:
    //  - --use-production-shopify : override SHOPIFY_* from .env.production.local
    //  - --env-file <path>        : load a custom env file (overrides existing values)
    loadLocalEnv();
    if (process.argv.includes('--use-production-shopify')) loadProductionShopifyEnv();
    loadEnvFileFromArg();
    applyEnvAliases();

    console.log('🔍 Fetching all cars from Shopify...\n');
    const requestedHandle = getArgValue('--handle');
    const { getAllCars } = await import('../lib/shopify.mjs');

    if (requestedHandle) {
      console.log(`🧾 Dumping metafields for handle: ${requestedHandle}\n`);
      const result = await dumpMetafieldsForHandle(requestedHandle);
      if (!result?.product) {
        console.log('❌ Product not found (or not accessible via Storefront API)\n');
        return;
      }

      const {
        product,
        metafields,
        variants,
        source,
        storefrontRequestedCount,
        storefrontNullCount,
      } = result;
      console.log(`✅ ${product.title}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Handle: ${product.handle}`);
      console.log(`   Source: ${source}`);
      console.log(`   Product metafields (total): ${metafields.length}`);

      if (source === 'storefront' && typeof storefrontRequestedCount === 'number') {
        console.log(`   Storefront identifiers requested: ${storefrontRequestedCount}`);
        console.log(`   Storefront null metafields: ${storefrontNullCount}`);
        if (storefrontRequestedCount > 0 && metafields.length === 0) {
          console.log('   ⚠️  Storefront returned only null metafields. This usually means:');
          console.log('      - Metafield definitions are not exposed to Storefront API, OR');
          console.log('      - Namespace/key mismatch (not in spec.*), OR');
          console.log('      - Metafields are empty on this product.');
          console.log(
            '      Tip: add SHOPIFY_ADMIN_TOKEN and rerun to verify actual saved metafields.'
          );
        }
      }

      const variantCount = Array.isArray(variants)
        ? variants.reduce((acc, v) => acc + (v.metafields?.length || 0), 0)
        : 0;
      console.log(`   Variant metafields (total): ${variantCount}`);

      const combined = [];
      metafields.forEach(m => combined.push({ ...m, __scope: 'product' }));
      (variants || []).forEach(v => {
        (v.metafields || []).forEach(m =>
          combined.push({ ...m, __scope: `variant:${v.title || v.id}` })
        );
      });

      const byNs = combined.reduce((acc, m) => {
        const ns = m.namespace || '(no-namespace)';
        acc[ns] = acc[ns] || [];
        acc[ns].push(m);
        return acc;
      }, {});

      const namespaces = Object.keys(byNs).sort();
      console.log(`   Namespaces: ${namespaces.length ? namespaces.join(', ') : '(none)'}`);
      namespaces.forEach(ns => {
        const list = byNs[ns] || [];
        console.log(`\n[${ns}] (${list.length})`);
        list
          .slice()
          .sort((a, b) => String(a.key || '').localeCompare(String(b.key || '')))
          .forEach(m => {
            const scope = m.__scope ? ` (${m.__scope})` : '';
            console.log(` - ${m.key}: ${m.value}${scope}`);
          });
      });
      console.log('');
      return;
    }

    const cars = await getAllCars();
    
    if (!cars || cars.length === 0) {
      console.log('❌ No cars found');
      return;
    }

    console.log(`✅ Found ${cars.length} cars\n`);
    console.log('═══════════════════════════════════════════════════════════\n');

    // Stats
    const stats = {
      total: cars.length,
      withMileage: 0,
      withTransmission: 0,
      withFuelType: 0,
      withInstallment: 0,
      complete: 0, // All 4 specs
    };

    // Check each car
    cars.forEach((car, index) => {
      const hasMileage = Boolean(car.mileage);
      const hasTransmission = Boolean(car.transmission);
      const hasFuelType = Boolean(car.fuelType || car.fuel_type);
      const hasInstallment = Boolean(car.installment);
      const isComplete = hasMileage && hasTransmission && hasFuelType && hasInstallment;

      if (hasMileage) stats.withMileage++;
      if (hasTransmission) stats.withTransmission++;
      if (hasFuelType) stats.withFuelType++;
      if (hasInstallment) stats.withInstallment++;
      if (isComplete) stats.complete++;

      // Show first 10 cars with missing data (include raw metafields for verification)
      if (!isComplete && index < 10) {
        console.log(`🚗 ${car.title}`);
        console.log(`   Handle: ${car.handle}`);
        console.log(`   Mileage: ${hasMileage ? '✅ ' + car.mileage : '❌ Missing'}`);
        console.log(
          `   Transmission: ${hasTransmission ? '✅ ' + car.transmission : '❌ Missing'}`
        );
        const fuelValue = hasFuelType ? '✅ ' + (car.fuelType || car.fuel_type) : '❌ Missing';
        console.log(`   Fuel: ${fuelValue}`);
        console.log(`   Installment: ${hasInstallment ? '✅ ' + car.installment : '❌ Missing'}`);

        const spec = car?.metafields?.spec;
        if (spec && typeof spec === 'object') {
          const keys = Object.keys(spec).sort();
          console.log(`   Metafields(spec): ${keys.length ? keys.join(', ') : '(none)'}`);
          // Print a compact JSON view for quick copy/paste checking
          console.log(`   Metafields(spec) raw: ${JSON.stringify(spec)}`);
        } else {
          console.log('   Metafields(spec): (not present)');
        }
        console.log('');
      }
    });

    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('📊 Data Completeness Summary:');
    console.log(`   Total cars: ${stats.total}`);
    console.log(
      `   With Mileage: ${stats.withMileage} (${((stats.withMileage / stats.total) * 100).toFixed(1)}%)`
    );
    console.log(
      `   With Transmission: ${stats.withTransmission} (${((stats.withTransmission / stats.total) * 100).toFixed(1)}%)`
    );
    console.log(
      `   With Fuel Type: ${stats.withFuelType} (${((stats.withFuelType / stats.total) * 100).toFixed(1)}%)`
    );
    console.log(
      `   With Installment: ${stats.withInstallment} (${((stats.withInstallment / stats.total) * 100).toFixed(1)}%)`
    );
    console.log(
      `   Complete (all 4): ${stats.complete} (${((stats.complete / stats.total) * 100).toFixed(1)}%)`
    );
    console.log('');

    // Show missing data cars count
    const missingCount = stats.total - stats.complete;
    if (missingCount > 0) {
      console.log(`⚠️  ${missingCount} cars are missing at least one field`);
      console.log('   (Run spec enrichment on listing pages to fill gaps)\n');
    } else {
      console.log('✅ All cars have complete data!\n');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
