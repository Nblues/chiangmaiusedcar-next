#!/usr/bin/env node

import fs from 'node:fs';

const reportPath = process.argv[2];
if (!reportPath) {
  console.error('Usage: node scripts/inspect-lcp-breakdown.mjs <report.json>');
  process.exit(2);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const audit = report?.audits?.['lcp-breakdown-insight'];

if (!audit) {
  console.log('Missing audit: lcp-breakdown-insight');
  process.exit(0);
}

function findFirstRow(obj) {
  if (!obj || typeof obj !== 'object') return null;
  if (obj.timing || obj.phases || obj.lcpMs) return obj;
  if (Array.isArray(obj.items)) {
    for (const it of obj.items) {
      const found = findFirstRow(it);
      if (found) return found;
    }
  }
  return null;
}

const top = audit?.details?.items?.[0];
const row = findFirstRow(top);

const wantedKeys = new Set([
  'timeToFirstByte',
  'resourceLoadDelay',
  'resourceLoadDuration',
  'elementRenderDelay',
  'ttfb',
  'loadDelay',
  'loadTime',
  'renderDelay',
]);

function collectWanted(obj, out = {}) {
  if (!obj || typeof obj !== 'object') return out;
  for (const [k, v] of Object.entries(obj)) {
    if (wantedKeys.has(k) && typeof v === 'number') {
      out[k] = v;
    } else if (v && typeof v === 'object') {
      collectWanted(v, out);
    }
  }
  return out;
}

function prune(value, depth = 3) {
  if (depth <= 0) return '[...]';
  if (value == null) return value;
  if (typeof value !== 'object') return value;

  if (Array.isArray(value)) {
    return value.slice(0, 3).map(v => prune(v, depth - 1));
  }

  const out = {};
  for (const k of Object.keys(value).slice(0, 20)) {
    out[k] = prune(value[k], depth - 1);
  }
  const keyCount = Object.keys(value).length;
  if (keyCount > 20) out.__moreKeys = keyCount - 20;
  return out;
}

function findFirstPhases(obj) {
  if (!obj || typeof obj !== 'object') return null;
  if (
    Array.isArray(obj.phases) &&
    obj.phases.every(p => p && typeof p === 'object' && 'subpart' in p)
  ) {
    return obj.phases;
  }
  if (Array.isArray(obj.items)) {
    for (const it of obj.items) {
      const found = findFirstPhases(it);
      if (found) return found;
    }
  }
  for (const v of Object.values(obj)) {
    if (v && typeof v === 'object') {
      const found = findFirstPhases(v);
      if (found) return found;
    }
  }
  return null;
}

console.log('Report:', reportPath);
console.log('Final URL:', report?.finalUrl ?? 'n/a');

if (!row) {
  console.log('Could not locate LCP breakdown row.');
  console.log('Top keys:', top && typeof top === 'object' ? Object.keys(top) : 'n/a');
  const found = collectWanted(audit, {});
  const keys = Object.keys(found);
  if (keys.length) {
    console.log('Found breakdown-like timings (ms):', JSON.stringify(found, null, 2));
  }

  const phases = findFirstPhases(audit);
  if (phases) {
    console.log('LCP phases (ms):');
    for (const p of phases) {
      const label = p.label || p.subpart;
      console.log(`- ${label}: ${p.duration}ms`);
    }
    process.exit(0);
  }

  console.log(
    'No phases found; top keys:',
    top && typeof top === 'object' ? Object.keys(top) : 'n/a'
  );
  process.exit(0);
}

// Print a compact view of numeric-ish fields
const compact = {};
for (const [k, v] of Object.entries(row)) {
  if (typeof v === 'number' || typeof v === 'string') compact[k] = v;
}

console.log('Breakdown row keys:', Object.keys(row));
console.log('Compact breakdown:', JSON.stringify(compact, null, 2));
