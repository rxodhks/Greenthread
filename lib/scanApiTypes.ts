import type { ScanScenario } from "@/lib/mockScan";

export type ScanApiSuccess = {
  ok: true;
  scenario: ScanScenario;
  source: "vision" | "mock";
  visionNote?: string;
};

export type ScanApiError = {
  ok: false;
  error: string;
};

export type ScanApiResponse = ScanApiSuccess | ScanApiError;
