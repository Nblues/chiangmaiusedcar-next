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
      
      // Find files that import useRouter and call it
      if (content.includes('next/router') && content.includes('useRouter()') && !content.includes('const dummyRouter =')) {
        console.log(`Processing: ${fullPath}`);
        
        let newContent = content;
        
        // 1. the router instantiation itself
        // from: const router = useRouter(); 
        // to: const _nextRouter = useRouter(); const router = _nextRouter || { pathname: '', asPath: '', query: {}, isReady: false, push: () => {}, back: () => {} };
        const safeRouter = `const _nextRouter = useRouter();
  const router = _nextRouter || { pathname: '', asPath: '', query: {}, isReady: false, push: () => {}, back: () => {} };`;
        
        const originalRouterRegex = /\s*const\s+([a-zA-Z0-9_]+)\s*=\s*useRouter\(\)\s*;/g;
        let match;
        let changed = false;
        
        while ((match = originalRouterRegex.exec(content)) !== null) {
            const varName = match[1];
            if (varName === 'router') {
              const replacement = match[0].replace(/const\s+router\s*=\s*useRouter\(\)\s*;/, safeRouter);
              newContent = newContent.replace(match[0], replacement);
              changed = true;
            }
        }
        
        if (changed) {
          fs.writeFileSync(fullPath, newContent, 'utf8');
          console.log(`  -> Patched ${fullPath}`);
        }
      }
    }
  }
}

dirs.forEach(walk);
console.log('Done padding useRouter');