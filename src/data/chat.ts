/*
  챗봇 샘플 데이터.
  ⚠️ AI_REPLIES는 프로토타입의 키워드 라우팅용 고정 응답 — "정답" 로직 아님.
  실서비스는 발화→LLM 의도 추출→재랭킹 조건→랭킹 결과(match·reason)로 대체(PRD F4).
*/

import type { AiReply, AiReplyKey } from "@/types";

/** 챗 시트의 빠른 답변 칩. */
export const QUICK_REPLIES: string[] = [
  "비슷한 톤으로",
  "더 라이트한 느낌",
  "같은 브랜드",
  "예산 10만원 이하",
  "다른 컬러",
  "비슷한 실루엣",
];

/** 키워드 라우팅용 더미 고정 응답(products = 상품 id 세트). */
export const AI_REPLIES: Record<AiReplyKey, AiReply> = {
  similar_tone: {
    text: "비슷한 베이지·내추럴 톤으로 골라봤어요.",
    products: ["p04", "p07", "p01"],
  },
  lighter: { text: "조금 더 라이트하고 부드러운 톤이에요.", products: ["p06", "p04", "p01"] },
  same_brand: { text: "MUMYUNG의 다른 상품들이에요.", products: ["p01", "p03", "p04"] },
  cheaper: { text: "10만원 이하로 보여드릴게요.", products: ["p01", "p07", "p03"] },
  different_color: { text: "같은 무드의 다른 컬러로요.", products: ["p02", "p05", "p07"] },
  silhouette: { text: "비슷한 오버사이즈 실루엣이에요.", products: ["p03", "p08", "p02"] },
  default: { text: "잠깐, 비슷한 분위기로 찾아볼게요…", products: ["p04", "p01", "p07"] },
};
