#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */

/*
  Usage:
    node scripts/extract-lighthouse-inp.cjs <report.json>
    node scripts/extract-lighthouse-inp.cjs <report.json> <out.json>

  Prints a compact INP-focused summary and (optionally) writes JSON.

  Notes:
  - Lighthouse navigation runs sometimes report INP as null if no meaningful interactions
    happened during the run.
*/

const fs = require('fs');
const path = require('path');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function pickAudit(report, id) {
  const a = report?.audits?.[id];
  if (!a) return null;

  return {
    id,
    title: a.title || null,
    description: a.description || null,
    score: typeof a.score === 'number' ? a.score : null,
    numericValue: typeof a.numericValue === 'number' ? a.numericValue : null,
    numericUnit: typeof a.numericUnit === 'string' ? a.numericUnit : null,
    displayValue: typeof a.displayValue === 'string' ? a.displayValue : null,
    details: a.details || null,
  };
}

function summarizeLongTasks(longTasksAudit, maxItems = 10) {
  const items = longTasksAudit?.details?.items;
  if (!Array.isArray(items)) return { total: 0, top: [] };

  const top = items
    .map(it => ({
      duration: typeof it.duration === 'number' ? it.duration : null,
      startTime: typeof it.startTime === 'number' ? it.startTime : null,
      url: typeof it.url === 'string' ? it.url : null,
    }))
    .filter(it => typeof it.duration === 'number')
    .sort((a, b) => b.duration - a.duration)
    .slice(0, maxItems);

  return { total: items.length, top };
}

function summarizeBootup(bootupAudit, maxItems = 10) {
  const items = bootupAudit?.details?.items;
  if (!Array.isArray(items)) return { total: 0, top: [] };

  // bootup-time uses {url, total, scripting, scriptParseCompile}
  const top = items
    .map(it => ({
      url: typeof it.url === 'string' ? it.url : null,
      totalMs: typeof it.total === 'number' ? it.total : null,
      scriptingMs: typeof it.scripting === 'number' ? it.scripting : null,
      parseCompileMs: typeof it.scriptParseCompile === 'number' ? it.scriptParseCompile : null,
    }))
    .filter(it => typeof it.totalMs === 'number')
    .sort((a, b) => b.totalMs - a.totalMs)
    .slice(0, maxItems);

  return { total: items.length, top };
}

function summarizeThirdParty(thirdPartyAudit, maxItems = 10) {
  const items = thirdPartyAudit?.details?.items;
  if (!Array.isArray(items)) return { total: 0, top: [] };

  // third-party-summary uses {entity, mainThreadTime, blockingTime, transferSize}
  const top = items
    .map(it => ({
      entity: typeof it.entity === 'string' ? it.entity : null,
      mainThreadTimeMs: typeof it.mainThreadTime === 'number' ? it.mainThreadTime : null,
      blockingTimeMs: typeof it.blockingTime === 'number' ? it.blockingTime : null,
      transferSizeBytes: typeof it.transferSize === 'number' ? it.transferSize : null,
    }))
    .filter(it => typeof it.mainThreadTimeMs === 'number' || typeof it.blockingTimeMs === 'number')
    .sort((a, b) => (b.blockingTimeMs || 0) - (a.blockingTimeMs || 0))
    .slice(0, maxItems);

  return { total: items.length, top };
}

function buildSummary(report) {
  const inp = pickAudit(report, 'interaction-to-next-paint');
  const tbt = pickAudit(report, 'total-blocking-time');
  const mainthread = pickAudit(report, 'mainthread-work-breakdown');
  const longTasks = pickAudit(report, 'long-tasks');
  const bootup = pickAudit(report, 'bootup-time');
  const thirdParty = pickAudit(report, 'third-party-summary');

  const longTasksSummary = summarizeLongTasks(longTasks);
  const bootupSummary = summarizeBootup(bootup);
  const thirdPartySummary = summarizeThirdParty(thirdParty);

  return {
    finalUrl: report?.finalUrl || null,
    fetchTime: report?.fetchTime || null,
    inp: inp
      ? {
          numericValue: inp.numericValue,
          numericUnit: inp.numericUnit,
          displayValue: inp.displayValue,
          score: inp.score,
        }
      : null,
    tbt: tbt
      ? {
          numericValue: tbt.numericValue,
          numericUnit: tbt.numericUnit,
          displayValue: tbt.displayValue,
          score: tbt.score,
        }
      : null,
    longTasks: longTasksSummary,
    bootupTime: bootupSummary,
    thirdParty: thirdPartySummary,
    auditsPresent: {
      inp: Boolean(inp),
      longTasks: Boolean(longTasks),
      bootupTime: Boolean(bootup),
      thirdParty: Boolean(thirdParty),
      mainthreadWorkBreakdown: Boolean(mainthread),
    },
  };
}

function format(summary) {
  const lines = [];
  lines.push(`url: ${summary.finalUrl || '-'}`);

  if (summary.inp) {
    const v = summary.inp.numericValue;
    const unit = summary.inp.numericUnit || '';
    const shown = summary.inp.displayValue || (v != null ? `${Math.round(v)}${unit}` : 'null');
    lines.push(`inp: ${shown} (score: ${summary.inp.score ?? 'n/a'})`);
  } else {
    lines.push('inp: (audit missing)');
  }

  if (summary.tbt) {
    const v = summary.tbt.numericValue;
    const unit = summary.tbt.numericUnit || '';
    const shown = summary.tbt.displayValue || (v != null ? `${Math.round(v)}${unit}` : 'null');
    lines.push(`tbt: ${shown}`);
  }

  lines.push(`longTasks: ${summary.longTasks.total}`);
  for (const t of summary.longTasks.top) {
    lines.push(`  - ${Math.round(t.duration)}ms ${t.url || ''}`.trimEnd());
  }

  lines.push(`bootupItems: ${summary.bootupTime.total}`);
  for (const b of summary.bootupTime.top) {
    const total = b.totalMs != null ? `${Math.round(b.totalMs)}ms` : 'n/a';
    lines.push(`  - ${total} ${b.url || ''}`.trimEnd());
  }

  lines.push(`thirdPartyEntities: ${summary.thirdParty.total}`);
  for (const e of summary.thirdParty.top) {
    const blocking = e.blockingTimeMs != null ? `${Math.round(e.blockingTimeMs)}ms` : 'n/a';
    const main = e.mainThreadTimeMs != null ? `${Math.round(e.mainThreadTimeMs)}ms` : 'n/a';
    lines.push(`  - blocking ${blocking}, main ${main} ${e.entity || ''}`.trimEnd());
  }

  return lines.join('\n');
}

function main() {
  const [, , inPath, outPath] = process.argv;
  if (!inPath) {
    process.stderr.write(
      'Usage: node scripts/extract-lighthouse-inp.cjs <report.json> [out.json]\n'
    );
    process.exit(2);
  }

  const reportPath = path.resolve(process.cwd(), inPath);
  const report = readJson(reportPath);
  const summary = buildSummary(report);

  if (outPath) {
    fs.writeFileSync(
      path.resolve(process.cwd(), outPath),
      JSON.stringify(summary, null, 2) + '\n',
      'utf8'
    );
    return;
  }

  process.stdout.write(format(summary) + '\n');
}

try {
  main();
} catch (err) {
  process.stderr.write(String(err && err.stack ? err.stack : err) + '\n');
  process.exit(1);
}
