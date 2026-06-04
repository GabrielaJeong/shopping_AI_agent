# CHANGELOG

> Moodyfit 버전 이력. 최신이 맨 위. 세션 시작 시 최상단 몇 개만 확인.

## [Unreleased]

### Added

- 문서 하네스 부트스트랩: `CLAUDE.md`, `docs/`(CONVENTIONS·LESSONS·DECISIONS·CURRENT_STATE·SESSION_CHECKLIST·SECURITY), `CHANGELOG.md`, `memory/MEMORY.md` 생성.
- 설계 결정 기록: `docs/DECISIONS.md` D-001~D-007 (스택, UI먼저·로직mock, DB=PostgreSQL, 추천 파이프라인 단계전환, 콜드스타트, 제품명 Moodyfit, Next 15 고정). 각 결정에 PRD F1~F6 연결.
- **앱 스캐폴드**: Next.js 15.5.19 + React 19.1 + TypeScript + Tailwind v4 + App Router(`src/`), pnpm(corepack). `next.config.ts` turbopack.root 고정, `pnpm-workspace.yaml` allowBuilds(sharp·unrs-resolver), `package.json`에 `typecheck` 스크립트 추가.
- 베이스라인 검증 통과: `typecheck` / `lint` / `build` 모두 green.
- **Prettier 도입**: prettier 3.8 + eslint-config-prettier 10(`/flat`)로 ESLint와 무충돌 구성. `.prettierrc.json`·`.prettierignore` 추가, `format`·`format:check` 스크립트 추가. CONVENTIONS·검증 명령 목록에 반영.

### Fixed

- `.prettierrc.json`에 `endOfLine: "auto"` 추가 — Windows autocrlf로 CRLF가 된 working tree에서 `format:check`가 전 파일 실패하던 문제 해결 (L-002).

### Lessons

- L-001: pnpm 11의 ignored build scripts가 typecheck/lint/build를 차단 → `pnpm-workspace.yaml allowBuilds`로 해결. CLAUDE.md Red Flag로 승격.

### Notes

- CLAUDE.md Red Flags는 L-001만 보유(나머지는 겪으며 누적).
- 제품명 표기 Moodyfit / `moodyfit_` 통일은 D-006. 화면 구현 시 프로토타입의 `mudifit_` 키를 일괄 치환.
