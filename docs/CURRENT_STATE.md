# CURRENT_STATE.md

> 현재 상태 스냅샷. 다음 세션 시작 시 빠른 파악용(이 문서만 통독, 나머지 docs는 grep).
> 최종 업데이트: 2026-06-25

## ★ 다음 진입점 (다음 세션 — 여기부터)

**추천 엔진 본체(F2부터) 구현 → 배포본에 점진 반영.** 프론트 mock은 배포 완료(https://moodyfit-alpha.vercel.app).
다음은 **화면은 안 건드리고(시그니처 유지)** 모든 mock 경계 함수 "속"만 실제 로직으로 채운다:

- **F2 후보 생성 → F3 랭킹** (`lib/recommend.ts`): `getHomeFeed`·`getExplore`·`getList`·`getSimilar`·`getMoreFromBrand`·`getProductDetail` — 취향 벡터↔태그 콘텐츠 유사도 후보 + 가중합 랭킹으로 `match`·`reason`을 **실제 산출**(상품에 박힌 정적 더미 대체). (D-012)
- **F4 챗 재랭킹** (`lib/chat-rerank.ts`): `parseReorderIntent`(발화→조건; 현 키워드 mock → LLM 의도 파싱)·`rerank`(조건→결과). (D-014)
- **F6 피드백 루프** (`lib/feedback.ts`): `applyFeedback` 정규화·감쇠·신호 가중치 보강(현 단순 ±delta). (D-013)
- **DB 연동 검토** (`lib/persistence.ts`, D-003): localStorage → 서버/DB. 인터페이스 `PersistenceStore`는 그대로, 구현만 교체.

**배포본에 점진 반영**: 경계를 채울 때마다 main 머지 → Vercel 자동 배포로 라이브(mock)에 점진 반영. 화면 시그니처가 안 바뀌니 UI 회귀 없음. (배포 설정·재배포 절차는 루트 `README.md` 「배포」)

**2번 백로그는 이때 같이 풀린다**(전부 F6/F2 경계): My 취향 키워드 델타(F6) · 컬렉션 무드 클러스터링(현 베이지 태그 mock → F2) · 상품 실제 이미지(데이터). → 아래 "알려진 이슈 / 백로그".
**1번 화면 점검**은 사용자가 직접 한 바퀴 도는 것으로 갈음(이번 세션 일단락).

## 구현 완료

> 한 줄 요약: **모든 화면 + 두 핵심 시트가 mock 경계 위에서 동작하고, 디자인 정본 2차 정합까지 끝나 Vercel 배포됨.** 화면별 상세 이력은 `CHANGELOG.md`, 결정 근거는 `DECISIONS.md`(grep으로 항목만).

- **인프라**: Next 15.5.19 / React 19.1 / TS / Tailwind v4 / App Router(`src/`), pnpm(corepack). Prettier(+`endOfLine auto`). 디자인 토큰 → `@theme`(D-008, Pretendard CDN). 검증 green(typecheck/lint/build). **빌드-린트는 끔, 린트 게이트 = `pnpm lint`**(flat config, CONVENTIONS).
- **상태/경계**(엔진 교체 지점 — 전부 mock 본체, `match`·`reason`은 더미): `app-state`(런치 머신 D-009) · `app-shell-state`(탭/푸시/시트/savedIds/컬렉션 — D-011·D-016·D-017) · `persistence`(mock 영속 D-003). 추천 `recommend.ts`(D-012) · 피드백 `feedback.ts`(D-013) · 챗 `chat-rerank.ts`(D-014).
- **런치 4화면**: Splash · Intro · Login · Onboarding(F1 취향 시드 → `buildTasteProfile` → 영속, 콜드스타트 D-005).
- **app 4탭**: Home · Explore · Saved · My. **푸시 3**: Detail · List · Search. **시트 2**: Feedback(F5/F6 실제 벡터 갱신) · Chat(F4 발화→조건→rerank). 전역 토스터(루트).
- **실데이터 연동된 부분**: 취향 키워드 바 = 실제 `tasteProfile.vector`(Home·My) · 찜 = 전역 savedIds + 컬렉션(영속) · 별로예요 = `recordFeedback(dislike)` −delta 실반영.
- **정본 고충실도 2차(#39~#47)**: 화면 전면 정합(프레임 390×844 · Home 오늘의 픽 무한루프 슬라이더 · 브랜드명 Moodyfit · Detail · Saved+AI컬렉션 · Explore AI발견 배너 · List ListView · Search 인라인 결과). 순수 UI/연출 — 엔진 본체(F2·F3·F6) 미변경.
- **해결된 이슈**: 시트 점프·열림 jank(#31·#36 → D-016 / L-006·L-007) · 폰트 Pretendard 통일(모노 악센트 제거, 워드마크만 Helvetica) · 메인 스크롤바 숨김 + 가로 슬라이더 화살표/자동넘김.
- **프론트 mock 배포 완료(Vercel)**: https://moodyfit-alpha.vercel.app — main push 자동 배포, env 없음. 배포 설정·재배포 절차는 루트 `README.md` 「배포」, 요약은 memory `deploy-vercel`.

## 미구현 / 진행 중

- [ ] **실제 엔진/연동(= 다음 진입점)**: F2·F3 추천 파이프라인, F4 LLM 의도 파싱, F6 정규화·감쇠·가중치, DB 연결(D-003).
- [ ] 폴리시 잔여(선택): 시트 풀 포커스 트랩(Tab 순환), 전체 흐름 전환 미세 다듬기.

## 알려진 이슈 / 백로그

- 상품 이미지는 flat color block 플레이스홀더 → 실제 사진 필요(들어오면 Detail 히어로 캐러셀도 자연 해소).
- handoff 'Planned': "별로예요" 이유 피커(색/핏/가격). 범위 들어오면 구현.
- **My 취향 키워드 델타**(정본 §8 "미니멀 78% +6"): F6(취향 변화 추적) 영역 → mock으로 박지 않음. TasteBars에 delta 옵션 생기면 표시.
- **feedback "학습 변화" 바 ↔ TasteBars**: 현재 델타(before→after) 표현 때문에 자체 바(의도적 분리, OK). 추후 TasteBars delta 옵션 시 통일 여지.

## 인프라 / 핵심 모듈 포인터

- 정본: `docs/README.md`(디자인·제품), `docs/prd.md`(기능 F1~F6).
- 디자인 레퍼런스/스키마: `docs/prototype-handoff/design_files/` (`styles.css`=토큰, `data.js`=데이터 모델).
- 결정 근거: `docs/DECISIONS.md`. 규칙: `docs/CONVENTIONS.md`. 보안: `docs/SECURITY.md`.
- 앱 진입: `src/app/` (layout.tsx, page.tsx, globals.css). 설정: `next.config.ts`(turbopack.root, eslint.ignoreDuringBuilds), `pnpm-workspace.yaml`(allowBuilds).
- **배포(Vercel)·재배포 절차**: 루트 `README.md` 「배포」 — main 자동 배포, env 없음, `next build --turbopack`(깨지면 `--turbopack` 제거로 폴백), 빌드-린트 off(린트는 `pnpm lint`).
- 검증: `corepack pnpm typecheck` / `lint` / `build` (pnpm은 PATH shim 불가 → corepack 경유).
