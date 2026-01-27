#!/usr/bin/env node

/*
  run-lighthouse-ci.mjs

  Minimal CI-friendly Lighthouse runner for this repo.
  - Runs a small set of URLs
  - Saves JSON reports into lighthouse-prod-latest/

  This exists because package.json references it (pnpm lighthouse:ci).

  Usage:
    pnpm lighthouse:ci
    node scripts/run-lighthouse-ci.mjs --base https://www.chiangmaiusedcar.com --out lighthouse-prod-latest

  Notes:
  - Uses the official lighthouse CLI via pnpm exec (must be installed).
  - Windows-friendly; avoids bashisms.
*/

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function preflight(url, { timeoutMs = 20000 } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        // Lighthouse runs headless Chrome; use a browser-like UA for preflight too.
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    // We don't need the body; close the stream ASAP.
    try {
      res.body?.cancel?.();
    } catch {
      // ignore
    }

    return { ok: res.status >= 200 && res.status < 300, status: res.status, finalUrl: res.url };
  } catch (e) {
    return { ok: false, status: 0, finalUrl: url, error: String(e?.message ?? e) };
  } finally {
    clearTimeout(timeout);
  }
}

function writeStubReport(outPath, url, preflightResult) {
  const status = preflightResult?.status ?? 0;
  const code = status ? `HTTP_${status}` : 'PREFLIGHT_FAILED';
  const message =
    status
      ? `Preflight status ${status} for ${url}`
      : `Preflight failed for ${url}${preflightResult?.error ? `: ${preflightResult.error}` : ''}`;

  const runtimeErrorOverride = preflightResult?.runtimeError;

  const stub = {
    requestedUrl: url,
    finalUrl: preflightResult?.finalUrl ?? url,
    fetchTime: new Date().toISOString(),
    preflight: {
      status,
      ok: Boolean(preflightResult?.ok),
    },
    runtimeError: runtimeErrorOverride || {
      code,
      message,
    },
    categories: {
      performance: { score: null },
      seo: { score: null },
      accessibility: { score: null },
      'best-practices': { score: null },
    },
    audits: {},
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(stub, null, 2), 'utf8');
}

async function waitForNonTrivialFile(filePath, { minBytes = 1000, timeoutMs = 15000 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const st = fs.statSync(filePath);
      if (st.isFile() && st.size >= minBytes) return true;
    } catch {
      // ignore
    }
    await sleep(250);
  }
  return false;
}

function parseArgs(argv) {
  const args = {
    base: 'https://www.chiangmaiusedcar.com',
    out: 'lighthouse-prod-latest',
    only: null,
    suite: 'core',
    strict: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    const next = argv[i + 1];

    if (a === '--base') {
      args.base = next;
      i += 1;
      continue;
    }

    if (a === '--out') {
      args.out = next;
      i += 1;
      continue;
    }

    if (a === '--only') {
      // Accept comma-separated or repeated values: home,en
      const list = String(next || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      if (list.length > 0) {
        args.only = (args.only || []).concat(list);
      }
      i += 1;
      continue;
    }

    if (a === '--suite') {
      args.suite = String(next || 'core');
      i += 1;
      continue;
    }

    if (a === '--strict') {
      args.strict = true;
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
      'run-lighthouse-ci.mjs',
      '',
      'Options:',
      '  --base <url>   (default: https://www.chiangmaiusedcar.com)',
      '  --out <dir>    (default: lighthouse-prod-latest)',
      '  --suite <name> (default: core) core|extended',
      '  --only <name>  Run only (comma-separated ok). core: home,en. extended: home,en,all-cars,all-cars-p2,about,contact,privacy-policy,promotion,sell-car,credit-check,payment-calculator',
      '  --strict       Exit non-zero if Lighthouse fails (default: off)',
      '',
    ].join('\n')
  );
}

async function runOne({ url, outFile, outDir, strict }) {
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.resolve(process.cwd(), outDir, outFile);

  // Avoid running Lighthouse against known-bad URLs (e.g., 404) because it will
  // fail and exit non-zero. Instead, write a stub JSON so the report explains why.
  const pf = await preflight(url);
  if (!pf.ok) {
    writeStubReport(outPath, url, pf);
    process.stderr.write(`Lighthouse: skipped (preflight ${pf.status || 'ERR'}): ${url}\n`);
    process.stderr.write(`Lighthouse: wrote stub ${outPath}\n`);
    return true;
  }

  const lighthouseCli = require.resolve('lighthouse/cli/index.js');

  // Note: In some Lighthouse versions/environments, a comma-separated list passed
  // to a single --only-categories flag can produce reports with empty `categories`.
  // Repeating the flag is more reliable and still supported by the CLI.
  const onlyCategories = ['performance', 'seo', 'accessibility', 'best-practices'];

  const args = [
    lighthouseCli,
    url,
    '--emulated-form-factor=mobile',
    '--throttling-method=simulate',
    ...onlyCategories.map(c => `--only-categories=${c}`),
    '--output=json',
    `--output-path=${outPath}`,
    '--chrome-flags=--headless --no-sandbox',
  ];

  const maxAttempts = 3;
  const retryableRuntimeErrors = new Set(['NO_NAVSTART']);

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    if (attempt > 1) {
      process.stderr.write(`Lighthouse: retrying (${attempt}/${maxAttempts}): ${url}\n`);
      await sleep(1500);
    }

    const result = spawnSync(process.execPath, args, {
      stdio: 'inherit',
      windowsHide: true,
    });

    if (typeof result.status === 'number' && result.status !== 0) {
      if (attempt === maxAttempts) {
        const exitInfo = `exit ${result.status}${result.signal ? ` signal ${result.signal}` : ''}`;
        writeStubReport(outPath, url, {
          ok: true,
          status: pf.status,
          finalUrl: pf.finalUrl,
          runtimeError: {
            code: 'LIGHTHOUSE_FAILED',
            message: `Lighthouse CLI failed (${exitInfo}) for ${url}`,
          },
        });
        process.stderr.write(`Lighthouse: failed (${exitInfo}): ${url}\n`);
        process.stderr.write(`Lighthouse: wrote stub ${outPath}\n`);
        return !strict;
      }
      continue;
    }

    const okOutput = await waitForNonTrivialFile(outPath, { minBytes: 1000, timeoutMs: 15000 });
    if (!okOutput) {
      if (attempt === maxAttempts) {
        writeStubReport(outPath, url, {
          ok: true,
          status: pf.status,
          finalUrl: pf.finalUrl,
          runtimeError: {
            code: 'LIGHTHOUSE_NO_OUTPUT',
            message: `Lighthouse produced no usable JSON output for ${url}`,
          },
        });
        process.stderr.write(`Lighthouse: missing/too-small output; wrote stub: ${outPath}\n`);
        return !strict;
      }
      continue;
    }

    // Lighthouse sometimes exits 0 but embeds a runtimeError that breaks metrics.
    // Retry once for the common trace issue.
    try {
      const report = JSON.parse(fs.readFileSync(outPath, 'utf8'));
      const code = report?.runtimeError?.code;
      if (code && retryableRuntimeErrors.has(code) && attempt < maxAttempts) {
        continue;
      }
    } catch {
      // ignore parse errors here; report generation will surface them.
    }

    process.stdout.write(`Lighthouse: wrote ${outPath}\n`);
    return true;
  }

  writeStubReport(outPath, url, {
    ok: true,
    status: pf.status,
    finalUrl: pf.finalUrl,
    runtimeError: {
      code: 'LIGHTHOUSE_UNKNOWN',
      message: `Lighthouse failed for unknown reasons for ${url}`,
    },
  });
  process.stderr.write(`Lighthouse: wrote stub ${outPath}\n`);
  return !strict;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    help();
    process.exit(0);
  }

  const strict = Boolean(opts.strict);

  const base = String(opts.base || '').replace(/\/$/, '');
  const outDir = opts.out || 'lighthouse-prod-latest';

  const suite = String(opts.suite || 'core').toLowerCase();
  if (!['core', 'extended'].includes(suite)) {
    process.stderr.write(`Invalid --suite: ${opts.suite}. Use core|extended\n`);
    process.exit(2);
  }

  /**
   * name: stable identifier used by --only
   * outFile: stable filename under outDir
   */
  const runs = [
    { name: 'home', url: `${base}/`, outFile: 'lighthouse-mobile-home.json' },
    { name: 'en', url: `${base}/en`, outFile: 'lighthouse-mobile-en.json' },
  ].concat(
    suite === 'extended'
      ? [
          { name: 'all-cars', url: `${base}/all-cars`, outFile: 'lighthouse-mobile-all-cars.json' },
          {
            name: 'all-cars-p2',
            url: `${base}/all-cars?page=2`,
            outFile: 'lighthouse-mobile-all-cars.p2.json',
          },
          { name: 'about', url: `${base}/about`, outFile: 'lighthouse-mobile-about.json' },
          { name: 'contact', url: `${base}/contact`, outFile: 'lighthouse-mobile-contact.json' },
          {
            name: 'privacy-policy',
            url: `${base}/privacy-policy`,
            outFile: 'lighthouse-mobile-privacy-policy.json',
          },
          {
            name: 'promotion',
            url: `${base}/promotion`,
            outFile: 'lighthouse-mobile-promotion.json',
          },
          {
            name: 'sell-car',
            url: `${base}/sell-car`,
            outFile: 'lighthouse-mobile-sell-car.json',
          },
          {
            name: 'credit-check',
            url: `${base}/credit-check`,
            outFile: 'lighthouse-mobile-credit-check.json',
          },
          {
            name: 'payment-calculator',
            url: `${base}/payment-calculator`,
            outFile: 'lighthouse-mobile-payment-calculator.json',
          },
        ]
      : []
  );

  const only = Array.isArray(opts.only) ? new Set(opts.only.map(s => s.toLowerCase())) : null;
  const selectedRuns = only ? runs.filter(r => only.has(r.name)) : runs;

  if (only && selectedRuns.length === 0) {
    process.stderr.write(
      suite === 'extended'
        ? 'No runs selected. Valid --only values: home,en,all-cars,all-cars-p2,about,contact,privacy-policy,promotion,sell-car,credit-check,payment-calculator\n'
        : 'No runs selected. Valid --only values: home,en\n'
    );
    process.exit(2);
  }

  let hadFailure = false;
  for (const r of selectedRuns) {
    const ok = await runOne({ url: r.url, outFile: r.outFile, outDir, strict });
    if (!ok) hadFailure = true;
  }

  if (strict && hadFailure) process.exitCode = 2;

  // If the summary script exists, print a compact summary.
  const summaryPath = path.join(process.cwd(), 'scripts', 'summarize-lighthouse.mjs');
  if (fs.existsSync(summaryPath)) {
    spawnSync(
      'node',
      [summaryPath, '--dir', outDir, '--files', ...selectedRuns.map(r => r.outFile)],
      {
        stdio: 'inherit',
        windowsHide: true,
      }
    );
  }
}

main();
