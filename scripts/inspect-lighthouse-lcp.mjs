#!/usr/bin/env node

import fs from 'node:fs';

const reportPath = process.argv[2];
if (!reportPath) {
  console.error('Usage: node scripts/inspect-lighthouse-lcp.mjs <report.json>');
  process.exit(2);
}

const raw = fs.readFileSync(reportPath, 'utf8');
const report = JSON.parse(raw);

const lcpAudit = report?.audits?.['largest-contentful-paint'];
const lcpMs = lcpAudit?.numericValue;
const lcpDisplay = lcpAudit?.displayValue;

const elAudit = report?.audits?.['largest-contentful-paint-element'];
const elItems = elAudit?.details?.items;

function findFirstNode(obj) {
  if (!obj || typeof obj !== 'object') return null;
  if (obj.node && typeof obj.node === 'object') return obj.node;
  if (Array.isArray(obj.items)) {
    for (const it of obj.items) {
      const found = findFirstNode(it);
      if (found) return found;
    }
  }
  return null;
}

const firstTop = Array.isArray(elItems) ? elItems[0] : null;
const node = findFirstNode(firstTop);
const snippet = node?.snippet ?? null;
const selector = node?.selector ?? null;

const itemKeys = firstTop && typeof firstTop === 'object' ? Object.keys(firstTop).slice(0, 20) : null;
const nodeKeys = node && typeof node === 'object' ? Object.keys(node).slice(0, 20) : null;

console.log('Report:', reportPath);
console.log('Final URL:', report?.finalUrl ?? 'n/a');
console.log('LCP:', lcpDisplay ?? (typeof lcpMs === 'number' ? `${(lcpMs / 1000).toFixed(2)}s` : 'n/a'));
console.log('Has audit largest-contentful-paint-element:', Boolean(elAudit));
console.log(
  'LCP element audit items:',
  Array.isArray(elItems) ? `count=${elItems.length}` : elAudit?.details ? 'present-but-nonarray' : 'missing'
);
console.log('First item keys:', itemKeys ?? 'n/a');
console.log('Resolved node keys:', nodeKeys ?? 'n/a');
console.log('LCP element selector:', selector ?? 'n/a');
console.log('LCP element snippet:', snippet ?? 'n/a');
