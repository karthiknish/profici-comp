// Simple in-memory token bucket rate limiter.
// Suitable for single-instance deployments. For multi-instance, use a shared store (Redis).

const buckets = new Map();

export function getClientIp(headers) {
  const h = headers.get?.("x-forwarded-for") || headers["x-forwarded-for"];
  // x-forwarded-for may contain a list: client, proxy1, proxy2
  return typeof h === "string" && h.length > 0 ? h.split(",")[0].trim() : "unknown";
}

export function rateLimit({ key, windowMs = 60_000, max = 10 }) {
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { tokens: max, last: now };
    buckets.set(key, bucket);
  }

  const elapsed = now - bucket.last;
  const refill = (elapsed / windowMs) * max;
  bucket.tokens = Math.min(max, bucket.tokens + refill);
  bucket.last = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    const remaining = Math.floor(bucket.tokens);
    const reset = windowMs - (elapsed % windowMs);
    return { ok: true, remaining, reset };
  }

  const reset = windowMs - (elapsed % windowMs);
  return { ok: false, remaining: 0, reset };
}

// Optional Redis-backed rate limiting for multi-instance deployments.
let redisClientPromise = null;
async function getRedisClient() {
  try {
    const url = process.env.REDIS_URL;
    if (!url) return null;
    if (!redisClientPromise) {
      redisClientPromise = import("ioredis")
        .then(({ default: Redis }) => {
          const client = new Redis(url, {
            maxRetriesPerRequest: 2,
            lazyConnect: true,
          });
          client.on("error", (e) => console.error("Redis error:", e?.message || e));
          return client;
        })
        .catch((err) => {
          console.error("Failed to initialize Redis:", err?.message || err);
          return null;
        });
    }
    return await redisClientPromise;
  } catch (e) {
    console.error("Redis init exception:", e?.message || e);
    return null;
  }
}

export async function rateLimitCheck({ key, windowMs = 60_000, max = 10 }) {
  // Try Redis first; fallback to in-memory token bucket
  try {
    const redis = await getRedisClient();
    if (!redis) return rateLimit({ key, windowMs, max });

    const bucketKey = `rl:${key}`;
    const current = await redis.incr(bucketKey);
    if (current === 1) {
      await redis.pexpire(bucketKey, windowMs);
    }
    const ttl = await redis.pttl(bucketKey);
    if (current <= max) {
      return { ok: true, remaining: Math.max(0, max - current), reset: ttl >= 0 ? ttl : windowMs };
    }
    return { ok: false, remaining: 0, reset: ttl >= 0 ? ttl : windowMs };
  } catch (e) {
    console.error("Redis rateLimitCheck error, falling back to memory:", e?.message || e);
    return rateLimit({ key, windowMs, max });
  }
}
