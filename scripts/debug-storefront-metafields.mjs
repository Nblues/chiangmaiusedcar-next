import { fetchShopify } from '../lib/shopify.mjs';
import fs from 'node:fs';
import path from 'node:path';

const sampleHandle = process.argv[2] || 'honda-hr-v-1-8-e-limited-auto-ปี-2015-2559';

const parseDotenv = text => {
  const out = {};
  const lines = String(text || '').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx < 1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key) out[key] = value;
  }
  return out;
};

const loadEnvFileIfPresent = fileName => {
  const filePath = path.resolve(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) return;
  const vars = parseDotenv(fs.readFileSync(filePath, 'utf8'));
  for (const [k, v] of Object.entries(vars)) {
    if (process.env[k] == null) process.env[k] = v;
  }
};

// Load env similarly to Next.js precedence (local first is fine for debugging)
loadEnvFileIfPresent('.env.local');
loadEnvFileIfPresent('.env.production.local');
loadEnvFileIfPresent('.env');

const run = async (name, query, variables) => {
  try {
    const data = await fetchShopify(query, variables);
    console.log(`\n=== ${name} OK ===`);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.log(`\n=== ${name} ERROR ===`);
    console.log(err?.message || String(err));
  }
};

await run('Shop info', `query { shop { name } }`, {});

await run(
  'Products (basic)',
  `query { products(first: 1) { edges { node { id handle title } } } }`,
  {}
);

await run(
  'ProductByHandle (basic)',
  `query($h: String!) { productByHandle(handle: $h) { id handle title } }`,
  { h: sampleHandle }
);

await run(
  'ProductByHandle metafields identifiers (known keys)',
  `query($h: String!) {
    productByHandle(handle: $h) {
      id
      handle
      metafields(identifiers: [
        { namespace: "spec", key: "year" }
        { namespace: "spec", key: "mileage" }
        { namespace: "spec", key: "transmission" }
        { namespace: "spec", key: "fuel_type" }
        { namespace: "spec", key: "fuel" }
        { namespace: "spec", key: "category" }
        { namespace: "spec", key: "body_type" }
        { namespace: "spec", key: "gear" }
        { namespace: "spec", key: "เกียร์" }
        { namespace: "spec", key: "เชื้อเพลิง" }
        { namespace: "spec", key: "เลขไมล์" }
        { namespace: "spec", key: "ปี" }
      ]) {
        namespace
        key
        value
        type
      }
    }
  }`,
  { h: sampleHandle }
);

await run(
  'ProductByHandle metafields namespace connection',
  `query($h: String!) {
    productByHandle(handle: $h) {
      id
      handle
      metafields(first: 50, namespace: "spec") {
        edges {
          node { namespace key value type }
        }
      }
    }
  }`,
  { h: sampleHandle }
);
