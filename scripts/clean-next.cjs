const fs = require('fs');
const path = require('path');

const targets = [path.join(process.cwd(), '.next'), path.join(process.cwd(), '.next-win')];

try {
  for (const target of targets) {
    fs.rmSync(target, { recursive: true, force: true });
  }
  process.stdout.write('Removed .next/.next-win\n');
} catch (err) {
  process.stdout.write('No .next/.next-win to remove\n');
}
