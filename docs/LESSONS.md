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

**날짜**: 2026-06-11 (초기 발견) / 2026-06-11 (재발 — 시트 점프를 한 군데만 고쳐 챗 경로가 남음)
**위험도**: 높음 (재발)
**발생 맥락**: 화면을 다 만든 뒤 폴리시 단계에서 — (a) 반응형 디바이스 프레임(#28)으로 셸을 `min-h-dvh`→`h-dvh`(고정 높이)로 바꿨는데 flex 스크롤 체인에 `min-h-0`을 안 넣어 **app 스테이지 스크롤이 죽음**(내용이 넘쳐 잘림). (b) 시트 포커스 접근성(#27)에서 `dialog.focus()`를 `preventScroll` 없이 호출해 **시트 열 때 배경이 강제 스크롤**됨. 둘 다 typecheck/lint/`/` 200은 통과 — 정적 검증으론 안 잡힘. 사용자가 직접 둘러보다 발견.
**재발(시트 점프)**: (b)를 `SheetContainer`의 focus 한 곳만 `preventScroll`로 고쳤는데, **챗 시트엔 두 번째 독립 점프 소스**(`endRef.scrollIntoView` — 배경 스크롤 컨테이너까지 끌어당김)가 따로 있었다. focus 벡터만 보고 "시트 점프 해결"로 판단 → 피드백 시트는 멀쩡한데 모든 챗 진입점(홈 AI 배너/큐레이터, detail 비슷한, feedback 더 묻기, search 결과없음)은 그대로 튐. 사용자가 다시 발견.
**재발 이유**: 검증을 typecheck/lint/HTTP 200에 의존했고, **스크롤·포커스·전환 같은 런타임/시각 동작은 흐름을 돌려봐야** 드러나는데 그 회귀 확인을 안 함. + **증상의 원인이 한 종류라고 가정**하고 한 군데만 고침(같은 증상의 다른 출현 지점을 안 찾음).
**해결**: 스크롤 체인에 `min-h-0` 추가, 시트 포커스는 `focus({ preventScroll: true })`, 챗 리스트는 `scrollIntoView` 대신 컨테이너 `scrollTop = scrollHeight`로 직접 스크롤(배경 미동).
**강화 규칙**:

1. **레이아웃(height/overflow/flex)·포커스·시트 동작을 바꾸면, 머지 전에 전체 흐름 한 바퀴(런치→탭→푸시→시트)를 돌려** 스크롤·시트 open/close·키보드(Esc/Tab)를 실제로 확인한다(또는 그 점검을 PR 본문에 항목으로 명시). typecheck/lint/200만으론 충분치 않음.
2. **시트/포커스/전역 동작(스크롤 점프 등)을 한 군데 고치면, 같은 패턴의 모든 출현 지점을 grep으로 전수 확인한다.** 점프류는 `scrollIntoView`·`.focus(`·`autoFocus`·`scrollTo`를 grep해 진입점별로 다른 소스가 없는지 확인하고, "한 곳 수정=해결"로 단정하지 않는다. 전역 동작은 진입점이 여럿(시트는 `openSheet(` 호출처 전부)이므로 한 곳 증상만 보고 끝내지 말 것.

---

<!--
운영 규칙:
- 재발하면 날짜를 추가한다(초기 발견 / 재발 / 재발). 재발 횟수 자체가 위험 신호.
- 강화 규칙이 "코딩 중 트리거"가 될 만하면 CLAUDE.md의 Red Flags로 승격하고 L-XXX를 참조로 단다.
- 일회성 단순 버그는 여기 말고 CHANGELOG의 버그 수정 섹션에만.
-->
