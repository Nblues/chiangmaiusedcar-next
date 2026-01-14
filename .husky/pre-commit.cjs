// Run lint-staged directly with node.
// Rationale: on some Windows setups `pnpm exec`/binary resolution can fail even when
// `pnpm dev/build` works. Calling lint-staged via node is more reliable.
const { execSync } = require('child_process');

try {
  const env = { ...process.env };
  env.NODE_OPTIONS = [env.NODE_OPTIONS, '--max-old-space-size=4096'].filter(Boolean).join(' ');
  env.UV_THREADPOOL_SIZE = env.UV_THREADPOOL_SIZE || '2';

  execSync('node ./node_modules/lint-staged/bin/lint-staged.js --concurrent 1', {
    stdio: 'inherit',
    env,
  });
  process.exit(0);
} catch (error) {
  process.exit(1);
}
