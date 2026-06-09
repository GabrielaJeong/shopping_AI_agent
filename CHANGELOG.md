# CHANGELOG

> Moodyfit 버전 이력. 최신이 맨 위. 세션 시작 시 최상단 몇 개만 확인.

## [Unreleased]

### Added

- 문서 하네스 부트스트랩: `CLAUDE.md`, `docs/`(CONVENTIONS·LESSONS·DECISIONS·CURRENT_STATE·SESSION_CHECKLIST·SECURITY), `CHANGELOG.md`, `memory/MEMORY.md` 생성.
- 설계 결정 기록: `docs/DECISIONS.md` D-001~D-012 (스택, UI먼저·로직mock, DB=PostgreSQL, 추천 파이프라인 단계전환, 콜드스타트, 제품명 Moodyfit, Next 15 고정, 디자인 토큰=Tailwind v4 @theme, 앱 구조=단일 루트 상태 머신, 취향 벡터 구조, app 셸 상태 분리, 추천 경계 getHomeFeed). 각 결정에 PRD F1~F6 연결.
- **디자인 토큰 매핑**: 프로토타입 `styles.css` 토큰을 `globals.css` `@theme`로 1:1 이식(색·타이포 스케일·radius·shadow). Pretendard 동적 서브셋 CDN을 `layout.tsx`에서 로드(Geist 제거, lang=ko, metadata=Moodyfit). 빌드 CSS에 유틸리티 생성 확인. 토큰 미리보기는 `/foundation`으로 이동.
- **런치 파운데이션**: 단일 루트 상태 머신(`lib/app-state`) + mock 영속화(`lib/persistence`, moodyfit_onboarded). 공통 프리미티브(`Icon`/`MudifitMark·Logo`/`Button`/`Chip`/`Card`/`ProductImg`/`cn` 헬퍼) — atoms.jsx 재현. **Splash** 실제 구현(1.8s 자동 전환), intro/login/onboarding/app은 전이 검증 플레이스홀더. splash-in/fade-up 애니메이션 + reduced-motion 가드.
- **데이터 모델 포팅**: `types/`(Product·TasteKeyword·TrendingTerm·AiReply 등 — match·reason·delta를 "추천 엔진 F2~F6이 계산할 더미"로 타입/주석 명시) + `data/`(샘플 카탈로그·취향·검색·챗, 한국어 보존) + 헬퍼 `format`/`byId`. `ProductImgColors`를 `@/types`로 일원화.
- **Intro 캐러셀**: 3슬라이드(취향 추천 / 학습 루프 / 찜·컬렉션) + 미니 목업(MockReco·MockFeedback·MockSaved, 프리미티브·샘플 데이터로 축소 재현), 점 인디케이터, 건너뛰기·다음·시작하기. AppRoot 연결(intro 플레이스홀더 대체).
- **Login 화면**: 브랜드+히어로 카피, 상품 티저 3-up, 이메일/Apple/카카오/둘러보기 버튼 + 약관 캡션. Button에 `secondary` 변형(paper-2) 추가. AppRoot 연결(login 플레이스홀더 대체). Apple·카카오는 모노 플레이스홀더(실 SDK 이후).
- **Onboarding 5단계 취향 퀴즈(F1)**: welcome→steps(무드/예산/카테고리/컬러/라이프스타일, min검증+CTA활성)→analyzing(연출)→summary. 핵심은 "선택→취향 벡터 생성·저장": `types`의 `TasteVector`/`TasteProfile`, `lib/taste-vector`(`buildTasteProfile`·`emptyTasteProfile`·`topTasteTags`), `persistence`에 취향 프로필 저장(키 moodyfit_taste_profile), `app-state.finishOnboarding(profile)`/`skipOnboarding`/`tasteProfile` 추가. 콜드스타트(둘러보기/미완료=빈 벡터, D-005) 처리. summary 매치%는 표시용 더미. (→ D-010)
- **app 셸 + 하단 내비 + 전역 saved(D-011)**: `lib/app-shell-state`(tab/screen(detail·list·search)/sheet(feedback·chat)/savedIds, 런치 상태와 분리), `components/bottom-nav`(4탭, 탭전환 시 screen=home 리셋, list는 home 하이라이트 유지), `components/app-shell`(탭/푸시/시트 플레이스홀더 + 시트 오버레이). 전역 savedIds 토글 + persistence 영속(키 moodyfit_saved_ids). AppRoot가 app 스테이지에서 AppShell 마운트(임시 플레이스홀더 제거).
- **피드백 시트(F5/F6, D-013)**: `lib/feedback.applyFeedback(taste, product, signal)` — 부호 있는 델타(like/save/dislike/hide)로 취향 벡터 갱신 + 변화 반환. `app-state.recordFeedback`가 호출해 **실제 갱신·persistence 영속**. 시트 UI: 성공 히어로(pulse-soft) + "학습 변화" 바(=실제 before→after, 화면용 가짜 숫자 아님) + 비슷한 상품 3-up(`getSimilar`, 경계 D-012) + CTA(AI에게 더 물어보기→chat / 계속 둘러보기). SheetOverlay를 열릴 때만 마운트+슬라이드업으로 재구성. globals에 `pulse-soft` 추가.
- **Detail 푸시 화면**: 이미지 히어로(back·인디케이터)·썸네일·브랜드/이름/가격·match%·reason·옵션(컬러/사이즈)·피드백 4버튼. 데이터는 `getProductDetail(id)` 경계(D-012, match·reason은 F3가 채울 더미). 좋아요→savedIds 추가+feedback 시트, 저장→토글, 비슷한→chat 시트, 별로예요→부정신호 슬롯(F6 −delta·planned 이유선택 주석). 좋아요 하트는 outline+accent-soft(활성처럼 안 보이게). AppShell detail 슬롯 연결.
- **추천 경계 + Home 탭(D-012)**: `lib/recommend.ts` `getHomeFeed(tasteProfile)` 진입 함수(정적 mock, F2 후보생성→F3 랭킹 교체 지점; match·reason은 엔진이 계산할 더미). 화면은 이 함수만 소비. 프리미티브 `ProductCard`(.p-card 재현)·`Reason`(HTML 근거, sanitize 주의) 신설. **Home** 실제 화면: 앱바·검색진입·카테고리 인스크린 필터·AI 배너(→chat 시트)·오늘의 픽 히어로(reason·match%)·픽 가로스크롤·섹션별 추천(전체보기→list). 카드→detail, 찜=전역 savedIds. AppShell 홈 탭에 연결(HomeDemo 제거).
- **앱 스캐폴드**: Next.js 15.5.19 + React 19.1 + TypeScript + Tailwind v4 + App Router(`src/`), pnpm(corepack). `next.config.ts` turbopack.root 고정, `pnpm-workspace.yaml` allowBuilds(sharp·unrs-resolver), `package.json`에 `typecheck` 스크립트 추가.
- 베이스라인 검증 통과: `typecheck` / `lint` / `build` 모두 green.
- **Prettier 도입**: prettier 3.8 + eslint-config-prettier 10(`/flat`)로 ESLint와 무충돌 구성. `.prettierrc.json`·`.prettierignore` 추가, `format`·`format:check` 스크립트 추가. CONVENTIONS·검증 명령 목록에 반영.

### Fixed

- `.prettierrc.json`에 `endOfLine: "auto"` 추가 — Windows autocrlf로 CRLF가 된 working tree에서 `format:check`가 전 파일 실패하던 문제 해결 (L-002).
- dev 서버 실행 중 `pnpm build` 동시 실행으로 `.next` 손상(`_buildManifest` ENOENT → Internal Server Error). `.next` 삭제·재기동으로 복구. 재발 방지 규칙은 L-003 / CLAUDE Red Flag.

### Lessons

- L-001: pnpm 11의 ignored build scripts가 typecheck/lint/build를 차단 → `pnpm-workspace.yaml allowBuilds`로 해결. CLAUDE.md Red Flag로 승격.
- L-002: Prettier `endOfLine` 기본값 + Windows autocrlf로 `format:check` 실패 → `endOfLine: "auto"`.
- L-003: dev 실행 중 `pnpm build` 동시 실행 → `.next` 손상. CLAUDE.md Red Flag로 승격.
- L-004: PowerShell 5.1에서 `gh pr create --body "...따옴표..."`가 인자 분해 → PR 본문은 항상 `--body-file` 사용.

### Notes

- CLAUDE.md Red Flags 보유: L-001(pnpm 빌드 차단), L-003(dev 중 build로 .next 손상).
- 제품명 표기 Moodyfit / `moodyfit_` 통일은 D-006. 화면 구현 시 프로토타입의 `mudifit_` 키를 일괄 치환.
