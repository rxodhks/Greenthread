import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-emerald-900/10 bg-[var(--gt-surface)] px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-emerald-900/65">
          © {new Date().getFullYear()} GreenThread — MVP UI. 배출 수치·NGO 연결은 시연용입니다.
        </p>
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <Link href="/privacy" className="text-xs text-emerald-800/70 underline hover:text-emerald-950">
            개인정보 및 AI 처리 안내
          </Link>
          <p className="text-xs text-emerald-800/50">Next.js · 실제 출시 전 법무·검증 파트너십이 필요합니다.</p>
        </div>
      </div>
    </footer>
  );
}
