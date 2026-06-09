/*
  피드백 반영 (PRD F6 — 피드백 루프). UI와 분리된 도메인 함수(D-001 / D-013).
  사용자 신호를 취향 벡터에 **부호 있는 델타**로 반영해 갱신된 프로필을 만든다.

  ⚠️ 현재는 신호별 고정 +/−델타다(단순 골격). 이후 F6 명세로 *이 함수 속만* 대체될 자리:
   - 신호별 가중치(구매 > 저장 > 좋아요 > 체류 > 클릭, 스킵/숨김은 −)
   - 정규화(가중치 발산 방지) + 시간 감쇠(옛 취향 깎기)
  지금은 경계와 부호 델타 골격까지. 화면이 보여주는 변화는 여기서 실제로 바뀐 값이어야 한다.
*/

import type { Product, TasteProfile, TasteVector } from "@/types";

export type FeedbackSignal = "like" | "save" | "dislike" | "hide";

/** 신호별 고정 델타(부호 포함). 임시 휴리스틱 — F6에서 신호 가중치로 대체. */
const SIGNAL_DELTA: Record<FeedbackSignal, number> = {
  save: 0.1,
  like: 0.08,
  dislike: -0.08,
  hide: -0.12,
};

export interface TasteChange {
  tag: string;
  /** 실제 적용된 변화량(클램프 반영). */
  delta: number;
  before: number;
  after: number;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * 신호를 상품 태그에 반영해 갱신된 프로필 + 실제 변화 목록을 반환.
 * 무관한 태그는 건드리지 않는다(부호 있는 델타 — 양수/음수 경로 모두 지원).
 */
export function applyFeedback(
  taste: TasteProfile,
  product: Product,
  signal: FeedbackSignal,
): { profile: TasteProfile; changes: TasteChange[] } {
  const delta = SIGNAL_DELTA[signal];
  const vector: TasteVector = { ...taste.vector };
  const changes: TasteChange[] = [];

  for (const tag of product.tags) {
    const before = round2(vector[tag] ?? 0);
    const after = round2(clamp01(before + delta));
    vector[tag] = after;
    changes.push({ tag, delta: round2(after - before), before, after });
  }

  return { profile: { ...taste, vector }, changes };
}
