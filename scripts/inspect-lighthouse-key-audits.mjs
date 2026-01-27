#!/usr/bin/env node

import fs from 'node:fs';

const reportPath = process.argv[2];
if (!reportPath) {
  console.error('Usage: node scripts/inspect-lighthouse-key-audits.mjs <report.json>');
  process.exit(2);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const audits = report?.audits ?? {};

function pick(id) {
  const a = audits[id];
  if (!a) return null;

  let detailsPreview = null;
  try {
    const details = a.details;
    if (details?.type === 'list' && Array.isArray(details.items)) {
      const first = details.items[0];
      detailsPreview = {
        type: 'list',
        count: details.items.length,
        firstItemKeys: first && typeof first === 'object' ? Object.keys(first).slice(0, 20) : null,
      };
    } else if (details?.type === 'table' && Array.isArray(details.items)) {
      const first = details.items[0];
      detailsPreview = {
        type: 'table',
        count: details.items.length,
        firstRowKeys: first && typeof first === 'object' ? Object.keys(first).slice(0, 20) : null,
      };
    } else if (details?.type) {
      detailsPreview = { type: details.type };
    }
  } catch {
    detailsPreview = null;
  }

  return {
    id,
    score: a.score ?? null,
    displayValue: a.displayValue ?? null,
    numericValue: a.numericValue ?? null,
    numericUnit: a.numericUnit ?? null,
    detailsType: a.details?.type ?? null,
    detailsPreview,
  };
}

const defaultIds = [
  'largest-contentful-paint',
  'largest-contentful-paint-element',
  'lcp-lazy-loaded',
  'prioritize-lcp-image',
  'preload-lcp-image',
  'render-blocking-resources',
  'critical-request-chains',
  'unused-javascript',
  'unused-css-rules',
  'mainthread-work-breakdown',
];

const idsFromArgs = process.argv.slice(3).filter(Boolean);
const ids = idsFromArgs.length > 0 ? idsFromArgs : defaultIds;

console.log('Report:', reportPath);
console.log('Final URL:', report?.finalUrl ?? 'n/a');

for (const id of ids) {
  const v = pick(id);
  if (!v) continue;
  console.log(`\n[${id}]`);
  console.log(JSON.stringify(v, null, 2));
}
