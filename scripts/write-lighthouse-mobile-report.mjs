#!/usr/bin/env node

/*
  write-lighthouse-mobile-report.mjs

  Writes a compact Markdown report from Lighthouse JSON files.

  Usage:
    node scripts/write-lighthouse-mobile-report.mjs \
      --dir lighthouse-prod-latest \
      --files lighthouse-mobile-home.json lighthouse-mobile-en.json \
      --out logs/lighthouse-mobile-report.md

  Notes:
  - No external deps.
  - Designed for quick “mobile speed” validation after running pnpm lighthouse:ci.
*/

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const args = {
    dir: null,
    files: [],
    out: 'logs/lighthouse-mobile-report.md',
    maxOpp: 6,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    const next = argv[i + 1];

    if (a === '--dir') {
      args.dir = next;
      i += 1;
      continue;
    }

    if (a === '--out') {
      args.out = next;
      i += 1;
      continue;
    }

    if (a === '--max-opp') {
      const n = Number(next);
      if (Number.isFinite(n) && n > 0) args.maxOpp = Math.floor(n);
      i += 1;
      continue;
    }

    if (a === '--files') {
      for (let j = i + 1; j < argv.length; j += 1) {
        const v = argv[j];
        if (v.startsWith('--')) break;
        args.files.push(v);
        i = j;
      }
      continue;
    }

    if (a === '--help' || a === '-h') {
      return { ...args, help: true };
    }

    if (!a.startsWith('--')) {
      args.files.push(a);
    }
  }

  return args;
}

function help() {
  process.stdout.write(
    [
      'write-lighthouse-mobile-report.mjs',
      '',
      'Options:',
      '  --dir <folder>              Prefix folder for --files (optional)',
      '  --files <a.json> <b.json>   One or more report filenames/paths',
      '  --out <file.md>             Output markdown (default: logs/lighthouse-mobile-report.md)',
      '  --max-opp <n>               Top opportunities per page (default: 6)',
      '',
    ].join('\n')
  );
}

function normalizePath(dir, file) {
  if (!dir) return file;
  if (file.includes('/') || file.includes('\\')) return file;
  return path.join(dir, file);
}

function safeReadJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function scorePct(report, id) {
  const score = report?.categories?.[id]?.score;
  return typeof score === 'number' ? Math.round(score * 100) : null;
}

function audit(report, id) {
  return report?.audits?.[id] ?? null;
}

function displayOrMs(report, id) {
  const a = audit(report, id);
  if (!a) return null;
  if (typeof a.displayValue === 'string') return a.displayValue;
  if (typeof a.numericValue === 'number' && Number.isFinite(a.numericValue)) {
    // numericValue is ms for paint metrics, except CLS.
    if (id === 'cumulative-layout-shift') return String(a.numericValue);
    return `${(a.numericValue / 1000).toFixed(2)}s`;
  }
  return null;
}

function toNumber(v) {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

function fmtBytes(bytes) {
  if (bytes == null) return null;
  const units = ['B', 'KB', 'MB'];
  let n = bytes;
  let u = 0;
  while (n >= 1024 && u < units.length - 1) {
    n /= 1024;
    u += 1;
  }
  return `${n.toFixed(u === 0 ? 0 : 1)}${units[u]}`;
}

function extractOpportunities(report, maxOpp) {
  const audits = report?.audits || {};
  const list = [];

  for (const [id, a] of Object.entries(audits)) {
    const d = a?.details;
    if (!d || d.type !== 'opportunity') continue;

    list.push({
      id,
      title: a?.title ?? id,
      displayValue: typeof a?.displayValue === 'string' ? a.displayValue : null,
      overallSavingsMs: toNumber(d.overallSavingsMs),
      overallSavingsBytes: toNumber(d.overallSavingsBytes),
    });
  }

  list.sort((x, y) => {
    const a = x.overallSavingsMs ?? -1;
    const b = y.overallSavingsMs ?? -1;
    if (b !== a) return b - a;
    const ab = x.overallSavingsBytes ?? -1;
    const bb = y.overallSavingsBytes ?? -1;
    return bb - ab;
  });

  return list.slice(0, maxOpp);
}

function mdEscape(s) {
  return String(s).replace(/\|/g, '\\|');
}

function sectionForReport(label, report, maxOpp) {
  const scores = {
    performance: scorePct(report, 'performance'),
    seo: scorePct(report, 'seo'),
    accessibility: scorePct(report, 'accessibility'),
    bestPractices: scorePct(report, 'best-practices'),
  };

  const runtimeError = report?.runtimeError ?? null;

  const metrics = {
    fcp: displayOrMs(report, 'first-contentful-paint'),
    lcp: displayOrMs(report, 'largest-contentful-paint'),
    cls: displayOrMs(report, 'cumulative-layout-shift'),
    inp: displayOrMs(report, 'interaction-to-next-paint'),
    tbt: displayOrMs(report, 'total-blocking-time'),
    si: displayOrMs(report, 'speed-index'),
  };

  const opp = extractOpportunities(report, maxOpp);

  const lines = [];
  lines.push(`## ${mdEscape(label)}`);
  lines.push('');
  lines.push(`Final URL: ${report?.finalUrl ?? '-'}`);
  lines.push('');

  if (runtimeError) {
    lines.push('### Runtime Error');
    lines.push('');
    lines.push('```');
    if (runtimeError.code) lines.push(`code: ${runtimeError.code}`);
    if (runtimeError.message) lines.push(`message: ${runtimeError.message}`);
    lines.push('```');
    lines.push('');
  }

  lines.push('| Category | Score |');
  lines.push('|---|---:|');
  lines.push(`| Performance | ${scores.performance ?? 'n/a'} |`);
  lines.push(`| SEO | ${scores.seo ?? 'n/a'} |`);
  lines.push(`| Accessibility | ${scores.accessibility ?? 'n/a'} |`);
  lines.push(`| Best Practices | ${scores.bestPractices ?? 'n/a'} |`);
  lines.push('');
  lines.push('| Metric | Value |');
  lines.push('|---|---:|');
  lines.push(`| FCP | ${metrics.fcp ?? 'n/a'} |`);
  lines.push(`| LCP | ${metrics.lcp ?? 'n/a'} |`);
  lines.push(`| CLS | ${metrics.cls ?? 'n/a'} |`);
  lines.push(`| INP | ${metrics.inp ?? 'n/a'} |`);
  lines.push(`| TBT | ${metrics.tbt ?? 'n/a'} |`);
  lines.push(`| Speed Index | ${metrics.si ?? 'n/a'} |`);
  lines.push('');

  if (opp.length > 0) {
    lines.push('### Top Opportunities');
    lines.push('');
    lines.push('| Opportunity | Savings |');
    lines.push('|---|---:|');
    for (const o of opp) {
      const ms = o.overallSavingsMs != null ? `${Math.round(o.overallSavingsMs)}ms` : null;
      const bytes = fmtBytes(o.overallSavingsBytes);
      const savings = [ms, bytes].filter(Boolean).join(' / ') || (o.displayValue ?? '');
      lines.push(`| ${mdEscape(o.title)} | ${mdEscape(savings || 'n/a')} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    help();
    process.exit(0);
  }

  const defaultFiles = [
    'lighthouse-mobile-home.json',
    'lighthouse-mobile-en.json',
    'lighthouse-mobile-all-cars.json',
    'lighthouse-mobile-all-cars.p2.json',
    'lighthouse-mobile-about.json',
    'lighthouse-mobile-contact.json',
    'lighthouse-mobile-privacy-policy.json',
    'lighthouse-mobile-promotion.json',
    'lighthouse-mobile-sell-car.json',
    'lighthouse-mobile-credit-check.json',
    'lighthouse-mobile-payment-calculator.json',
  ];
  const files = args.files.length > 0 ? args.files : defaultFiles;

  const sections = [];
  sections.push('# Lighthouse Mobile Report');
  sections.push('');
  sections.push(`Generated: ${new Date().toISOString()}`);
  sections.push('');

  let hadMissing = false;

  for (const file of files) {
    const reportPath = normalizePath(args.dir, file);

    if (!fs.existsSync(reportPath)) {
      hadMissing = true;
      sections.push(`## ${mdEscape(file)}`);
      sections.push('');
      sections.push(`Missing report: ${mdEscape(reportPath)}`);
      sections.push('');
      continue;
    }

    try {
      const report = safeReadJson(reportPath);
      sections.push(sectionForReport(file, report, args.maxOpp));
      sections.push('');
    } catch (e) {
      sections.push(`## ${mdEscape(file)}`);
      sections.push('');
      sections.push(`Failed to parse JSON: ${mdEscape(reportPath)}`);
      sections.push('');
      sections.push('```');
      sections.push(String(e?.message ?? e));
      sections.push('```');
      sections.push('');
      process.exitCode = 2;
    }
  }

  const outPath = path.resolve(process.cwd(), args.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, sections.join('\n'), 'utf8');
  process.stdout.write(`Wrote: ${outPath}\n`);

  if (hadMissing && process.exitCode == null) process.exitCode = 1;
}

main();
