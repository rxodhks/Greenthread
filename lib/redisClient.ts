import { Redis } from "@upstash/redis";

let cached: Redis | null | undefined;

/** Upstash Redis (Vercel Marketplace). 미설정 시 null — 메모리 폴백. */
export function getRedis(): Redis | null {
  if (cached !== undefined) return cached;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    cached = null;
    return null;
  }
  cached = new Redis({ url, token });
  return cached;
}
