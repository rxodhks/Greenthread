import { NextRequest, NextResponse } from "next/server";
import {
  type ScanCategory,
  getScenarioById,
  resolveScenarioFromHint,
  scenarioForCategory,
  type ScanScenario,
} from "@/lib/mockScan";
import { classifyScanImage } from "@/lib/openaiVision";
import { rateLimitOrThrow } from "@/lib/rateLimit";
import { appendScanThreadEvent } from "@/lib/threadEventStore";

export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024;

function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
}

async function pickScenario(params: {
  category: ScanCategory;
  buffer: Buffer | null;
  mimeType: string;
}): Promise<{ scenario: ScanScenario; source: "vision" | "mock"; visionNote?: string }> {
  const { category, buffer, mimeType } = params;
  if (!buffer || !process.env.OPENAI_API_KEY) {
    return {
      scenario: resolveScenarioFromHint(null, category),
      source: "mock",
    };
  }

  try {
    const b64 = buffer.toString("base64");
    const v = await classifyScanImage({ base64: b64, mimeType, category });
    if (!v) {
      return {
        scenario: resolveScenarioFromHint(null, category),
        source: "mock",
      };
    }
    let scenario: ScanScenario;
    if (v.scenarioId) {
      const exact = getScenarioById(v.scenarioId);
      scenario =
        exact && exact.category === category ? exact : resolveScenarioFromHint(v.scenarioId, category);
    } else {
      scenario = resolveScenarioFromHint(v.detectedLabel, category);
    }
    return {
      scenario,
      source: "vision",
      visionNote: v.detectedLabel ?? undefined,
    };
  } catch {
    return {
      scenario: scenarioForCategory(category),
      source: "mock",
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    rateLimitOrThrow(`scan:${clientIp(req)}`, 30, 60_000);
  } catch (e) {
    if ((e as Error).message === "RATE_LIMIT") {
      return NextResponse.json(
        { ok: false, error: "요청이 너무 잦습니다. 잠시 후 다시 시도해 주세요." },
        { status: 429 },
      );
    }
    throw e;
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "잘못된 요청 본문입니다." }, { status: 400 });
  }

  const cat = form.get("category");
  if (cat !== "food" && cat !== "transport" && cat !== "shopping") {
    return NextResponse.json({ ok: false, error: "유효한 category가 필요합니다." }, { status: 400 });
  }
  const category = cat as ScanCategory;

  const file = form.get("image");
  let buffer: Buffer | null = null;
  let mimeType = "image/jpeg";

  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { ok: false, error: "이미지는 4MB 이하만 업로드할 수 있습니다." },
        { status: 413 },
      );
    }
    mimeType = file.type || "image/jpeg";
    if (!mimeType.startsWith("image/")) {
      return NextResponse.json({ ok: false, error: "이미지 파일만 업로드할 수 있습니다." }, { status: 400 });
    }
    const ab = await file.arrayBuffer();
    buffer = Buffer.from(ab);
  }

  let scenario: ScanScenario;
  let source: "vision" | "mock";
  let visionNote: string | undefined;

  try {
    const out = await pickScenario({ category, buffer, mimeType });
    scenario = out.scenario;
    source = out.source;
    visionNote = out.visionNote;
  } catch (err) {
    console.error("[scan]", err);
    scenario = scenarioForCategory(category);
    source = "mock";
    visionNote = undefined;
  }

  await appendScanThreadEvent({ label: scenario.label, category: scenario.category });

  return NextResponse.json({
    ok: true,
    scenario,
    source,
    visionNote,
  });
}
