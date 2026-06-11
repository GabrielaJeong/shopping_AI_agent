# CURRENT_STATE.md

> 현재 상태 스냅샷. 다음 세션 시작 시 빠른 파악용.
> 최종 업데이트: 2026-06-05

## 구현 완료

- [x] 문서 하네스 부트스트랩 (CLAUDE.md, docs 스켈레톤, CHANGELOG, memory 인덱스, SECURITY)
- [x] 핵심 설계 결정 기록 (DECISIONS D-001~D-014: …·추천경계·피드백반영경계·챗봇재랭킹경계)
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
- [x] **Detail** 푸시 화면: 이미지 히어로(back·인디케이터)·썸네일·메타·match%·reason·옵션(컬러/사이즈)·피드백 4버튼. 데이터는 `getProductDetail(id)` 경계(D-012). 좋아요→저장 추가+feedback 시트, 저장→토글, 비슷한→chat 시트, **별로예요→`recordFeedback(dislike)`로 취향 벡터 −delta 실제 반영(F6 음수 경로 활성) + 토스트**. 좋아요 하트는 outline+accent-soft. (handoff 'planned' 이유 피커는 이후)
- [x] **전역 토스터**: `app-shell-state.toast()`/`toasts` + AppShell `Toaster`(하단, 2.2s 자동). 사용자 액션 알림 재사용 규칙은 CONVENTIONS 「UI 알림(토스트)」.
- [x] **피드백 시트** (F5/F6, → D-013): `lib/feedback.applyFeedback`(부호 델타 like/save/dislike/hide)로 **취향 벡터 실제 갱신·영속**, `app-state.recordFeedback`. 성공 히어로(pulse) + "학습 변화" 바(=실제 before→after) + 비슷한 상품 3-up(`getSimilar`) + CTA(더 묻기→chat / 계속 둘러보기). 시트 오버레이를 열릴 때만 마운트+슬라이드업으로 정리.
- [x] **AI 챗 시트** (F4, → D-014): 두 경계 `lib/chat-rerank`(`parseReorderIntent`=발화→조건, `rerank`=조건→결과). 큐레이터 헤더·유저/AI 버블·인라인 ProductCard·타이핑 연출·빠른답변 칩·입력창. 발화→parse→rerank→결과 카드. 프로토타입 키워드-고정응답 라우팅은 부활 안 함(조건 산출 구조).
- [x] **핵심 루프 골격 완성**: 런치(Splash·Intro·Login·Onboarding) + app(Home·Detail) + 두 핵심 시트(Feedback·Chat). F1(취향 시드)·F4(재랭킹)·F5/F6(피드백 반영) 표면이 mock 경계 위에 동작.
- [x] **List/Search 푸시 화면**: List(헤더+검색진입+2-col 그리드, `getList(keyword)` 경계 D-012). Search(검색 필드+clear · 실시간 인기 랭킹(up/down/same/new) · AI 추천 검색어 · 최근 검색어 개별/전체 삭제 · 자동완성 substring 볼드). 선택→list, 결과 없음→chat. back→home. 랭킹/검색 데이터는 mock.
- [x] **Saved(찜) 탭**: 전역 savedIds 그리드(하트로 해제) + AI 컬렉션 제안 카드(만들기/닫기) + 컬렉션 필터 칩 + 빈 상태. `app-shell-state`에 `savedIds: string[]` 노출. 컬렉션 자동분류는 mock(태그 빈도, 클러스터링 자리 주석).
- [x] **Explore(탐색) 탭**: 2-col 그리드 + 정렬(AI추천순/가격순) + 카테고리 인스크린 필터 + "AI 발견" 칩→list. 추천 경계 `getExplore()`(D-012). 임시 SavedSummary 플레이스홀더 제거.
- [x] **My(마이) 탭**: 취향 학습 링 + **취향 키워드 바(실제 tasteProfile.vector)** + 학습 추세 스파크라인 + 설정행(알림 토글 · 계정 · 취향 다시 설정→onboarding · 로그아웃→login). 키워드 탭→list. 링%·추세·키워드 델타는 더미(학습률 산출 자리 주석). AppShell 전 탭 실제 화면화 완료(TabPlaceholder 제거).
- [x] **모든 핵심 화면 구현 완료**: 런치(Splash·Intro·Login·Onboarding) + app 4탭(Home·Explore·Saved·My) + 푸시(Detail·List·Search) + 시트(Feedback·Chat). UI 골격 + mock 경계.

## 미구현 / 진행 중

- [ ] 실제 엔진/연동 (PRD 단계, 현재는 mock 경계만): F2·F3 추천 파이프라인, F4 LLM 의도 파싱, F6 정규화·감쇠·신호 가중치, DB 연결(D-003)
- [ ] 학습률/키워드 델타 추적(My 링·추세 실제화), 컬렉션 클러스터링(Saved), 상품 실제 이미지

## 알려진 이슈 / 백로그

- 프로토타입의 상품 이미지는 flat color block 플레이스홀더 → 실제 사진 필요.
- handoff에 'Planned(미구현)'로 남은 항목: "별로예요" 시 이유 피커(색/핏/가격). 범위 들어오면 구현.

## 인프라 / 핵심 모듈 포인터

- 정본: `docs/README.md`(디자인·제품), `docs/prd.md`(기능 F1~F6).
- 디자인 레퍼런스/스키마: `docs/prototype-handoff/design_files/` (`styles.css`=토큰, `data.js`=데이터 모델).
- 결정 근거: `docs/DECISIONS.md`. 규칙: `docs/CONVENTIONS.md`. 보안: `docs/SECURITY.md`.
- 앱 진입: `src/app/` (layout.tsx, page.tsx, globals.css). 설정: `next.config.ts`(turbopack.root 고정), `pnpm-workspace.yaml`(allowBuilds).
- 검증: `corepack pnpm typecheck` / `lint` / `build` (pnpm은 PATH shim 불가 → corepack 경유).
