# CONVENTIONS.md

> Moodyfit 코딩 규칙 상세. CLAUDE.md "코딩 규칙(요약)"의 풀버전.
> 빈 스켈레톤으로 시작 — 스택 스캐폴드 후 실제 패턴이 정해지면 항목을 채운다.

## 네이밍

- 파일: **kebab-case** (`app-state.tsx`, `product-img.tsx`). 컴포넌트/타입: **PascalCase**, 함수/변수: **camelCase**, 상수: **UPPER_SNAKE**.
- 컴포넌트는 named export 선호(`export function Button`). 페이지(`app/**/page.tsx`)만 default export.
- import 별칭 `@/*` = `src/*`.

## 계층 경계

- `src/lib/` = 도메인/인프라 로직(상태 머신 `app-state`, 영속화 `persistence`, 추천(mock) 등). 화면은 이 인터페이스만 소비.
- `src/components/` = UI. 재사용 프리미티브는 `src/components/ui/`(`button`/`chip`/`card`), 화면은 `src/components/screens/`.
- `src/app/` = App Router 진입(`layout`, `page`). 라우트는 얇게, 로직은 lib/components로 위임.
- **영속화는 반드시 `persistence` 인터페이스 경유**(localStorage 직접 호출 금지 — D-003/D-009로 DB 교체 가능하게).
- 이벤트 핸들러를 받거나 hook을 쓰는 컴포넌트는 `"use client"`. 순수 표현(예: `Card`)은 서버 컴포넌트로 둔다.
- className 합성은 `@/lib/cn`(`cn(...)`)을 쓴다.

## 디자인 토큰 / 스타일

- **출처**: 프로토타입 `docs/prototype-handoff/design_files/styles.css` = 토큰의 단일 진실. 색/타이포/radius/shadow를 임의 값으로 하드코딩하지 말 것.
- **정의 위치**: `src/app/globals.css`의 `@theme` 블록 (Tailwind v4 CSS-first). `tailwind.config.*`는 만들지 않는다 (→ D-008).
- **네이밍 → 유틸리티**:
  - 색 `--color-paper / paper-2 / paper-3 / paper-deep / ink / ink-2 / ink-3 / ink-soft / line / line-soft / accent / accent-soft / accent-deep / hot / hot-soft / down` → `bg-*` `text-*` `border-*`.
  - radius `--radius-image|chip|btn|card|sheet` → `rounded-*`. shadow `--shadow-card|sheet|elev` → `shadow-*`.
  - 텍스트 `--text-display|h1|h2|h3|body|body-2|caption|label|price` (size + `--line-height`/`--letter-spacing`/`--font-weight` 모디파이어) → `text-*`. `label`은 `uppercase`를 함께.
- **간격**: Tailwind 기본 스케일(4px step) 사용. 화면 좌우 패딩 20px = `px-5`, 6px = `gap-1.5`, 10px = `gap-2.5`.
- **폰트**: 본문 `font-sans`(Pretendard), 워드마크 `font-brand`(Helvetica/Arial). 이모지 금지.
- 새 토큰이 필요하면 styles.css 근거를 확인하고 `@theme`에 추가 후 사용. 컴포넌트 전용 일회성 값은 토큰화하지 않는다.
- **클릭 커서**: 손가락 커서는 `globals.css`의 **unlayered 전역 규칙**(`button:not(:disabled)`/`[role="button"]:not([aria-disabled])`/`a[href]`/`summary`)이 일괄 처리한다. ⚠️ 이 규칙은 **`@layer` 밖**에 둬야 한다 — `@layer base`에 넣으면 이 Tailwind v4 셋업에서 raw `<button>`(명시적 `cursor-pointer` 없는 것)에 적용이 안 됐다(BannerChip·TasteBars 행 등). unlayered라야 모든 레이어보다 우선해 확실히 적용된다. 클릭 요소마다 `cursor-pointer`를 붙일 필요 없다(붙어도 무해). 비활성(`:disabled`/`aria-disabled`)은 `:not()`으로 제외되어 그 요소의 `cursor-not-allowed` 등을 덮지 않는다.

## UI 알림(토스트)

- **사용자 액션 확인 알림은 공용 토스터를 쓴다** — `useToast().toast(msg)`(`@/lib/toast`). 새 토스트/스낵바/배너 컴포넌트를 만들지 말 것.
- 렌더는 **AppRoot의 단일 `Toaster`**(하단, 자동 소멸). `ToastProvider`가 stage보다 위에 있어 로그아웃·취향 재설정처럼 화면을 떠나는 액션의 토스트도 보인다.
- 토스트 문구는 **실제로 일어난 동작을 반영**한다(빈 약속 금지). 예: "비슷한 추천을 줄일게요"는 실제 −delta 반영(F6)과 짝.
- 적용 대상(예): 찜 추가/해제, 피드백 반영, 로그아웃·취향 재설정, 컬렉션 생성 등.

## 포맷팅 (Prettier)

- 포맷은 **Prettier 단독** 담당, ESLint는 코드 품질만 본다 (`eslint-config-prettier/flat`로 포맷 규칙 비활성 → 충돌 없음).
- **린트 게이트는 `pnpm lint`(flat config `eslint.config.mjs`) 한 곳으로 일원화.** Next 빌드 내부 ESLint는 **끈다**(`next.config.ts` `eslint.ignoreDuringBuilds: true`) — `eslint-config-next`의 `react-hooks` 플러그인이 pnpm 엄격 모드에서 빌드-린트 러너의 require 경로로 해석 안 돼 빌드 로그에 ⨯가 찍히기 때문(코드는 `pnpm lint`로 이미 깨끗). **린트를 끈 게 아니라 한 곳으로 모은 것** — 린트는 `pnpm lint`로 계속 돌린다. **타입체크(tsc)는 빌드에서 계속 수행**된다(`typescript.ignoreBuildErrors`는 켜지 않음).
- 설정: `.prettierrc.json` (semi, double-quote, printWidth 100, tabWidth 2, trailingComma all, **endOfLine auto**). 무시: `.prettierignore` (빌드 산출물·lock·프로토타입 레퍼런스·바이너리).
- `endOfLine: "auto"`는 Windows의 git autocrlf로 working tree가 CRLF가 돼도 `format:check`가 실패하지 않게 한다 (→ L-002).
- 명령: 정리 `corepack pnpm format` / 검증 `corepack pnpm format:check`. 커밋 전 `format:check` 통과를 기본으로 한다.

## 에러 응답 형식 (API 라우트)

- ( 통일된 에러 스키마. 확정 후 기록 )

## 입력 검증 위치

- ( 검증을 어디서 하는가. 확정 후 기록 )

## 자주 발생한 버그 패턴 → 해결

| 패턴     | 해결 |
| -------- | ---- |
| ( 누적 ) |      |
