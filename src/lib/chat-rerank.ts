/*
  챗봇 재랭킹 경계 (PRD F4 — 이 앱의 핵심 차별점). UI와 분리된 도메인 함수(D-001 / D-014).

  ⚠️ 방향성(계속 강조한 것): 챗봇이 랭킹으로 올리는 것은 **점수가 아니라 조건(ReorderConditions)**이다.
  match·reason은 rerank가 돌려주는 **결과**다. 챗봇 ↔ 랭킹은 양방향.

  발화 → 조건 → 재정렬을 두 함수로 분리:
   - parseReorderIntent(발화, 맥락) → ReorderConditions
       ⚠️ 현재 간단한 키워드 기반 mock. 이후 **LLM 의도 파싱**으로 *이 함수 속만* 대체.
       (프로토타입의 "키워드→고정 응답 라우팅"이 아니라, 구조화된 조건을 산출한다.)
   - rerank(조건, 취향) → Recommendation[] (match·reason 포함)
       ⚠️ 현재 mock: 조건으로 카탈로그를 필터/가중 정렬. 이후 **F3 랭킹 엔진**이 조건을 피처로 받아 처리할 자리.
*/

import type { Recommendation } from "./recommend";
import type { TasteProfile } from "@/types";
import { PRODUCTS, byId } from "@/data";

export interface ReorderConditions {
  /** 톤/색 제약 태그. */
  tones: string[];
  /** 실루엣/핏 제약 태그. */
  silhouettes: string[];
  /** 가격 상한(원). null이면 제약 없음. */
  maxPrice: number | null;
  /** 같은 브랜드 제약. */
  brand: string | null;
  /** 취향 벡터 위에 얹을 태그 가중치 조정(+/-). */
  weightAdjust: Record<string, number>;
  /** 원본 발화(표시/디버그용). */
  utterance: string;
}

export interface ReorderContext {
  taste: TasteProfile;
  /** 지금 보고 있는 상품("비슷한 톤"이 무엇 대비인지 해소용). */
  currentProductId?: string | null;
}

/**
 * 발화 → 재랭킹 조건. ⚠️ mock 키워드 파싱(이후 LLM 의도 추출로 대체).
 * "비슷한 톤/실루엣"은 맥락(현재 상품)의 태그를 제약으로 끌어온다.
 */
export function parseReorderIntent(utterance: string, ctx: ReorderContext): ReorderConditions {
  const u = utterance;
  const current = ctx.currentProductId ? byId(ctx.currentProductId) : undefined;
  const cond: ReorderConditions = {
    tones: [],
    silhouettes: [],
    maxPrice: null,
    brand: null,
    weightAdjust: {},
    utterance,
  };

  if (/라이트|가벼|밝/.test(u)) {
    cond.tones.push("라이트");
    cond.weightAdjust["라이트"] = 0.2;
  }
  if (/비슷한 톤|같은 톤|톤/.test(u) && current) {
    cond.tones.push(...current.tags);
  }
  if (/같은 브랜드/.test(u) && current) {
    cond.brand = current.brand;
  }
  if (/실루엣|핏/.test(u) && current) {
    cond.silhouettes.push(...current.tags);
  }
  if (/다른 컬러|컬러/.test(u)) {
    // 컬러 제약 완화(현재 mock에선 no-op 표시만)
    cond.weightAdjust["컬러"] = 0;
  }
  const priceMatch = u.match(/(\d+)\s*만원/);
  if (priceMatch && /이하|아래|under|미만/.test(u)) {
    cond.maxPrice = Number(priceMatch[1]) * 10000;
  }

  return cond;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/**
 * 조건 + 취향 벡터로 재정렬한 추천. ⚠️ mock 점수식(이후 F3 랭킹 엔진으로 대체).
 * match는 여기서 산출한 결과, reason은 조건을 템플릿화한 결과(이후 최대 기여 피처로 생성).
 */
export function rerank(
  conditions: ReorderConditions,
  taste: TasteProfile,
  n = 3,
): Recommendation[] {
  let candidates = PRODUCTS.slice();
  if (conditions.maxPrice != null) {
    candidates = candidates.filter((p) => p.price <= conditions.maxPrice!);
  }
  if (conditions.brand) {
    candidates = candidates.filter((p) => p.brand === conditions.brand);
  }

  const constraintTags = new Set([...conditions.tones, ...conditions.silhouettes]);

  const scored = candidates
    .map((product) => {
      let score = 50;
      for (const tag of product.tags) score += (taste.vector[tag] ?? 0) * 20; // 취향 유사도
      for (const tag of product.tags) if (constraintTags.has(tag)) score += 12; // 조건 부합
      for (const [tag, adj] of Object.entries(conditions.weightAdjust)) {
        if (product.tags.includes(tag)) score += adj * 30;
      }
      return { product, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, n).map(({ product, score }) => ({
    product,
    match: clamp(Math.round(score), 0, 100),
    reason: buildReason(conditions, product),
  }));
}

function buildReason(c: ReorderConditions, product: { tags: string[] }): string {
  const bits: string[] = [];
  const matchedTone = c.tones.find((t) => product.tags.includes(t)) ?? c.tones[0];
  if (matchedTone) bits.push(`<strong>${matchedTone}</strong> 톤`);
  if (c.brand) bits.push(`<strong>${c.brand}</strong>`);
  if (c.maxPrice != null) bits.push(`예산 ${Math.round(c.maxPrice / 10000)}만원 이하`);
  if (c.silhouettes.length) bits.push(`비슷한 실루엣`);
  return bits.length
    ? `${bits.join(" + ")} 조건에 맞춰 다시 골랐어요.`
    : "방금 조건으로 다시 정렬했어요.";
}

/** 조건을 사람이 읽는 AI 응답 한 줄로(고정 응답 매핑이 아니라 조건에서 생성). */
export function replyText(conditions: ReorderConditions): string {
  if (conditions.brand) return `${conditions.brand} 상품들로 다시 골라봤어요.`;
  if (conditions.maxPrice != null)
    return `예산 ${Math.round(conditions.maxPrice / 10000)}만원 이하로 다시 골라봤어요.`;
  if (conditions.tones.includes("라이트")) return "조금 더 라이트한 느낌으로 골라봤어요.";
  if (conditions.silhouettes.length) return "비슷한 실루엣으로 골라봤어요.";
  if (conditions.tones.length) return "비슷한 톤으로 골라봤어요.";
  return "이 조건으로 추천을 다시 정렬했어요.";
}
