/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function sanitizeOutput(text) {
  if (!text) return '';
  return (
    String(text)
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Strip most non-ASCII to avoid Windows console crashes from Unicode/emoji.
      .replace(/[\u0080-\uFFFF]/g, '')
  );
}

function fileNonEmpty(filePath) {
  try {
    return (
      fs.existsSync(filePath) && fs.statSync(filePath).isFile() && fs.statSync(filePath).size > 50
    );
  } catch {
    return false;
  }
}

function runNode(repoRoot, scriptPath, args = []) {
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: repoRoot,
    stdio: 'pipe',
    windowsHide: true,
    env: process.env,
  });

  if (result.stdout && result.stdout.length) {
    process.stdout.write(sanitizeOutput(result.stdout.toString('utf8')));
  }
  if (result.stderr && result.stderr.length) {
    process.stderr.write(sanitizeOutput(result.stderr.toString('utf8')));
  }

  return result;
}

function main() {
  const repoRoot = process.cwd();

  const nextSitemapBin = path.join(
    repoRoot,
    'node_modules',
    'next-sitemap',
    'bin',
    'next-sitemap.mjs'
  );
  const imageSitemapScript = path.join(repoRoot, 'scripts', 'generate-image-sitemap.mjs');

  const sitemapIndex = path.join(repoRoot, 'public', 'sitemap.xml');
  const sitemap0 = path.join(repoRoot, 'public', 'sitemap-0.xml');
  const sitemapImages = path.join(repoRoot, 'public', 'sitemap-images.xml');

  if (!fs.existsSync(nextSitemapBin)) {
    process.stderr.write(
      'Sitemap: next-sitemap not installed (missing node_modules/next-sitemap)\n'
    );
    process.exitCode = 1;
    return;
  }

  process.stdout.write('Sitemap: generating sitemap.xml...\n');
  const sitemapResult = runNode(repoRoot, nextSitemapBin);

  const sitemapOk = fileNonEmpty(sitemapIndex) && fileNonEmpty(sitemap0);
  if (!sitemapOk) {
    process.stderr.write(
      'Sitemap: generation failed (missing or empty public/sitemap.xml or public/sitemap-0.xml)\n'
    );
    process.exitCode = typeof sitemapResult.status === 'number' ? sitemapResult.status : 1;
    return;
  }

  if (typeof sitemapResult.status === 'number' && sitemapResult.status !== 0) {
    process.stdout.write(
      `Sitemap: note: underlying exit status was ${sitemapResult.status}, using generated files\n`
    );
  }

  if (fs.existsSync(imageSitemapScript)) {
    process.stdout.write('Sitemap: generating sitemap-images.xml...\n');
    const imageResult = runNode(repoRoot, imageSitemapScript);

    if (
      typeof imageResult.status === 'number' &&
      imageResult.status !== 0 &&
      fileNonEmpty(sitemapImages)
    ) {
      process.stdout.write(
        `Sitemap: note: image generator exit status was ${imageResult.status}, using generated file\n`
      );
    }
  }

  process.exitCode = 0;
}

main();
