/*
  샘플 데이터 + 헬퍼 배럴. 화면은 여기서 import 한다.
  ⚠️ 전부 정적 mock 데이터다. 추천/취향/검색 수치(match·reason·value·delta 등)는
  추천 엔진(PRD F2~F6)이 계산할 자리의 더미값 — 진짜 산출값이 아니다. (types/index.ts, DECISIONS D-002·D-004)
*/

import { PRODUCTS } from "./products";
import type { Product } from "@/types";

export { PRODUCTS } from "./products";
export { TASTE, LEARN_TREND } from "./taste";
export { CATS } from "./categories";
export { TRENDING, AI_SEARCHES, RECENT } from "./search";
export { QUICK_REPLIES, AI_REPLIES } from "./chat";

/** 가격을 "₩ 68,000" 형식으로. */
export function format(price: number): string {
  return "₩ " + price.toLocaleString("ko-KR");
}

/** id로 상품 조회(없으면 undefined). */
export function byId(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
