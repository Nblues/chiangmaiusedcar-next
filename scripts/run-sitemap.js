/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

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

function runNode(repoRoot, scriptPath, args = [], { heartbeatLabel } = {}) {
  return new Promise(resolve => {
    const child = spawn(process.execPath, [scriptPath, ...args], {
      cwd: repoRoot,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
      env: process.env,
    });

    let heartbeatTimer = null;
    if (heartbeatLabel) {
      heartbeatTimer = setInterval(() => {
        try {
          process.stdout.write(`Sitemap: still running (${heartbeatLabel})...\n`);
        } catch {
          // ignore
        }
      }, 15000);
    }

    const onStdout = chunk => {
      try {
        process.stdout.write(sanitizeOutput(chunk.toString('utf8')));
      } catch {
        // ignore
      }
    };
    const onStderr = chunk => {
      try {
        process.stderr.write(sanitizeOutput(chunk.toString('utf8')));
      } catch {
        // ignore
      }
    };

    child.stdout.on('data', onStdout);
    child.stderr.on('data', onStderr);

    child.on('close', code => {
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      resolve({ status: typeof code === 'number' ? code : 1 });
    });
  });
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
  return runNode(repoRoot, nextSitemapBin, [], { heartbeatLabel: 'next-sitemap' }).then(
    sitemapResult => {

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

      const runImages = () => {
        if (!fs.existsSync(imageSitemapScript)) return Promise.resolve(null);

        process.stdout.write('Sitemap: generating sitemap-images.xml...\n');
        return runNode(repoRoot, imageSitemapScript, [], { heartbeatLabel: 'image-sitemap' }).then(
          imageResult => {
            if (
              typeof imageResult.status === 'number' &&
              imageResult.status !== 0 &&
              fileNonEmpty(sitemapImages)
            ) {
              process.stdout.write(
                `Sitemap: note: image generator exit status was ${imageResult.status}, using generated file\n`
              );
            }
            return imageResult;
          }
        );
      };

      return runImages().then(() => {
        process.exitCode = 0;
      });
    }
  );
}

main();
