import { kv } from '@vercel/kv';

const memoryStore = new Map();

const DEFAULT_WINDOW_MS = 10 * 60 * 1000;
const DEFAULT_LIMIT = 5;

function isKvConfigured() {
  return Boolean(
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
      (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) ||
      process.env.KV_URL
  );
}

function readMemory(key, windowMs) {
  const now = Date.now();
  const entry = memoryStore.get(key);
  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    const next = { count: 1, resetAt };
    memoryStore.set(key, next);
    return { count: 1, resetAt };
  }
  entry.count += 1;
  memoryStore.set(key, entry);
  return entry;
}

export async function rateLimit(key, options = {}) {
  const windowMs = Number(options.windowMs || DEFAULT_WINDOW_MS);
  const limit = Number(options.limit || DEFAULT_LIMIT);
  const bucketKey = `ratelimit:${key}`;
  const now = Date.now();

  if (!isKvConfigured()) {
    const entry = readMemory(bucketKey, windowMs);
    const remaining = Math.max(limit - entry.count, 0);
    return {
      ok: entry.count <= limit,
      remaining,
      resetAt: entry.resetAt,
      source: 'memory',
    };
  }

  try {
    const count = await kv.incr(bucketKey);
    if (count === 1) {
      await kv.expire(bucketKey, Math.ceil(windowMs / 1000));
    }
    const remaining = Math.max(limit - count, 0);
    return {
      ok: count <= limit,
      remaining,
      resetAt: now + windowMs,
      source: 'kv',
    };
  } catch {
    const entry = readMemory(bucketKey, windowMs);
    const remaining = Math.max(limit - entry.count, 0);
    return {
      ok: entry.count <= limit,
      remaining,
      resetAt: entry.resetAt,
      source: 'memory',
    };
  }
}
