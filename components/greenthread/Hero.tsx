export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-emerald-900/10 bg-gradient-to-b from-emerald-50/80 to-[var(--gt-bg)] px-4 py-16 sm:px-6 sm:py-20">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-5xl">
        <p className="mb-3 inline-flex rounded-full border border-emerald-700/20 bg-white/60 px-3 py-1 text-xs font-medium text-emerald-800">
          개인 행동 → 지구 반응, 한 스레드로 연결
        </p>
        <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-emerald-950 sm:text-4xl md:text-5xl">
          카메라 한 번으로 탄소·공급망을 실시간 이해하고, NGO 액션과 바로 잇습니다.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-emerald-900/75 sm:text-lg">
          음식·교통·쇼핑을 스캔하면 AI가 개인 탄소 발자국과 글로벌 공급망 영향을 즉시 보여 줍니다. 전 세계 사용자의 선택이 지도 위
          하나의 스레드로 이어져, 기부와 챌린지로 현장 프로젝트에 연결됩니다.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#scan"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-emerald-900/15 transition hover:bg-emerald-700"
          >
            데모 스캔 시작
          </a>
          <a
            href="#thread"
            className="inline-flex items-center justify-center rounded-full border border-emerald-800/20 bg-white/70 px-5 py-2.5 text-sm font-medium text-emerald-900 transition hover:border-emerald-700/40"
          >
            글로벌 스레드 보기
          </a>
        </div>
      </div>
    </section>
  );
}
