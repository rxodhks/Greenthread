import { KNOWN_SCENARIO_IDS, type ScanCategory } from "@/lib/mockScan";

type VisionParse = {
  scenario_id?: string;
  detected_label?: string;
};

const ALLOWED = new Set(KNOWN_SCENARIO_IDS);

function stripJsonFence(text: string) {
  let t = text.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  }
  return t.trim();
}

/**
 * 이미지가 있고 OPENAI_API_KEY가 설정된 경우에만 호출.
 * 실패 시 null (호출부에서 mock 폴백).
 */
export async function classifyScanImage(params: {
  base64: string;
  mimeType: string;
  category: ScanCategory;
}): Promise<{ scenarioId: string | null; detectedLabel: string | null } | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const model = process.env.OPENAI_VISION_MODEL ?? "gpt-4o-mini";

  const allowedList = [...KNOWN_SCENARIO_IDS].join(", ");
  const userText = `The user selected category: "${params.category}".
Look at the image. Reply with JSON only, no markdown:
{"scenario_id":"one of [${allowedList}] or unknown","detected_label":"short Korean label for what you see"}

Pick scenario_id that best matches the image among the known ids for this product demo. If unclear, use "unknown".`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 200,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: userText },
            {
              type: "image_url",
              image_url: {
                url: `data:${params.mimeType};base64,${params.base64}`,
                detail: "low",
              },
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`OpenAI HTTP ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) return null;

  let parsed: VisionParse;
  try {
    parsed = JSON.parse(stripJsonFence(raw)) as VisionParse;
  } catch {
    return null;
  }

  const sid = (parsed.scenario_id ?? "").trim().toLowerCase();
  const scenarioId = sid && ALLOWED.has(sid) ? sid : null;
  const detectedLabel = parsed.detected_label?.trim() || null;

  return {
    scenarioId,
    detectedLabel,
  };
}
