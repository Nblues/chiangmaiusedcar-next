// Simple audit for browser warning: "Incorrect use of <label for=...>"
// Usage:
//   node scripts/label-audit.mjs                 # checks /
//   node scripts/label-audit.mjs /credit-check  # checks one or more routes
//   BASE_URL=http://localhost:3000 node scripts/label-audit.mjs / /all-cars

import { mkdir, writeFile } from 'node:fs/promises';

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const routes = process.argv.slice(2);
const routesToCheck = routes.length ? routes : ['/'];

const reportPath = 'dev/reports/label-audit.md';

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findLabelFors(html) {
  const matches = [...html.matchAll(/<label\b[^>]*\bfor="([^"]+)"[^>]*>/gi)];
  return matches.map(m => m[1]).filter(Boolean);
}

function hasLabelableTarget(html, id) {
  const safeId = escapeRegExp(id);
  const labelable = new RegExp(
    `<\\s*(input|select|textarea|button|meter|output|progress)\\b[^>]*\\bid=\\"${safeId}\\"`,
    'i'
  );
  return labelable.test(html);
}

function isHiddenInput(html, id) {
  const safeId = escapeRegExp(id);
  const hidden = new RegExp(
    `<\\s*input\\b[^>]*\\bid=\\"${safeId}\\"[^>]*\\btype=\\"hidden\\"`,
    'i'
  );
  return hidden.test(html);
}

async function auditRoute(route) {
  const url = new URL(route, baseUrl).toString();
  const res = await fetch(url);
  const html = await res.text();

  const forValues = findLabelFors(html);
  const unique = [...new Set(forValues)];

  const missingTargets = [];
  const hiddenTargets = [];

  for (const id of unique) {
    if (!hasLabelableTarget(html, id)) missingTargets.push(id);
    else if (isHiddenInput(html, id)) hiddenTargets.push(id);
  }

  return {
    route,
    status: res.status,
    labelsTotal: forValues.length,
    labelsUnique: unique.length,
    missingTargets,
    hiddenTargets,
  };
}

async function main() {
  const results = [];

  for (const route of routesToCheck) {
    // eslint-disable-next-line no-console
    console.log(`Auditing ${route} ...`);
    // eslint-disable-next-line no-await-in-loop
    results.push(await auditRoute(route));
  }

  const problems = results.filter(r => r.missingTargets.length || r.hiddenTargets.length);

  const reportLines = [
    '# Label/For Audit',
    '',
    `Base URL: ${baseUrl}`,
    `Checked at: ${new Date().toISOString()}`,
    '',
    '## Summary',
    ...results.map(
      r =>
        `- ${r.route} [${r.status}] labels=${r.labelsTotal} unique=${r.labelsUnique} missing=${r.missingTargets.length} hidden=${r.hiddenTargets.length}`
    ),
    '',
  ];

  if (!problems.length) {
    reportLines.push('## Problems', 'None detected on checked routes.');
  } else {
    reportLines.push('## Problems');
    for (const r of problems) {
      if (r.missingTargets.length) {
        reportLines.push('', `### ${r.route}`, 'Missing/non-labelable targets:');
        reportLines.push(...r.missingTargets.map(v => `- ${v}`));
      }
      if (r.hiddenTargets.length) {
        reportLines.push('', `### ${r.route}`, 'Targets are hidden inputs:');
        reportLines.push(...r.hiddenTargets.map(v => `- ${v}`));
      }
    }
  }

  await mkdir('dev/reports', { recursive: true });
  await writeFile(reportPath, reportLines.join('\n'), 'utf8');

  // eslint-disable-next-line no-console
  console.log('\nSummary:');
  for (const r of results) {
    // eslint-disable-next-line no-console
    console.log(
      `- ${r.route} [${r.status}] labels=${r.labelsTotal} unique=${r.labelsUnique} missing=${r.missingTargets.length} hidden=${r.hiddenTargets.length}`
    );
  }

  // eslint-disable-next-line no-console
  console.log(`\nWrote report: ${reportPath}`);
}

main().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
