#!/usr/bin/env node
/**
 * 주간 텔레메트리 요약 (로컬/CI에서 실행).
 * 사용: BASE_URL=https://your-app.vercel.app METRICS_ADMIN_SECRET=xxx node scripts/telemetry-weekly.mjs
 */
const base = process.env.BASE_URL?.replace(/\/$/, "");
const secret = process.env.METRICS_ADMIN_SECRET;

if (!base || !secret) {
  console.error("Set BASE_URL and METRICS_ADMIN_SECRET");
  process.exit(1);
}

const res = await fetch(`${base}/api/admin/metrics`, {
  headers: { Authorization: `Bearer ${secret}` },
});

const json = await res.json();
if (!res.ok || !json.ok) {
  console.error(json);
  process.exit(1);
}

const a = json.aggregate;
console.log(JSON.stringify({
  weekOf: new Date().toISOString().slice(0, 10),
  storage: json.storage,
  sampleSize: json.sampleSize,
  scanSuccess: a.scanSuccess,
  ctaRatePct: a.ctaClickRatePct,
  ctaDonate: a.ctaDonate,
  ctaAlternatives: a.ctaAlternatives,
  shareClick: a.shareClick,
}, null, 2));
