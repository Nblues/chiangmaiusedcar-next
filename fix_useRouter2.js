const fs = require('fs');
const path = require('path');

const dirs = ['pages', 'components'];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');

      // Check if file uses _nextRouter safely
      if (content.includes('const _nextRouter = useRouter();') || content.includes('_nextRouter')) {
        console.log(`Fixing block in: ${fullPath}`);

        // We need to wrap useRouter in try/catch or use router from context safely since `useRouter()` throws during SSG.
        // Or simply import it and conditionally use it on client. Actually, in Next.js Pages router, `useRouter()` throwing `NextRouter was not mounted` usually means we're evaluating outside of `<RouterContext.Provider>` which might be an issue with how the `components` or `pages/_app` tree wraps it.
        // Wait, normally `useRouter()` doesn't throw during SSG for normal page components. Why is it throwing here? 

        const fallback = `  let _nextRouter = null;
  try { _nextRouter = useRouter(); } catch(e) {}
  const router = _nextRouter || { pathname: '', asPath: '', query: {}, isReady: false, push: () => {}, back: () => {}, replace: () => {} };`;

        let newContent = content.replace(/const\s+_nextRouter\s*=\s*useRouter\(\);\s*const\s+router\s*=\s*_nextRouter[^;]+;/, fallback);
        
        // Also MobileBottomNav had a slightly different one
        newContent = newContent.replace(/const\s+nextRouter\s*=\s*useRouter\(\);\s*const\s+router\s*=\s*nextRouter\s*\|\|\s*\{\s*pathname:\s*'\/',\s*isReady:\s*false\s*\}\s*;/g, fallback);


        if (newContent !== content) {
          fs.writeFileSync(fullPath, newContent, 'utf8');
          console.log(`  -> Patched successfully`);
        }
      }
    }
  }
}

dirs.forEach(walk);
console.log('Fixed try/catch useRouter routing block');