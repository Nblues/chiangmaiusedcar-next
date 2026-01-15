#!/usr/bin/env node

/*
  Robust Lighthouse runner (Windows-friendly) with:
  - hard timeout (prevents hangs)
  - log capture to a file
  - verifies output JSON exists and is parseable

  Usage example:
    node scripts/run-lighthouse-report.cjs \
      --url https://www.chiangmaiusedcar.com/ \
      --output lighthouse-mobile-home.postfix2.json \
      --log lighthouse-mobile-home.postfix2.log \
      --timeout-ms 420000 \
      --only-categories performance \
      --emulated-form-factor mobile \
      --throttling-method simulate \
      --chrome-flags "--headless --no-sandbox"
*/

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

function parseArgs(argv) {
  const args = {
    url: null,
    output: null,
    log: null,
    timeoutMs: 6 * 60 * 1000,

    onlyCategories: null,
    emulatedFormFactor: null,
    throttlingMethod: null,
    chromeFlags: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    const next = argv[i + 1];

    if (a === '--url') {
      args.url = next;
      i += 1;
      continue;
    }
    if (a === '--output') {
      args.output = next;
      i += 1;
      continue;
    }
    if (a === '--log') {
      args.log = next;
      i += 1;
      continue;
    }
    if (a === '--timeout-ms') {
      args.timeoutMs = Number(next);
      i += 1;
      continue;
    }

    if (a === '--only-categories') {
      args.onlyCategories = next;
      i += 1;
      continue;
    }
    if (a === '--emulated-form-factor') {
      args.emulatedFormFactor = next;
      i += 1;
      continue;
    }
    if (a === '--throttling-method') {
      args.throttlingMethod = next;
      i += 1;
      continue;
    }
    if (a === '--chrome-flags') {
      args.chromeFlags = next;
      i += 1;
      continue;
    }

    if (a === '--help' || a === '-h') {
      return { ...args, help: true };
    }

    // Unknown flag: ignore (keeps script tolerant if task adds flags later)
  }

  return args;
}

function requireArg(name, value) {
  if (!value) {
    process.stderr.write(`Missing required arg: --${name}\n`);
    process.stderr.write('Run with --help for usage.\n');
    process.exit(2);
  }
}

function safeUnlink(filePath) {
  try {
    fs.unlinkSync(filePath);
  } catch {
    // ignore
  }
}

function fileSizeBytes(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return null;
  }
}

async function killProcessTree(child) {
  if (!child || !child.pid) return;

  if (process.platform === 'win32') {
    await new Promise(resolve => {
      const killer = spawn('taskkill', ['/PID', String(child.pid), '/T', '/F'], {
        stdio: 'ignore',
        windowsHide: true,
      });
      killer.on('close', () => resolve());
      killer.on('error', () => resolve());
    });
    return;
  }

  try {
    child.kill('SIGKILL');
  } catch {
    // ignore
  }
}

function buildLighthouseArgs(opts) {
  const args = [opts.url, '--output=json', '--output-path', opts.output];

  if (opts.emulatedFormFactor) {
    args.push(`--emulated-form-factor=${opts.emulatedFormFactor}`);
  }
  if (opts.throttlingMethod) {
    args.push(`--throttling-method=${opts.throttlingMethod}`);
  }
  if (opts.onlyCategories) {
    args.push(`--only-categories=${opts.onlyCategories}`);
  }
  if (opts.chromeFlags) {
    // lighthouse expects one arg containing the chrome flags string
    args.push(`--chrome-flags=${opts.chromeFlags}`);
  }

  return args;
}

function printHelp() {
  process.stdout.write(
    [
      'run-lighthouse-report.cjs',
      '',
      'Required:',
      '  --url <url>',
      '  --output <path>',
      '',
      'Optional:',
      '  --log <path>                 (default: <output>.log)',
      '  --timeout-ms <ms>            (default: 360000)',
      '  --only-categories <name>',
      '  --emulated-form-factor <x>',
      '  --throttling-method <x>',
      '  --chrome-flags "..."',
      '',
    ].join('\n')
  );
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    printHelp();
    process.exit(0);
  }

  requireArg('url', opts.url);
  requireArg('output', opts.output);

  if (!Number.isFinite(opts.timeoutMs) || opts.timeoutMs <= 0) {
    process.stderr.write('Invalid --timeout-ms (must be a positive number)\n');
    process.exit(2);
  }

  const repoRoot = process.cwd();

  const outputPath = path.resolve(repoRoot, opts.output);
  const logPath = path.resolve(repoRoot, opts.log || `${opts.output}.log`);

  // Normalize for lighthouse args (absolute output path avoids cwd quirks)
  const lhOpts = {
    ...opts,
    output: outputPath,
  };

  safeUnlink(outputPath);
  fs.mkdirSync(path.dirname(logPath), { recursive: true });

  const logStream = fs.createWriteStream(logPath, { flags: 'a' });
  const log = chunk => {
    const text = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk));
    logStream.write(text);
  };

  log(`\n===== Lighthouse run @ ${new Date().toISOString()} =====\n`);
  log(`url: ${opts.url}\n`);
  log(`output: ${outputPath}\n`);
  log(`timeoutMs: ${opts.timeoutMs}\n\n`);

  const lighthouseCli = path.join(repoRoot, 'node_modules', 'lighthouse', 'cli', 'index.js');
  if (!fs.existsSync(lighthouseCli)) {
    process.stderr.write('Cannot find Lighthouse CLI entrypoint.\n');
    process.stderr.write(`Expected: ${lighthouseCli}\n`);
    process.stderr.write('Try reinstalling dependencies: pnpm install\n');
    process.exit(2);
  }

  const nodeBin = process.execPath;
  const lhArgs = [lighthouseCli, ...buildLighthouseArgs(lhOpts)];

  log(
    `cmd: ${nodeBin} ${lhArgs.map(a => (String(a).includes(' ') ? JSON.stringify(a) : a)).join(' ')}\n\n`
  );

  const child = spawn(nodeBin, lhArgs, {
    cwd: repoRoot,
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });

  let timedOut = false;
  const timeout = setTimeout(async () => {
    timedOut = true;
    log(`\n[runner] TIMEOUT after ${opts.timeoutMs}ms, killing process tree...\n`);
    await killProcessTree(child);
  }, opts.timeoutMs);

  child.stdout.on('data', d => {
    process.stdout.write(d);
    log(d);
  });
  child.stderr.on('data', d => {
    process.stderr.write(d);
    log(d);
  });

  const exitCode = await new Promise(resolve => {
    child.on('close', code => resolve(typeof code === 'number' ? code : 1));
    child.on('error', () => resolve(1));
  });

  clearTimeout(timeout);
  log(`\n[runner] lighthouse exitCode=${exitCode}${timedOut ? ' (timed out)' : ''}\n`);

  const bytes = fileSizeBytes(outputPath);
  log(`[runner] output exists=${bytes != null}, bytes=${bytes != null ? bytes : 'n/a'}\n`);

  logStream.end();

  // If lighthouse timed out, fail hard.
  if (timedOut) {
    process.stderr.write(`Lighthouse timed out after ${opts.timeoutMs}ms\n`);
    process.exit(124);
  }

  if (bytes == null || bytes < 1000) {
    process.stderr.write('Lighthouse did not produce a valid output file (missing/too small).\n');
    process.stderr.write(`Expected: ${outputPath}\n`);
    process.stderr.write(`Log: ${logPath}\n`);
    process.exit(exitCode || 2);
  }

  // Validate JSON is parseable.
  try {
    const raw = fs.readFileSync(outputPath, 'utf8');
    JSON.parse(raw);
  } catch (err) {
    process.stderr.write('Lighthouse output exists but JSON failed to parse.\n');
    process.stderr.write(`Expected: ${outputPath}\n`);
    process.stderr.write(`Log: ${logPath}\n`);
    process.stderr.write(String(err && err.stack ? err.stack : err) + '\n');
    process.exit(3);
  }

  // If lighthouse returned nonzero but output is valid, keep workflow moving.
  if (exitCode !== 0) {
    process.stderr.write(
      `Warning: Lighthouse exited with code ${exitCode} but produced a report; continuing.\n`
    );
    process.exit(0);
  }

  process.stdout.write(`Report OK: ${outputPath} (${bytes} bytes)\n`);
}

main().catch(err => {
  process.stderr.write(String(err && err.stack ? err.stack : err) + '\n');
  process.exit(1);
});
