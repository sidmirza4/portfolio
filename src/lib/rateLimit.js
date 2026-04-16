import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

/**
 * Sliding window rate limiter using Redis INCR + EXPIRE.
 * Returns { allowed: boolean, remaining: number, retryAfter: number }
 */
async function checkLimit(key, limit, windowSeconds) {
  const current = await redis.incr(key);

  // Set expiry only on the first request in this window
  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }

  const ttl = await redis.ttl(key);
  const remaining = Math.max(0, limit - current);
  const allowed = current <= limit;

  return { allowed, remaining, retryAfter: allowed ? 0 : ttl };
}

/**
 * Enforces multiple rate limit tiers for a given IP.
 * Tiers: 5 req/min · 15 req/hour · 30 req/day
 */
export async function enforceRateLimit(ip) {
  const safeIp = (ip || 'unknown').replace(/[^a-zA-Z0-9.:_-]/g, '_');
  const now = new Date();

  // Time-bucketed keys so windows reset naturally
  const minuteKey = `rl:${safeIp}:min:${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}-${now.getUTCHours()}-${now.getUTCMinutes()}`;
  const hourKey = `rl:${safeIp}:hr:${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}-${now.getUTCHours()}`;
  const dayKey = `rl:${safeIp}:day:${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}`;

  const [minute, hour, day] = await Promise.all([
    checkLimit(minuteKey, 15, 60),
    checkLimit(hourKey, 60, 3600),
    checkLimit(dayKey, 100, 86400),
  ]);

  if (!minute.allowed) {
    return {
      allowed: false,
      reason: 'Too many requests. Please wait a moment.',
      retryAfter: minute.retryAfter,
    };
  }
  if (!hour.allowed) {
    return {
      allowed: false,
      reason: 'Hourly limit reached. Please come back later.',
      retryAfter: hour.retryAfter,
    };
  }
  if (!day.allowed) {
    return {
      allowed: false,
      reason: 'Daily limit reached. Please try again tomorrow.',
      retryAfter: day.retryAfter,
    };
  }

  return { allowed: true, remaining: Math.min(minute.remaining, hour.remaining, day.remaining) };
}
