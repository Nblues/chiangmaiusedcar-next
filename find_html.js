const fs = require('fs');
const path = require('path');

const dirs = ['pages', 'components', 'sections', 'layouts'];
const searchString = '<Html';

function findInDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            findInDir(fullPath);
        } else if (stat.isFile() && /\.(js|jsx|ts|tsx)$/.test(fullPath)) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(searchString) && fullPath !== path.normalize('pages/_document.jsx')) {
                console.log(`Found suspicious <Html> in: ${fullPath}`);
                const lines = content.split('\n');
                lines.forEach((line, index) => {
                    if (line.includes(searchString)) {
                        console.log(`  Line ${index + 1}: ${line.trim()}`);
                    }
                });
            }
        }
    }
}

console.log('Searching for "<Html" outside of _document.jsx...');
dirs.forEach(dir => findInDir(dir));
console.log('Search complete.');
