export function BusinessModel() {
  return (
    <section id="pricing" className="scroll-mt-20 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-semibold text-emerald-950">수익 모델</h2>
        <p className="mt-2 max-w-2xl text-emerald-900/70">
          Freemium으로 유저를 늘리고, 투명한 기부 수수료와 브랜드 그린 챌린지로 현장 프로젝트를 지속 가능하게 만듭니다.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-emerald-900/10 bg-[var(--gt-surface)] p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-emerald-950">Freemium</h3>
            <ul className="mt-4 space-y-2 text-sm text-emerald-900/80">
              <li>
                <span className="font-medium text-emerald-900">Free</span> — 하루 스캔 5회, 기본 NGO 매칭
              </li>
              <li>
                <span className="font-medium text-emerald-900">Pro</span> — 무제한 스캔, 공급망 심층 리포트·알림
              </li>
            </ul>
          </article>

          <article className="rounded-2xl border border-emerald-900/10 bg-[var(--gt-surface)] p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-emerald-950">소액 기부 · 10% 수수료</h3>
            <p className="mt-4 text-sm leading-relaxed text-emerald-900/80">
              스캔 직후 NGO에 바로 송금되는 흐름에서 플랫폼 운영·검증 비용 10%를 명시합니다. 영수증·배분 내역을 앱에서
              추적 가능하게 설계합니다.
            </p>
          </article>

          <article className="rounded-2xl border border-emerald-900/10 bg-[var(--gt-surface)] p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-emerald-950">그린 챌린지 스폰서십</h3>
            <p className="mt-4 text-sm leading-relaxed text-emerald-900/80">
              브랜드가 기간·목표를 걸고 사용자 행동과 매칭 기부를 후원합니다. 지도 스레드에 스폰서 배지·임팩트 대시보드를
              노출합니다.
            </p>
          </article>
        </div>

        <div className="mt-12 rounded-2xl border border-dashed border-emerald-700/30 bg-emerald-50/50 p-6">
          <p className="text-sm font-medium text-emerald-900">그린 챌린지 파트너 (플레이스홀더)</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {["EcoTransit", "CircularMart", "PurePlate"].map((name) => (
              <span
                key={name}
                className="rounded-full border border-emerald-800/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-800/80"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
