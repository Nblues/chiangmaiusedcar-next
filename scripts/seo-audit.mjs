import fs from 'node:fs';
import path from 'node:path';

const workspaceRoot = process.cwd();
const PAGES_DIR = path.join(workspaceRoot, '.next', 'server', 'pages');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function countMatches(haystack, regex) {
  const m = haystack.match(regex);
  return m ? m.length : 0;
}

function getHead(html) {
  const start = html.indexOf('<head>');
  const end = html.indexOf('</head>');
  if (start === -1 || end === -1 || end <= start) return '';
  return html.slice(start + '<head>'.length, end);
}

function extractCanonical(head) {
  const m = head.match(/<link[^>]+rel="canonical"[^>]*>/i);
  if (!m) return null;
  const href = m[0].match(/href="([^"]+)"/i);
  return href ? href[1] : null;
}

function extractOgUrl(head) {
  const m = head.match(/<meta[^>]+property="og:url"[^>]*>/i);
  if (!m) return null;
  const content = m[0].match(/content="([^"]+)"/i);
  return content ? content[1] : null;
}

function extractHtmlLang(html) {
  const m = html.match(/<html[^>]+lang="([^"]+)"/i);
  return m ? m[1] : null;
}

function expectedLocaleFromPath(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  if (normalized.startsWith('en/')) return 'en';
  if (normalized.startsWith('th/')) return 'th';
  return null;
}

function expectedCanonicalPrefix(locale) {
  if (locale === 'en') return 'https://www.chiangmaiusedcar.com/en';
  if (locale === 'th') return 'https://www.chiangmaiusedcar.com';
  return 'https://www.chiangmaiusedcar.com';
}

function shouldHaveEnPrefix(locale, canonical) {
  if (!canonical) return false;
  const isEnCanonical = canonical.startsWith('https://www.chiangmaiusedcar.com/en');
  return locale === 'en' ? isEnCanonical : !isEnCanonical;
}

function isHtmlLangOk(locale, htmlLang) {
  if (!locale || !htmlLang) return true;
  if (locale === 'en') return htmlLang === 'en';
  if (locale === 'th') return htmlLang === 'th';
  return true;
}

function main() {
  if (!fs.existsSync(PAGES_DIR)) {
    console.error(`Missing ${PAGES_DIR}. Run next build first.`);
    process.exit(1);
  }

  const allFiles = walk(PAGES_DIR)
    .filter(f => f.endsWith('.html'))
    // Skip _document output etc.
    .filter(f => !f.endsWith('/_document.html'));

  const issues = [];

  for (const filePath of allFiles) {
    const rel = path.relative(PAGES_DIR, filePath);
    const html = fs.readFileSync(filePath, 'utf8');
    const head = getHead(html);

    const canonicalCount = countMatches(head, /rel="canonical"/gi);
    const alternateCount = countMatches(head, /rel="alternate"/gi);
    const htmlLang = extractHtmlLang(html);

    const canonical = extractCanonical(head);
    const ogUrl = extractOgUrl(head);

    const locale = expectedLocaleFromPath(rel);

    const fileIssues = [];

    if (canonicalCount !== 1) {
      fileIssues.push(`canonicalCount=${canonicalCount}`);
    }

    if (canonical && ogUrl && canonical !== ogUrl) {
      fileIssues.push(`og:url!=canonical`);
    }

    if (!isHtmlLangOk(locale, htmlLang)) {
      fileIssues.push(`htmlLang=${htmlLang} expected=${locale}`);
    }

    if (locale && canonical && !shouldHaveEnPrefix(locale, canonical)) {
      fileIssues.push(`canonicalLocaleMismatch=${canonical}`);
    }

    // Sanity: alternates should exist on localized content pages.
    if (alternateCount === 0) {
      // allow some internal pages (e.g., /_error) to skip
      if (!rel.startsWith('_') && !rel.endsWith('404.html') && !rel.endsWith('500.html')) {
        fileIssues.push('missingAlternates');
      }
    }

    // Check for old non-www domain leak
    if (head.includes('https://chiangmaiusedcar.com')) {
      fileIssues.push('nonWwwDomainInHead');
    }

    if (fileIssues.length) {
      issues.push({ rel, canonical, htmlLang, issues: fileIssues });
    }
  }

  // Keep output small to avoid VS Code stress.
  if (issues.length === 0) {
    console.log('SEO audit: OK (no issues found)');
    return;
  }

  console.log(`SEO audit: found ${issues.length} files with issues`);

  // Print up to 30 issues max
  const max = 30;
  for (const item of issues.slice(0, max)) {
    console.log(
      `- ${item.rel}: ${item.issues.join(', ')}${item.canonical ? ` | canonical=${item.canonical}` : ''}`
    );
  }

  if (issues.length > max) {
    console.log(`...and ${issues.length - max} more`);
  }

  process.exitCode = 2;
}

main();
