#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
// Quick self-test for Vercel KV connectivity using env vars

import fs from 'fs';
import path from 'path';

function exit(msg, code = 1) {
  console.log(msg);
  try {
    fs.appendFileSync(path.resolve('logs', 'kv-selftest.log'), `[EXIT ${code}] ${msg}\n`);
  } catch (e) {
    // ignore logging failure
  }
  process.exit(code);
}

// Load env from .env.local or .env (minimal parser, no extra deps)
function loadEnvFile(filename) {
  try {
    const p = path.resolve(process.cwd(), filename);
    if (!fs.existsSync(p)) return;
    const raw = fs.readFileSync(p, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      // remove surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = val;
      }
    }
  } catch {
    // ignore
  }
}

loadEnvFile('.env.local');
loadEnvFile('.env');

// Normalize double-prefixed envs (e.g., KV_KV_REST_API_URL) into standard names
const pairs = [
  ['KV_KV_REST_API_URL', 'KV_REST_API_URL'],
  ['KV_KV_REST_API_TOKEN', 'KV_REST_API_TOKEN'],
  ['KV_KV_URL', 'KV_URL'],
];
for (const [src, dst] of pairs) {
  if (!process.env[dst] && process.env[src]) {
    process.env[dst] = process.env[src];
  }
}

const url = process.env.KV_REST_API_URL || process.env.KV_URL;
const token = process.env.KV_REST_API_TOKEN;

console.log('=== KV Self-Test ===');
try {
  fs.mkdirSync('logs', { recursive: true });
  fs.appendFileSync(path.resolve('logs', 'kv-selftest.log'), 'Start self-test\n');
} catch (e) {
  // ignore
}
console.log('Detected env:', {
  KV_REST_API_URL: process.env.KV_REST_API_URL ? 'set' : 'missing',
  KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? 'set' : 'missing',
  KV_URL: process.env.KV_URL ? 'set' : 'missing',
});
try {
  fs.appendFileSync(
    path.resolve('logs', 'kv-selftest.log'),
    `Env: URL=${process.env.KV_REST_API_URL || process.env.KV_URL ? 'set' : 'missing'} TOKEN=${process.env.KV_REST_API_TOKEN ? 'set' : 'missing'}\n`
  );
} catch (e) {
  // ignore
}
if (!url || (!token && !process.env.KV_URL)) {
  exit('KV env missing (KV_REST_API_URL/TOKEN or KV_URL). Finish KV connection and pull env.');
}

try {
  const { kv } = await import('@vercel/kv');
  try { fs.appendFileSync(path.resolve('logs', 'kv-selftest.log'), 'Imported @vercel/kv\n'); } catch (e) { /* ignore */ }
  const key = `kv:selftest:${Date.now()}`;
  const payload = { ok: true, at: new Date().toISOString() };
  await kv.set(key, payload, { ex: 60 });
  try { fs.appendFileSync(path.resolve('logs', 'kv-selftest.log'), `Set ${key}\n`); } catch (e) { /* ignore */ }
  const got = await kv.get(key);
  try { fs.appendFileSync(path.resolve('logs', 'kv-selftest.log'), `Got ${JSON.stringify(got)}\n`); } catch (e) { /* ignore */ }
  await kv.del(key);
  if (got && got.ok) {
    console.log('✅ KV round-trip succeeded:', got);
  try { fs.appendFileSync(path.resolve('logs', 'kv-selftest.log'), 'Success\n'); } catch (e) { /* ignore */ }
    process.exit(0);
  } else {
    exit('❌ KV get returned empty or invalid payload');
  }
} catch (err) {
  console.log('Stack:', err);
  try { fs.appendFileSync(path.resolve('logs', 'kv-selftest.log'), `Error: ${err?.message || err}\n`); } catch (e) { /* ignore */ }
  exit(`❌ KV error: ${err?.message || err}`);
}
