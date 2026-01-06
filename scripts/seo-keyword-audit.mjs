import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import vm from 'node:vm';

const DEFAULT_BASE_URL = 'http://localhost:3000';

function normalizeWhitespace(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .replace(/\u00A0/g, ' ')
    .trim();
}

function stripTags(html) {
  if (!html) return '';
  return normalizeWhitespace(
    String(html)
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  );
}

function decodeHtmlEntities(text) {
  const input = String(text || '');
  const replaced = input
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');

  return replaced.replace(/&#(\d+);/g, (_, num) => {
    const code = Number(num);
    if (!Number.isFinite(code)) return _;
    try {
      return String.fromCodePoint(code);
    } catch {
      return _;
    }
  });
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? normalizeWhitespace(decodeHtmlEntities(stripTags(match[1]))) : '';
}

function extractMetaDescription(html) {
  // Match meta tag where name="description" and capture content (order can vary)
  const metas = html.match(/<meta\s+[^>]*>/gi) || [];
  for (const meta of metas) {
    const nameMatch = meta.match(/name\s*=\s*["']description["']/i);
    if (!nameMatch) continue;
    const contentMatch = meta.match(/content\s*=\s*["']([^"']*)["']/i);
    if (contentMatch) return normalizeWhitespace(decodeHtmlEntities(contentMatch[1]));
  }
  return '';
}

function extractHeadings(html) {
  const headings = [];
  const re = /<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;
  while ((match = re.exec(html))) {
    headings.push({
      level: match[1].toLowerCase(),
      text: normalizeWhitespace(decodeHtmlEntities(stripTags(match[2]))),
    });
  }
  return headings;
}

function countOccurrences(haystack, needle) {
  const h = String(haystack || '').toLowerCase();
  const n = String(needle || '')
    .toLowerCase()
    .trim();
  if (!n) return 0;
  let idx = 0;
  let count = 0;
  while (true) {
    idx = h.indexOf(n, idx);
    if (idx === -1) break;
    count += 1;
    idx += n.length;
  }
  return count;
}

function hasConsecutiveRepeat(text, phrase) {
  const p = String(phrase || '').trim();
  if (!p) return false;
  const escaped = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(${escaped})\\s+\\1`, 'i');
  return re.test(text);
}

function scoreKeywordUsage({ title, description, headingsText, bodyText, primary, secondary }) {
  const issues = [];
  const observations = [];

  const titlePrimary = countOccurrences(title, primary);
  const descPrimary = countOccurrences(description, primary);

  if (primary) {
    if (titlePrimary === 0) issues.push('Title ไม่มีคีย์เวิร์ดหลัก');
    if (titlePrimary > 2) issues.push('Title มีคีย์เวิร์ดหลักซ้ำมากเกิน (เสี่ยงดูยัดคำ)');
    if (descPrimary === 0) issues.push('Description ไม่มีคีย์เวิร์ดหลัก');
    if (descPrimary > 3) issues.push('Description มีคีย์เวิร์ดหลักซ้ำมากเกิน (เสี่ยงดูยัดคำ)');

    if (hasConsecutiveRepeat(bodyText, primary) || hasConsecutiveRepeat(headingsText, primary)) {
      issues.push('พบการซ้ำคีย์เวิร์ดหลักติดกัน (ลักษณะ keyword stuffing)');
    }

    const primaryInHeadings = countOccurrences(headingsText, primary);
    observations.push(
      `คีย์หลักใน Title: ${titlePrimary} ครั้ง, Description: ${descPrimary} ครั้ง, Headings: ${primaryInHeadings} ครั้ง`
    );
  }

  const secondaryList = Array.isArray(secondary) ? secondary : [];
  const secondaryCounts = secondaryList
    .map(k => ({
      keyword: k,
      inH: countOccurrences(headingsText, k),
      inBody: countOccurrences(bodyText, k),
    }))
    .filter(x => x.keyword);

  const secondaryInH2H3Total = secondaryCounts.reduce((sum, x) => sum + x.inH, 0);
  if (secondaryList.length > 0 && secondaryInH2H3Total === 0) {
    issues.push('ไม่พบคีย์รองในหัวข้อ (H2/H3) — แนะนำกระจายคีย์รองในหัวข้อย่อยแบบธรรมชาติ');
  }

  const stuffedSecondary = secondaryCounts.filter(x => x.inBody >= 8);
  if (stuffedSecondary.length > 0) {
    issues.push(
      `คีย์รองซ้ำในเนื้อหาเยอะผิดปกติ: ${stuffedSecondary.map(x => `${x.keyword}(${x.inBody})`).join(', ')}`
    );
  }

  const topSecondaryInHeadings = secondaryCounts
    .filter(x => x.inH > 0)
    .sort((a, b) => b.inH - a.inH)
    .slice(0, 5);

  if (topSecondaryInHeadings.length > 0) {
    observations.push(
      `คีย์รองใน Headings: ${topSecondaryInHeadings.map(x => `${x.keyword}(${x.inH})`).join(', ')}`
    );
  }

  return { issues, observations, secondaryCounts };
}

function auditHeadingsStructure(headings) {
  const issues = [];
  const h1s = headings.filter(h => h.level === 'h1');
  if (h1s.length === 0) issues.push('ไม่มี H1');
  if (h1s.length > 1) issues.push('มี H1 มากกว่า 1 อัน');

  // Check jumps: e.g., H2 -> H4 without H3
  const levels = headings.map(h => Number(h.level.slice(1)));
  for (let i = 1; i < levels.length; i++) {
    const prev = levels[i - 1];
    const curr = levels[i];
    if (curr - prev >= 2) {
      issues.push(`ลำดับหัวข้อกระโดดจาก H${prev} ไป H${curr}`);
      break;
    }
  }

  return { issues, h1Text: h1s.map(x => x.text).join(' | ') };
}

function routeFromPageFile(pagesRoot, filePath) {
  const rel = path.relative(pagesRoot, filePath).replace(/\\/g, '/');
  if (rel.startsWith('api/')) return null;
  if (rel.startsWith('_')) return null;
  if (rel === '404.jsx' || rel === '404.js' || rel === '500.jsx' || rel === '500.js') return null;

  const ext = path.extname(rel);
  const base = rel.slice(0, -ext.length);

  // dynamic routes: skip (need sample values)
  if (base.includes('[')) return null;

  if (base === 'index') return '/';
  return (
    '/' +
    base
      .replace(/\/index$/i, '')
      .replace(/\/index$/i, '')
      .replace(/\//g, '/')
  );
}

function walkPages(pagesDir) {
  const results = [];
  const stack = [pagesDir];
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'api') continue;
        stack.push(full);
        continue;
      }
      if (!/\.(js|jsx|ts|tsx)$/.test(entry.name)) continue;
      results.push(full);
    }
  }
  return results;
}

function mapConfigForRoute(seoMap) {
  const routeToKey = {
    '/': 'home',
    '/all-cars': 'allCars',
    '/contact': 'contact',
    '/credit-check': 'creditCheck',
    '/sell-car': 'sellCar',
    '/about': 'about',
    '/promotion': 'promotion',
    '/payment-calculator': 'paymentCalculator',
  };

  return route => {
    const key = routeToKey[route];
    if (!key) return null;
    return { key, config: seoMap[key] || null };
  };
}

async function fetchHtml(baseUrl, route) {
  const url = new URL(route, baseUrl);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'seo-keyword-audit/1.0',
      Accept: 'text/html',
    },
  });
  const text = await res.text();
  return { status: res.status, url: url.toString(), html: text };
}

function buildReportHeader({ baseUrl, auditedRoutesCount, skippedRoutes }) {
  return (
    `# รายงานตรวจสอบ SEO Keywords + Headings\n\n` +
    `- วันที่: ${new Date().toLocaleString('th-TH')}\n` +
    `- Base URL: ${baseUrl}\n` +
    `- ตรวจสอบทั้งหมด: ${auditedRoutesCount} หน้า\n` +
    `- ข้าม (dynamic/ไม่รองรับ): ${skippedRoutes.length} หน้า\n\n`
  );
}

function formatPageSection(page) {
  const lines = [];
  lines.push(`## ${page.route}`);
  lines.push(`- URL: ${page.url}`);
  lines.push(`- HTTP: ${page.status}`);
  if (page.configKey) lines.push(`- seo-keyword-map: ${page.configKey}`);

  lines.push(`- Title: ${page.title || '(ไม่พบ)'}`);
  lines.push(`- Description: ${page.description || '(ไม่พบ)'}`);

  if (page.headingIssues.length > 0) {
    lines.push(`- Headings: ❌ ${page.headingIssues.join(' | ')}`);
  } else {
    lines.push(`- Headings: ✅ โครงสร้าง OK (H1=${page.h1Count})`);
  }

  if (page.keywordIssues.length > 0) {
    lines.push(`- Keywords: ❌ ${page.keywordIssues.join(' | ')}`);
  } else if (page.configKey) {
    lines.push(`- Keywords: ✅ ผ่านเกณฑ์พื้นฐาน (ไม่พบสัญญาณยัดคำ)`);
  } else {
    lines.push(`- Keywords: ℹ️ ไม่มี config ใน seo-keyword-map (ตรวจเฉพาะโครง H-tag/Meta)`);
  }

  for (const obs of page.keywordObservations) {
    lines.push(`- ${obs}`);
  }

  // Quick heading list
  if (page.headings.length > 0) {
    const sample = page.headings
      .slice(0, 12)
      .map(h => `${h.level.toUpperCase()}: ${h.text}`)
      .join(' / ');
    lines.push(`- หัวข้อ (ตัวอย่าง): ${sample}${page.headings.length > 12 ? ' …' : ''}`);
  }

  lines.push('');
  return lines.join('\n');
}

async function main() {
  const workspaceRoot = process.cwd();
  const pagesDir = path.join(workspaceRoot, 'pages');
  const baseUrl = process.env.BASE_URL || DEFAULT_BASE_URL;

  const seoMap = loadSeoKeywordMap(path.join(workspaceRoot, 'config', 'seo-keyword-map.js'));

  const files = walkPages(pagesDir);
  const routes = [];
  const skippedRoutes = [];
  for (const file of files) {
    const route = routeFromPageFile(pagesDir, file);
    if (!route) {
      skippedRoutes.push(path.relative(workspaceRoot, file));
      continue;
    }
    routes.push(route);
  }

  // Ensure unique and stable order
  const uniqueRoutes = Array.from(new Set(routes)).sort((a, b) =>
    a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)
  );

  const configResolver = mapConfigForRoute(seoMap);

  const results = [];
  for (const route of uniqueRoutes) {
    let fetched;
    try {
      fetched = await fetchHtml(baseUrl, route);
    } catch (e) {
      results.push({
        route,
        url: new URL(route, baseUrl).toString(),
        status: 'FETCH_ERROR',
        title: '',
        description: '',
        headings: [],
        h1Count: 0,
        headingIssues: [`ดึงหน้าไม่สำเร็จ: ${e.message}`],
        configKey: null,
        keywordIssues: [],
        keywordObservations: [],
      });
      continue;
    }

    const { key: configKey, config } = configResolver(route) || {};

    const title = extractTitle(fetched.html);
    const description = extractMetaDescription(fetched.html);
    const headings = extractHeadings(fetched.html).filter(h => h.text);
    const headingsText = headings.map(h => h.text).join(' ');

    const headingAudit = auditHeadingsStructure(headings);

    // Body text: strip tags from body (approx)
    const bodyText = normalizeWhitespace(decodeHtmlEntities(stripTags(fetched.html)));

    const primary = config?.primary || '';
    const secondary = config?.secondary || [];

    const keywordAudit = configKey
      ? scoreKeywordUsage({
          title,
          description,
          headingsText,
          bodyText,
          primary,
          secondary,
        })
      : { issues: [], observations: [] };

    results.push({
      route,
      url: fetched.url,
      status: fetched.status,
      title,
      description,
      headings,
      h1Count: headings.filter(h => h.level === 'h1').length,
      headingIssues: headingAudit.issues,
      configKey: configKey || null,
      keywordIssues: keywordAudit.issues,
      keywordObservations: keywordAudit.observations,
    });
  }

  const reportParts = [];
  reportParts.push(
    buildReportHeader({
      baseUrl,
      auditedRoutesCount: results.length,
      skippedRoutes,
    })
  );

  // Summary
  const failed = results.filter(r => r.headingIssues.length > 0 || r.keywordIssues.length > 0);
  reportParts.push('## สรุปภาพรวม\n');
  reportParts.push(`- ผ่านทั้งหมด: ${results.length - failed.length} หน้า`);
  reportParts.push(`- มีข้อแนะนำ/ปัญหา: ${failed.length} หน้า\n`);

  if (failed.length > 0) {
    reportParts.push('### หน้าที่ควรแก้ก่อน (เรียงตามความสำคัญ)');
    for (const r of failed.slice(0, 20)) {
      const reasons = [...r.headingIssues, ...r.keywordIssues].slice(0, 3).join(' | ');
      reportParts.push(`- ${r.route}: ${reasons}`);
    }
    reportParts.push('');
  }

  for (const page of results) {
    reportParts.push(formatPageSection(page));
  }

  // Skipped
  if (skippedRoutes.length > 0) {
    reportParts.push('## ข้าม (dynamic/ไม่รองรับ)');
    reportParts.push(
      'ไฟล์เหล่านี้เป็น dynamic route หรือ special files จึงไม่สามารถตรวจแบบ route จริงได้โดยไม่รู้ค่าพารามิเตอร์:'
    );
    for (const s of skippedRoutes.slice(0, 200)) {
      reportParts.push(`- ${s}`);
    }
    reportParts.push('');
  }

  const outDir = path.join(workspaceRoot, 'dev', 'reports');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'seo-keyword-audit.md');
  fs.writeFileSync(outPath, reportParts.join('\n'), 'utf8');

  console.log(`Wrote report: ${outPath}`);
  console.log(`Audited: ${results.length} routes`);
}

function loadSeoKeywordMap(filePath) {
  let code;
  try {
    code = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    console.error(`Failed to read ${filePath}:`, e);
    process.exitCode = 1;
    return {};
  }

  // Convert ESM exports to plain declarations so Node (CJS) can evaluate.
  const transformed = code
    .replace(/\r\n/g, '\n')
    .replace(/^\s*export\s+const\s+/gm, 'const ')
    .replace(/^\s*export\s+function\s+/gm, 'function ')
    .replace(/^\s*export\s+default\s+/gm, '')
    .replace(/^\s*export\s+\{[^}]*\};?\s*$/gm, '');

  const sandbox = {
    console,
    process: { env: {} },
    SEO_KEYWORD_MAP: undefined,
  };

  try {
    vm.createContext(sandbox);
    vm.runInContext(`${transformed}\n;globalThis.__SEO_KEYWORD_MAP__ = SEO_KEYWORD_MAP;`, sandbox, {
      filename: filePath,
      timeout: 1000,
    });
  } catch (e) {
    console.error('Failed to evaluate config/seo-keyword-map.js:', e);
    process.exitCode = 1;
    return {};
  }

  return sandbox.__SEO_KEYWORD_MAP__ || sandbox.globalThis?.__SEO_KEYWORD_MAP__ || {};
}

await main();
