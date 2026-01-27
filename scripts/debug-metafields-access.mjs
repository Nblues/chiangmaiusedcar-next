import fs from 'node:fs';
import path from 'node:path';

console.log('debug-metafields-access: start');

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
      if (!process.env[key] && value !== undefined) process.env[key] = value;
    }
  } catch {
    // ignore missing files
  }
}

const root = process.cwd();
loadEnvFromFile(path.join(root, '.env.local'));
loadEnvFromFile(path.join(root, '.env.production.local'));
loadEnvFromFile(path.join(root, '.env'));

const domain = process.env.SHOPIFY_DOMAIN || 'kn-goodcar.com';
const token =
  process.env.Storefront_API || process.env.SHOPIFY_STOREFRONT_TOKEN || process.env.API_shopify;
const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-01';

if (!token) {
  console.error(
    'Missing Storefront token (Storefront_API / SHOPIFY_STOREFRONT_TOKEN / API_shopify)'
  );
  process.exit(1);
}

const url = `https://${domain}/api/${apiVersion}/graphql.json`;

const query = `query DebugMetafieldsAccess {
  products(first: 1) {
    edges {
      node {
        id
        title
        handle
        brand1: metafield(namespace: "spec", key: "brand") { key namespace type value }
        brand2: metafield(namespace: "spec", key: "ยี่ห้อ") { key namespace type value }
        fuel1: metafield(namespace: "spec", key: "fuel_type") { key namespace type value }
        fuel2: metafield(namespace: "spec", key: "เชื้อเพลิง") { key namespace type value }
        year1: metafield(namespace: "spec", key: "year") { key namespace type value }
        year2: metafield(namespace: "spec", key: "ปี") { key namespace type value }

        variants(first: 1) {
          edges {
            node {
              id
              title
              v_brand1: metafield(namespace: "spec", key: "brand") { key namespace type value }
              v_brand2: metafield(namespace: "spec", key: "ยี่ห้อ") { key namespace type value }
              v_fuel1: metafield(namespace: "spec", key: "fuel_type") { key namespace type value }
              v_fuel2: metafield(namespace: "spec", key: "เชื้อเพลิง") { key namespace type value }
              v_year1: metafield(namespace: "spec", key: "year") { key namespace type value }
              v_year2: metafield(namespace: "spec", key: "ปี") { key namespace type value }
            }
          }
        }
      }
    }
  }
}`;

console.log('URL:', url);
console.log(
  'Token source:',
  process.env.Storefront_API
    ? 'Storefront_API'
    : process.env.SHOPIFY_STOREFRONT_TOKEN
      ? 'SHOPIFY_STOREFRONT_TOKEN'
      : 'API_shopify'
);

const res = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept-Encoding': 'identity',
    'X-Shopify-Storefront-Access-Token': token,
  },
  body: JSON.stringify({ query, variables: {} }),
});

console.log('Status:', res.status);

const text = await res.text();
let json = null;
try {
  json = JSON.parse(text);
} catch {
  console.log('Body preview:', text.slice(0, 2000));
  process.exit(0);
}

const node = json?.data?.products?.edges?.[0]?.node;
if (!node) {
  console.log('No product node returned.');
  console.log('Response preview:', JSON.stringify(json, null, 2).slice(0, 2000));
  process.exit(0);
}

console.log('Product:', { id: node.id, handle: node.handle, title: node.title });
console.log('metafield(spec.brand):', node.brand1);
console.log('metafield(spec.ยี่ห้อ):', node.brand2);
console.log('metafield(spec.fuel_type):', node.fuel1);
console.log('metafield(spec.เชื้อเพลิง):', node.fuel2);
console.log('metafield(spec.year):', node.year1);
console.log('metafield(spec.ปี):', node.year2);

const v = node?.variants?.edges?.[0]?.node;
console.log('Variant:', v ? { id: v.id, title: v.title } : null);
console.log('variant metafield(spec.brand):', v?.v_brand1 ?? null);
console.log('variant metafield(spec.ยี่ห้อ):', v?.v_brand2 ?? null);
console.log('variant metafield(spec.fuel_type):', v?.v_fuel1 ?? null);
console.log('variant metafield(spec.เชื้อเพลิง):', v?.v_fuel2 ?? null);
console.log('variant metafield(spec.year):', v?.v_year1 ?? null);
console.log('variant metafield(spec.ปี):', v?.v_year2 ?? null);

if (json?.errors) {
  console.log('GraphQL errors:', JSON.stringify(json.errors, null, 2));
}
