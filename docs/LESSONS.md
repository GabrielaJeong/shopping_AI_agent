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

<!--
운영 규칙:
- 재발하면 날짜를 추가한다(초기 발견 / 재발 / 재발). 재발 횟수 자체가 위험 신호.
- 강화 규칙이 "코딩 중 트리거"가 될 만하면 CLAUDE.md의 Red Flags로 승격하고 L-XXX를 참조로 단다.
- 일회성 단순 버그는 여기 말고 CHANGELOG의 버그 수정 섹션에만.
-->
