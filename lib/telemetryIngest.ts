import { NextRequest, NextResponse } from "next/server";
import { rateLimitOrThrow } from "@/lib/rateLimit";
import { recordTelemetry } from "@/lib/telemetryRecord";

const EVENT_RE = /^[a-z][a-z0-9_]{0,63}$/;

function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
}

/** 클라이언트 제품 이벤트 수집. `POST /api/beacon` 및 레거시 `POST /api/telemetry`가 공유한다. */
export async function ingestClientTelemetry(req: NextRequest): Promise<NextResponse> {
  try {
    rateLimitOrThrow(`gt_telemetry:${clientIp(req)}`, 120, 60_000);
  } catch (e) {
    if ((e as Error).message === "RATE_LIMIT") {
      return NextResponse.json({ ok: false, error: "too_many_requests" }, { status: 429 });
    }
    throw e;
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const event = (body as { event?: string }).event;
  const props = (body as { props?: unknown }).props;

  if (typeof event !== "string" || !EVENT_RE.test(event)) {
    return NextResponse.json({ ok: false, error: "invalid_event" }, { status: 400 });
  }

  if (props !== undefined && (typeof props !== "object" || props === null || Array.isArray(props))) {
    return NextResponse.json({ ok: false, error: "invalid_props" }, { status: 400 });
  }

  const row = {
    event,
    props: props as Record<string, unknown> | undefined,
    ts: Date.now(),
    ip: clientIp(req),
  };

  await recordTelemetry(row);

  return NextResponse.json({ ok: true });
}
