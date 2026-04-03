type Entry = { count: number; resetAt: number };

declare global {
  var __gtRateLimit: Map<string, Entry> | undefined;
}

function map(): Map<string, Entry> {
  if (!globalThis.__gtRateLimit) globalThis.__gtRateLimit = new Map();
  return globalThis.__gtRateLimit;
}

/** 간단한 고정 윈도우. 서버리스 인스턴스 간 공유는 되지 않으며, 남용 완화용 최소 장치입니다. */
export function rateLimitOrThrow(key: string, limit: number, windowMs: number): void {
  const now = Date.now();
  const m = map();
  let e = m.get(key);
  if (!e || now >= e.resetAt) {
    e = { count: 0, resetAt: now + windowMs };
    m.set(key, e);
  }
  e.count += 1;
  if (e.count > limit) {
    const err = new Error("RATE_LIMIT");
    (err as Error & { status?: number }).status = 429;
    throw err;
  }
}
