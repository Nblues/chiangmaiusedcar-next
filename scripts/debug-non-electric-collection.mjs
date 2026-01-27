import fs from 'node:fs';
import path from 'node:path';
import { fetchShopify, getCarSpecsByHandles } from '../lib/shopify.mjs';

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

const TARGET_TITLE = 'ยานพาหนะที่ไม่ใช้ไฟฟ้า';

async function main() {
  console.log('debug-non-electric-collection: start');
  console.log('Target collection title:', TARGET_TITLE);

  const collectionsQuery = `query Collections($first: Int!) {
    collections(first: $first) {
      edges {
        node { handle title }
      }
    }
  }`;

  const collectionsData = await fetchShopify(collectionsQuery, { first: 50 });
  const collections = (collectionsData?.collections?.edges || []).map(e => e?.node).filter(Boolean);

  const hit =
    collections.find(c => c.title === TARGET_TITLE) ||
    collections.find(c => String(c.title || '').includes(TARGET_TITLE));

  if (!hit) {
    console.log('Collection not found. Available collections (first 50):');
    for (const c of collections) console.log('-', c.title, `(${c.handle})`);
    process.exit(0);
  }

  console.log('Using collection:', hit.title, `(${hit.handle})`);

  const collectionQuery = `query CollectionProducts($handle: String!) {
    collectionByHandle(handle: $handle) {
      title
      handle
      products(first: 20) {
        edges {
          node {
            handle
            title
          }
        }
      }
    }
  }`;

  const collectionData = await fetchShopify(collectionQuery, { handle: hit.handle });
  const products = (collectionData?.collectionByHandle?.products?.edges || [])
    .map(e => e?.node)
    .filter(Boolean);

  const handles = products.map(p => p.handle).filter(Boolean);
  console.log('Products fetched:', handles.length);
  if (handles.length === 0) process.exit(0);

  const specs = await getCarSpecsByHandles(handles);

  console.log('\nResults (via getCarSpecsByHandles):');
  for (const p of products) {
    const s = specs?.[p.handle] || {};
    const fuel = s.fuelType || s.fuel_type || null;
    const line = [
      p.handle,
      `fuel=${fuel ?? '-'}`,
      `trans=${s.transmission ?? '-'}`,
      `year=${s.year ?? '-'}`,
      `mileage=${s.mileage ?? '-'}`,
      `category=${s.category ?? '-'}`,
      `body=${s.body_type ?? '-'}`,
    ].join(' | ');
    console.log(line);
  }
}

main().catch(err => {
  console.error('debug-non-electric-collection error:', err?.message || err);
  process.exit(1);
});
