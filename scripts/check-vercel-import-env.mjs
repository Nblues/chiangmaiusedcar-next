import fs from 'node:fs';
import path from 'node:path';

const filePath = path.resolve(process.cwd(), '.env.vercel.production.import.example');

if (!fs.existsSync(filePath)) {
  console.error(`MISSING_FILE: ${filePath}`);
  process.exit(2);
}

const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

const isKeyLine = line => /^[A-Z0-9_]+\s*=/.test(line);
const keyOf = line => line.split('=', 1)[0].trim();
const valueOf = line => {
  const idx = line.indexOf('=');
  return idx === -1 ? '' : line.slice(idx + 1).trim();
};

const unquote = v => {
  let s = (v ?? '').trim();
  // Strip UTF-8 BOM if present (can happen with copy/paste).
  if (s && s.charCodeAt(0) === 0xfeff) s = s.slice(1);
  if (!s) return s;
  if (s.length >= 2) {
    const first = s[0];
    const last = s[s.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return s.slice(1, -1);
    }
  }
  return s;
};

const keys = lines.filter(isKeyLine).map(keyOf);

const required = [
  'SHOPIFY_DOMAIN',
  'SHOPIFY_STOREFRONT_TOKEN',
  'SHOPIFY_API_VERSION',
  'SHOPIFY_ADMIN_DOMAIN',
  'SHOPIFY_ADMIN_TOKEN',
  'DEBUG_ENDPOINT_SECRET',
  'SITE_URL',
];

const missing = required.filter(k => !keys.includes(k));

const dupMap = new Map();
for (const k of keys) dupMap.set(k, (dupMap.get(k) ?? 0) + 1);
const duplicates = [...dupMap.entries()].filter(([, c]) => c > 1);

const adminTokenLine = [...lines].reverse().find(l => /^SHOPIFY_ADMIN_TOKEN\s*=/.test(l));
const adminTokenRaw = adminTokenLine ? valueOf(adminTokenLine) : '';
const adminToken = adminTokenLine ? unquote(adminTokenRaw) : '';
const adminPrefixOk = /^shp(at|ca|ua|ss|pa)_/.test(adminToken);
const adminRawLooksQuoted = (() => {
  const t = (adminTokenRaw ?? '').trim();
  return t.startsWith('"') || t.startsWith("'");
})();
const adminRawLooksLikeShp = (() => {
  const t = (adminTokenRaw ?? '').trim();
  return t.startsWith('shp') || t.startsWith('"shp') || t.startsWith("'shp");
})();

console.log('== Masked preview ==');
for (const line of lines) {
  if (!isKeyLine(line)) {
    console.log(line);
    continue;
  }
  const k = keyOf(line);
  const v = valueOf(line);
  if (/TOKEN|SECRET|PASSWORD|KEY/.test(k)) {
    console.log(`${k}=***`);
  } else {
    console.log(`${k}=${v}`);
  }
}

console.log('\n== Checks ==');
console.log(`Missing keys: ${missing.length ? missing.join(', ') : '(none)'}`);
console.log(
  `Duplicate keys: ${duplicates.length ? duplicates.map(([k, c]) => `${k} x${c}`).join(', ') : '(none)'}`
);
console.log(`SHOPIFY_ADMIN_TOKEN prefix ok: ${adminTokenLine ? adminPrefixOk : 'MISSING'}`);
console.log(
  `SHOPIFY_ADMIN_TOKEN raw looks quoted: ${adminTokenLine ? adminRawLooksQuoted : 'MISSING'}`
);
console.log(
  `SHOPIFY_ADMIN_TOKEN raw starts with shp: ${adminTokenLine ? adminRawLooksLikeShp : 'MISSING'}`
);
