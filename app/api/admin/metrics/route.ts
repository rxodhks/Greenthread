import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redisClient";
import { getTelemetryMemory, type TelemetryRow } from "@/lib/telemetryMemory";
import { aggregateTelemetry } from "@/lib/telemetryStats";

export const runtime = "nodejs";

const TELEMETRY_KEY = "greenthread:telemetry";
const TELEMETRY_MAX = 5000;

function authOk(req: NextRequest): boolean {
  const secret = process.env.METRICS_ADMIN_SECRET?.trim();
  if (!secret) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!process.env.METRICS_ADMIN_SECRET?.trim()) {
    return NextResponse.json(
      { ok: false, error: "METRICS_ADMIN_SECRET not configured on server" },
      { status: 503 },
    );
  }
  if (!authOk(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let rows: TelemetryRow[] = [];
  const redis = getRedis();
  if (redis) {
    const raw = await redis.lrange(TELEMETRY_KEY, 0, TELEMETRY_MAX - 1);
    for (const s of raw) {
      try {
        const o = JSON.parse(s) as TelemetryRow;
        if (o && typeof o.event === "string") rows.push(o);
      } catch {
        /* skip */
      }
    }
  } else {
    rows = getTelemetryMemory();
  }

  const aggregate = aggregateTelemetry(rows);
  const tsList = rows.map((r) => r.ts).filter((t) => typeof t === "number");
  const newestTs = tsList.length ? Math.max(...tsList) : null;
  const oldestTs = tsList.length ? Math.min(...tsList) : null;

  return NextResponse.json({
    ok: true,
    storage: redis ? "redis" : "memory",
    sampleSize: rows.length,
    oldestTs,
    newestTs,
    aggregate,
    hypothesis: {
      targetCtaRatePct: 15,
      note: "스캔 성공 대비 CTA(기부+대체 행동) 클릭률. share_*는 별도 전환 지표.",
    },
  });
}
