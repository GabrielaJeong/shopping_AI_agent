# CHANGELOG

> Moodyfit 버전 이력. 최신이 맨 위. 세션 시작 시 최상단 몇 개만 확인.

## [Unreleased]

### Changed

- **정본 고충실도 2차 — 화면 전면 정합(#39~#47)**: 디자인 정본/전달 패딩 스펙대로 화면을 재구성. ① **Home** 오늘의 픽 **무한 루프 슬라이더**(loop+warp, DOM 중심 측정) + 카드/패딩 정밀화(#39). ② **브랜드명** Mudifit→**Moodyfit** 통일(#40, D-006). ③ **My** 프로필·다크 학습카드·취향 키워드·설정 정본화(#41). ④ **Onboarding** welcome·steps·analyzing·summary 패딩/진행바/CTA 정합(#42). ⑤ **Explore** 제목 + **AI 발견 배너 카드**(→추천 화면) + 카테고리/정렬 + 그리드(#43). ⑥ **List(AI 발견 화면)** 정본 ListView로 — AI 요약 배너 + 카테고리 칩 + 정렬 3종 + 매칭 우선 그리드(#44). ⑦ **Saved** 정본화 + **AI 컬렉션 제안 흐름**(#45, → D-017). ⑧ **Detail** 전면 재구성 — 풀블리드 히어로·썸네일·메타(AI매치칩·태그)·이유카드·옵션·피드백 4열·상품정보·가로스크롤 추천(#46). ⑨ **Search** 정본화 + **결과 페이지 내 인라인 표시**(#47, → D-018). 프레임 캔버스 390×844. 모두 순수 UI/연출/경계형태 — 추천 엔진(F2·F3·F6) 본체 미변경. 검증은 production build + curl(L-008).
- **정본 시각/연출 정합(대조 후속)**: ① Explore 정렬을 텍스트 버튼 → **칩 스타일**(선택=sel/비선택=outline, explore.jsx 정본). ② Search **"실시간 인기" 자동 갱신 연출**(약 3.5s 주기 인접 swap mock, 입력 중 정지 — 집계/검색 엔진은 범위 밖). ③ Onboarding analyzing **스파클이 링을 도는 궤도 회전**(정본 §4, reduced-motion 전역 가드로 정지). ④ Saved **"+ 새 컬렉션" 동작 연결**(현재 보기를 스냅샷한 컬렉션 생성+선택+토스트, 세션 한정 mock) + 제안 카피 "묶어드릴까요"→**"묶을까요"**(정본 §7). ⑤ Detail **"이 추천 더 묻기" 챗 트리거 추가**(정본 §12). ⑥ **디바이스 프레임 폭 420→390**(정본 캔버스 390×844, README §34) — 30px 넓던 프레임 탓에 좌우 패딩 비율·"오늘의 픽" 카드 peek이 원본과 어긋나 보이던 것 정합(슬라이더 CSS 자체는 정본 styles.css와 동일했음, 프레임 폭이 근본 원인). 모두 순수 시각/연출 — 추천 엔진(F2·F3·F6) 미변경. 미루기 항목(My 키워드 델타=F6 / Detail 이미지 캐러셀=실사진 / feedback 바 TasteBars 통일)은 CURRENT_STATE 백로그.
- **Home 충실도 재현(폴리시)**: 정본(home.jsx/README §5)대로 재구성 — 앱바(인사+검색아이콘+벨) · AI 큐레이션 배너(문장+액션칩) · **오늘의 픽 가로 슬라이더**(썸네일+브랜드/이름/가격/태그칩/자세히보기 + reason + 점 인디케이터) · **내 취향 키워드 바(실제 tasteProfile)** · 오늘의 추천(카테고리 칩 필터를 이 섹션으로) · AI가 찾은 새 취향. `getHomeFeed` 반환형을 `heroPicks/today/discoveries`로 재구성(경계 형태만 변경, mock 본체·match·reason 더미는 그대로). 이전의 단순 단일 히어로/일반 섹션 버전을 대체.

### Added

- **찜 컬렉션**(#45, → D-017): `Collection` 타입 + `persistence.get/setCollections` + `app-shell-state.createCollection`(영속). AI 컬렉션 제안(저장 상품 베이지 무드 클러스터 mock) → "컬렉션 만들기" → 사용자 컬렉션 칩 생성·자동 선택·필터. 탭 전환/리로드에도 유지, savedIds 단일 출처(카운트 교차). 데모 시드(데일리/출근룩) 없음.
- **상품 정보 스펙 + 브랜드 추천**(#46, → D-019): `Product.material` 필드(8개) + `data.productSpec`(소재=카탈로그값, 실루엣/컬러=태그·이름 파생). `recommend.getMoreFromBrand` 경계 추가(브랜드의 다른 상품).
- **검색 결과 인라인**(#47, → D-018): 검색 페이지에서 결과를 바로 표시(AI 요약 말풍선 + 2열 그리드, 무결과→챗). 칩·랭킹·제안 클릭 = setQuery. 경계 `getList`만 소비.
- **반응형(폴리시)**: 모바일은 풀-블리드 폰 화면 유지, 큰 화면(sm↑)은 레터박스 배경(#e8e4dc) 위 가운데 정렬된 **디바이스 프레임**(h-844 캡=`calc(100dvh-3rem)`, rounded-[2rem], shadow-elev)으로 — 내비/시트/토스트가 창 바닥이 아닌 프레임 바닥에 옴. 런치 화면(intro/login/onboarding 4)·셸 `min-h-dvh`→`h-dvh`/`h-full`+필요시 overflow 스크롤로 프레임 높이와 정합.
- **접근성(폴리시)**: 시트 — Esc로 닫기 + 열릴 때 시트로 포커스 이동·닫힐 때 직전 포커스 복원 + `aria-label`/`aria-modal`/`tabIndex=-1`. ProductCard — 열기 영역(role=button)과 찜 버튼을 **형제로 분리**(중첩 인터랙티브 제거) + 찜 `aria-pressed`/`aria-label`.
- **토스트 확대(폴리시) + 전역화**: 토스터를 `lib/toast`(`ToastProvider`/`useToast`/`Toaster`)로 분리해 **루트(AppRoot)로 승격** — stage 전환(로그아웃·취향 재설정)에도 보이게. 액션 연결: 찜 토글(`toggleSaved` 중앙: 찜했어요/해제), 컬렉션 만들기, 별로예요(−delta), 홈 알림, 로그아웃·취향 재설정. (이전 `app-shell-state`의 toast/Toaster는 제거 — useToast로 일원화). CONVENTIONS 규칙도 `useToast()`로 갱신.

- 문서 하네스 부트스트랩: `CLAUDE.md`, `docs/`(CONVENTIONS·LESSONS·DECISIONS·CURRENT_STATE·SESSION_CHECKLIST·SECURITY), `CHANGELOG.md`, `memory/MEMORY.md` 생성.
- 설계 결정 기록: `docs/DECISIONS.md` D-001~D-012 (스택, UI먼저·로직mock, DB=PostgreSQL, 추천 파이프라인 단계전환, 콜드스타트, 제품명 Moodyfit, Next 15 고정, 디자인 토큰=Tailwind v4 @theme, 앱 구조=단일 루트 상태 머신, 취향 벡터 구조, app 셸 상태 분리, 추천 경계 getHomeFeed). 각 결정에 PRD F1~F6 연결.
- **디자인 토큰 매핑**: 프로토타입 `styles.css` 토큰을 `globals.css` `@theme`로 1:1 이식(색·타이포 스케일·radius·shadow). Pretendard 동적 서브셋 CDN을 `layout.tsx`에서 로드(Geist 제거, lang=ko, metadata=Moodyfit). 빌드 CSS에 유틸리티 생성 확인. 토큰 미리보기는 `/foundation`으로 이동.
- **런치 파운데이션**: 단일 루트 상태 머신(`lib/app-state`) + mock 영속화(`lib/persistence`, moodyfit_onboarded). 공통 프리미티브(`Icon`/`MoodyfitMark·Logo`/`Button`/`Chip`/`Card`/`ProductImg`/`cn` 헬퍼) — atoms.jsx 재현. **Splash** 실제 구현(1.8s 자동 전환), intro/login/onboarding/app은 전이 검증 플레이스홀더. splash-in/fade-up 애니메이션 + reduced-motion 가드.
- **데이터 모델 포팅**: `types/`(Product·TasteKeyword·TrendingTerm·AiReply 등 — match·reason·delta를 "추천 엔진 F2~F6이 계산할 더미"로 타입/주석 명시) + `data/`(샘플 카탈로그·취향·검색·챗, 한국어 보존) + 헬퍼 `format`/`byId`. `ProductImgColors`를 `@/types`로 일원화.
- **Intro 캐러셀**: 3슬라이드(취향 추천 / 학습 루프 / 찜·컬렉션) + 미니 목업(MockReco·MockFeedback·MockSaved, 프리미티브·샘플 데이터로 축소 재현), 점 인디케이터, 건너뛰기·다음·시작하기. AppRoot 연결(intro 플레이스홀더 대체).
- **Login 화면**: 브랜드+히어로 카피, 상품 티저 3-up, 이메일/Apple/카카오/둘러보기 버튼 + 약관 캡션. Button에 `secondary` 변형(paper-2) 추가. AppRoot 연결(login 플레이스홀더 대체). Apple·카카오는 모노 플레이스홀더(실 SDK 이후).
- **Onboarding 5단계 취향 퀴즈(F1)**: welcome→steps(무드/예산/카테고리/컬러/라이프스타일, min검증+CTA활성)→analyzing(연출)→summary. 핵심은 "선택→취향 벡터 생성·저장": `types`의 `TasteVector`/`TasteProfile`, `lib/taste-vector`(`buildTasteProfile`·`emptyTasteProfile`·`topTasteTags`), `persistence`에 취향 프로필 저장(키 moodyfit_taste_profile), `app-state.finishOnboarding(profile)`/`skipOnboarding`/`tasteProfile` 추가. 콜드스타트(둘러보기/미완료=빈 벡터, D-005) 처리. summary 매치%는 표시용 더미. (→ D-010)
- **app 셸 + 하단 내비 + 전역 saved(D-011)**: `lib/app-shell-state`(tab/screen(detail·list·search)/sheet(feedback·chat)/savedIds, 런치 상태와 분리), `components/bottom-nav`(4탭, 탭전환 시 screen=home 리셋, list는 home 하이라이트 유지), `components/app-shell`(탭/푸시/시트 플레이스홀더 + 시트 오버레이). 전역 savedIds 토글 + persistence 영속(키 moodyfit_saved_ids). AppRoot가 app 스테이지에서 AppShell 마운트(임시 플레이스홀더 제거).
- **My(마이) 탭**: 취향 학습 링 + **취향 키워드 바(실제 tasteProfile.vector를 읽음 — 가짜 숫자 아님)** + 학습 추세 스파크라인 + 설정행(알림 토글·계정·취향 다시 설정→onboarding·로그아웃→login). 키워드 탭→list. 링%·추세·키워드 델타는 더미(학습률 산출 자리 주석). AppShell 전 탭 실제 화면화 완료(TabPlaceholder 제거, app-shell 헤더 주석 갱신).
- **Explore(탐색) 탭**: 2-col 그리드 + 정렬(AI추천순/가격순) + 카테고리 인스크린 필터 + "AI 발견" 칩(→list). 추천 경계 `getExplore()`(D-012)만 소비. AppShell explore 탭 연결, 임시 SavedSummary 플레이스홀더 제거.
- **Saved(찜) 탭**: 전역 savedIds 저장 그리드(하트 토글로 해제) + AI 컬렉션 제안 카드(만들기/닫기) + 컬렉션 필터 칩 + 빈 상태. `app-shell-state`에 `savedIds: string[]` 노출. 컬렉션 자동분류는 mock(저장 상품 태그 빈도) — 이후 취향 벡터/태그 클러스터링 자리(주석). AppShell saved 탭 연결.
- **List/Search 푸시 화면**: List(헤더+검색진입+2-col 그리드)는 추천 경계 `getList(keyword)`(D-012, mock substring 매칭)만 소비. Search(검색필드+clear · 실시간 인기 랭킹 up/down/same/NEW · AI 추천 검색어 칩 · 최근 검색어 개별/전체 삭제 · 자동완성 substring 볼드). 검색어 선택→list, 결과 없음→chat 시트(발화 전달). back→home. 랭킹·검색 데이터는 mock. AppShell list/search 슬롯 연결.
- **AI 챗 시트(F4, D-014)**: 챗봇 재랭킹을 두 경계 함수로 분리 — `lib/chat-rerank`의 `parseReorderIntent(발화,맥락)→ReorderConditions`(키워드 mock, 이후 LLM 의도 파싱) + `rerank(조건,취향)→Recommendation[]`(조건 필터·가중 정렬 mock, 이후 F3 엔진). 방향성: 챗봇은 조건을 올리고 match·reason은 rerank의 결과. 시트 UI: 큐레이터 헤더·유저/AI 버블·인라인 ProductCard·타이핑 연출·빠른답변 칩·입력창. 발화/칩→parse→rerank→결과 카드. 프로토타입 키워드-고정응답 라우팅 부활 안 함. detail "비슷한" 시드는 "비슷한 톤으로".
- **피드백 시트(F5/F6, D-013)**: `lib/feedback.applyFeedback(taste, product, signal)` — 부호 있는 델타(like/save/dislike/hide)로 취향 벡터 갱신 + 변화 반환. `app-state.recordFeedback`가 호출해 **실제 갱신·persistence 영속**. 시트 UI: 성공 히어로(pulse-soft) + "학습 변화" 바(=실제 before→after, 화면용 가짜 숫자 아님) + 비슷한 상품 3-up(`getSimilar`, 경계 D-012) + CTA(AI에게 더 물어보기→chat / 계속 둘러보기). SheetOverlay를 열릴 때만 마운트+슬라이드업으로 재구성. globals에 `pulse-soft` 추가.
- **Detail 푸시 화면**: 이미지 히어로(back·인디케이터)·썸네일·브랜드/이름/가격·match%·reason·옵션(컬러/사이즈)·피드백 4버튼. 데이터는 `getProductDetail(id)` 경계(D-012, match·reason은 F3가 채울 더미). 좋아요→savedIds 추가+feedback 시트, 저장→토글, 비슷한→chat 시트, 별로예요→부정신호 슬롯(F6 −delta·planned 이유선택 주석). 좋아요 하트는 outline+accent-soft(활성처럼 안 보이게). AppShell detail 슬롯 연결.
- **추천 경계 + Home 탭(D-012)**: `lib/recommend.ts` `getHomeFeed(tasteProfile)` 진입 함수(정적 mock, F2 후보생성→F3 랭킹 교체 지점; match·reason은 엔진이 계산할 더미). 화면은 이 함수만 소비. 프리미티브 `ProductCard`(.p-card 재현)·`Reason`(HTML 근거, sanitize 주의) 신설. **Home** 실제 화면: 앱바·검색진입·카테고리 인스크린 필터·AI 배너(→chat 시트)·오늘의 픽 히어로(reason·match%)·픽 가로스크롤·섹션별 추천(전체보기→list). 카드→detail, 찜=전역 savedIds. AppShell 홈 탭에 연결(HomeDemo 제거).
- **앱 스캐폴드**: Next.js 15.5.19 + React 19.1 + TypeScript + Tailwind v4 + App Router(`src/`), pnpm(corepack). `next.config.ts` turbopack.root 고정, `pnpm-workspace.yaml` allowBuilds(sharp·unrs-resolver), `package.json`에 `typecheck` 스크립트 추가.
- 베이스라인 검증 통과: `typecheck` / `lint` / `build` 모두 green.
- **Prettier 도입**: prettier 3.8 + eslint-config-prettier 10(`/flat`)로 ESLint와 무충돌 구성. `.prettierrc.json`·`.prettierignore` 추가, `format`·`format:check` 스크립트 추가. CONVENTIONS·검증 명령 목록에 반영.
- **전역 토스터**: `app-shell-state`에 `toast(msg)` + `toasts` 추가, AppShell `Toaster`(하단·자동 2.2s). detail "별로예요" → `recordFeedback(dislike)`로 취향 벡터 −delta 실제 반영 + "비슷한 추천을 줄일게요" 토스트(부정 신호의 실제 경로 연결). (다른 액션 토스트는 폴리시에서 확대)

### Fixed

- **챗 시트 점프 — 장기 미해결, 측정으로 근본원인 확정·해결**(#31): `endRef.scrollIntoView`가 시트가 아직 화면 밖(`translate-y-full`)인 순간 실행돼, 화면 밖 endRef를 보이게 하려고 **조상 스크롤 컨테이너(디바이스 프레임/윈도우)를 강제 스크롤** → 배경이 솟구쳤다 복귀(계측: 배경 rect 293px 왕복, `app scrollTop`=0). app 스크롤 컨테이너는 시트의 형제라 안 움직여 "스크롤 아님"으로 여러 번 오진했음. `scrollIntoView` 제거 → 리스트 컨테이너 `scrollTop = scrollHeight` 직접 조정(조상 미동). **챗 6개 진입점(홈 AI 배너/다른 무드/예산/detail 비슷한/feedback 더 묻기/search 결과없음) 전부 점프 없음 — 사용자 dev 확인 완료.** (→ L-006 근본원인 교정 / L-007 신설)
- **시트 열림 끊김(jank) 제거**(#36, → D-016): 시트 open이 `useAppShell` 컨텍스트 값을 바꿔 현재 화면 전체(무거운 Home)가 재렌더되며 슬라이드업이 끊기던 문제 → `sheet` 상태를 별도 `SheetStateContext`(`useSheet`)로 분리해 시트 토글이 화면을 재렌더하지 않게. 슬라이드 부드러움 — 사용자 확인 완료.
- `.prettierrc.json`에 `endOfLine: "auto"` 추가 — Windows autocrlf로 CRLF가 된 working tree에서 `format:check`가 전 파일 실패하던 문제 해결 (L-002).
- dev 서버 실행 중 `pnpm build` 동시 실행으로 `.next` 손상(`_buildManifest` ENOENT → Internal Server Error). `.next` 삭제·재기동으로 복구. 재발 방지 규칙은 L-003 / CLAUDE Red Flag.
- My 탭 `Row`가 `<button>`인데 "알림" 행의 토글 스위치(`<button>`)를 품어 button 중첩 → hydration 에러. 인터랙티브 trailing이 있으면 Row를 `div`로 분기해 해결.
- 시트 닫기 X 위치 정리: 드래그 핸들을 중앙 정렬하고 X를 시트 우상단 코너로(이전엔 핸들이 좌측에 붙고 X가 헤더를 넘쳐 챗 큐레이터 헤더와 겹침).
- **app 스테이지 스크롤 복구**(#28 회귀): 디바이스 프레임으로 셸이 고정 높이(`h-dvh`)가 됐는데 flex 스크롤 체인에 `min-h-0`이 없어 내용이 넘쳐 잘리고 안 내려가던 문제 → `AppShellInner`/안쪽 스크롤 div에 `min-h-0` 추가. (→ L-006)
- **시트 열 때 배경 강제 스크롤**(#27 회귀): 시트 포커스 이동을 `focus({ preventScroll: true })`로 바꿔 하단 absolute 시트로 인한 점프 제거. (→ L-006)
- **검색어 선택이 엉뚱하게 "결과 없음→챗"으로 빠짐**: 실시간 인기 등 구(句) 검색어가 한 필드에 통째로 substring 매칭되지 않아 빈 결과→챗으로 가던 문제 → `getList`를 **토큰(공백 분리) 매칭**으로 변경(어느 토큰이든 맞으면 포함). 이제 인기어 선택은 list로.

### Lessons

- L-001: pnpm 11의 ignored build scripts가 typecheck/lint/build를 차단 → `pnpm-workspace.yaml allowBuilds`로 해결. CLAUDE.md Red Flag로 승격.
- L-002: Prettier `endOfLine` 기본값 + Windows autocrlf로 `format:check` 실패 → `endOfLine: "auto"`.
- L-003: dev 실행 중 `pnpm build` 동시 실행 → `.next` 손상. CLAUDE.md Red Flag로 승격.
- L-004: PowerShell 5.1에서 `gh pr create --body "...따옴표..."`가 인자 분해 → PR 본문은 항상 `--body-file` 사용.
- L-005: PR 머지 후 main에 머문 채 새 작업 첫 커밋을 main에 직접(push 전 발견·복구) → 작업 시작 전 feature 브랜치 먼저. CLAUDE Red Flag로 승격.
- L-006: 폴리시의 레이아웃/포커스 변경(#27·#28)이 스크롤·시트 동작 회귀를 냄(정적 검증 통과). 레이아웃/포커스/시트 변경 시 머지 전 전체 흐름 한 바퀴 실제 확인. CLAUDE Red Flag로 승격. **(2026-06-16 재발·근본원인 확정**: 시트 점프의 진짜 원인은 scrollIntoView가 조상(프레임/윈도우)을 스크롤한 것 — 틀렸던 기전 설명 교정. 강화규칙2(한 곳 고치면 grep 전수확인) 추가.)
- L-007: **시각 버그를 추측으로 반복 수정 — 측정으로 원인 확정 전 고치지 말 것**. 우리가 겪은 "가설→즉시 수정→재현" 루프를 규칙화: ① 보고 전 수정이 dev에 실제 적용됐는지(브랜치/머지/리로드) 확인, ② 프록시(`scrollTop`) 말고 사용자가 보는 관측량(요소 rect)을 프레임별 측정, ③ transient는 연속 샘플 min/max, ④ 같은 증상 2번 재현이면 멈추고 계측부터. CLAUDE Red Flag로 승격.

### Notes

- CLAUDE.md Red Flags 보유: L-001(pnpm 빌드 차단), L-003(dev 중 build로 .next 손상), L-005(작업 전 브랜치), L-006(레이아웃/포커스 변경 후 흐름 점검 + 전역 동작 grep 전수확인), L-007(시각 버그는 추측 말고 측정·실제 적용 확인).
- 설계 결정 추가: D-016(시트 상태 별도 컨텍스트 분리 — 시트 열림 시 화면 재렌더 방지).
- 제품명 표기 Moodyfit / `moodyfit_` 통일은 D-006. 화면 구현 시 프로토타입의 `mudifit_` 키를 일괄 치환.
- **브랜드 컴포넌트 리네임**: `MudifitMark`/`MudifitLogo` → `MoodyfitMark`/`MoodyfitLogo`(brand.tsx + splash/intro/login 사용처). 옛 명칭의 마지막 잔재 정리 — D-006(명칭 통일) 코드까지 마무리. 시각/동작 변경 없음.
