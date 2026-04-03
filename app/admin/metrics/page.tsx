"use client";

import { useCallback, useState } from "react";
import Link from "next/link";

type MetricsPayload = {
  ok: true;
  storage: string;
  sampleSize: number;
  oldestTs: number | null;
  newestTs: number | null;
  aggregate: {
    total: number;
    byEvent: Record<string, number>;
    scanSuccess: number;
    scanError: number;
    ctaDonate: number;
    ctaAlternatives: number;
    shareClick: number;
    shareCopySuccess: number;
    shareNative: number;
    ctaClickRatePct: number | null;
    byScanSource: { vision: number; mock: number };
  };
  hypothesis: { targetCtaRatePct: number; note: string };
};

export default function AdminMetricsPage() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MetricsPayload | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch("/api/admin/metrics", {
        headers: { Authorization: `Bearer ${token.trim()}` },
      });
      const json = (await res.json()) as MetricsPayload | { ok: false; error: string };
      if (!res.ok || !("aggregate" in json) || !json.ok) {
        setError("error" in json ? json.error : `HTTP ${res.status}`);
        return;
      }
      setData(json);
    } catch {
      setError("network");
    } finally {
      setLoading(false);
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-emerald-950 px-4 py-10 text-emerald-50 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm text-emerald-200/80">
          <Link href="/" className="underline hover:text-white">
            ← 홈
          </Link>
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-white">텔레메트리 요약</h1>
        <p className="mt-2 text-sm text-emerald-100/75">
          서버 환경 변수 <code className="rounded bg-black/30 px-1">METRICS_ADMIN_SECRET</code> 값을 입력한 뒤 조회합니다. 토큰은
          브라우저에 저장하지 않습니다.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1 text-sm">
            <span className="text-emerald-200/90">Admin secret</span>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="mt-1 w-full rounded-lg border border-emerald-500/30 bg-emerald-900/50 px-3 py-2 text-white placeholder:text-emerald-300/40"
              placeholder="METRICS_ADMIN_SECRET"
              autoComplete="off"
            />
          </label>
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading || !token.trim()}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 disabled:opacity-50"
          >
            {loading ? "불러오는 중…" : "조회"}
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-400/40 bg-red-950/50 px-3 py-2 text-sm text-red-100" role="alert">
            {error}
          </p>
        )}

        {data && (
          <div className="mt-8 space-y-6">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-900/40 p-4 text-sm">
              <p>
                저장소: <strong>{data.storage}</strong> · 샘플 {data.sampleSize}건
              </p>
              {data.oldestTs && data.newestTs && (
                <p className="mt-1 text-emerald-100/70">
                  기간: {new Date(data.oldestTs).toLocaleString("ko-KR")} —{" "}
                  {new Date(data.newestTs).toLocaleString("ko-KR")}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-emerald-400/30 bg-emerald-900/60 p-5">
              <h2 className="text-lg font-medium text-white">CTA 클릭률 (가설 검증)</h2>
              <p className="mt-1 text-sm text-emerald-100/80">{data.hypothesis.note}</p>
              <p className="mt-4 text-3xl font-semibold tabular-nums text-white">
                {data.aggregate.ctaClickRatePct != null ? `${data.aggregate.ctaClickRatePct}%` : "—"}
              </p>
              <p className="mt-1 text-sm text-emerald-200/80">
                목표(가설): 약 {data.hypothesis.targetCtaRatePct}% · 스캔 성공 {data.aggregate.scanSuccess} · CTA 클릭{" "}
                {data.aggregate.ctaDonate + data.aggregate.ctaAlternatives} (기부 {data.aggregate.ctaDonate} / 대체{" "}
                {data.aggregate.ctaAlternatives})
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-900/40 p-4">
                <h3 className="text-sm font-medium text-emerald-100">스캔</h3>
                <p className="mt-2 tabular-nums">성공 {data.aggregate.scanSuccess}</p>
                <p className="tabular-nums text-emerald-200/80">실패 {data.aggregate.scanError}</p>
                <p className="mt-2 text-xs text-emerald-300/70">
                  비전 {data.aggregate.byScanSource.vision} · 데모 {data.aggregate.byScanSource.mock}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-900/40 p-4">
                <h3 className="text-sm font-medium text-emerald-100">공유</h3>
                <p className="mt-2 tabular-nums">share_click {data.aggregate.shareClick}</p>
                <p className="tabular-nums text-emerald-200/80">
                  복사 성공 {data.aggregate.shareCopySuccess} · 네이티브 {data.aggregate.shareNative}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-900/40 p-4">
              <h3 className="text-sm font-medium text-emerald-100">이벤트별 건수</h3>
              <ul className="mt-2 max-h-48 overflow-auto text-sm tabular-nums text-emerald-100/90">
                {Object.entries(data.aggregate.byEvent)
                  .sort((a, b) => b[1] - a[1])
                  .map(([k, v]) => (
                    <li key={k} className="flex justify-between gap-4 border-b border-emerald-800/40 py-1">
                      <span>{k}</span>
                      <span>{v}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
