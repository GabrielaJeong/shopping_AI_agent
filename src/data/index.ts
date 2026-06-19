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

// 상세 "상품 정보" 파생용 사전. ⚠️ 데모 — 실 서비스는 상품 카탈로그가 필드로 보유.
const FIT_KEYWORDS = ["오버사이즈", "와이드", "박시", "슬림", "릴랙스", "크롭", "하이라이즈", "롱"];
const TONE_NAMES: Record<string, string> = {
  베이지: "에크루 베이지",
  카멜: "카멜",
  차콜: "차콜 그레이",
  오트밀: "오트밀",
  화이트: "오프 화이트",
  다크브라운: "다크 브라운",
  "미디엄 워시": "미디엄 워시",
};

/**
 * 상품 정보 스펙 행(상세 하단). 소재만 카탈로그값(material), 실루엣·컬러는 태그/이름에서 파생.
 * ⚠️ 데모용 파생 — 실제로는 상품 카탈로그의 구조화 필드를 그대로 노출(추측 스키마 아님).
 */
export function productSpec(p: Product): [string, string][] {
  const fits = [
    ...new Set([
      ...p.tags.filter((t) => FIT_KEYWORDS.includes(t)),
      ...FIT_KEYWORDS.filter((k) => p.name.includes(k)),
    ]),
  ];
  const toneTag = p.tags.find((t) => TONE_NAMES[t]);
  return [
    ["소재", p.material],
    ["실루엣", fits.length ? `${fits.join(" · ")} 핏` : "레귤러 핏"],
    ["컬러", toneTag ? TONE_NAMES[toneTag] : "멀티 컬러"],
    ["제조국", "대한민국"],
  ];
}
