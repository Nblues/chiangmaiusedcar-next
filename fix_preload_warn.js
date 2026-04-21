const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'pages');

function processFiles(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processFiles(fullPath);
    } else if (stat.isFile() && (fullPath.endsWith('.jsx') || fullPath.endsWith('.tsx'))) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      let modified = false;

      // Regex to find <link rel="preload" ... /> for images
      // It handles multiline tags
      const preloadRegex = /<link\s+rel="preload"\s+as="image"\s+href="\/herobanner\/[^>]*\/>/g;
      
      if (preloadRegex.test(content)) {
        content = content.replace(preloadRegex, '');
        modified = true;
      }
      
      // Some tags might be formatted differently or we can just nuke ANY <link rel="preload" that points to /herobanner
      const preloadRegex2 = /<link[^>]*rel="preload"[^>]*href="\/herobanner\/[^>]*\/>/g;
      if (preloadRegex2.test(content)) {
        content = content.replace(preloadRegex2, '');
        modified = true;
      }

      // Fix `w-full h-full` missing `relative` wrapping A11yImage with fill
      if (fullPath.includes('about.jsx')) {
        const targetDiv = '<div className="w-full h-full">';
        if (content.includes(targetDiv)) {
           // check if A11yImage follows
           content = content.replace(/<div className="w-full h-full">(\s*\{[^}]*\}\s*)<A11yImage/s, '<div className="relative w-full h-full">$1<A11yImage');
           modified = true;
        }
      }

      if (modified) {
        // also clean up empty <Head> if any left over whitespace
        content = content.replace(/<Head>\s*<\/Head>/g, '');
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processFiles(pagesDir);
console.log('Done!');
