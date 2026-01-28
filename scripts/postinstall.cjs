#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function isTruthy(value) {
  return value === '1' || value === 'true' || value === 'TRUE';
}

function main() {
  const isCI = Boolean(process.env.CI) || isTruthy(process.env.CI);
  const isVercel = Boolean(process.env.VERCEL) || isTruthy(process.env.VERCEL);

  // Generate responsive hero variants (no network writes; safe everywhere).
  try {
    const generateScript = path.join(__dirname, 'generate-hero-variants.cjs');
    const result = spawnSync(process.execPath, [generateScript], { stdio: 'inherit' });

    if (typeof result.status === 'number' && result.status !== 0) {
      // eslint-disable-next-line no-console
      console.warn(`[postinstall] generate-hero-variants exited with code ${result.status} (ignored)`);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[postinstall] generate-hero-variants failed (ignored):', err);
  }

  // Never do network writes during CI/Vercel builds.
  if (isCI || isVercel) {
    // eslint-disable-next-line no-console
    console.log('[postinstall] Skipping resolve:map in CI/Vercel');
    return;
  }

  const configFile = path.join(process.cwd(), 'config', 'site-location.json');
  if (fs.existsSync(configFile)) {
    // eslint-disable-next-line no-console
    console.log('[postinstall] config/site-location.json exists; skipping resolve:map');
    return;
  }

  const pnpmCmd = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
  const result = spawnSync(pnpmCmd, ['run', 'resolve:map'], { stdio: 'inherit' });

  if (typeof result.status === 'number' && result.status !== 0) {
    // eslint-disable-next-line no-console
    console.warn(`[postinstall] resolve:map exited with code ${result.status} (ignored)`);
  }
}

main();
