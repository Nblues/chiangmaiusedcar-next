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

const domain =
  process.env.SHOPIFY_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || 'kn-goodcar.com';
const token =
  process.env.SHOPIFY_STOREFRONT_TOKEN || process.env.Storefront_API || process.env.API_shopify;
const apiVersion = process.env.SHOPIFY_API_VERSION || '2023-04';

if (!token) {
  console.error(
    'Missing Storefront token env (SHOPIFY_STOREFRONT_TOKEN/Storefront_API/API_shopify)'
  );
  process.exit(1);
}

const url = `https://${domain}/api/${apiVersion}/graphql.json`;
const query = `{
  products(first: 1) { edges { node { id title } } }
}`;

console.log('URL:', url);
console.log('Has token:', Boolean(token));

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

console.log('Status:', res.status, res.statusText);
console.log('Content-Type:', res.headers.get('content-type'));
console.log('Content-Length:', res.headers.get('content-length'));

// Read only first 64KB to avoid OOM if the response is unexpectedly huge.
const reader = res.body?.getReader?.();
if (!reader) {
  const text = await res.text();
  console.log('Body length:', text.length);
  console.log('Body preview:', text.slice(0, 500));
  process.exit(0);
}

let total = 0;
let preview = '';
for (;;) {
  const { done, value } = await reader.read();
  if (done) break;
  total += value.byteLength;
  if (preview.length < 500) {
    preview += new TextDecoder().decode(value, { stream: true });
  }
  if (total >= 64 * 1024) break;
}

console.log('Read bytes (partial):', total);
console.log('Body preview (partial):', preview.slice(0, 500));
