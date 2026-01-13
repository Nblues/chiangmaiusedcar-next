#!/usr/bin/env node

/* eslint-disable prettier/prettier, @typescript-eslint/no-require-imports */

try {
  // eslint-disable-next-line global-require
  require('sharp');
  process.stdout.write('sharp ok\n');
} catch (err) {
  process.stderr.write(`sharp error: ${err && err.stack ? err.stack : String(err)}\n`);
  process.exit(1);
}
