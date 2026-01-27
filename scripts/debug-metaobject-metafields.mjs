import fs from 'node:fs';
import path from 'node:path';

console.log('debug-metaobject-metafields: start');

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

const query = `{
  products(first: 1) {
    edges {
      node {
        id
        title
        metafields(identifiers: [
          { namespace: "spec", key: "brand" }
        ]) {
          namespace
          key
          type
          value
          reference {
            __typename
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
    // Workaround: avoid compressed responses which can crash Node/undici on Windows.
    'Accept-Encoding': 'identity',
    'X-Shopify-Storefront-Access-Token': token,
  },
  body: JSON.stringify({ query, variables: {} }),
});

console.log('Status:', res.status);

// Read only a small preview to avoid crashes if response is unexpectedly large.
const reader = res.body?.getReader?.();
if (!reader) {
  const text = await res.text();
  console.log('Body length:', text.length);
  console.log('Body preview:', text.slice(0, 2000));
  process.exit(0);
}

let total = 0;
let preview = '';
for (;;) {
  const { done, value } = await reader.read();
  if (done) break;
  total += value.byteLength;
  if (preview.length < 2000) {
    preview += new TextDecoder().decode(value, { stream: true });
  }
  if (total >= 64 * 1024) break;
}

console.log('Read bytes (partial):', total);
console.log('Body preview (partial):', preview.slice(0, 2000));
