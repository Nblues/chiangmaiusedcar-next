#!/usr/bin/env node

/*
  run-lighthouse-local-home-multi.mjs

  Purpose:
  - Run the repo's Lighthouse CI runner multiple times against local prod server.
  - Copy each JSON report to a unique filename (run1..runN).
  - Print per-run summaries and a final variability summary (min/avg/max).

  Usage:
    node scripts/run-lighthouse-local-home-multi.mjs --runs 5

  Options:
    --runs <n>           Number of runs (default: 5)
    --base <url>         Base URL (default: http://localhost:3000)
    --out <dir>          Output dir (default: lighthouse-prod-latest)
    --sleep-ms <ms>      Sleep between runs (default: 1500)
*/

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

function parseArgs(argv) {
  const args = {
    runs: 5,
    base: 'http://localhost:3000',
    outDir: 'lighthouse-prod-latest',
    sleepMs: 1500,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    const next = argv[i + 1];

    if (a === '--runs') {
      const n = Number(next);
      if (Number.isFinite(n) && n > 0) args.runs = Math.floor(n);
      i += 1;
      continue;
    }

    if (a === '--base') {
      if (next) args.base = String(next);
      i += 1;
      continue;
    }

    if (a === '--out') {
      if (next) args.outDir = String(next);
      i += 1;
      continue;
    }

    if (a === '--sleep-ms') {
      const n = Number(next);
      if (Number.isFinite(n) && n >= 0) args.sleepMs = Math.floor(n);
      i += 1;
      continue;
    }

    if (a === '--help' || a === '-h') {
      return { ...args, help: true };
    }
  }

  return args;
}

function help() {
  process.stdout.write(
    [
      'run-lighthouse-local-home-multi.mjs',
      '',
      'Options:',
      '  --runs <n>           Number of runs (default: 5)',
      '  --base <url>         Base URL (default: http://localhost:3000)',
      '  --out <dir>          Output dir (default: lighthouse-prod-latest)',
      '  --sleep-ms <ms>      Sleep between runs (default: 1500)',
      '',
      'Example:',
      '  node scripts/run-lighthouse-local-home-multi.mjs --runs 5',
      '',
    ].join('\n')
  );
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function scorePct(report, id) {
  const score = report?.categories?.[id]?.score;
  return typeof score === 'number' ? Math.round(score * 100) : null;
}

function auditNumeric(report, id) {
  const v = report?.audits?.[id]?.numericValue;
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

function auditDisplay(report, id) {
  const v = report?.audits?.[id]?.displayValue;
  return typeof v === 'string' ? v : null;
}

function fmtMs(ms) {
  if (typeof ms !== 'number' || !Number.isFinite(ms)) return 'n/a';
  return `${(ms / 1000).toFixed(2)}s`;
}

function fmtNumber(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return 'n/a';
  return String(n);
}

function summarizeReport(report) {
  const perf = scorePct(report, 'performance');

  const fcpMs = auditNumeric(report, 'first-contentful-paint');
  const lcpMs = auditNumeric(report, 'largest-contentful-paint');
  const siMs = auditNumeric(report, 'speed-index');
  const tbtMs = auditNumeric(report, 'total-blocking-time');

  const cls = (() => {
    const disp = auditDisplay(report, 'cumulative-layout-shift');
    if (disp) {
      const parsed = Number(disp);
      if (Number.isFinite(parsed)) return parsed;
    }
    const num = auditNumeric(report, 'cumulative-layout-shift');
    if (num != null) return num;
    return null;
  })();

  return {
    finalUrl: report?.finalUrl ?? null,
    performance: perf,
    fcpMs,
    lcpMs,
    siMs,
    tbtMs,
    cls,
  };
}

function statSummary(values) {
  const nums = values.filter(v => typeof v === 'number' && Number.isFinite(v));
  if (nums.length === 0) return { count: 0, min: null, max: null, avg: null };
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  return { count: nums.length, min, max, avg };
}

function runNode(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      stdio: 'inherit',
      windowsHide: true,
    });

    child.on('error', err => reject(err));
    child.on('close', code => {
      if (code === 0) return resolve();
      const e = new Error(`Command failed: node ${args.join(' ')} (exit ${code})`);
      e.exitCode = code;
      reject(e);
    });
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    help();
    process.exit(0);
  }

  ensureDir(args.outDir);

  const baseReportName = 'lighthouse-mobile-home.json';
  const baseReportPath = path.join(args.outDir, baseReportName);

  const perRun = [];

  for (let i = 1; i <= args.runs; i += 1) {
    process.stdout.write(`\n=== Lighthouse local home run ${i}/${args.runs} ===\n`);

    await runNode([
      path.join('scripts', 'run-lighthouse-ci.mjs'),
      '--base',
      args.base,
      '--out',
      args.outDir,
      '--only',
      'home',
    ]);

    if (!fs.existsSync(baseReportPath)) {
      throw new Error(`Missing report: ${baseReportPath}`);
    }

    const runReportPath = path.join(args.outDir, `lighthouse-mobile-home.run${i}.json`);
    fs.copyFileSync(baseReportPath, runReportPath);

    const report = readJson(runReportPath);
    const s = summarizeReport(report);
    perRun.push(s);

    process.stdout.write(
      `Perf=${s.performance ?? 'n/a'} FCP=${fmtMs(s.fcpMs)} LCP=${fmtMs(s.lcpMs)} TBT=${fmtNumber(s.tbtMs)}ms CLS=${s.cls ?? 'n/a'} SI=${fmtMs(s.siMs)}\n`
    );

    if (i < args.runs && args.sleepMs > 0) {
      await sleep(args.sleepMs);
    }
  }

  const perfStats = statSummary(perRun.map(r => r.performance));
  const lcpStats = statSummary(perRun.map(r => (r.lcpMs != null ? r.lcpMs / 1000 : null)));
  const tbtStats = statSummary(perRun.map(r => r.tbtMs));
  const clsStats = statSummary(perRun.map(r => r.cls));

  process.stdout.write('\n=== Variability summary (min / avg / max) ===\n');
  if (perfStats.count) {
    process.stdout.write(
      `Performance: ${perfStats.min} / ${perfStats.avg.toFixed(1)} / ${perfStats.max} (n=${perfStats.count})\n`
    );
  } else {
    process.stdout.write('Performance: n/a\n');
  }

  if (lcpStats.count) {
    process.stdout.write(
      `LCP (s): ${lcpStats.min.toFixed(2)} / ${lcpStats.avg.toFixed(2)} / ${lcpStats.max.toFixed(2)} (n=${lcpStats.count})\n`
    );
  } else {
    process.stdout.write('LCP (s): n/a\n');
  }

  if (tbtStats.count) {
    process.stdout.write(
      `TBT (ms): ${Math.round(tbtStats.min)} / ${Math.round(tbtStats.avg)} / ${Math.round(tbtStats.max)} (n=${tbtStats.count})\n`
    );
  } else {
    process.stdout.write('TBT (ms): n/a\n');
  }

  if (clsStats.count) {
    process.stdout.write(
      `CLS: ${clsStats.min.toFixed(3)} / ${clsStats.avg.toFixed(3)} / ${clsStats.max.toFixed(3)} (n=${clsStats.count})\n`
    );
  } else {
    process.stdout.write('CLS: n/a\n');
  }
}

main().catch(err => {
  // eslint-disable-next-line no-console
  console.error('\nERROR:', err?.message ?? String(err));
  process.exitCode = 1;
});
