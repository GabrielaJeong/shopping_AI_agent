/*
  추천 진입점 (PRD F2 후보 생성 → F3 랭킹의 자리).

  ⚠️ 현재 이 함수 속은 정적 mock이다. `tasteProfile`을 인자로 받지만 아직 사용하지 않는다.
  이후 실제 추천이 구현되면 *이 함수 속만* 바뀌고 화면(Home)은 시그니처만 의존하므로 그대로 둔다:
    - F2: 콘텐츠 기반 유사도(취향 벡터 ↔ 상품 태그)로 후보 생성 (+ 규칙 폴백)
    - F3: 가중합 랭킹으로 정렬 + match·reason 산출(최대 기여 피처 템플릿화)
  match·reason은 "엔진이 계산할 자리"의 더미다(현재는 상품에 박힌 정적 값). (DECISIONS D-002·D-004·D-012)

  콜드스타트(D-005): 빈 취향 벡터여도 동일하게 동작하며 절대 비지 않는다(규칙 기반 시작은 이후 단계).
*/

import type { Product, TasteProfile } from "@/types";
import { PRODUCTS, byId } from "@/data";

export interface Recommendation {
  product: Product;
  /** 0~100. ⚠️ 현재 더미(product.match). 실제로는 F3 랭킹이 계산. */
  match: number;
  /** 추천 근거(HTML). ⚠️ 현재 더미(product.reason). 실제로는 F3가 최대 기여 피처로 생성. */
  reason: string;
}

export interface HomeFeed {
  /** 오늘의 픽 — 가로 슬라이더(여러 개). */
  heroPicks: Recommendation[];
  /** 오늘의 추천 — 카테고리 필터 대상. */
  today: Recommendation[];
  /** AI가 찾은 새 취향(발견). */
  discoveries: Recommendation[];
}

/**
 * 단일 상품의 추천 결과(상세 화면용). 화면은 mock을 직접 보지 말고 이 경계를 통한다.
 * ⚠️ match·reason은 현재 더미(상품에 박힌 값) — 이후 F3 랭킹이 채울 자리(D-012).
 */
export function getProductDetail(id: string): Recommendation | null {
  const product = byId(id);
  return product ? { product, match: product.match, reason: product.reason } : null;
}

/**
 * 탐색 그리드 후보(explore 화면용). 경계 유지(D-012).
 * ⚠️ 현재 전체 카탈로그(mock). 이후 F2 후보 생성 + 신규/탐색 노출 슬롯이 들어올 자리.
 */
export function getExplore(): Recommendation[] {
  return PRODUCTS.map((product) => ({ product, match: product.match, reason: product.reason }));
}

/**
 * 키워드/카테고리로 추린 리스트(list 화면용). 경계 유지(D-012).
 * ⚠️ 현재 mock: 이름·브랜드·태그·카테고리 substring 매칭. 이후 F2 후보 생성으로 대체.
 */
export function getList(keyword: string): Recommendation[] {
  const k = keyword.trim().toLowerCase();
  const matched = !k
    ? PRODUCTS
    : PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(k) ||
          p.brand.toLowerCase().includes(k) ||
          p.category.includes(k) ||
          p.tags.some((t) => t.toLowerCase().includes(k)),
      );
  return matched.map((product) => ({ product, match: product.match, reason: product.reason }));
}

/**
 * "비슷한 상품" 추천(피드백 시트·detail 등). 경계 유지(D-012).
 * ⚠️ 현재 mock: 같은 카테고리를 앞세워 채움. 이후 F2 콘텐츠 유사도(태그 기반)로 대체.
 */
export function getSimilar(id: string, n = 3): Recommendation[] {
  const base = byId(id);
  const others = PRODUCTS.filter((p) => p.id !== id);
  const sorted = base
    ? [...others].sort(
        (a, b) => (b.category === base.category ? 1 : 0) - (a.category === base.category ? 1 : 0),
      )
    : others;
  return sorted
    .slice(0, n)
    .map((product) => ({ product, match: product.match, reason: product.reason }));
}

/**
 * 홈 추천 피드. 취향 프로필을 입력으로 받는다(이 시그니처가 F2~F3 교체의 경계).
 * 현재는 정적 mock — taste는 사용하지 않으며 빈 벡터에도 안전.
 * 반환 형태(heroPicks/today/discoveries)는 Home 디자인(home.jsx/README §5)에 맞춘 것.
 */
export function getHomeFeed(taste: TasteProfile): HomeFeed {
  void taste; // 현재 mock은 취향 벡터를 사용하지 않음(F2/F3에서 사용 예정)
  const all = PRODUCTS.map(
    (product): Recommendation => ({ product, match: product.match, reason: product.reason }),
  );
  return {
    heroPicks: all.slice(0, 5), // 오늘의 픽 슬라이더
    today: all.slice(1, 6), // 오늘의 추천
    discoveries: all.slice(5, 8), // AI가 찾은 새 취향
  };
}
