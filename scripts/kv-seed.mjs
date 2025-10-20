#!/usr/bin/env node
/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
/* eslint-disable no-console */
// Seed a sample car status into Vercel KV and read it back

import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

function exit(msg, code = 1) {
  console.error(msg);
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

const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.KV_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
if (!url || (!token && !process.env.KV_URL)) {
  exit('Missing KV env. Connect Vercel KV to the project and run: vercel env pull .env.local');
}

const carId = process.argv[2] || 'gid://shopify/Product/TEST-123';
const status = process.argv[3] || 'reserved';

const key = `car:${carId}`;
const payload = { status, updatedAt: new Date().toISOString() };

try {
  await kv.set(key, payload);
  const got = await kv.get(key);
  console.log('✅ Wrote and read key:', key, got);
  process.exit(0);
} catch (err) {
  exit(`❌ KV seed error: ${err?.message || err}`);
}
