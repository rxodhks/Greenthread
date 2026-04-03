import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보 및 AI 처리 안내 — GreenThread",
  description: "GreenThread 데모의 이미지·제3자 AI 처리 및 데이터 보관에 관한 안내입니다.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--gt-bg)] px-4 py-12 text-emerald-950 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm text-emerald-800/80">
          <Link href="/" className="underline hover:text-emerald-950">
            ← 홈
          </Link>
        </p>
        <h1 className="mt-6 text-2xl font-semibold">개인정보 및 AI 처리 안내</h1>
        <p className="mt-2 text-sm text-emerald-800/80">최종 수정: 제품 데모 기준 안내 문구입니다.</p>

        <section className="mt-10 space-y-4 text-sm leading-relaxed text-emerald-900/90">
          <h2 className="text-base font-semibold text-emerald-950">1. 수집하는 정보</h2>
          <p>
            스캔 시 선택한 <strong>카테고리</strong>와, 선택적으로 <strong>이미지 파일</strong>이 서버로 전송될 수 있습니다. 별도
            회원가입이 없으면 이메일·이름 등은 수집하지 않습니다.
          </p>

          <h2 className="pt-4 text-base font-semibold text-emerald-950">2. 제3자 AI (OpenAI)</h2>
          <p>
            서버에 <code className="rounded bg-emerald-100/80 px-1 text-xs">OPENAI_API_KEY</code>가 설정된 경우, 업로드 이미지가
            분석 목적으로 <strong>OpenAI</strong> API로 전송될 수 있습니다. 전송 전 스캔 영역의 안내를 확인해 주세요. OpenAI의
            개인정보처리방침은 OpenAI 정책을 따릅니다.
          </p>

          <h2 className="pt-4 text-base font-semibold text-emerald-950">3. 이미지 보관</h2>
          <p>
            본 데모 구현은 스캔 완료 후 <strong>이미지를 영구 저장하지 않는 것</strong>을 목표로 합니다. 운영 환경·로그 설정에 따라
            일시적 기술 로그가 남을 수 있습니다.
          </p>

          <h2 className="pt-4 text-base font-semibold text-emerald-950">4. 텔레메트리</h2>
          <p>
            스캔 성공/실패, 버튼 클릭 등 <strong>이벤트 이름과 비식별 속성</strong>이 기록될 수 있습니다. 관리형 저장소(Redis)를
            쓰면 집계·운영 목적으로 보관됩니다.
          </p>

          <h2 className="pt-4 text-base font-semibold text-emerald-950">5. 기부·외부 링크</h2>
          <p>
            기부 등 외부 사이트로 이동하면 해당 사이트의 정책이 적용됩니다. GreenThread는 외부 결제·기부의 당사자가 아닙니다(데모
            연결).
          </p>

          <h2 className="pt-4 text-base font-semibold text-emerald-950">6. 문의</h2>
          <p>
            정책 관련 문의는 사이트 운영자 연락처(예: 푸터 또는 별도 안내)를 이용해 주세요.
          </p>
        </section>
      </div>
    </div>
  );
}
