# Moodyfit (무디핏)

> 취향을 학습해 옷을 골라주는 모바일 패션-커머스 **AI 초개인화 추천 앱**.
> Multi-select shop with an AI agent (recommendation system attached).

## 라이브 데모

- **https://moodyfit-alpha.vercel.app** — **프론트 mock 배포 완료** (Vercel)
- ⚠️ 현재는 **UI/플로우 mock 단계**: 추천·챗·피드백은 교체 가능한 mock 경계(`lib/`) 위에서 동작하고, 실제 추천 엔진은 다음 단계입니다. 데이터는 브라우저 localStorage(방문자/기기별 독립, 서버 동기 없음).

## 다음

**추천 엔진 본체(F2부터) 구현 → 배포본에 점진 반영.** 화면은 그대로 두고 `lib/`의 mock 경계 함수 "속"만 실제 로직으로 채운 뒤 main에 머지하면 Vercel 자동 배포로 라이브(mock)에 점진 반영됩니다(화면 시그니처 불변 → UI 회귀 없음). 상세 진입점은 [`docs/CURRENT_STATE.md`](docs/CURRENT_STATE.md) 최상단 참고.

## 스택

TypeScript · Next.js 15.5 (App Router, `src/`) · React 19 · Tailwind v4 · pnpm(corepack). 백엔드는 별도 서버 없이 Next API 라우트로 통합(예정).

## 개발

```bash
corepack pnpm install
corepack pnpm dev        # 개발 서버
corepack pnpm typecheck  # 타입 검사
corepack pnpm lint       # 린트 게이트(빌드-린트는 끔 — 아래 배포 참고)
corepack pnpm build      # 프로덕션 빌드(turbopack)
```

> 로컬 프로덕션 검증은 `corepack pnpm build && corepack pnpm start`. dev 서버가 떠 있으면 멈추고 돌릴 것(같은 `.next` 공유 시 손상 — `docs/LESSONS.md` L-003).

## 배포 (Vercel) — 재배포 시 참고

- **연결**: GitHub 레포를 Vercel 대시보드에서 import → **main push 시 자동 배포**(PR은 프리뷰). 별도 GitHub Actions/CI 없음 — Vercel GitHub App이 처리. `vercel.json` 없음.
- **프로젝트 설정(자동 감지, 손댈 것 없음)**: Framework = Next.js, Root Directory = `./`, Install = `pnpm install`(`package.json`의 `packageManager`로 pnpm 사용), Build = `pnpm build`. **환경변수 없음.**
- **빌드 = `next build --turbopack`**(turbopack 프로덕션 빌드). 혹시 Vercel에서 turbopack 빌드가 깨지면 `package.json`의 `build`에서 `--turbopack`만 제거해 webpack 빌드로 폴백.
- **`next.config.ts`**: `eslint.ignoreDuringBuilds: true`(빌드-린트는 끄고 린트는 `pnpm lint`로 일원화 — `eslint-config-next`의 react-hooks 플러그인이 pnpm 엄격 모드에서 빌드-린트 러너에 안 잡혀서. 타입체크는 빌드에서 계속 수행) · `turbopack.root`(상위 lockfile 추론 경고 방지).
- **`pnpm-workspace.yaml`**: `allowBuilds`(sharp, unrs-resolver) — pnpm이 네이티브 빌드 스크립트를 막아 검증이 죽는 것 방지(`docs/LESSONS.md` L-001).
- 폰트: Pretendard를 `layout.tsx`에서 CDN(jsDelivr)으로 로드(환경변수·자가호스팅 없음).

## 문서

- 작업 컨텍스트(에이전트용): [`CLAUDE.md`](CLAUDE.md) · 현재 상태/다음 진입점: [`docs/CURRENT_STATE.md`](docs/CURRENT_STATE.md) · 변경 이력: [`CHANGELOG.md`](CHANGELOG.md)
- 디자인·제품 정본: [`docs/README.md`](docs/README.md) · 기능 명세(F1~F6): [`docs/prd.md`](docs/prd.md) · 설계 결정: [`docs/DECISIONS.md`](docs/DECISIONS.md) · 규칙: [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md)
