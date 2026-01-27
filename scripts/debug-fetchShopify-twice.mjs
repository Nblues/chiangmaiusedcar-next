import { fetchShopify } from '../lib/shopify.mjs';

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
  } catch {}
}

const root = process.cwd();
loadEnvFromFile(path.join(root, '.env.local'));
loadEnvFromFile(path.join(root, '.env.production.local'));
loadEnvFromFile(path.join(root, '.env'));

process.env.SHOPIFY_DOMAIN ||= 'kn-goodcar.com';

async function main() {
  const q1 = `{
    shop { name description primaryDomain { url } }
  }`;

  const q2 = `{
    products(first: 1) { edges { node { id title } } }
  }`;

  console.log('Running query 1');
  const r1 = await fetchShopify(q1);
  console.log('q1 ok:', Boolean(r1?.shop?.name));
  console.log('q1 full:', JSON.stringify(r1, null, 2).slice(0, 5000));

  console.log('Running query 2');
  const r2 = await fetchShopify(q2);
  console.log('q2 ok:', Boolean(r2?.products?.edges?.length));
}

main().catch(err => {
  console.error('ERR', err);
  process.exit(1);
});
