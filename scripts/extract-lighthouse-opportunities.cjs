#!/usr/bin/env node

/*
  Usage:
    node scripts/extract-lighthouse-opportunities.cjs <report.json>
    node scripts/extract-lighthouse-opportunities.cjs <report.json> <out.json>

  - Extracts Lighthouse "opportunity" audits into a compact, sortable JSON report.
  - Truncates large item lists to keep output readable.
*/

const fs = require('fs');
const path = require('path');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function toNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function truncateItems(items, maxItems) {
  if (!Array.isArray(items)) return null;
  const limited = items.slice(0, maxItems);
  return {
    total: items.length,
    shown: limited.length,
    items: limited,
  };
}

function extractOpportunities(report, { maxItemsPerAudit }) {
  const audits = report?.audits || {};

  const opportunities = [];

  for (const [id, audit] of Object.entries(audits)) {
    const details = audit?.details;
    if (!details || details.type !== 'opportunity') continue;

    const overallSavingsMs = toNumber(details.overallSavingsMs);
    const overallSavingsBytes = toNumber(details.overallSavingsBytes);

    opportunities.push({
      id,
      title: audit?.title || null,
      description: audit?.description || null,
      score: toNumber(audit?.score),
      numericValue: toNumber(audit?.numericValue),
      displayValue: typeof audit?.displayValue === 'string' ? audit.displayValue : null,
      overallSavingsMs,
      overallSavingsBytes,
      details: {
        headings: Array.isArray(details.headings) ? details.headings : null,
        items: truncateItems(details.items, maxItemsPerAudit),
      },
    });
  }

  opportunities.sort((a, b) => {
    const aMs = a.overallSavingsMs ?? -1;
    const bMs = b.overallSavingsMs ?? -1;
    if (bMs !== aMs) return bMs - aMs;
    const aBytes = a.overallSavingsBytes ?? -1;
    const bBytes = b.overallSavingsBytes ?? -1;
    return bBytes - aBytes;
  });

  return {
    finalUrl: report?.finalUrl || null,
    fetchTime: report?.fetchTime || null,
    opportunities,
  };
}

function main() {
  const [, , inPath, outPath] = process.argv;

  if (!inPath) {
    console.error(
      'Usage: node scripts/extract-lighthouse-opportunities.cjs <report.json> [out.json]'
    );
    process.exit(2);
  }

  const resolvedIn = path.resolve(process.cwd(), inPath);
  const report = readJson(resolvedIn);

  const extracted = extractOpportunities(report, { maxItemsPerAudit: 10 });

  if (outPath) {
    const resolvedOut = path.resolve(process.cwd(), outPath);
    fs.writeFileSync(resolvedOut, JSON.stringify(extracted, null, 2) + '\n', 'utf8');
    return;
  }

  process.stdout.write(JSON.stringify(extracted, null, 2) + '\n');
}

try {
  main();
} catch (err) {
  console.error(String(err && err.stack ? err.stack : err));
  process.exit(1);
}
