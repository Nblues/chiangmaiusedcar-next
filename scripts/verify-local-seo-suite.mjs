import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

function slugifyForFilename(input) {
  return String(input)
    .replace(/^https?:\/\//i, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function runVerifier(url) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [path.join('scripts', 'verify-production-seo.mjs'), '--page', url],
      { stdio: ['ignore', 'pipe', 'pipe'] }
    );

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', chunk => {
      stdout += chunk.toString('utf8');
    });
    child.stderr.on('data', chunk => {
      stderr += chunk.toString('utf8');
    });

    child.on('error', err => reject(err));
    child.on('close', code => {
      resolve({ code: Number(code || 0), stdout, stderr });
    });
  });
}

function parseJsonLines(text) {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  const parsed = [];
  const parseErrors = [];

  for (const line of lines) {
    try {
      parsed.push(JSON.parse(line));
    } catch (err) {
      parseErrors.push({ line, error: String(err?.message || err) });
    }
  }

  return { lines, parsed, parseErrors };
}

function pickLastResultObject(objs) {
  for (let i = objs.length - 1; i >= 0; i -= 1) {
    const o = objs[i];
    if (o && typeof o === 'object' && 'result' in o) return o;
  }
  return null;
}

function pickLastObjectWithKey(objs, key) {
  for (let i = objs.length - 1; i >= 0; i -= 1) {
    const o = objs[i];
    if (o && typeof o === 'object' && key in o) return o;
  }
  return null;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function toMdTable(rows) {
  const header = ['Page', 'URL', 'Result', 'Status', 'og:image', 'JSON-LD errors'];
  const sep = header.map(() => '---');

  const escape = s => String(s ?? '').replace(/\|/g, '\\|');

  const lines = [];
  lines.push(`| ${header.map(escape).join(' | ')} |`);
  lines.push(`| ${sep.join(' | ')} |`);

  for (const r of rows) {
    lines.push(
      `| ${escape(r.page)} | ${escape(r.url)} | ${escape(r.result)} | ${escape(r.pageStatus)} | ${escape(
        r.ogImage
      )} | ${escape(r.jsonLdParseErrors)} |`
    );
  }

  return `${lines.join('\n')}\n`;
}

const DEFAULT_BASE = process.env.LOCAL_SEO_BASE_URL || 'http://localhost:3010';
const base = DEFAULT_BASE.replace(/\/$/, '');

async function detectSampleCarUrl(baseUrl) {
  try {
    const res = await fetch(`${baseUrl}/all-cars`, {
      redirect: 'follow',
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    const html = await res.text();

    // Find first link that looks like a car detail route.
    const m = html.match(/href=["'](\/car\/[^"'#?]+)["']/i);
    if (!m || !m[1]) return null;
    const pathPart = String(m[1]).trim();
    if (!pathPart.startsWith('/car/')) return null;
    return `${baseUrl}${pathPart}`;
  } catch {
    return null;
  }
}

const fallbackCarSampleUrl = `${base}/car/honda-city-v-abs-auto-%E0%B8%9B%E0%B8%B5-2554`;
const carSampleUrl = (await detectSampleCarUrl(base)) || fallbackCarSampleUrl;

const pages = [
  { page: 'home', url: `${base}/` },
  { page: 'all-cars', url: `${base}/all-cars` },
  { page: 'all-cars?page=2', url: `${base}/all-cars?page=2` },
  { page: 'used-cars-chiang-mai', url: `${base}/used-cars-chiang-mai` },
  { page: 'brand-toyota', url: `${base}/used-cars-chiang-mai-brand/toyota` },
  // Sample car page from current inventory (auto-detected from /all-cars)
  { page: 'car-sample', url: carSampleUrl },
];

const logsDir = path.join('logs');
await fs.mkdir(logsDir, { recursive: true });

const results = [];
let allOk = true;

for (const entry of pages) {
  // eslint-disable-next-line no-console
  console.log(`\n=== Verify: ${entry.page} ===`);
  // eslint-disable-next-line no-console
  console.log(entry.url);

  const maxAttempts = 2;
  let attempt = 0;
  let run;
  let durationMs = 0;
  let summary = {};

  while (attempt < maxAttempts) {
    attempt += 1;
    const startedAt = Date.now();
    // eslint-disable-next-line no-await-in-loop
    run = await runVerifier(entry.url);
    durationMs = Date.now() - startedAt;

    const combined = [run.stdout, run.stderr].filter(Boolean).join('\n');
    const { parsed } = parseJsonLines(combined);
    summary = pickLastResultObject(parsed) || {};

    const ogLine = pickLastObjectWithKey(parsed, 'ogImage') || {};
    const pageLine = pickLastObjectWithKey(parsed, 'pageStatus') || {};
    const jsonLdLine = pickLastObjectWithKey(parsed, 'jsonLdParseErrors') || {};

    summary.__suite = {
      ogImage: typeof ogLine.ogImage === 'string' ? ogLine.ogImage : null,
      pageStatus: pageLine.pageStatus,
      jsonLdParseErrors: jsonLdLine.jsonLdParseErrors,
    };

    const looksOk =
      (summary?.result === 'PASS' || run.code === 0) &&
      summary?.ogImageOk !== false &&
      summary?.meetsPageSchemaExpectations !== false;

    if (looksOk) break;

    if (attempt < maxAttempts) {
      // eslint-disable-next-line no-console
      console.log(`Retrying (${attempt}/${maxAttempts}) after transient FAIL...`);
      // eslint-disable-next-line no-await-in-loop
      await sleep(750);
    }
  }

  const logName = `local-suite-${slugifyForFilename(entry.page)}.jsonl`;
  const logPath = path.join(logsDir, logName);
  await fs.writeFile(logPath, run.stdout || '', 'utf8');

  const row = {
    page: entry.page,
    url: entry.url,
    durationMs,
    exitCode: run.code,
    result: summary.result || (run.code === 0 ? 'PASS' : 'FAIL'),
    pageStatus: summary?.__suite?.pageStatus ?? '',
    ogImage: summary?.__suite?.ogImage ?? '',
    jsonLdParseErrors: summary?.__suite?.jsonLdParseErrors ?? '',
    ogImageOk: summary.ogImageOk ?? false,
    meetsPageSchemaExpectations: summary.meetsPageSchemaExpectations ?? false,
    hasSomeSchema: summary.hasSomeSchema ?? false,
    isCarPage: summary.isCarPage ?? false,
  };

  const ok =
    row.result === 'PASS' &&
    row.ogImageOk === true &&
    row.meetsPageSchemaExpectations === true &&
    Number(row.jsonLdParseErrors || 0) === 0;

  if (!ok) allOk = false;

  results.push(row);

  // eslint-disable-next-line no-console
  console.log({
    result: row.result,
    pageStatus: row.pageStatus,
    ogImageOk: row.ogImageOk,
    meetsPageSchemaExpectations: row.meetsPageSchemaExpectations,
    jsonLdParseErrors: row.jsonLdParseErrors,
    durationMs,
    log: logPath,
  });
}

const reportPath = path.join(logsDir, 'local-seo-suite-report.md');
const now = new Date().toISOString();

const md = [
  `# Local SEO verification report`,
  ``,
  `- Generated: ${now}`,
  `- Base URL: ${base}`,
  `- Result: ${allOk ? 'PASS' : 'FAIL'}`,
  ``,
  toMdTable(
    results.map(r => ({
      page: r.page,
      url: r.url,
      result: r.result,
      pageStatus: r.pageStatus,
      ogImage: r.ogImage,
      jsonLdParseErrors: r.jsonLdParseErrors,
    }))
  ),
  `## Notes`,
  `- Per-page raw logs: files matching \`logs/local-suite-*.jsonl\``,
  `- This suite expects OG tags + JSON-LD to be present in SSR HTML`,
  ``,
].join('\n');

await fs.writeFile(reportPath, md, 'utf8');

// eslint-disable-next-line no-console
console.log(`\nReport: ${reportPath}`);

if (!allOk) {
  process.exitCode = 1;
}
