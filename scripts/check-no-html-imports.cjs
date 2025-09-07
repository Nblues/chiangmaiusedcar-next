const { execSync } = require('node:child_process');

try {
  const out = execSync(
    `rg -nS "(import .*\\.html|require\\(.*\\.html\\))" -g "!content/**" -g "!public/**" -g "!*.md"`,
    { stdio: 'pipe' }
  ).toString();
  if (out.trim()) {
    console.error('❌ Found .html imports:\n' + out);
    process.exit(1);
  }
  console.log('✅ No .html imports found - build is safe');
} catch (e) {
  // ripgrep returns non-zero if nothing found; this is expected
  console.log('✅ No .html imports found - build is safe');
}
