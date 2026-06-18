# LESSONS.md

> Moodyfit의 실수 패턴과 재발 방지 규칙. 세션 시작 시 확인(위험도 '높음' 우선).

## 포맷

## L-XXX: 패턴 제목

**날짜**: YYYY-MM-DD
**위험도**: 낮음 / 중간 / 높음
**발생 맥락**: 언제 어떻게 발생했는가
**재발 이유**: 왜 막지 못했는가
**해결**: 즉각 대응
**강화 규칙**: 재발 방지를 위한 체크리스트 (추상적 다짐이 아니라 *검증 가능한 행동*으로)

---

## L-001: pnpm 11이 네이티브 빌드 스크립트를 차단하면 typecheck/lint/build가 시작조차 못 함

**날짜**: 2026-06-04 (초기 발견)
**위험도**: 중간
**발생 맥락**: Next 15 스캐폴드 직후 `pnpm install`이 `sharp`·`unrs-resolver`의 빌드 스크립트를 보안 기본값으로 건너뜀(ERR_PNPM_IGNORED_BUILDS). 이후 `pnpm typecheck`/`lint`가 스크립트 실행 전 의존성 상태 점검(runDepsStatusCheck) 단계에서 이 ignored builds를 **에러로 취급**해 명령 자체가 exit 1로 죽음.
**재발 이유**: (1) ignored builds가 단순 경고일 거라 가정. (2) `package.json`의 `"pnpm": { onlyBuiltDependencies }` 필드로 해결하려 했으나 **pnpm 11은 이 필드를 더 이상 읽지 않음**(설정이 `pnpm-workspace.yaml`로 이동).
**해결**: `pnpm-workspace.yaml`의 `allowBuilds:` 맵에 `sharp: true`, `unrs-resolver: true`를 명시하고 재설치 → 빌드 수행, 이후 검증 명령 정상.
**강화 규칙**: 네이티브 빌드 스크립트(postinstall/install)가 있는 의존성을 추가/스캐폴드하면, 설치 직후 ERR_PNPM_IGNORED_BUILDS 여부를 확인하고 필요한 패키지를 `pnpm-workspace.yaml allowBuilds`에 등록한 뒤 `pnpm install`을 다시 돌려 검증한다. pnpm 설정은 `package.json "pnpm"`이 아니라 `pnpm-workspace.yaml`에 둔다.

---

## L-002: Prettier `endOfLine` 기본값(lf) + Windows autocrlf → format:check가 전 파일에서 실패

**날짜**: 2026-06-04 (초기 발견)
**위험도**: 낮음
**발생 맥락**: feature/scaffold에서 `format:check` green이었으나, PR 머지 후 main을 새로 체크아웃하니 git autocrlf가 working tree를 CRLF로 변환 → Prettier 기본 `endOfLine:"lf"`가 거의 모든 텍스트 파일을 위반으로 판정해 `format:check`가 exit 1. typecheck/lint는 영향 없음.
**재발 이유**: 포맷 검증을 "포맷터 적용 직후"의 working tree에서만 확인했고, git 체크아웃이 EOL을 바꾼다는 점을 검증에 넣지 않음.
**해결**: `.prettierrc.json`에 `"endOfLine": "auto"` 추가(파일의 기존 EOL을 허용). CRLF/LF 환경 모두에서 통과.
**강화 규칙**: Windows에서 Prettier를 도입할 때 `endOfLine: "auto"`를 기본 설정한다. 포맷 검증은 "방금 format한 직후"가 아니라 **새 체크아웃 상태**(또는 CI의 LF 환경)에서도 통과하는지로 본다.

---

## L-003: dev 서버 실행 중 `pnpm build`를 돌리면 `.next`가 손상돼 Internal Server Error

**날짜**: 2026-06-05 (초기 발견)
**위험도**: 중간
**발생 맥락**: `pnpm dev`(Turbopack)가 백그라운드로 떠 있는 상태에서 변경 검증용으로 `pnpm build`를 여러 번 실행. build와 dev가 같은 `.next` 디렉터리를 동시에 쓰면서 `_buildManifest.js.tmp.*` 임시 파일 경합 → `ENOENT` 반복, 브라우저에 Internal Server Error.
**재발 이유**: "UI/스타일·라우트 추가" 검증에 build를 포함시키면서, 그 build가 **실행 중인 dev 서버와 같은 `.next`를 공유**한다는 점을 간과.
**해결**: dev 중지 → `.next` 삭제 → dev 재기동. (코드 버그 아님 — typecheck/lint/build 자체는 green)
**강화 규칙**: **dev 서버가 떠 있는 동안에는 `pnpm build`를 돌리지 않는다.** 활성 dev 세션 중 검증은 `typecheck`/`lint`로 충분(둘 다 `.next` 미사용). build 검증이 꼭 필요하면 먼저 dev를 중지하고, 캐시 깨짐 신호(`_buildManifest.*` ENOENT)가 보이면 `.next` 삭제 후 재기동.

---

## L-004: PowerShell 5.1에서 PR 본문에 큰따옴표가 있으면 `gh pr create --body`가 인자를 쪼갠다

**날짜**: 2026-06-05 (초기 발견)
**위험도**: 낮음
**발생 맥락**: `gh pr create --body $body`로 PR 생성 시, `$body`(here-string)에 리터럴 큰따옴표(예: 카피 인용 `"오늘의 무드를…"`)가 포함되자 PowerShell 5.1의 네이티브 인자 인용이 깨져 gh가 본문을 여러 unknown arguments로 분해 → `please quote all values that have spaces`로 실패. 따옴표 없던 이전 PR 본문들은 우연히 통과했음.
**재발 이유**: PowerShell 5.1이 native exe에 문자열 인자를 넘길 때 임베디드 `"`를 제대로 escape하지 못한다는 점을 간과(한국어 카피엔 인용부호가 흔함).
**해결**: 본문을 임시 파일에 쓰고 `gh pr create --body-file <file>` 사용 — 인용 문제 우회.
**강화 규칙**: **PR 본문은 항상 `--body-file`로 넘긴다**(임시 .md에 써서). `--body "...$var..."` 직접 전달 금지. 멀티라인/특수문자 본문에 안전.

---

## L-005: PR 머지 후 main에 머문 상태에서 새 작업 첫 커밋을 main에 직접 함

**날짜**: 2026-06-05 (초기 발견)
**위험도**: 중간
**발생 맥락**: PR #16 머지 → `git checkout main` + pull로 끝난 뒤, 다음 작업(list/search)에서 **feature 브랜치 생성을 잊고** 바로 `git commit` → 로컬 main에 커밋됨. `git push -u origin feature/list-search`의 refspec 에러로 비로소 발견(push 전이라 원격 영향 없음).
**재발 이유**: PR 머지 워크플로가 **항상 main에서 끝나서**, 다음 작업 진입 시 브랜치 생성을 빠뜨리기 쉬움(보호 브랜치에 올라타 있는 상태가 기본값이 됨).
**해결**: 커밋을 feature 브랜치로 이전(`git checkout -b feature/<name>` → `git branch -f main origin/main`)하고 main을 origin/main으로 복구. 이후 정상 푸시·PR.
**강화 규칙**: **새 작업의 첫 파일 수정 전에 `git checkout -b feature/<name>` 먼저.** 커밋 직전 `git branch --show-current`로 main이 아님을 확인. (보호 브랜치 직접 커밋 금지 — CLAUDE.md 절대 금지 1)

---

## L-006: 마감(폴리시)에서 레이아웃/포커스 변경이 멀쩡하던 흐름을 깨뜨림

**날짜**: 2026-06-11 (초기 발견) / 2026-06-11 (재발 — 시트 점프를 한 군데만 고쳐 챗 경로가 남음) / 2026-06-16 (근본 원인 측정으로 확정 — 여러 번 오진 후)
**위험도**: 높음 (재발·장기 미해결)
**발생 맥락**: 화면을 다 만든 뒤 폴리시 단계에서 — (a) 반응형 디바이스 프레임(#28)으로 셸을 `min-h-dvh`→`h-dvh`(고정 높이)로 바꿨는데 flex 스크롤 체인에 `min-h-0`을 안 넣어 **app 스테이지 스크롤이 죽음**(내용이 넘쳐 잘림). (b) 시트 포커스 접근성(#27)에서 `dialog.focus()`를 `preventScroll` 없이 호출해 **시트 열 때 배경이 강제 스크롤**됨. 둘 다 typecheck/lint/`/` 200은 통과 — 정적 검증으론 안 잡힘. 사용자가 직접 둘러보다 발견.
**재발(시트 점프)**: (b)를 `SheetContainer`의 focus 한 곳만 `preventScroll`로 고쳤는데, 챗 시트엔 두 번째 독립 점프 소스(`endRef.scrollIntoView`)가 따로 있었다. focus 벡터만 보고 "해결"로 판단 → 챗 시트는 그대로 튐.
**근본 원인(확정)**: `endRef.scrollIntoView`가 **시트가 아직 화면 밖(`translate-y-full`)인 순간** 실행돼, 화면 밖의 endRef를 보이게 하려고 **조상 스크롤 컨테이너(디바이스 프레임/윈도우)를 강제 스크롤** → 그 안의 배경(현재 화면) 전체가 위로 솟구쳤다 시트가 올라오며 제자리로 복귀(측정: **배경 rect.top 293px 왕복, `app scrollTop`은 내내 0**). app 스크롤 컨테이너는 시트의 형제라 안 움직였고(그래서 "스크롤 아님"으로 오판), 실제 범인은 endRef의 조상인 프레임/윈도우였다. + 별개로, 시트 open이 `useAppShell` 컨텍스트 값을 바꿔 무거운 Home이 재렌더되며 슬라이드가 끊기는 jank도 있었음(→ 시트 상태 별도 컨텍스트 분리, D-016).
**재발 이유**: typecheck/lint/200 의존 + **증상 원인을 한 종류로 가정**해 한 군데만 고침 + **오진이 길어진 과정 자체**(첫 수정 PR이 미머지라 dev가 옛 코드 서빙, 정적 추론으로 형제/조상 관계 오판, 프록시 지표를 스냅샷 시점에만 봐 transient 누락) → L-007로 분리.
**해결**: 스크롤 체인에 `min-h-0` 추가, 시트 포커스는 `focus({ preventScroll: true })`, 챗 리스트는 `scrollIntoView` 대신 컨테이너 `scrollTop = scrollHeight`로 직접 스크롤(조상 미동). 시트 상태는 별도 컨텍스트로 분리해 open 시 화면 재렌더 방지(D-016).
**강화 규칙**:

1. **레이아웃(height/overflow/flex)·포커스·시트 동작을 바꾸면, 머지 전에 전체 흐름 한 바퀴(런치→탭→푸시→시트)를 돌려** 스크롤·시트 open/close·키보드(Esc/Tab)를 실제로 확인한다(또는 그 점검을 PR 본문에 항목으로 명시). typecheck/lint/200만으론 충분치 않음.
2. **시트/포커스/전역 동작(스크롤 점프 등)을 한 군데 고치면, 같은 패턴의 모든 출현 지점을 grep으로 전수 확인한다.** 점프류는 `scrollIntoView`·`.focus(`·`autoFocus`·`scrollTo`를 grep해 진입점별로 다른 소스가 없는지 확인하고, "한 곳 수정=해결"로 단정하지 않는다. 전역 동작은 진입점이 여럿(시트는 `openSheet(` 호출처 전부)이므로 한 곳 증상만 보고 끝내지 말 것.

---

## L-007: 시각 버그를 추측으로 반복 수정 — 측정으로 원인을 확정하기 전에 고치지 말 것

**날짜**: 2026-06-16
**위험도**: 높음 (시간 낭비 — 한 버그를 여러 세션에 걸쳐 "고쳤다"고 반복 보고했으나 미해결)
**발생 맥락**: 챗 시트 점프(L-006)를 여러 차례 "원인 X일 것" → 즉시 수정 → "됐을 것"으로 보고했으나 계속 재현. 길어진 이유 3가지: ① 첫 수정(scrollIntoView 제거)이 든 PR이 **미머지·미체크아웃 브랜치**라 dev 서버가 옛 코드를 서빙 → 사용자는 수정안을 _본 적도 없음_. ② **정적 추론**으로 "app-scroll은 시트의 형제라 scrollIntoView가 못 건드린다"고 단정 → endRef의 조상인 **프레임/윈도우**가 범인인 걸 놓침. ③ 측정도 **프록시 지표**(win/frame/app `scrollTop`)를 **스냅샷 시점**(800ms·1600ms)에만 봐서, 배경이 솟구쳤다 **제자리로 복귀하는 transient**를 "이동 없음"으로 놓침. 결국 사용자가 보는 관측량(배경 요소 `getBoundingClientRect().top`)을 **프레임별 연속 샘플** + 사라지지 않는 패널로 찍어서야 293px 왕복(scroll=0)을 잡고 원인 확정.
**재발 이유**: "가설→즉시 수정→됐겠지"의 반복. 원인을 **측정으로 확정**하지 않았고, 수정이 **사용자가 보는 런타임에 실제로 적용됐는지**(브랜치/머지/리로드) 확인하지 않음. 정적 추론(DOM 조상/형제 관계)을 측정 없이 결론으로 사용.
**해결**: 사용자가 보는 그 픽셀을 직접 측정 — 배경 요소의 rect를 프레임별로 기록, transient는 연속 샘플 min/max로 판정. 범인 컨테이너(프레임/윈도우)를 특정한 뒤 그 원인(scrollIntoView)을 제거.
**강화 규칙**:

1. **"고쳤다"고 보고하기 전에, 그 변경이 사용자가 보는 런타임에 실제로 적용됐는지 확인한다.** `git branch --show-current` + dev가 서빙하는 코드가 그 브랜치인지(미머지 PR의 코드는 main에서 도는 dev에 안 뜬다). 사용자에게 "확인해달라" 하기 전에 이걸 먼저 본다.
2. **시각 버그는 프록시가 아니라 사용자가 보는 관측량 자체를 측정한다.** "배경이 튄다" → 배경 요소의 `getBoundingClientRect().top`을 잰다. `scrollTop`만 보고 "스크롤 아님"이라 단정 금지 — transform·조상 스크롤은 자식의 scrollTop을 안 바꾸고도 화면을 움직인다.
3. **transient(잠깐 튀고 복귀)는 스냅샷 1~2회로 놓친다 → 연속 프레임 샘플 + min/max로 본다.** 측정 baseline도 이벤트(예: openSheet) *이전*에 잡아야 그 순간의 변화를 포착한다.
4. **원인 미확정 상태에서 추측 수정을 쌓지 않는다.** 같은 증상을 2번 이상 "고쳤다"가 재현되면, 즉시 멈추고 계측부터. (사용자 정책: 추측 고정 금지 — 의심과 확인 계획을 먼저 말하기)

---

## L-008: 장기 구동 Turbopack dev가 stale → 시각 변경이 사용자 화면에 안 보임 (build로 확인)

**날짜**: 2026-06-18
**위험도**: 높음 (반복 — 한 변경을 여러 번 "반영됨" 보고했으나 사용자 화면 무변화)
**발생 맥락**: 여러 브랜치 전환 + arbitrary Tailwind 값 변경(`max-w-[420px]`→`[390px]`, 커서 unlayered 등)을 거치며, 오래 떠 있던 `next dev`(Turbopack)의 **Tailwind 유틸 CSS 생성이 stale**해짐. curl로 서버 응답 CSS를 보니 옛 규칙(`max-width:420px`)과 새 규칙(`390px`)이 **공존**했고, CSS 청크 URL 해시가 안 바뀌어 브라우저가 옛 CSS를 캐시. HMR이 arbitrary-value CSS 변경을 신뢰성 있게 push하지 못함. → "파일 고침 + dev 컴파일 로그"만 보고 "반영됨"이라 반복 보고했으나 사용자 화면은 그대로.
**재발 이유**: dev 컴파일 로그를 "반영"으로 간주하고, **사용자가 실제 받는 산출물(서버 응답 HTML/CSS)을 확인 안 함**. dev 장기 구동 + 잦은 브랜치 전환의 누적 staleness 간과. (L-007의 "실제 적용 확인"을 서버 응답 레벨까지 안 내려감)
**해결**: dev 정지 → `.next` 삭제 → **production build(`corepack pnpm build`) + `corepack pnpm start`** 로 서빙(결정적, HMR 없음, 새 청크 해시로 캐시버스트). curl로 서버가 새 값만 내보내는지 확인 후 사용자에게 정확한 URL/포트/브랜치 전달.
**강화 규칙**:

1. **"화면에 반영됨"은 서버 응답을 curl로 확인한 뒤에만 말한다** — HTML의 클래스 + CSS 규칙 둘 다. dev 컴파일 로그 ≠ 브라우저가 받는 것.
2. **시각/토큰/레이아웃(특히 arbitrary Tailwind 값) 변경이 화면에 안 보이면 1순위로 dev stale 의심** → `.next` 삭제 후 재기동, 그래도 의심되면 **production build로 확인**(HMR/Tailwind-dev 재생성 stale 원천 차단).
3. **사용자와 정확한 URL·포트·브랜치를 먼저 맞춘다.** dev/포트가 여러 개면 사용자가 다른 걸 볼 수 있음 → 단일 리스너로 정리하고 URL을 명시. 미머지 브랜치는 그 브랜치를 서빙하는 서버에서만 보인다.

---

<!--
운영 규칙:
- 재발하면 날짜를 추가한다(초기 발견 / 재발 / 재발). 재발 횟수 자체가 위험 신호.
- 강화 규칙이 "코딩 중 트리거"가 될 만하면 CLAUDE.md의 Red Flags로 승격하고 L-XXX를 참조로 단다.
- 일회성 단순 버그는 여기 말고 CHANGELOG의 버그 수정 섹션에만.
-->
