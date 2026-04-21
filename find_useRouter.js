const fs = require('fs');
const path = require('path');
function checkRouter(dir) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      checkRouter(filePath);
    } else if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('next/router')) {
        let lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('useRouter()')) {
            if (/^\S/.test(lines[i]) && !lines[i].startsWith('export ') && !lines[i].startsWith('const') && !lines[i].startsWith('let')) {
               // maybe global?
            }
            if (lines[i].includes('useRouter') && /^\s*const\s+\w+\s*=\s*useRouter\(\)/.test(lines[i])) {
              // check if it's at indent 0
              if (lines[i].startsWith('const') || lines[i].startsWith('let')) {
                 console.log('Top level useRouter in', filePath);
              }
            }
          }
        }
      }
    }
  });
}
checkRouter('pages'); checkRouter('components');