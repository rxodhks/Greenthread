"use client";

import { useCallback, useState } from "react";
import { trackClientEvent } from "@/lib/clientTelemetry";
import { resizeImageForUpload } from "@/lib/imageResize";
import type { ScanApiResponse } from "@/lib/scanApiTypes";
import type { ScanCategory, ScanScenario } from "@/lib/mockScan";

const DONATE_HREF =
  process.env.NEXT_PUBLIC_GT_DONATE_URL ?? "https://www.globalgiving.org/";
const ALTERNATIVES_HREF =
  process.env.NEXT_PUBLIC_GT_ALTERNATIVES_URL ??
  "mailto:hello@example.com?subject=Greenthread%20%EB%8C%80%EC%B2%B4%20%ED%96%89%EB%8F%99";

const categories: { id: ScanCategory; title: string; hint: string }[] = [
  { id: "food", title: "음식", hint: "메뉴·라벨·식재료" },
  { id: "transport", title: "교통", hint: "차량·티켓·주유" },
  { id: "shopping", title: "쇼핑", hint: "택·영수증·제품" },
];

function formatCo2(kg: number) {
  if (kg >= 1) return `${kg.toFixed(1)} kg CO₂e`;
  return `${(kg * 1000).toFixed(0)} g CO₂e`;
}

export function ScanExperience() {
  const [category, setCategory] = useState<ScanCategory>("food");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanScenario | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"vision" | "mock" | null>(null);
  const [visionNote, setVisionNote] = useState<string | null>(null);
  const [shareHint, setShareHint] = useState<string | null>(null);

  const runScan = useCallback(async (cat: ScanCategory, file: File | null, name?: string | null) => {
    setLoading(true);
    setResult(null);
    setError(null);
    setSource(null);
    setVisionNote(null);
    setShareHint(null);
    if (name) setFileName(name);

    const fd = new FormData();
    fd.append("category", cat);
    if (file) fd.append("image", file);

    try {
      const res = await fetch("/api/scan", { method: "POST", body: fd });
      const data = (await res.json()) as ScanApiResponse;
      if (!data.ok) {
        setError(data.error);
        return;
      }
      setResult(data.scenario);
      setSource(data.source);
      setVisionNote(data.visionNote ?? null);
      /* scan_success / API scan_error 는 서버 POST /api/scan 에서 기록(클라이언트 비콘 차단과 무관) */
      window.dispatchEvent(new CustomEvent("gt-scan-complete"));
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      trackClientEvent("scan_error", { category: cat, error: "network" });
    } finally {
      setLoading(false);
    }
  }, []);

  const shareResult = useCallback(async () => {
    if (!result || typeof window === "undefined") return;
    setShareHint(null);
    const url = `${window.location.origin}/share/${result.id}`;
    trackClientEvent("share_click", { scenarioId: result.id });
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({
          title: "GreenThread 추정 결과",
          text: `${result.label} · ${formatCo2(result.co2Kg)}`,
          url,
        });
        trackClientEvent("share_native", { scenarioId: result.id });
        setShareHint("공유를 완료했습니다.");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        trackClientEvent("share_copy_success", { scenarioId: result.id });
        setShareHint("링크를 클립보드에 복사했습니다.");
      } else {
        setShareHint("이 브라우저에서는 공유를 지원하지 않습니다.");
      }
    } catch {
      trackClientEvent("share_cancelled", { scenarioId: result.id });
      setShareHint("공유가 취소되었거나 실패했습니다.");
    }
  }, [result]);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const sized = await resizeImageForUpload(f);
    void runScan(category, sized, f.name);
  };

  return (
    <section id="scan" className="scroll-mt-20 border-b border-emerald-900/10 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-semibold text-emerald-950">실시간 스캔 데모</h2>
        <p className="mt-2 max-w-2xl text-emerald-900/70">
          이미지를 올리면 서버에서 분석합니다. <code className="rounded bg-emerald-100/80 px-1 text-xs">OPENAI_API_KEY</code>가
          있으면 비전 모델이 시나리오를 고르고, 없으면 같은 배출 시나리오 풀에서 교육용 추정을 반환합니다. 수치는 참고용 추정이며 법적
          보증이 아닙니다.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-emerald-900/10 bg-[var(--gt-surface)] p-6 shadow-sm">
            <p className="text-sm font-medium text-emerald-900">카테고리</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    category === c.id
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                  }`}
                >
                  {c.title}
                  <span className="ml-1 text-xs opacity-80">({c.hint})</span>
                </button>
              ))}
            </div>

            <label className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-700/25 bg-emerald-50/50 px-4 py-12 text-center transition hover:border-emerald-600/50 hover:bg-emerald-50 [touch-action:manipulation]">
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />
              <span className="text-sm font-medium text-emerald-900">카메라 또는 갤러리에서 이미지 선택</span>
              <span className="mt-1 text-xs text-emerald-800/60">
                선택 시 서버로 전송됩니다. 제3자 AI 처리에 동의하는 경우에만 사용해 주세요.
              </span>
            </label>

            <button
              type="button"
              onClick={() => void runScan(category, null, "데모_샘플.jpg")}
              className="mt-4 w-full rounded-xl border border-emerald-800/15 bg-white py-3 text-sm font-medium text-emerald-900 transition hover:bg-emerald-50"
            >
              이미지 없이 데모 분석만 실행
            </button>

            {error && (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900" role="alert">
                {error}
              </p>
            )}

            {loading && (
              <p className="mt-4 flex items-center gap-2 text-sm text-emerald-800">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                공급망 그래프와 배출계수를 합성하는 중…
              </p>
            )}
            {fileName && !loading && result && (
              <p className="mt-4 text-xs text-emerald-800/60">입력: {fileName}</p>
            )}
          </div>

          <div className="rounded-2xl border border-emerald-900/10 bg-gradient-to-br from-white to-emerald-50/80 p-6 shadow-sm">
            {!result && !loading && (
              <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center text-emerald-800/60">
                <p className="text-sm">스캔 결과가 여기에 실시간으로 나타납니다.</p>
              </div>
            )}
            {result && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-800/80">
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-900">
                    출처: {source === "vision" ? "비전 분류" : "데모·추정 풀"}
                  </span>
                  {visionNote && (
                    <span className="rounded-full bg-white/80 px-2 py-0.5 ring-1 ring-emerald-900/10">
                      감지 요약: {visionNote}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-emerald-700/80">탄소 발자국 (추정)</p>
                  <p className="mt-1 text-3xl font-semibold tabular-nums text-emerald-950">{formatCo2(result.co2Kg)}</p>
                  <p className="mt-1 text-sm text-emerald-900/80">{result.itemLabel}</p>
                  <p className="mt-2 text-xs leading-relaxed text-emerald-800/75">
                    <span className="font-medium text-emerald-900/90">출처·한계: </span>
                    {result.sourceNote}
                    <span className="ml-1 tabular-nums">(버전 {result.factorVersion})</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-emerald-800">감지된 활동</p>
                  <p className="mt-1 text-lg font-medium text-emerald-950">{result.label}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-4 ring-1 ring-emerald-900/10">
                  <p className="text-xs font-medium text-emerald-800">글로벌 공급망 인사이트</p>
                  <p className="mt-2 text-sm leading-relaxed text-emerald-900/85">{result.supplyChainNote}</p>
                </div>
                <div className="rounded-xl border border-emerald-600/25 bg-emerald-600/5 p-4">
                  <p className="text-xs font-medium text-emerald-800">NGO 프로젝트 1:1 연결 (예시)</p>
                  <p className="mt-1 text-sm font-semibold text-emerald-950">{result.ngoName}</p>
                  <p className="mt-2 text-sm leading-relaxed text-emerald-900/90">{result.ngoImpact}</p>
                  {result.impactM2 != null && (
                    <p className="mt-2 text-sm font-medium text-emerald-800">
                      환산 보호 면적: 약 {result.impactM2} m²
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void shareResult()}
                    className="rounded-full border border-emerald-700/30 bg-white px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-50"
                  >
                    결과 링크 공유
                  </button>
                </div>
                {shareHint && <p className="text-xs text-emerald-800/70">{shareHint}</p>}
                <div className="flex flex-wrap gap-2">
                  <a
                    href={DONATE_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackClientEvent("cta_donate_click", {
                        scenarioId: result.id,
                        href: DONATE_HREF,
                      })
                    }
                    className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    이 프로젝트에 소액 기부
                  </a>
                  <a
                    href={ALTERNATIVES_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackClientEvent("cta_alternatives_click", {
                        scenarioId: result.id,
                        href: ALTERNATIVES_HREF,
                      })
                    }
                    className="inline-flex items-center justify-center rounded-full border border-emerald-800/20 px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-50"
                  >
                    대체 행동 제안 받기
                  </a>
                </div>
                <p className="text-xs text-emerald-800/55">
                  기부 시 플랫폼 수수료 10%를 투명하게 공개하고, 나머지는 검증된 NGO에 전달하는 흐름을 제품에 내장합니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
