/* eslint-disable no-console */

const { spawnSync } = require('node:child_process');
const path = require('node:path');

const args = process.argv.slice(2);

const isWasm = args.includes('--wasm');
const forwardArgs = args.filter((a) => a !== '--wasm');

const isWindows = process.platform === 'win32';

// Force a standard NODE_ENV for Next builds.
process.env.NODE_ENV = 'production';
process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || '8';
process.env.NEXT_TELEMETRY_DISABLED = process.env.NEXT_TELEMETRY_DISABLED || '1';

// This project historically hits hard crashes from the native Next SWC binary on Windows.
// Disable SWC (and the native SWC binary) on win32 to keep local builds stable.
if (isWindows || isWasm) {
  process.env.NEXT_DISABLE_SWC = process.env.NEXT_DISABLE_SWC || '1';
  process.env.NEXT_DISABLE_SWC_BINARY = process.env.NEXT_DISABLE_SWC_BINARY || '1';

  // Reduce parallelism on Windows builds to avoid child-process crashes (jest-worker/static worker).
  // next.config.js will pick this up to set workerThreads/cpus.
  process.env.LOW_MEMORY_BUILD = process.env.LOW_MEMORY_BUILD || 'true';
}

// Keep existing NODE_OPTIONS if already provided by the environment.
process.env.NODE_OPTIONS =
  process.env.NODE_OPTIONS || '--max-old-space-size=10240 --max-semi-space-size=512';

const nextBin = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next');

const result = spawnSync(process.execPath, [nextBin, 'build', ...forwardArgs], {
  stdio: 'inherit',
  env: process.env,
});

process.exit(result.status ?? 1);
