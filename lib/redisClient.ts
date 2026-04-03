import { Redis } from "@upstash/redis";

/** 성공 시에만 캐시. env 미설정은 매 요청마다 다시 읽음(로컬 .env.local 추가 후 재시도 가능). */
let redisInstance: Redis | undefined;

function readUrl() {
  return (
    process.env.UPSTASH_REDIS_REST_URL?.trim() ||
    process.env.KV_REST_API_URL?.trim() ||
    ""
  );
}

function readToken() {
  return (
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ||
    process.env.KV_REST_API_TOKEN?.trim() ||
    ""
  );
}

/**
 * Upstash Redis (Vercel 연동).
 * - 표준: UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
 * - Vercel KV·일부 연동: KV_REST_API_URL / KV_REST_API_TOKEN
 * 미설정 시 null — 메모리 폴백.
 */
export function getRedis(): Redis | null {
  if (redisInstance) return redisInstance;

  const url = readUrl();
  const token = readToken();
  if (!url || !token) {
    return null;
  }

  redisInstance = new Redis({ url, token });
  return redisInstance;
}
