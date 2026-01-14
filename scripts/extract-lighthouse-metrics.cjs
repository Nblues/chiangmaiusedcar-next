#!/usr/bin/env node

/*
  Usage:
    node scripts/extract-lighthouse-metrics.cjs <report.json>
    node scripts/extract-lighthouse-metrics.cjs <report.json> <out.json>

  - If <out.json> is provided, writes a compact JSON summary to that path.
  - Otherwise prints a human-readable summary to stdout (useful for redirecting to a .txt file).
*/

const fs = require('fs');
const path = require('path');

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function scoreTo100(score) {
  if (typeof score !== 'number' || !Number.isFinite(score)) return null;
  return Math.round(score * 100);
}

function auditNumeric(report, id) {
  const a = report?.audits?.[id];
  const numericValue = typeof a?.numericValue === 'number' ? a.numericValue : null;
  const displayValue = typeof a?.displayValue === 'string' ? a.displayValue : null;
  return { numericValue, displayValue };
}

function msToSeconds(ms) {
  if (typeof ms !== 'number' || !Number.isFinite(ms)) return null;
  return Math.round(ms) / 1000;
}

function buildSummary(report) {
  const categories = report?.categories || {};

  const perf = scoreTo100(categories?.performance?.score);
  const a11y = scoreTo100(categories?.accessibility?.score);
  const seo = scoreTo100(categories?.seo?.score);
  const bp = scoreTo100(categories?.['best-practices']?.score);

  const fcp = auditNumeric(report, 'first-contentful-paint');
  const lcp = auditNumeric(report, 'largest-contentful-paint');
  const tbt = auditNumeric(report, 'total-blocking-time');
  const cls = auditNumeric(report, 'cumulative-layout-shift');
  const si = auditNumeric(report, 'speed-index');
  const inp = auditNumeric(report, 'interaction-to-next-paint');

  return {
    finalUrl: report?.finalUrl || null,
    fetchTime: report?.fetchTime || null,
    categories: {
      performance: perf,
      accessibility: a11y,
      seo,
      bestPractices: bp,
    },
    metrics: {
      fcpMs: fcp.numericValue,
      fcpS: msToSeconds(fcp.numericValue),
      lcpMs: lcp.numericValue,
      lcpS: msToSeconds(lcp.numericValue),
      tbtMs: tbt.numericValue,
      cls: cls.numericValue,
      siMs: si.numericValue,
      siS: msToSeconds(si.numericValue),
      inpMs: inp.numericValue,
      inpS: msToSeconds(inp.numericValue),
    },
    display: {
      fcp: fcp.displayValue,
      lcp: lcp.displayValue,
      tbt: tbt.displayValue,
      cls: cls.displayValue,
      si: si.displayValue,
      inp: inp.displayValue,
    },
  };
}

function formatText(summary) {
  const c = summary.categories || {};
  const m = summary.metrics || {};

  const lines = [];
  lines.push(`url: ${summary.finalUrl || '-'}`);

  const cats = [
    ['perf', c.performance],
    ['seo', c.seo],
    ['a11y', c.accessibility],
    ['bp', c.bestPractices],
  ]
    .filter(([, v]) => typeof v === 'number')
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');

  if (cats) lines.push(cats);

  const metrics = [
    ['fcp', m.fcpMs != null ? `${Math.round(m.fcpMs)}ms` : null],
    ['lcp', m.lcpMs != null ? `${Math.round(m.lcpMs)}ms` : null],
    ['cls', m.cls != null ? String(m.cls) : null],
    ['tbt', m.tbtMs != null ? `${Math.round(m.tbtMs)}ms` : null],
    ['si', m.siMs != null ? `${Math.round(m.siMs)}ms` : null],
    ['inp', m.inpMs != null ? `${Math.round(m.inpMs)}ms` : null],
  ]
    .filter(([, v]) => v != null)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');

  if (metrics) lines.push(metrics);

  return lines.join('\n');
}

function main() {
  const [, , inPath, outPath] = process.argv;
  if (!inPath) {
    console.error('Usage: node scripts/extract-lighthouse-metrics.cjs <report.json> [out.json]');
    process.exit(2);
  }

  const resolvedIn = path.resolve(process.cwd(), inPath);
  const report = readJson(resolvedIn);
  const summary = buildSummary(report);

  if (outPath) {
    const resolvedOut = path.resolve(process.cwd(), outPath);
    fs.writeFileSync(resolvedOut, JSON.stringify(summary, null, 2) + '\n', 'utf8');
    return;
  }

  process.stdout.write(formatText(summary) + '\n');
}

try {
  main();
} catch (err) {
  console.error(String(err && err.stack ? err.stack : err));
  process.exit(1);
}
