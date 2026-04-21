const fs = require('fs');
const path = require('path');

function scanDir(dir) {
  try {
    fs.readdirSync(dir).forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        scanDir(filePath);
      } else if (filePath.match(/\.m?jsx?$/)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.match(/from\s+['"].*?(_document)['"]/i)) {
          console.log('Found full _document match in:', filePath);
        }
        if (content.includes('next/document')) {
          console.log('Found next/document in:', filePath);
        }
      }
    });
  } catch(e) {}
}

scanDir('pages');
scanDir('components');
scanDir('app');
scanDir('lib');
scanDir('utils');
