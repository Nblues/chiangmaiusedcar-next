import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const modeArgIndex = process.argv.indexOf('--mode');
const mode = modeArgIndex >= 0 ? process.argv[modeArgIndex + 1] : undefined;

const portArgIndex = process.argv.indexOf('--port');
const portRaw = portArgIndex >= 0 ? process.argv[portArgIndex + 1] : undefined;
const port = (() => {
  const n = Number(portRaw);
  return Number.isFinite(n) && n > 0 ? n : 3000;
})();

const takeover = process.argv.includes('--takeover');

function resolveScript(modeValue) {
  if (modeValue === 'safe') return 'dev:safe';
  if (modeValue === 'light') return 'dev:light';
  if (modeValue === 'turbo') return 'dev:turbo';
  if (modeValue === 'full') return 'dev:full';
  return 'dev';
}

const script = resolveScript(mode);

const fallbackScript = mode === 'full' ? 'dev:safe' : undefined;

let stopping = false;
let activeScript = script;

const crashTimestamps = [];
const MAX_CRASHES_WINDOW = 3;
const CRASH_WINDOW_MS = 60_000;
const NATIVE_CRASH_CODES = new Set([3221226505, 3221225477, 3221225781]);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const lockPath = path.join(process.cwd(), 'logs', 'dev-watch.lock');

function acquireLockOrExit() {
  try {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

    const fd = fs.openSync(lockPath, 'wx');
    fs.writeFileSync(fd, `${process.pid}\n`, 'utf8');
    fs.closeSync(fd);
  } catch {
    // eslint-disable-next-line no-console
    console.error(`[dev-watch] Another instance is already running (lock: ${lockPath}). Exiting.`);
    process.exit(2);
  }
}

function releaseLock() {
  try {
    if (fs.existsSync(lockPath)) fs.unlinkSync(lockPath);
  } catch {
    // ignore
  }
}

function appendLog(line) {
  try {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
    fs.appendFileSync(path.join(logDir, 'dev-watch.log'), `${line}\n`, 'utf8');
  } catch {
    // ignore log failures
  }
}

async function killStaleListener() {
  if (process.platform !== 'win32') return;
  await new Promise(resolve => {
    const ps = spawn(
      'powershell',
      [
        '-NoProfile',
        '-NonInteractive',
        '-ExecutionPolicy',
        'Bypass',
        '-Command',
        `$c=Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1; if($c){ if(${takeover ? '$true' : '$false'}){ Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue; Write-Host "[dev-watch] Took over :${port} (killed PID=$($c.OwningProcess))" } else { Write-Host "[dev-watch] Port :${port} already in use (PID=$($c.OwningProcess)). Use --takeover to kill it."; exit 3 } }`,
      ],
      { stdio: 'ignore', shell: false }
    );
    ps.on('exit', () => resolve());
    ps.on('error', () => resolve());
  });
}

async function runLoop() {
  acquireLockOrExit();

  // eslint-disable-next-line no-console
  console.log(`[dev-watch] Starting: pnpm run ${activeScript} (port=${port})`);
  appendLog(`[${new Date().toISOString()}] start script=${activeScript} port=${port}`);

  while (!stopping) {
    await killStaleListener();

    const child = spawn('pnpm', ['run', activeScript], {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: {
        ...process.env,
        DEV_WATCH: '1',
      },
    });

    const exitCode = await new Promise(resolve => {
      child.on('exit', code => resolve(typeof code === 'number' ? code : 0));
      child.on('error', () => resolve(1));
    });

    if (stopping) break;

    const now = Date.now();
    crashTimestamps.push(now);
    while (crashTimestamps.length && now - crashTimestamps[0] > CRASH_WINDOW_MS) {
      crashTimestamps.shift();
    }

    const isNativeCrash = NATIVE_CRASH_CODES.has(exitCode);
    const stamp = new Date().toISOString();
    appendLog(`[${stamp}] exit code=${exitCode} native=${isNativeCrash} script=${activeScript}`);

    // eslint-disable-next-line no-console
    console.log(
      `[dev-watch] Dev server exited (code=${exitCode}${isNativeCrash ? ', native-crash' : ''}).`
    );

    // If Windows-native crash happens repeatedly, auto-fallback to safe mode.
    if (
      fallbackScript &&
      activeScript !== fallbackScript &&
      isNativeCrash &&
      crashTimestamps.length >= MAX_CRASHES_WINDOW
    ) {
      activeScript = fallbackScript;
      crashTimestamps.length = 0;
      // eslint-disable-next-line no-console
      console.log(
        `[dev-watch] Too many crashes in a short time. Falling back to: pnpm run ${activeScript}`
      );
      appendLog(`[${stamp}] fallback -> ${activeScript}`);
    }

    const delayMs = isNativeCrash ? 2500 : 1000;
    // eslint-disable-next-line no-console
    console.log(`[dev-watch] Restarting in ${Math.round(delayMs / 100) / 10}s...`);
    await sleep(delayMs);
  }
}

function stop() {
  stopping = true;
}

process.on('SIGINT', stop);
process.on('SIGTERM', stop);

process.on('exit', () => {
  releaseLock();
});

runLoop().catch(err => {
  // eslint-disable-next-line no-console
  console.error('[dev-watch] Fatal error:', err);
  releaseLock();
  process.exit(1);
});
