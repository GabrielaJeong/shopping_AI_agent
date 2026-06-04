# CONVENTIONS.md

> Moodyfit 코딩 규칙 상세. CLAUDE.md "코딩 규칙(요약)"의 풀버전.
> 빈 스켈레톤으로 시작 — 스택 스캐폴드 후 실제 패턴이 정해지면 항목을 채운다.

## 네이밍

- ( 파일/컴포넌트/함수/변수 네이밍 규칙. 스캐폴드 후 확정 )

## 계층 경계

- ( 데이터 접근·추천 로직은 `/lib` 한 곳으로. 화면은 인터페이스만 소비. 구체 규칙은 스캐폴드 후 )

## 디자인 토큰 / 스타일

- **출처**: 프로토타입 `docs/prototype-handoff/design_files/styles.css` = 토큰의 단일 진실. 색/타이포/radius/shadow를 임의 값으로 하드코딩하지 말 것.
- **정의 위치**: `src/app/globals.css`의 `@theme` 블록 (Tailwind v4 CSS-first). `tailwind.config.*`는 만들지 않는다 (→ D-008).
- **네이밍 → 유틸리티**:
  - 색 `--color-paper / paper-2 / paper-3 / paper-deep / ink / ink-2 / ink-3 / ink-soft / line / line-soft / accent / accent-soft / accent-deep / hot / hot-soft / down` → `bg-*` `text-*` `border-*`.
  - radius `--radius-image|chip|btn|card|sheet` → `rounded-*`. shadow `--shadow-card|sheet|elev` → `shadow-*`.
  - 텍스트 `--text-display|h1|h2|h3|body|body-2|caption|label|price` (size + `--line-height`/`--letter-spacing`/`--font-weight` 모디파이어) → `text-*`. `label`은 `uppercase`를 함께.
- **간격**: Tailwind 기본 스케일(4px step) 사용. 화면 좌우 패딩 20px = `px-5`, 6px = `gap-1.5`, 10px = `gap-2.5`.
- **폰트**: 본문 `font-sans`(Pretendard), 워드마크 `font-brand`(Helvetica/Arial). 이모지 금지.
- 새 토큰이 필요하면 styles.css 근거를 확인하고 `@theme`에 추가 후 사용. 컴포넌트 전용 일회성 값은 토큰화하지 않는다.

## 포맷팅 (Prettier)

- 포맷은 **Prettier 단독** 담당, ESLint는 코드 품질만 본다 (`eslint-config-prettier/flat`로 포맷 규칙 비활성 → 충돌 없음).
- 설정: `.prettierrc.json` (semi, double-quote, printWidth 100, tabWidth 2, trailingComma all, **endOfLine auto**). 무시: `.prettierignore` (빌드 산출물·lock·프로토타입 레퍼런스·바이너리).
- `endOfLine: "auto"`는 Windows의 git autocrlf로 working tree가 CRLF가 돼도 `format:check`가 실패하지 않게 한다 (→ L-002).
- 명령: 정리 `corepack pnpm format` / 검증 `corepack pnpm format:check`. 커밋 전 `format:check` 통과를 기본으로 한다.

## 에러 응답 형식 (API 라우트)

- ( 통일된 에러 스키마. 확정 후 기록 )

## 입력 검증 위치

- ( 검증을 어디서 하는가. 확정 후 기록 )

## 자주 발생한 버그 패턴 → 해결

| 패턴     | 해결 |
| -------- | ---- |
| ( 누적 ) |      |
