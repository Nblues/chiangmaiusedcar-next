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
        if (content.includes('next/navigation')) {
          console.log('Found next/navigation in:', filePath);
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
