# CONVENTIONS.md

> Moodyfit 코딩 규칙 상세. CLAUDE.md "코딩 규칙(요약)"의 풀버전.
> 빈 스켈레톤으로 시작 — 스택 스캐폴드 후 실제 패턴이 정해지면 항목을 채운다.

## 네이밍

- ( 파일/컴포넌트/함수/변수 네이밍 규칙. 스캐폴드 후 확정 )

## 계층 경계

- ( 데이터 접근·추천 로직은 `/lib` 한 곳으로. 화면은 인터페이스만 소비. 구체 규칙은 스캐폴드 후 )

## 디자인 토큰 / 스타일

- ( 토큰 출처 = 프로토타입 `styles.css`. Tailwind 토큰 매핑 규칙은 스캐폴드 후 확정 )

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
