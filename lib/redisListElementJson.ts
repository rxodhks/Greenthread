/**
 * @upstash/redis 는 LRANGE 등에서 리스트 원소가 JSON 문자열이면 자동으로 객체로 역직렬화한다.
 * 그 상태에서 다시 JSON.parse 하면 실패하므로, 문자열·객체 둘 다 처리한다.
 */
export function parseRedisListElementJson<T>(raw: unknown, guard: (v: unknown) => v is T): T | null {
  if (guard(raw)) return raw;
  if (typeof raw !== "string") return null;
  try {
    const v = JSON.parse(raw) as unknown;
    return guard(v) ? v : null;
  } catch {
    return null;
  }
}
