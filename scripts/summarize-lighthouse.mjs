#!/usr/bin/env node

/*
  summarize-lighthouse.mjs

  Purpose:
  - Print a small, stable summary from Lighthouse JSON reports.
  - Default workflow in this repo: tasks write reports into lighthouse-prod-latest/.

  Usage:
    node scripts/summarize-lighthouse.mjs --dir lighthouse-prod-latest --files lighthouse-mobile-home.json lighthouse-mobile-en.json
    node scripts/summarize-lighthouse.mjs --files path/to/report.json
    node scripts/summarize-lighthouse.mjs --dir lighthouse-prod-latest --write

  Notes:
  - Keeps output ASCII-safe.
  - Does not require any external deps.
*/

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const args = {
    dir: null,
    files: [],
    write: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    const next = argv[i + 1];

    if (a === '--dir') {
      args.dir = next;
      i += 1;
      continue;
    }

    if (a === '--files') {
      // consume remaining tokens until next flag or end
      for (let j = i + 1; j < argv.length; j += 1) {
        const v = argv[j];
        if (v.startsWith('--')) break;
        args.files.push(v);
        i = j;
      }
      continue;
    }

    if (a === '--write') {
      args.write = true;
      continue;
    }

    if (a === '--help' || a === '-h') {
      return { ...args, help: true };
    }

    // Allow passing files without --files
    if (!a.startsWith('--')) {
      args.files.push(a);
    }
  }

  return args;
}

function help() {
  process.stdout.write(
    [
      'summarize-lighthouse.mjs',
      '',
      'Options:',
      '  --dir <folder>              Prefix folder for --files (optional)',
      '  --files <a.json> <b.json>   One or more report filenames/paths',
      '  --write                     Also write a .summary.json next to each report',
      '',
      'Examples:',
      '  node scripts/summarize-lighthouse.mjs --dir lighthouse-prod-latest --files lighthouse-mobile-home.json lighthouse-mobile-en.json',
      '  node scripts/summarize-lighthouse.mjs lighthouse-prod-latest/lighthouse-mobile-home.json',
      '',
    ].join('\n')
  );
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

function displayOrNumeric(report, id) {
  const a = audit(report, id);
  if (!a) return null;
  return a.displayValue ?? a.numericValue ?? null;
}

function fmtMs(ms) {
  if (typeof ms !== 'number' || !Number.isFinite(ms)) return null;
  return `${(ms / 1000).toFixed(2)}s`;
}

function normalizePath(dir, file) {
  if (!dir) return file;
  // If caller already passed a path separator, do not double-prefix.
  if (file.includes('/') || file.includes('\\')) return file;
  return path.join(dir, file);
}

function summarizeOne(report) {
  const summary = {
    finalUrl: report?.finalUrl ?? null,
    fetchTime: report?.fetchTime ?? null,
    scores: {
      performance: scorePct(report, 'performance'),
      seo: scorePct(report, 'seo'),
      accessibility: scorePct(report, 'accessibility'),
      bestPractices: scorePct(report, 'best-practices'),
    },
    metrics: {
      fcp: displayOrNumeric(report, 'first-contentful-paint'),
      lcp: displayOrNumeric(report, 'largest-contentful-paint'),
      speedIndex: displayOrNumeric(report, 'speed-index'),
      tti: displayOrNumeric(report, 'interactive'),
      tbt: displayOrNumeric(report, 'total-blocking-time'),
      cls: displayOrNumeric(report, 'cumulative-layout-shift'),
      inp: displayOrNumeric(report, 'interaction-to-next-paint'),
    },
  };

  // Prefer numericValue formatting for key paint metrics if display is absent
  const fcpNum = audit(report, 'first-contentful-paint')?.numericValue;
  const lcpNum = audit(report, 'largest-contentful-paint')?.numericValue;
  const siNum = audit(report, 'speed-index')?.numericValue;
  const ttiNum = audit(report, 'interactive')?.numericValue;

  if (summary.metrics.fcp == null) summary.metrics.fcp = fmtMs(fcpNum);
  if (summary.metrics.lcp == null) summary.metrics.lcp = fmtMs(lcpNum);
  if (summary.metrics.speedIndex == null) summary.metrics.speedIndex = fmtMs(siNum);
  if (summary.metrics.tti == null) summary.metrics.tti = fmtMs(ttiNum);

  return summary;
}

function printSummary(label, summary) {
  process.stdout.write(`\n== ${label} ==\n`);
  if (summary.finalUrl) process.stdout.write(`Final URL: ${summary.finalUrl}\n`);

  const s = summary.scores;
  process.stdout.write(
    `Scores: performance=${s.performance ?? 'n/a'} seo=${s.seo ?? 'n/a'} a11y=${s.accessibility ?? 'n/a'} best=${s.bestPractices ?? 'n/a'}\n`
  );

  const m = summary.metrics;
  process.stdout.write(
    `FCP=${m.fcp ?? 'n/a'} LCP=${m.lcp ?? 'n/a'} CLS=${m.cls ?? 'n/a'} INP=${m.inp ?? 'n/a'} TBT=${m.tbt ?? 'n/a'} SI=${m.speedIndex ?? 'n/a'} TTI=${m.tti ?? 'n/a'}\n`
  );
}

function writeSidecar(reportPath, summary) {
  const out = `${reportPath}.summary.json`;
  fs.writeFileSync(out, JSON.stringify(summary, null, 2) + '\n', 'utf8');
  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    help();
    process.exit(0);
  }

  const defaultFiles = ['lighthouse-mobile-home.json', 'lighthouse-mobile-en.json'];
  const files = args.files.length > 0 ? args.files : defaultFiles;

  let hadMissing = false;

  for (const file of files) {
    const reportPath = normalizePath(args.dir, file);

    if (!fs.existsSync(reportPath)) {
      process.stdout.write(`\n== ${file} ==\nMISSING: ${reportPath}\n`);
      hadMissing = true;
      continue;
    }

    try {
      const report = safeReadJson(reportPath);
      const summary = summarizeOne(report);
      printSummary(file, summary);

      if (args.write) {
        const out = writeSidecar(reportPath, summary);
        process.stdout.write(`Wrote: ${out}\n`);
      }
    } catch (e) {
      process.stdout.write(`\n== ${file} ==\nERROR: failed to read/parse ${reportPath}\n`);
      process.stdout.write(`${String(e?.message ?? e)}\n`);
      process.exitCode = 2;
    }
  }

  if (hadMissing && process.exitCode == null) {
    process.exitCode = 1;
  }
}

main();
