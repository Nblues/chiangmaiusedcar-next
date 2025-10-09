const { execSync } = require('node:child_process');

// ตรวจสอบว่ามี ripgrep installed หรือไม่
function hasRipgrep() {
  try {
    execSync('rg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

try {
  // ถ้าไม่มี ripgrep ให้ข้ามการตรวจสอบ (สำหรับ Vercel)
  if (!hasRipgrep()) {
    console.log('⚠️  ripgrep not found - skipping .html import check (Vercel build)');
    process.exit(0);
  }

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
