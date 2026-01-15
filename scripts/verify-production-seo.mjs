/* eslint-disable no-console */

// Verifies production SEO signals:
// - sitemap is reachable and contains URLs
// - selected page has og:image and the image is 1200x630
// - JSON-LD contains @type Car and Product

function readArgValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

const BASE_URL = (process.env.BASE_URL || 'https://www.chiangmaiusedcar.com').replace(/\/$/, '');
const SITEMAP_URL =
  readArgValue('--sitemap') || process.env.SITEMAP_URL || `${BASE_URL}/sitemap.xml`;
const PAGE_URL = readArgValue('--page') || process.env.PAGE_URL; // optional override

function uniq(values) {
  return Array.from(new Set(values));
}

function extractLocs(xmlText) {
  const locs = [];
  const regex = /<loc>([\s\S]*?)<\/loc>/gi;
  let match;
  while ((match = regex.exec(xmlText))) {
    const value = match[1].trim();
    if (value) locs.push(value);
  }
  return locs;
}

function pickCandidatePage(urls) {
  const preferPatterns = [
    /\/car\b/i,
    /\/cars\b/i,
    /\/vehicle\b/i,
    /\/inventory\b/i,
    /\/products\b/i,
    /\/product\b/i,
    /\/รถ/i,
  ];

  for (const pattern of preferPatterns) {
    const found = urls.find(u => pattern.test(u));
    if (found) return found;
  }

  const nonXml = urls.find(u => !/\.xml($|\?)/i.test(u));
  return nonXml || `${BASE_URL}/`;
}

function extractOgImage(html) {
  // handle both property/name forms and both single/double quotes
  const patterns = [
    /<meta\s+[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i,
    /<meta\s+[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["'][^>]*>/i,
    /<meta\s+[^>]*name=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i,
    /<meta\s+[^>]*content=["']([^"']+)["'][^>]*name=["']og:image["'][^>]*>/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      // HTML attributes sometimes escape ampersands.
      return match[1].trim().replaceAll('&amp;', '&');
    }
  }
  return null;
}

function extractJsonLdBlocks(html) {
  const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const blocks = [];
  let match;
  while ((match = regex.exec(html))) {
    const raw = match[1].trim();
    if (raw) blocks.push(raw);
  }
  return blocks;
}

function normalizeToArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function collectJsonLdNodes(value) {
  // Flattens common shapes: arrays, @graph, ItemList.itemListElement.item, etc.
  const nodes = [];

  const visit = node => {
    if (!node) return;

    if (Array.isArray(node)) {
      for (const entry of node) visit(entry);
      return;
    }

    if (typeof node !== 'object') return;

    nodes.push(node);

    if (node['@graph']) visit(node['@graph']);

    if (node.itemListElement) {
      for (const el of normalizeToArray(node.itemListElement)) {
        if (el && typeof el === 'object') {
          if (el.item) visit(el.item);
          visit(el);
        }
      }
    }

    if (node.mainEntity) visit(node.mainEntity);
    if (node.subjectOf) visit(node.subjectOf);
    if (node.about) visit(node.about);
    if (node.offers) visit(node.offers);
  };

  visit(value);
  return nodes;
}

function collectTypesFromNodes(nodes) {
  const types = [];
  for (const node of nodes) {
    const t = node && node['@type'];
    if (!t) continue;
    for (const tt of normalizeToArray(t)) {
      if (typeof tt === 'string' && tt.trim()) types.push(tt.trim());
    }
  }
  return uniq(types);
}

async function fetchText(url) {
  const res = await fetch(url, { redirect: 'follow' });
  const text = await res.text();
  return { status: res.status, ok: res.ok, url: res.url, text };
}

async function fetchBuffer(url) {
  const res = await fetch(url, { redirect: 'follow' });
  const arrayBuffer = await res.arrayBuffer();
  return { status: res.status, ok: res.ok, url: res.url, buffer: Buffer.from(arrayBuffer) };
}

async function readImageSize(imageUrl) {
  try {
    const sharpModule = await import('sharp');
    const sharp = sharpModule.default || sharpModule;

    const img = await fetchBuffer(imageUrl);
    if (!img.ok) {
      return { ok: false, error: `Image fetch failed: HTTP ${img.status}`, finalUrl: img.url };
    }

    const meta = await sharp(img.buffer).metadata();
    return {
      ok: true,
      finalUrl: img.url,
      width: meta.width,
      height: meta.height,
      format: meta.format,
    };
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}

async function main() {
  console.log(JSON.stringify({ baseUrl: BASE_URL, sitemapUrl: SITEMAP_URL }));

  const sitemap = await fetchText(SITEMAP_URL);
  console.log(
    JSON.stringify({
      sitemapStatus: sitemap.status,
      sitemapFinalUrl: sitemap.url,
      sitemapBytes: sitemap.text.length,
    })
  );
  if (!sitemap.ok) {
    process.exitCode = 2;
    return;
  }

  const locs = extractLocs(sitemap.text);
  if (locs.length === 0) {
    console.log('No <loc> entries found in sitemap.xml');
    process.exitCode = 2;
    return;
  }

  // If this looks like a sitemap index, fetch the first child sitemap.
  const isIndex = /<sitemapindex[\s>]/i.test(sitemap.text) && locs.some(u => /sitemap/i.test(u));
  let urls = locs;
  if (isIndex) {
    const childSitemapUrl = locs[0];
    const child = await fetchText(childSitemapUrl);
    console.log(
      JSON.stringify({
        childSitemapUrl,
        childSitemapStatus: child.status,
        childSitemapBytes: child.text.length,
      })
    );
    if (child.ok) {
      urls = extractLocs(child.text);
    }
  }

  console.log(JSON.stringify({ sampledUrls: urls.length, sample: urls.slice(0, 10) }));

  const targetUrl = PAGE_URL || pickCandidatePage(urls);
  console.log(JSON.stringify({ targetUrl }));

  const page = await fetchText(targetUrl);
  console.log(
    JSON.stringify({ pageStatus: page.status, pageFinalUrl: page.url, htmlBytes: page.text.length })
  );
  if (!page.ok) {
    process.exitCode = 2;
    return;
  }

  const ogImage = extractOgImage(page.text);
  console.log(JSON.stringify({ ogImage }));

  if (!ogImage) {
    console.log('FAIL: og:image not found');
    process.exitCode = 1;
    return;
  }

  const imgSize = await readImageSize(ogImage);
  console.log(JSON.stringify({ ogImageCheck: imgSize }));

  const ogImageOk = imgSize.ok && imgSize.width === 1200 && imgSize.height === 630;

  const jsonLdBlocks = extractJsonLdBlocks(page.text);
  const parsed = jsonLdBlocks.map((raw, index) => {
    try {
      return { index, ok: true, value: JSON.parse(raw) };
    } catch (error) {
      return { index, ok: false, error: String(error), sample: raw.slice(0, 180) };
    }
  });

  const parseErrors = parsed.filter(p => !p.ok);
  console.log(
    JSON.stringify({ jsonLdBlocks: jsonLdBlocks.length, jsonLdParseErrors: parseErrors.length })
  );
  if (parseErrors.length) {
    console.log('Sample JSON-LD parse error:', parseErrors[0]);
  }

  const nodes = parsed.filter(p => p.ok).flatMap(p => collectJsonLdNodes(p.value));
  const types = collectTypesFromNodes(nodes);

  const hasCar = types.includes('Car');
  const hasProduct = types.includes('Product');

  // Product schema is expected on a car detail page, but not required for
  // collection/list pages (home, /all-cars) where ItemList/CollectionPage is typical.
  const requiresProduct = /\/car\//i.test(page.url || targetUrl);

  console.log(JSON.stringify({ jsonLdTypes: types, hasCar, hasProduct, requiresProduct }));

  const ok = ogImageOk && hasCar && (requiresProduct ? hasProduct : true);
  console.log(
    JSON.stringify({ result: ok ? 'PASS' : 'FAIL', ogImageOk, hasCar, hasProduct, requiresProduct })
  );

  if (!ok) process.exitCode = 1;
}

await main();
