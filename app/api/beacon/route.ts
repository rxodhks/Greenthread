import { NextRequest } from "next/server";
import { ingestClientTelemetry } from "@/lib/telemetryIngest";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  return ingestClientTelemetry(req);
}
