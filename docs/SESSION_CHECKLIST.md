# SESSION_CHECKLIST.md
> 세션 프로토콜의 실행 형태(체크박스). Moodyfit 명령어에 맞춰 채움.

## 세션 시작
- [ ] `CHANGELOG.md` 최상단 — 최신 버전/최근 작업 확인
- [ ] `docs/CURRENT_STATE.md` — 구현/미구현 스냅샷
- [ ] `docs/LESSONS.md` — 위험도 '높음' 우선
- [ ] 작업 영역의 `docs/CONVENTIONS.md` / `docs/DECISIONS.md` 발췌 확인
- [ ] 작업할 화면의 디자인 정본(`docs/README.md` 해당 섹션) + 관련 PRD 기능(F1~F6) 확인
- [ ] 범위 파악: 수정 파일 + 연결 경계(데이터/라우트/외부 호출) 식별, Red Flags 숙지
- [ ] 환경: 작업 브랜치가 맞는가(`main` 직접 커밋 금지), 베이스라인 검증 통과

## 작업 중
- [ ] CONVENTIONS 준수, Red Flags 트리거 시 즉시 멈춤
- [ ] 외부 경계(스키마/응답/권한) 변경 시 영향 지점 전수 검토
- [ ] 디자인 토큰/카피/플로우는 정본 근거로만 변경

## 검증 (변경 성격에 맞춰 차등)
- [ ] 타입/시그니처 → `pnpm typecheck`
- [ ] UI/스타일 → `pnpm typecheck` + `pnpm lint`
- [ ] 새 라우트/페이지 → + `pnpm build`
- [ ] 백엔드/로직(API 라우트) → + 단위 테스트

## 세션 종료
- [ ] 버그 셀프 리포트 → 재발 가능 패턴이면 `docs/LESSONS.md` L-XXX
- [ ] 설계 결정 기록 → 있으면 `docs/DECISIONS.md` D-XXX
- [ ] 상태 갱신 → `docs/CURRENT_STATE.md` / 해당 시 `CHANGELOG.md`
- [ ] 커밋 & 푸시 → 작업 브랜치, 메시지에 의도/근거
