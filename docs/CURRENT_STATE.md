# CURRENT_STATE.md

> 현재 상태 스냅샷. 다음 세션 시작 시 빠른 파악용.
> 최종 업데이트: 2026-06-05

## 구현 완료

- [x] 문서 하네스 부트스트랩 (CLAUDE.md, docs 스켈레톤, CHANGELOG, memory 인덱스, SECURITY)
- [x] 핵심 설계 결정 기록 (DECISIONS D-001~D-012: …·취향벡터구조·app셸상태·추천경계)
- [x] 앱 스캐폴드 (Next.js 15.5.19 + React 19.1 + TypeScript + Tailwind v4 + App Router + src/, pnpm via corepack). 베이스라인 검증 green: typecheck / lint / build 통과.
- [x] Prettier 도입(eslint 무충돌, endOfLine auto) + 검증 명령 `format:check`.
- [x] 디자인 토큰 → Tailwind v4 `@theme` 매핑 (색·타이포·radius·shadow, `globals.css`). Pretendard CDN 연결, `layout.tsx` Geist 제거·lang=ko. 빌드 CSS에 유틸리티 생성 확인 (→ D-008). 토큰 미리보기는 `/foundation`.
- [x] 상태 머신 + mock 영속화 (D-009): `lib/app-state`(stage 머신), `lib/persistence`(moodyfit_onboarded 추상화). 루트(`/`)에서 마운트.
- [x] 공통 프리미티브 (`components/`): `Icon`, `MudifitMark/Logo`, `ui/Button`, `ui/Chip`, `ui/Card`, `ProductImg`, `cn` 헬퍼. (atoms.jsx 구조 참고·재현)
- [x] **Splash** 화면 (실제 구현, 1.8s 자동 전환).
- [x] 데이터 모델 포팅: `types/`(Product/TasteKeyword/TrendingTerm/AiReply 등, 더미 필드 명시) + `data/`(샘플 카탈로그·취향·검색·챗, 한국어 보존) + 헬퍼 `format`/`byId`. match·reason·delta는 **정적 더미**(F2~F6가 계산할 자리)로 타입·주석에 명시.
- [x] **Intro** 캐러셀 (3슬라이드 + 미니 목업 MockReco/MockFeedback/MockSaved, 점 인디케이터, 건너뛰기/다음/시작하기). AppRoot에 연결.
- [x] **Login** 화면 (브랜드+히어로 카피, 상품 티저 3-up, 이메일/Apple/카카오/둘러보기 + 약관 캡션). Button에 `secondary` 변형 추가. AppRoot에 연결. (Apple·카카오는 모노 플레이스홀더 — 실 SDK는 이후)
- [x] **Onboarding** 5단계 취향 퀴즈 (F1, → D-010): welcome→steps(무드/예산/카테고리/컬러/라이프스타일, min검증+CTA활성)→analyzing(연출)→summary. 선택→`buildTasteProfile`(lib)→`persistence` 저장→`finishOnboarding`. 콜드스타트(둘러보기/미완료=빈 벡터, D-005) 처리. summary 매치%는 표시용 더미.
- [x] **런치 플로우 4화면(Splash·Intro·Login·Onboarding) 완성** — 상태 머신 전이 전 구간 실제 화면.
- [x] **app 셸 + 하단 내비 + 전역 saved** (→ D-011): `lib/app-shell-state`(tab/screen/sheet/savedIds), `BottomNav`(4탭, list=home 하이라이트), `AppShell`. savedIds 전역+영속(`moodyfit_saved_ids`).
- [x] **추천 경계** (→ D-012): `lib/recommend.ts` `getHomeFeed(tasteProfile)` 진입 함수(현재 정적 mock, F2·F3 교체 지점). 화면은 이 함수만 소비. `Recommendation{product,match,reason}`.
- [x] **Home 탭** 실제 화면: 앱바·검색진입·카테고리 인스크린 필터·AI 배너(→chat)·오늘의 픽 히어로(reason·match%)·픽 가로스크롤·섹션별 추천(전체보기→list). 프리미티브 `ProductCard`·`Reason` 신설. 카드→detail, 찜=전역 savedIds.

## 미구현 / 진행 중

- [ ] explore / saved / my 탭 실제 화면
- [ ] 푸시(detail/list/search) 실제 화면 (+ `ChatProductCard` 등)
- [ ] 핵심 시트 2종(feedback/chat) 실제 내용
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
