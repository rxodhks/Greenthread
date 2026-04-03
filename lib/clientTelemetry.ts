"use client";

/** 스캔·CTA 등 제품 이벤트. 서버 `POST /api/telemetry`로 전송(실패 무시). */
export function trackClientEvent(event: string, props?: Record<string, unknown>) {
  void fetch("/api/telemetry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, props }),
    keepalive: true,
  }).catch(() => {});
}
