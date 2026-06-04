# CURRENT_STATE.md
> 현재 상태 스냅샷. 다음 세션 시작 시 빠른 파악용.
> 최종 업데이트: 2026-06-03

## 구현 완료
- [x] 문서 하네스 부트스트랩 (CLAUDE.md, docs 스켈레톤, CHANGELOG, memory 인덱스, SECURITY)
- [x] 스택/단계 전환 결정 기록 (DECISIONS D-001, D-002)

## 미구현 / 진행 중
- [ ] 앱 스캐폴드 (Next.js App Router + TypeScript + Tailwind + pnpm) — 아직 없음
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
