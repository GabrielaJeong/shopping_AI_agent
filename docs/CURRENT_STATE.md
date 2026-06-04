# CURRENT_STATE.md

> 현재 상태 스냅샷. 다음 세션 시작 시 빠른 파악용.
> 최종 업데이트: 2026-06-04

## 구현 완료

- [x] 문서 하네스 부트스트랩 (CLAUDE.md, docs 스켈레톤, CHANGELOG, memory 인덱스, SECURITY)
- [x] 핵심 설계 결정 기록 (DECISIONS D-001~D-007: 스택·단계전환·DB·추천파이프라인·콜드스타트·제품명·Next버전)
- [x] 앱 스캐폴드 (Next.js 15.5.19 + React 19.1 + TypeScript + Tailwind v4 + App Router + src/, pnpm via corepack). 베이스라인 검증 green: typecheck / lint / build 통과.

## 미구현 / 진행 중

- [ ] 디자인 토큰 → Tailwind 매핑 (출처: 프로토타입 styles.css)
- [ ] 런치 플로우 (splash → intro → login → onboarding)
- [ ] app 4탭 (home / explore / saved / my) + 푸시 화면 (detail / list / search)
- [ ] 핵심 시트 2종 (feedback, AI chat) — UI/mock
- [ ] 추천/챗봇/피드백 로직 (PRD F2~F6) — 이후 단계, 현재 mock 인터페이스
- [ ] LLM 챗봇 실제 연동 — 이후 단계

## 알려진 이슈 / 백로그

- 프로토타입의 상품 이미지는 flat color block 플레이스홀더 → 실제 사진 필요.
- handoff에 'Planned(미구현)'로 남은 항목: "별로예요" 시 이유 피커(색/핏/가격). 범위 들어오면 구현.

## 인프라 / 핵심 모듈 포인터

- 정본: `docs/README.md`(디자인·제품), `docs/prd.md`(기능 F1~F6).
- 디자인 레퍼런스/스키마: `docs/prototype-handoff/design_files/` (`styles.css`=토큰, `data.js`=데이터 모델).
- 결정 근거: `docs/DECISIONS.md`. 규칙: `docs/CONVENTIONS.md`. 보안: `docs/SECURITY.md`.
- 앱 진입: `src/app/` (layout.tsx, page.tsx, globals.css). 설정: `next.config.ts`(turbopack.root 고정), `pnpm-workspace.yaml`(allowBuilds).
- 검증: `corepack pnpm typecheck` / `lint` / `build` (pnpm은 PATH shim 불가 → corepack 경유).
