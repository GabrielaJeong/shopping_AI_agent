/*
  Moodyfit 도메인 타입 (PRD 데이터 모델 기준).
  handoff data.js의 필드 구조는 참고만 했고, PRD(F1~F6)·용어집을 기준으로 정의.

  ⚠️ 중요 — "추천 엔진이 계산할 자리"인 더미 값들:
  match · reason · TasteKeyword.value/delta · TrendingTerm.delta 등은 **현재 정적 더미**다.
  실제로는 추천 파이프라인(PRD F2~F6: 후보 생성·랭킹·취향 벡터·피드백 루프)이 계산할 값으로,
  지금 샘플 데이터에 박힌 숫자/문구는 데모용일 뿐 진짜 계산 결과가 아니다. (→ DECISIONS D-002·D-004)
  다음 세션은 이 값들을 실제 산출값으로 착각하지 말 것.
*/

export type CategoryId = "all" | "top" | "bottom" | "outer" | "shoes" | "bag" | "acc";

export interface Category {
  id: CategoryId;
  name: string;
}

/** 상품 썸네일 톤 블록 색 — 실제 사진 전 플레이스홀더(light→base→dark 그라데이션). */
export interface ProductImgColors {
  light: string;
  base: string;
  dark: string;
}

/**
 * 추천 매치 점수(0–100).
 * ⚠️ 더미. 실제로는 랭킹 모델(PRD F3)이 취향 유사도·인기·맥락·챗봇 조건의 가중합으로 계산.
 */
export type MatchScore = number;

/**
 * 추천 근거 "왜 추천했는지"(HTML 포함 — `<strong>` 강조).
 * ⚠️ 더미. 실제로는 최대 기여 피처를 템플릿으로 변환(PRD F3)해 생성.
 */
export type ReasonHtml = string;

export interface Product {
  id: string;
  brand: string;
  name: string;
  /** 원화 정수(₩). */
  price: number;
  category: CategoryId;
  /** 스타일/속성 태그 — 콘텐츠 기반 후보 생성·취향 벡터 매칭의 근거(PRD F2). */
  tags: string[];
  /** 컬러 스와치 hex 목록. */
  colors: string[];
  /** 주 소재(상세 "상품 정보" 표기용). ⚠️ 데모 카탈로그값. */
  material: string;
  img: ProductImgColors;
  match: MatchScore;
  reason: ReasonHtml;
}

/**
 * 취향 키워드 막대(마이/온보딩 요약, 피드백 시트 학습 변화).
 * ⚠️ value·delta는 더미. 실제로는 취향 벡터(PRD F1 시드 / F6 갱신)가 보유·갱신할 값.
 */
export interface TasteKeyword {
  name: string;
  /** 선호 강도 0–1 (더미). */
  value: number;
  /** 최근 변화량 — F6 피드백 루프가 산출(더미). */
  delta: number;
}

export type TrendChange = "up" | "down" | "same" | "new";

/** 실시간 인기 검색어 행. ⚠️ change·delta는 데모 더미(실서비스는 집계값). */
export interface TrendingTerm {
  term: string;
  change: TrendChange;
  /** 순위 변화 폭(더미). */
  delta: number;
}

/** 챗봇 canned 응답 키(프로토타입 키워드 라우팅 — 실서비스는 LLM 의도 추출로 대체, PRD F4). */
export type AiReplyKey =
  | "similar_tone"
  | "lighter"
  | "same_brand"
  | "cheaper"
  | "different_color"
  | "silhouette"
  | "default";

/** ⚠️ 더미 고정 응답. 실제로는 재랭킹 결과(match·reason 포함)를 LLM/추천이 생성(PRD F4). */
export interface AiReply {
  text: string;
  /** 답변에 곁들일 상품 id 세트. */
  products: string[];
}

/**
 * 취향 벡터 — 태그→가중치(0~1) 맵. 한 사용자의 취향 프로필.
 * F1 온보딩이 초기값을 시드하고, 이후 F6 피드백 루프가 갱신한다(부호 있는 델타·정규화·감쇠).
 * 예: { 미니멀: 0.7, 베이지: 0.6, ... }
 */
export type TasteVector = Record<string, number>;

/** 취향 프로필 — 취향 벡터 + 별도 제약(예산). 온보딩(F1) 산출물이자 추천(F2~F6)의 입력. */
export interface TasteProfile {
  vector: TasteVector;
  /** 예산 선택(단일) — 가중치 태그가 아니라 필터 제약. 미선택/상관없음이면 null. */
  budget: string | null;
}
