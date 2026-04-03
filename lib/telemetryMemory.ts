export type TelemetryRow = {
  event: string;
  props?: Record<string, unknown>;
  ts: number;
  ip: string;
};

const MAX = 2000;

declare global {
  var __gtTelemetryRows: TelemetryRow[] | undefined;
}

function bucket(): TelemetryRow[] {
  if (!globalThis.__gtTelemetryRows) globalThis.__gtTelemetryRows = [];
  return globalThis.__gtTelemetryRows;
}

export function pushTelemetryMemory(row: TelemetryRow) {
  const b = bucket();
  b.unshift(row);
  if (b.length > MAX) b.length = MAX;
}

export function getTelemetryMemory(): TelemetryRow[] {
  return [...bucket()];
}
