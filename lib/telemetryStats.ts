import type { TelemetryRow } from "@/lib/telemetryMemory";

export type TelemetryAggregate = {
  total: number;
  byEvent: Record<string, number>;
  scanSuccess: number;
  scanError: number;
  ctaDonate: number;
  ctaAlternatives: number;
  shareClick: number;
  shareCopySuccess: number;
  shareNative: number;
  /** (기부+대체) 클릭 / 스캔 성공, 퍼센트. 스캔 성공 0이면 null */
  ctaClickRatePct: number | null;
  byScanSource: { vision: number; mock: number };
};

export function aggregateTelemetry(rows: TelemetryRow[]): TelemetryAggregate {
  const byEvent: Record<string, number> = {};
  let scanSuccess = 0;
  let scanError = 0;
  let ctaDonate = 0;
  let ctaAlternatives = 0;
  let shareClick = 0;
  let shareCopySuccess = 0;
  let shareNative = 0;
  let vision = 0;
  let mock = 0;

  for (const r of rows) {
    byEvent[r.event] = (byEvent[r.event] ?? 0) + 1;
    switch (r.event) {
      case "scan_success":
        scanSuccess += 1;
        if (r.props?.source === "vision") vision += 1;
        else if (r.props?.source === "mock") mock += 1;
        break;
      case "scan_error":
        scanError += 1;
        break;
      case "cta_donate_click":
        ctaDonate += 1;
        break;
      case "cta_alternatives_click":
        ctaAlternatives += 1;
        break;
      case "share_click":
        shareClick += 1;
        break;
      case "share_copy_success":
        shareCopySuccess += 1;
        break;
      case "share_native":
        shareNative += 1;
        break;
      default:
        break;
    }
  }

  const ctaSum = ctaDonate + ctaAlternatives;
  const ctaClickRatePct = scanSuccess > 0 ? Math.round((ctaSum / scanSuccess) * 1000) / 10 : null;

  return {
    total: rows.length,
    byEvent,
    scanSuccess,
    scanError,
    ctaDonate,
    ctaAlternatives,
    shareClick,
    shareCopySuccess,
    shareNative,
    ctaClickRatePct,
    byScanSource: { vision, mock },
  };
}
