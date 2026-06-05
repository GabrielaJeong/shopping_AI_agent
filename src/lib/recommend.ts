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
import { byId } from "@/data";

export interface Recommendation {
  product: Product;
  /** 0~100. ⚠️ 현재 더미(product.match). 실제로는 F3 랭킹이 계산. */
  match: number;
  /** 추천 근거(HTML). ⚠️ 현재 더미(product.reason). 실제로는 F3가 최대 기여 피처로 생성. */
  reason: string;
}

export interface HomeSection {
  title: string;
  /** "전체보기" → list view 키워드(없으면 제목 기준). */
  keyword?: string;
  items: Recommendation[];
}

export interface HomeFeed {
  /** 오늘의 픽(히어로). */
  hero: Recommendation;
  /** 가로 스크롤 픽 row. */
  picks: Recommendation[];
  sections: HomeSection[];
}

function rec(id: string): Recommendation {
  const product = byId(id);
  if (!product) throw new Error(`recommend: unknown product id ${id}`);
  return { product, match: product.match, reason: product.reason };
}

/**
 * 홈 추천 피드. 취향 프로필을 입력으로 받는다(이 시그니처가 F2~F3 교체의 경계).
 * 현재는 정적 mock — taste는 사용하지 않으며 빈 벡터에도 안전.
 */
export function getHomeFeed(taste: TasteProfile): HomeFeed {
  void taste; // 현재 mock은 취향 벡터를 사용하지 않음(F2/F3에서 사용 예정)
  return {
    hero: rec("p01"),
    picks: [rec("p02"), rec("p03"), rec("p04"), rec("p06"), rec("p08")],
    sections: [
      { title: "오늘 들어온 추천", items: [rec("p01"), rec("p04"), rec("p07"), rec("p03")] },
      { title: "베이지 무드 추천", keyword: "베이지", items: [rec("p01"), rec("p04"), rec("p07")] },
      { title: "미니멀 데일리", keyword: "미니멀", items: [rec("p03"), rec("p06"), rec("p08")] },
    ],
  };
}
