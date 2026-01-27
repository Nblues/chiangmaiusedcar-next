#!/usr/bin/env node

import fs from 'node:fs';

const reportPath = process.argv[2];
if (!reportPath) {
  console.error('Usage: node scripts/inspect-lighthouse-runtime-error.mjs <report.json>');
  process.exit(2);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

console.log('Report:', reportPath);
console.log('Final URL:', report?.finalUrl ?? 'n/a');
console.log('Requested URL:', report?.requestedUrl ?? 'n/a');
console.log('RuntimeError:', report?.runtimeError ?? null);
console.log('Categories keys:', Object.keys(report?.categories ?? {}));
