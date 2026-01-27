#!/usr/bin/env node
/**
 * Checks whether any token-like values in an env file can access Shopify Admin API.
 *
 * Safety:
 * - Prints ONLY HTTP status lines, never prints token values.
 * - Intended for local debugging only.
 */

import fs from 'node:fs';
import path from 'node:path';

function parseEnvLine(line) {
  const trimmed = String(line || '').trim();
  if (!trimmed || trimmed.startsWith('#')) return null;
  const eq = trimmed.indexOf('=');
  if (eq <= 0) return null;

  const key = trimmed.slice(0, eq).trim();
  let value = trimmed.slice(eq + 1).trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return { key, value };
}

function readEnvFile(filePath) {
  const full = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(full)) throw new Error(`Env file not found: ${full}`);

  const content = fs.readFileSync(full, 'utf8');
  const entries = content.split(/\r?\n/).map(parseEnvLine).filter(Boolean);

  const map = new Map();
  entries.forEach(e => {
    if (!map.has(e.key)) map.set(e.key, e.value);
  });

  return map;
}

async function testAdminToken(domain, token, label) {
  const url = `https://${domain}/admin/api/2024-01/shop.json`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
  });
  console.log(`${label}: ${res.status} ${res.statusText}`);
  return res.ok;
}

async function main() {
  const args = process.argv.slice(2);
  const envFileIdx = args.indexOf('--env-file');
  const envFile = envFileIdx !== -1 ? args[envFileIdx + 1] : '.env.production.local';

  const env = readEnvFile(envFile);
  const domain = env.get('SHOPIFY_DOMAIN');

  if (!domain) {
    console.error('Missing SHOPIFY_DOMAIN in env file.');
    process.exit(1);
  }

  const candidateKeys = ['SHOPIFY_ADMIN_TOKEN', 'API_shopify', 'คีย์ API_shopify'];
  const candidates = candidateKeys
    .map(k => ({ key: k, value: env.get(k) }))
    .filter(c => typeof c.value === 'string' && c.value.length > 0);

  if (candidates.length === 0) {
    console.error('No admin token candidates found in env file.');
    process.exit(1);
  }

  console.log(`Domain: ${domain}`);
  console.log(`Env file: ${envFile}`);

  for (const c of candidates) {
    try {
      const ok = await testAdminToken(domain, c.value, c.key);
      if (ok) {
        console.log(`✅ ${c.key} works for Admin API`);
        process.exit(0);
      }
    } catch (err) {
      console.log(`${c.key}: ERROR ${err?.message || String(err)}`);
    }
  }

  console.log('❌ None of the candidates worked for Admin API.');
  console.log('Tip: create a Shopify Custom App and use its Admin API access token (usually starts with shpat_).');
  process.exit(2);
}

main();
