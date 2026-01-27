#!/usr/bin/env node

import fs from 'node:fs';

const reportPath = process.argv[2];
const needle = (process.argv[3] ?? '').toLowerCase();

if (!reportPath) {
  console.error('Usage: node scripts/list-lighthouse-audits.mjs <report.json> [substring]');
  process.exit(2);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const audits = report?.audits ?? {};
let keys = Object.keys(audits);

if (needle) {
  keys = keys.filter(k => k.toLowerCase().includes(needle));
}

keys.sort();
console.log(`Audit keys (${needle || 'all'}): count=${keys.length}`);
for (const k of keys.slice(0, 200)) {
  console.log(k);
}
if (keys.length > 200) {
  console.log(`... (${keys.length - 200} more)`);
}
