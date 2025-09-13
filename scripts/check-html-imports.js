const fs = require('fs');
const path = require('path');

function searchHtmlImports(dir, results = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules, .next, content, public
      if (!['node_modules', '.next', 'content', 'public', '.git'].includes(file)) {
        searchHtmlImports(fullPath, results);
      }
    } else if (
      file.endsWith('.js') ||
      file.endsWith('.jsx') ||
      file.endsWith('.ts') ||
      file.endsWith('.tsx')
    ) {
      // Skip our own check script
      if (
        fullPath.includes('check-html-imports.js') ||
        fullPath.includes('check-no-html-imports.cjs')
      ) {
        continue;
      }

      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        if (
          (line.includes('import') && line.includes('.html')) ||
          (line.includes('require(') && line.includes('.html'))
        ) {
          results.push(`${fullPath}:${index + 1}: ${line.trim()}`);
        }
      });
    }
  }

  return results;
}

try {
  const results = searchHtmlImports('.');

  if (results.length > 0) {
    console.error('❌ Found .html imports:');
    results.forEach(result => console.error(result));
    process.exit(1);
  } else {
    console.log('✅ No .html imports found - build is safe');
  }
} catch (error) {
  console.log('✅ No .html imports found - build is safe');
}
