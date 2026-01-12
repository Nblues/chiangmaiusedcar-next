/* eslint-disable no-console */

const HOME_URL = process.env.HOME_URL || 'http://localhost:3000/';

function isAbsoluteHttpUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value);
}

function isNumeric(value) {
  if (typeof value === 'number') return Number.isFinite(value);
  if (typeof value !== 'string') return false;
  return /^\d+(\.\d+)?$/.test(value);
}

function extractJsonLdBlocks(html) {
  const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const blocks = [];
  let match;
  while ((match = regex.exec(html))) {
    blocks.push(match[1]);
  }
  return blocks;
}

function normalizeToArray(maybeArray) {
  if (!maybeArray) return [];
  return Array.isArray(maybeArray) ? maybeArray : [maybeArray];
}

function collectItemListProducts(jsonLdObjects) {
  const products = [];

  for (const obj of jsonLdObjects) {
    if (!obj) continue;

    const candidates = Array.isArray(obj) ? obj : [obj];
    for (const item of candidates) {
      if (!item || item['@type'] !== 'ItemList') continue;

      const elements = normalizeToArray(item.itemListElement);
      for (const el of elements) {
        const product = el && el.item;
        if (product && product['@type'] === 'Product') {
          products.push(product);
        }
      }
    }
  }

  return products;
}

function validateProducts(products) {
  const problems = [];

  for (const product of products) {
    const productUrl = product.url;
    const offers = product.offers || {};
    const offerUrl = offers.url;
    const offerPrice = offers.price;

    const images = normalizeToArray(product.image);

    if (!isAbsoluteHttpUrl(productUrl)) {
      problems.push({ kind: 'Product.url not absolute', value: productUrl });
    }

    if (!isAbsoluteHttpUrl(offerUrl)) {
      problems.push({ kind: 'Offer.url not absolute', value: offerUrl });
    }

    if (!isNumeric(offerPrice)) {
      problems.push({ kind: 'Offer.price not numeric', value: offerPrice });
    }

    if (images.length === 0 || !images.every(isAbsoluteHttpUrl)) {
      problems.push({ kind: 'Product.image not all absolute', value: images });
    }
  }

  return problems;
}

async function main() {
  const response = await fetch(HOME_URL);
  const html = await response.text();

  console.log(JSON.stringify({ url: HOME_URL, status: response.status, htmlBytes: html.length }));

  const blocks = extractJsonLdBlocks(html);
  console.log(JSON.stringify({ jsonLdBlocks: blocks.length }));

  const parsed = blocks.map((raw, index) => {
    try {
      return { index, ok: true, value: JSON.parse(raw) };
    } catch (error) {
      return { index, ok: false, error: String(error), sample: raw.slice(0, 200) };
    }
  });

  const parseErrors = parsed.filter((p) => !p.ok);
  if (parseErrors.length) {
    console.log('JSON-LD parse errors:', parseErrors.length);
    console.log(parseErrors[0]);
    process.exitCode = 2;
    return;
  }

  const jsonLdObjects = parsed.map((p) => p.value);
  const products = collectItemListProducts(jsonLdObjects);
  console.log(JSON.stringify({ itemListProducts: products.length }));

  const problems = validateProducts(products);
  console.log(JSON.stringify({ problems: problems.length }));
  if (problems.length) {
    console.log('Sample problem:', problems[0]);
    process.exitCode = 1;
  }
}

await main();
