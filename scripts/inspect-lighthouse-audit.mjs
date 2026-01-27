#!/usr/bin/env node

/*
  inspect-lighthouse-audit.mjs

  Small helper to print top offenders for a Lighthouse audit from a JSON report.

  Usage:
    node scripts/inspect-lighthouse-audit.mjs \
      --file lighthouse-prod-latest/lighthouse-mobile-all-cars.json \
      --audit uses-responsive-images \
      --top 10
*/

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const out = { file: null, audit: null, top: 10 };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    const next = argv[i + 1];

    if (a === '--file') {
      out.file = next;
      i += 1;
      continue;
    }

    if (a === '--audit') {
      out.audit = next;
      i += 1;
      continue;
    }

    if (a === '--top') {
      const n = Number.parseInt(String(next || ''), 10);
      if (Number.isFinite(n) && n > 0) out.top = n;
      i += 1;
      continue;
    }

    if (a === '--help' || a === '-h') {
      out.help = true;
      continue;
    }
  }
  return out;
}

function help() {
  process.stdout.write(
    [
      'inspect-lighthouse-audit.mjs',
      '',
      'Options:',
      '  --file <path>   Lighthouse JSON file',
      '  --audit <id>    Audit id (e.g. uses-responsive-images)',
      '  --top <n>       How many items to print (default: 10)',
      '',
    ].join('\n')
  );
}

const opts = parseArgs(process.argv.slice(2));
if (opts.help || !opts.file || !opts.audit) {
  help();
  process.exit(opts.help ? 0 : 1);
}

const filePath = path.resolve(process.cwd(), opts.file);
const raw = fs.readFileSync(filePath, 'utf8');
const report = JSON.parse(raw);

const audit = report?.audits?.[opts.audit];
if (!audit) {
  process.stderr.write(`Audit not found: ${opts.audit}\n`);
  process.exit(2);
}

const overallSavingsBytes = audit?.details?.overallSavingsBytes;
if (Number.isFinite(overallSavingsBytes)) {
  process.stdout.write(`overallSavingsBytes: ${overallSavingsBytes}\n`);
}

const items = Array.isArray(audit?.details?.items) ? audit.details.items.slice() : [];
items.sort((a, b) => (b?.wastedBytes || 0) - (a?.wastedBytes || 0));

const top = items.slice(0, opts.top);
for (const i of top) {
  const wasted = i?.wastedBytes ?? null;
  const total = i?.totalBytes ?? null;
  const url = i?.url ?? '';
  process.stdout.write(`${wasted}\t${total}\t${url}\n`);
}
