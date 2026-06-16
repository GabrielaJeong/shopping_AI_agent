# CLAUDE.md

> Moodyfit(무디핏)의 Claude Code 작업용 고정 컨텍스트. 세션 시작 시 자동 로드.
> 길어지면 효력이 떨어진다 — 상세는 `docs/`로 위임하고 여기엔 포인터와 핵심만.

## 프로젝트 개요

- **Moodyfit(무디핏)**: 취향을 학습해 옷을 골라주는 모바일 패션-커머스 **AI 초개인화 추천 앱**.
  핵심 차별점 두 가지 — ① **설명 가능한 추천**(모든 추천에 `match` 점수 + `reason` 근거),
  ② **AI 대화로 탐색 좁히기**(자연어 발화를 추천 재정렬 신호=재랭킹 조건으로 사용).
- **스택**: TypeScript + Next.js(App Router) 단일 앱. 백엔드는 별도 서버 없이 **Next.js API 라우트**로 통합.
  스타일링 **Tailwind**, 패키지 매니저 **pnpm**. 타깃은 **웹(모바일 셸)** — 네이티브 아님.
- **현재 단계**: UI를 디자인 정본대로 충실히 재현하되, 추천/챗봇/피드백 로직은 **mock**.
  실제 추천 파이프라인·LLM 연동은 PRD F2~F6 명세대로 **이후 단계**에서 새로 구현. (→ `docs/DECISIONS.md` D-002)
- **현재 버전**: `CHANGELOG.md` 최상단 참고.

## 정본 문서 (코드의 근거)

- `docs/README.md` — **디자인·제품 정본**(Handoff: Moodyfit). 화면/토큰/내비게이션/카피의 출처.
- `docs/prd.md` — **기능 명세**(F1~F6), 성공지표, 시스템 아키텍처, 단계적 로드맵.
- `docs/유저 플로우.png`, `docs/포트폴리오 차트.png` — 사용자 플로우 / 시스템 아키텍처 도식.
- `docs/prototype-handoff/design_files/` — **디자인 레퍼런스(프로토타입)**. 그대로 복붙하는 프로덕션 코드 아님.
  `styles.css`(토큰 출처), `data.js`(샘플 데이터 모델=스키마 참고)는 특히 유용. 프로토타입의 키워드 라우팅은 **"정답"이 아님**.

## 세션 시작 시 필수 확인 (순서대로)

1. `CHANGELOG.md` — 최신 버전/최근 작업
2. `docs/CURRENT_STATE.md` — 구현/미구현 스냅샷
3. `docs/LESSONS.md` — 과거 실수 패턴 (위험도 '높음' 우선)
4. `docs/CONVENTIONS.md` — 코딩 규칙
5. `docs/DECISIONS.md` — 작업 관련 결정사항
6. 작업 범위 관련 파일 (+ 해당 화면의 디자인 정본 `docs/README.md` 섹션, PRD 기능)

## 프로젝트 구조

> 앱은 **아직 스캐폴드되지 않음**. 현재 리포에는 `docs/`(정본·프로토타입)와 루트 메타 문서만 존재.
> 스캐폴드 시 아래를 따른다. 구조가 확정되면 이 트리를 실제에 맞게 갱신할 것.

```
/app                 # Next.js App Router. 라우트=화면. (예정)
  /api               # 백엔드 통합 — 추천/챗봇/피드백 엔드포인트 (예정, 현재 mock)
/components          # UI 컴포넌트 (atoms.jsx 등 프로토타입 프리미티브의 프로덕션 재구현)
/lib                 # 도메인 로직: 취향 벡터, 추천(mock), 데이터 접근
/styles             # Tailwind 설정 + 디자인 토큰 (styles.css 토큰을 출처로)
/docs               # ★ 정본 문서 + 프로토타입 레퍼런스 (변경 영향: 모든 화면의 근거)
/memory             # 세션 간 사실 저장 (MEMORY.md = 인덱스)
```

## 핵심 아키텍처 (한눈에 안 보이는 것만)

- **런치 머신**: `splash → intro → login → onboarding → app`. `moodyfit_onboarded` 플래그가 있으면 splash→app 직행.
- **app 스테이지**: 하단 4탭(`home/explore/saved/my`) + 푸시 화면(`detail/list/search`) + 오버레이 시트(`none/feedback/chat`).
  탭 전환 시 screen은 home으로 리셋. detail/list/search는 Home 위에 쌓였다 back으로 복귀.
- **전역 상태**: `savedIds`(좋아요/저장)는 전역 — 어느 화면에서 토글해도 모든 곳에 반영. 좋아요는 저장에 추가 + 피드백 시트 오픈.
- **두 핵심 시트**: **피드백 시트**(F5/F6 — 학습 반영을 사용자에게 시각화), **AI 챗 시트**(F4 — 발화를 재랭킹 조건으로 올리고 match·reason 결과를 돌려받는 양방향 루프).
- **방향 주의**: 챗봇이 랭킹으로 올리는 것은 **점수가 아니라 조건**이다. `match`·`reason`은 랭킹이 돌려주는 **결과**.
- **콜드스타트는 예외가 아닌 기본 출발 상태**. 데이터 없이도 콘텐츠+규칙 기반으로 100% 동작.

## 코딩 규칙 (요약 — 상세는 docs/CONVENTIONS.md)

- 디자인 정본(`docs/README.md`)을 **고충실도로** 재현. 토큰/카피/인터랙션은 final-intent — 임의 변경 금지. 카피는 **한국어 보존**.
- 디자인 토큰의 출처는 프로토타입 `styles.css`. 색/타이포/간격/라운드/섀도는 토큰으로 관리(하드코딩 지양).
- 프로토타입 코드(Babel-in-browser, `window.SHOP_DATA`, `Object.assign(window,…)`)는 **스캐폴딩** — 포팅 금지. 실제 라우팅/상태/컴포넌트로 대체.
- 추천/챗봇/피드백은 현재 **mock**이되, 인터페이스는 PRD F2~F6 명세를 향하도록 설계. 프로토타입 키워드 라우팅을 영구 로직으로 박지 말 것.
- 데이터 접근/추천 로직은 한 곳(`/lib`)으로 모은다. 화면은 그 인터페이스만 소비.
- 이모지 사용 금지(디자인 규칙). 아이콘은 라인 아이콘으로 등가 대체.

## 반박·수정 정책

유저가 제시한 코드/계획에 버그·보안·구조 문제가 보이면 반드시 반박 후 수정안을 제시하고 진행한다.
반박 형식: "반박: [이유]. [수정안]으로 진행합니다." 문제 없으면 그냥 진행.

## 절대 금지 사항

1. 보호 브랜치(`main`) 직접 커밋 금지. 작업은 feature 브랜치에서.
2. 로그인/개인 취향 데이터 취급 시 보안 정책(`docs/SECURITY.md`) 위반 금지 — 평문 비밀/조용한 insecure fallback 금지.
3. 디자인 정본의 토큰·카피·플로우를 근거 없이 변경 금지.
4. 추측으로 API/스키마 형태를 박지 말 것 — 실제 데이터/명세를 보고 기록(`data.js`, PRD).

## Red Flags — 이 패턴 작성 시 멈추고 확인

- 🚩 네이티브 빌드 스크립트가 있는 의존성 추가/스캐폴드 중 → 설치 후 `ERR_PNPM_IGNORED_BUILDS` 확인. 필요한 패키지를 `pnpm-workspace.yaml`의 `allowBuilds`에 등록 후 재설치(미등록 시 typecheck/lint/build가 시작조차 안 됨). pnpm 설정은 `package.json "pnpm"`이 아니라 `pnpm-workspace.yaml`. (→ L-001)
- 🚩 `pnpm dev`가 떠 있는데 검증으로 `pnpm build`를 돌리려는 중 → 멈춰라. 같은 `.next` 공유로 매니페스트가 손상돼 Internal Server Error가 난다. 활성 dev 세션 중엔 `typecheck`/`lint`만. build가 필요하면 dev 중지 후. 캐시 깨짐(`_buildManifest.*` ENOENT) 시 `.next` 삭제 후 재기동. (→ L-003)
- 🚩 새 작업의 첫 커밋/파일 수정 직전 → `git branch --show-current`로 **main이 아닌지 확인**. PR 머지 후엔 main에 머물러 있으니, 작업 시작 전 `git checkout -b feature/<name>` 먼저. (→ L-005)
- 🚩 레이아웃(height/overflow/flex)·포커스·시트 동작 변경 중 → typecheck/lint/200만으론 안 잡힌다. 머지 전 전체 흐름 한 바퀴(런치→탭→푸시→시트)로 **스크롤·시트 open/close·키보드(Esc)** 실제 확인(또는 PR에 점검 항목 명시). (→ L-006)
- 🚩 시트/포커스/전역 동작(스크롤 점프 등)을 **한 군데 고치는 중** → 멈춰라. 같은 증상의 다른 출현 지점이 있다. `scrollIntoView`·`.focus(`·`autoFocus`·`openSheet(`를 grep해 **모든 진입점/소스를 전수 확인**하고 고친다. "한 곳 수정=해결"로 단정 금지. (→ L-006 강화규칙 2)
- 🚩 시각 버그(점프/깜빡임/레이아웃 튐)를 **추측으로 고치려는 중**, 또는 같은 증상을 두 번째 "고쳤다"는 중 → 멈춰라. ① 사용자가 보는 **관측량 자체**를 프레임별로 측정(프록시 `scrollTop`만 보고 단정 금지 — transform·조상 스크롤은 scrollTop을 안 바꾼다). ② transient는 연속 샘플 min/max로. ③ 보고 전 **수정이 dev에 실제 적용됐는지**(브랜치/머지/리로드) 확인. (→ L-007)

( 나머지는 LESSONS에서 "코딩 중 트리거"로 승격된 것만 누적한다. 예시를 미리 채우지 말 것 — 겪어서 쌓아야 신호가 산다. )

## 세션 종료 프로토콜

1. 버그 패턴 셀프 리포트 → 재발 가능하면 `docs/LESSONS.md` L-XXX (강화 규칙은 검증 가능한 행동으로).
2. 설계 결정 기록 → `docs/DECISIONS.md` D-XXX (왜/대안/트레이드오프).
3. `docs/CURRENT_STATE.md` / 해당 시 `CHANGELOG.md` 갱신.
4. Git 커밋 & 푸시 — 작업 브랜치. 커밋 메시지에 의도/근거.

## Git 브랜치 전략

- 보호 브랜치: `main` (직접 커밋 금지, PR로 병합).
- 작업 브랜치: `feature/<설명>`. PR 머지 전 검증 통과 필수.

## 검증 명령 (변경 성격에 맞춰 차등 — 상세는 docs/SESSION_CHECKLIST.md)

- 모든 변경: `pnpm format:check` (정리는 `pnpm format`)
- 타입/시그니처: `pnpm typecheck`
- UI/스타일: `pnpm typecheck` + `pnpm lint`
- 새 라우트/페이지: + `pnpm build`
- 백엔드/로직(API 라우트 등): + 단위 테스트
  > "매 커밋 풀 빌드+전체 테스트"는 낭비. 외부 경계(스키마/응답/권한) 변경 시엔 검증 생략 금물.

## 자주 쓰는 명령어 / 환경 주의

- **pnpm은 PATH에 직접 없음** → `corepack pnpm <cmd>`로 호출(corepack enable은 권한 문제로 shim 설치 불가). 예: `corepack pnpm install`, `corepack pnpm dev`, `corepack pnpm build`.
- 검증: `corepack pnpm typecheck` / `lint` / `build`.
- OS: **Windows / PowerShell**. 셸 문법 주의(`$null`, `$env:VAR`, 백틱 줄바꿈). PowerShell 파이프에서 `Select-Object -First N`은 상위 프로세스에 broken-pipe를 줘 네이티브 명령이 비정상 종료할 수 있음 → 전체 출력은 `-Last N` 또는 `Out-String` 사용.
- **PR 생성**: 본문은 항상 `gh pr create --body-file <임시.md>`로(PowerShell 5.1에서 `--body "...따옴표..."`는 인자가 쪼개짐 → L-004). `gh`는 `C:\Program Files\GitHub CLI\gh.exe`, 사용자 계정으로 인증돼 있음.
