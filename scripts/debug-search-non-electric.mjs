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

const PHRASE = 'ยานพาหนะที่ไม่ใช้ไฟฟ้า';

async function search(queryString) {
  const q = `query ProductsSearch($q: String!) {
    products(first: 20, query: $q) {
      edges {
        node { handle title productType tags }
      }
    }
  }`;

  const data = await fetchShopify(q, { q: queryString });
  const nodes = (data?.products?.edges || []).map(e => e?.node).filter(Boolean);
  return nodes;
}

async function main() {
  console.log('debug-search-non-electric: start');
  console.log('Phrase:', PHRASE);

  const candidates = [
    `product_type:'${PHRASE}'`,
    `product_type:"${PHRASE}"`,
    `tag:'${PHRASE}'`,
    `tag:"${PHRASE}"`,
    PHRASE,
  ];

  for (const c of candidates) {
    try {
      const nodes = await search(c);
      console.log(`\nQuery: ${c}`);
      console.log('Matches:', nodes.length);
      for (const n of nodes.slice(0, 5)) {
        console.log(
          '-',
          n.handle,
          '|',
          n.productType || '-',
          '| tags:',
          (n.tags || []).slice(0, 4).join(',')
        );
      }

      if (nodes.length > 0) {
        const handles = nodes.map(n => n.handle).filter(Boolean);
        const specs = await getCarSpecsByHandles(handles);
        console.log('Sample parsed fuel types:');
        for (const n of nodes.slice(0, 5)) {
          const s = specs?.[n.handle] || {};
          const fuel = s.fuelType || s.fuel_type || '-';
          console.log('  ', n.handle, '=>', fuel);
        }
      }
    } catch (e) {
      console.log(`\nQuery: ${c}`);
      console.log('Error:', e?.message || e);
    }
  }

  // Sample from the most common productType in this shop (seen in Shopify taxonomy UI).
  const commonProductType = 'ยานพาหนะ รถยนต์ รถมือสอง';
  const commonQueries = [
    `product_type:"${commonProductType}"`,
    `product_type:"${commonProductType}" -tag:ไฟฟ้า -tag:รถไฟฟ้า -tag:EV -tag:ev -tag:electric -tag:Electric`,
  ];

  for (const c of commonQueries) {
    try {
      const nodes = await search(c);
      console.log(`\nQuery: ${c}`);
      console.log('Matches:', nodes.length);
      for (const n of nodes.slice(0, 5)) {
        console.log(
          '-',
          n.handle,
          '|',
          n.productType || '-',
          '| tags:',
          (n.tags || []).slice(0, 6).join(',')
        );
      }

      if (nodes.length > 0) {
        const handles = nodes.map(n => n.handle).filter(Boolean);
        const specs = await getCarSpecsByHandles(handles);
        console.log('Sample parsed fuel types:');
        for (const n of nodes.slice(0, 10)) {
          const s = specs?.[n.handle] || {};
          const fuel = s.fuelType || s.fuel_type || '-';
          console.log('  ', n.handle, '=>', fuel);
        }
      }
    } catch (e) {
      console.log(`\nQuery: ${c}`);
      console.log('Error:', e?.message || e);
    }
  }

  // If nothing matched, print productType histogram from the first 100 products.
  const listQuery = `query ProductsFirst($first: Int!) {
    products(first: $first) {
      edges { node { productType } }
    }
  }`;

  const listData = await fetchShopify(listQuery, { first: 100 });
  const types = (listData?.products?.edges || []).map(e => e?.node?.productType).filter(Boolean);
  const counts = new Map();
  for (const t of types) counts.set(t, (counts.get(t) || 0) + 1);

  console.log('\nTop productTypes (first 100 products):');
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  for (const [t, n] of sorted.slice(0, 20)) console.log('-', t, ':', n);
}

main().catch(err => {
  console.error('debug-search-non-electric error:', err?.message || err);
  process.exit(1);
});
