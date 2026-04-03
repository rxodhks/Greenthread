# Greenthread

Next.js 앱. 로컬 설정은 [.env.example](.env.example)를 참고하세요.

## Getting Started

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인합니다.

## Build

```bash
npm run build
npm run start
```

## Deploy checklist (Vercel 등)

1. **환경 변수**: Production(및 Preview 사용 시 Preview)에 Redis URL·토큰 쌍(`UPSTASH_REDIS_*` 또는 `KV_REST_*`)과 `METRICS_ADMIN_SECRET`을 넣습니다. 자세한 체크 항목은 [.env.example](.env.example) 하단 주석을 따릅니다.
2. **재배포**: 변수 변경 후 반드시 **Redeploy** 합니다.
3. **스모크 테스트**: 배포 URL에서 스캔 데모 1회 실행 → `/admin/metrics`에서 secret 입력 후 조회 시 샘플 수·스캔 성공이 증가하는지 확인합니다. 지도의 최근 스캔 노드는 `/api/thread-events` 폴링으로 반영됩니다.

## Weekly telemetry snapshot

주간 집계 JSON을 콘솔에 출력합니다 (로컬 또는 CI).

```bash
set BASE_URL=https://your-deployment.example.com
set METRICS_ADMIN_SECRET=your-secret
npm run telemetry:week
```

Unix 계열에서는 `export BASE_URL=...` `export METRICS_ADMIN_SECRET=...` 후 동일하게 실행합니다. GitHub Actions 등에서 주 1회 스케줄로 돌리려면 위 두 변수를 시크릿으로 넣고 `npm run telemetry:week`만 호출하면 됩니다.

클라이언트 제품 이벤트(공유·CTA 등)는 **`POST /api/beacon`** 으로 전송합니다. 레거시 **`POST /api/telemetry`** 는 동일 동작으로 유지됩니다.

## Learn More (Next.js)

- [Next.js Documentation](https://nextjs.org/docs)
- [Deploying Next.js](https://nextjs.org/docs/app/building-your-application/deploying)
