import fs from 'node:fs';
import path from 'node:path';

import { safeFetch } from '../lib/safeFetch.js';

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
  process.env.SHOPIFY_STOREFRONT_TOKEN || process.env.Storefront_API || process.env.API_shopify;
const apiVersion = process.env.SHOPIFY_API_VERSION || '2023-04';

if (!token) {
  console.error('Missing storefront token');
  process.exit(1);
}

const url = `https://${domain}/api/${apiVersion}/graphql.json`;

async function call(query) {
  return safeFetch(url, {
    method: 'POST',
    headers: { 'X-Shopify-Storefront-Access-Token': token },
    body: { query, variables: {} },
    timeout: 3000,
    retries: 0,
    validateJson: true,
    fallback: null,
  });
}

console.log('Call 1');
const r1 = await call('{ shop { name } }');
console.log('Call 1 ok:', Boolean(r1?.data?.shop?.name));

console.log('Call 2');
const r2 = await call('{ products(first: 1) { edges { node { id } } } }');
console.log('Call 2 ok:', Boolean(r2?.data?.products?.edges?.length));
