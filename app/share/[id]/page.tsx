import Link from "next/link";
import { notFound } from "next/navigation";
import { getScenarioById } from "@/lib/mockScan";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const s = getScenarioById(id);
  if (!s) return { title: "GreenThread" };
  return {
    title: `${s.label} — GreenThread (추정)`,
    description: `교육용 데모 추정 탄소 발자국: 약 ${s.co2Kg} kg CO₂e. 법적·회계적 근거가 아닙니다.`,
    openGraph: {
      title: `${s.label} — GreenThread`,
      description: `추정 탄소 발자국 데모 · ${s.itemLabel}`,
    },
  };
}

function formatCo2(kg: number) {
  if (kg >= 1) return `${kg.toFixed(1)} kg CO₂e`;
  return `${(kg * 1000).toFixed(0)} g CO₂e`;
}

export default async function ShareScenarioPage({ params }: Props) {
  const { id } = await params;
  const s = getScenarioById(id);
  if (!s) notFound();

  return (
    <div className="min-h-screen bg-[var(--gt-bg)] px-4 py-12 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-lg rounded-2xl border border-emerald-900/15 bg-[var(--gt-surface)] p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-700/80">GreenThread · 공유 카드 (추정)</p>
        <h1 className="mt-2 text-xl font-semibold text-emerald-950">{s.label}</h1>
        <p className="mt-4 text-3xl font-semibold tabular-nums text-emerald-800">{formatCo2(s.co2Kg)}</p>
        <p className="mt-1 text-sm text-emerald-900/75">{s.itemLabel}</p>
        <p className="mt-4 text-xs leading-relaxed text-emerald-800/70">
          {s.sourceNote} (버전 {s.factorVersion})
        </p>
        <p className="mt-4 text-xs text-emerald-800/55">
          이미지·개인 데이터는 포함되지 않습니다. 수치는 교육용 데모이며 법적 보증이 아닙니다.
        </p>
        <Link
          href="/#scan"
          className="mt-8 inline-flex rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
        >
          GreenThread에서 직접 스캔하기
        </Link>
      </div>
    </div>
  );
}
