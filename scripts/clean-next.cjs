const fs = require('fs');
const path = require('path');

const target = path.join(process.cwd(), '.next');

try {
  fs.rmSync(target, { recursive: true, force: true });
  process.stdout.write('Removed .next\n');
} catch (err) {
  process.stdout.write('No .next to remove\n');
}
