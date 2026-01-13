/* eslint-disable no-console */

import sharp from 'sharp';

const url = process.argv[2];
if (!url) {
  console.error('Usage: node scripts/verify-local-page.mjs <url>');
  process.exit(2);
}

function extractOgImage(html) {
  const match = html.match(
    /<meta\s+[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i
  );
  return match?.[1]?.replaceAll('&amp;', '&') || null;
}

function extractJsonLdBlocks(html) {
  return Array.from(
    html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
    m => m[1]
  );
}

function collectTypes(value) {
  const types = new Set();
  const stack = [value];

  while (stack.length) {
    const node = stack.pop();
    if (!node) continue;

    if (Array.isArray(node)) {
      for (const item of node) stack.push(item);
      continue;
    }

    if (typeof node !== 'object') continue;

    const t = node['@type'];
    if (t) {
      const arr = Array.isArray(t) ? t : [t];
      for (const x of arr) if (typeof x === 'string') types.add(x);
    }

    for (const k of Object.keys(node)) stack.push(node[k]);
  }

  return Array.from(types);
}

const res = await fetch(url);
const html = await res.text();

const og = extractOgImage(html);
const blocks = extractJsonLdBlocks(html);

let types = [];
for (const b of blocks) {
  const parsed = JSON.parse(b);
  types = types.concat(collectTypes(parsed));
}

types = Array.from(new Set(types));

console.log(
  JSON.stringify(
    { url, status: res.status, ogImage: og, jsonLdBlocks: blocks.length, types },
    null,
    2
  )
);

if (og) {
  const img = await fetch(og, { redirect: 'follow' });
  const contentType = img.headers.get('content-type') || '';
  const buf = Buffer.from(await img.arrayBuffer());

  const info = { ogFetchStatus: img.status, contentType };

  if (!contentType.toLowerCase().includes('image/')) {
    console.log(
      JSON.stringify(
        {
          ...info,
          note: 'og:image did not return an image',
          bodySample: buf.toString('utf8', 0, 300),
        },
        null,
        2
      )
    );
  } else {
    const meta = await sharp(buf).metadata();
    console.log(
      JSON.stringify(
        { ...info, width: meta.width, height: meta.height, format: meta.format },
        null,
        2
      )
    );
  }
}
