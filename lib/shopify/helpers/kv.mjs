export let __kvPromise = null;

export const hasEnvValue = v => v != null && String(v).trim() !== '' && String(v) !== 'undefined';

export const normalizeKvEnv = () => {
  const pairs = [
    ['KV_KV_REST_API_URL', 'KV_REST_API_URL'],
    ['KV_KV_REST_API_TOKEN', 'KV_REST_API_TOKEN'],
    ['KV_KV_REST_API_READ_ONLY_TOKEN', 'KV_REST_API_READ_ONLY_TOKEN'],
    ['KV_KV_URL', 'KV_URL'],
  ];
  for (const [src, dst] of pairs) {
    if (!process.env[dst] && process.env[src]) {
      process.env[dst] = process.env[src];
    }
  }

  if (!process.env.KV_REST_API_TOKEN && process.env.KV_REST_API_READ_ONLY_TOKEN) {
    process.env.KV_REST_API_TOKEN = process.env.KV_REST_API_READ_ONLY_TOKEN;
  }
};

normalizeKvEnv();

export const isKvConfigured = () => {
  const url =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.UPSTASH_REDIS_REST_API_URL ||
    process.env.KV_URL;
  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.UPSTASH_REDIS_REST_API_TOKEN ||
    process.env.KV_REST_API_READ_ONLY_TOKEN;
  return hasEnvValue(url) && (hasEnvValue(token) || hasEnvValue(process.env.KV_URL));
};

export const getKv = async () => {
  if (!isKvConfigured()) return null;
  if (!__kvPromise) {
    __kvPromise = import('@vercel/kv').then(m => m?.kv || null).catch(() => null);
  }
  return __kvPromise;
};

export const getShopifyStoreKey = () => {
  const raw =
    process.env.SHOPIFY_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    '';
  return String(raw)
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/+$/, '')
    .toLowerCase();
};
