import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-900/15 bg-[var(--gt-surface)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-emerald-950">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm text-white shadow-sm"
            aria-hidden
          >
            GT
          </span>
          GreenThread
        </Link>
        <nav className="flex items-center gap-4 text-sm text-emerald-900/80">
          <a href="#scan" className="hover:text-emerald-700">
            실시간 스캔
          </a>
          <a href="#thread" className="hidden sm:inline hover:text-emerald-700">
            글로벌 스레드
          </a>
          <a href="#pricing" className="hover:text-emerald-700">
            요금제
          </a>
          <Link href="/privacy" className="hover:text-emerald-700">
            개인정보
          </Link>
        </nav>
      </div>
    </header>
  );
}
