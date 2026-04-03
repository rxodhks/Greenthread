import { getRedis } from "@/lib/redisClient";
import { pushTelemetryMemory, type TelemetryRow } from "@/lib/telemetryMemory";

const TELEMETRY_KEY = "greenthread:telemetry";
const TELEMETRY_MAX = 5000;

/** Redis(또는 메모리)에 텔레메트리 한 건 저장. `POST /api/beacon`(및 레거시 `/api/telemetry`)·서버 측 이벤트가 공유한다. */
export async function recordTelemetry(row: TelemetryRow): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.lpush(TELEMETRY_KEY, JSON.stringify(row));
    await redis.ltrim(TELEMETRY_KEY, 0, TELEMETRY_MAX - 1);
  } else {
    pushTelemetryMemory(row);
    if (process.env.NODE_ENV === "development") {
      console.info("[telemetry]", row);
    }
  }
}
