/*
  취향 벡터 시드 로직 (PRD F1). UI와 분리된 도메인 함수(D-001).
  온보딩 5단계 선택 → 태그별 가중치 맵(취향 벡터)으로 변환해 초기값을 만든다.

  ⚠️ 초기 가중치는 "출시 단계 수동 휴리스틱"이다(PRD F1/F3의 가중합 단계와 정합).
  데이터가 쌓이면 학습 기반으로 진화할 자리 — 지금 숫자는 합리적 시드일 뿐 학습 결과가 아니다.
*/

import type { TasteProfile, TasteVector } from "@/types";

/** 온보딩 선택 결과(스텝 key별 선택된 옵션 id 배열). */
export interface OnboardingSelections {
  mood: string[];
  budget: string[]; // 단일 선택이지만 배열로 통일(길이 0~1)
  category: string[];
  color: string[];
  lifestyle: string[];
}

/**
 * 선택 카테고리별 초기 신호 강도(휴리스틱).
 * 온보딩 시점엔 무드·컬러가 취향을 가장 잘 대변한다고 보고 더 높게 시드.
 */
const SEED_WEIGHT = {
  mood: 0.7,
  color: 0.6,
  category: 0.5,
  lifestyle: 0.45,
} as const;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** 빈 취향 프로필 — 콜드스타트(온보딩 건너뜀/미완료) 기본값(D-005). 앱은 이 값으로도 깨지지 않아야 한다. */
export function emptyTasteProfile(): TasteProfile {
  return { vector: {}, budget: null };
}

/**
 * 온보딩 선택 → 취향 프로필(벡터 + 예산).
 * 같은 태그가 여러 단계에서 선택되면 가중치를 더하고 [0,1]로 클램프.
 * 예산은 가중치 태그가 아니라 제약이므로 vector에 넣지 않고 budget에 보관("상관 없어요"는 null).
 */
export function buildTasteProfile(selections: OnboardingSelections): TasteProfile {
  const vector: TasteVector = {};
  const add = (tags: string[], w: number) => {
    for (const tag of tags) {
      vector[tag] = clamp01((vector[tag] ?? 0) + w);
    }
  };

  add(selections.mood, SEED_WEIGHT.mood);
  add(selections.color, SEED_WEIGHT.color);
  add(selections.category, SEED_WEIGHT.category);
  add(selections.lifestyle, SEED_WEIGHT.lifestyle);

  const budgetPick = selections.budget[0] ?? null;
  const budget = budgetPick && budgetPick !== "any" ? budgetPick : null;

  return { vector, budget };
}

/** 취향 벡터에서 가중치 상위 N개 태그를 뽑는다(요약 카드 등 표시용). */
export function topTasteTags(vector: TasteVector, n: number): { tag: string; weight: number }[] {
  return Object.entries(vector)
    .map(([tag, weight]) => ({ tag, weight }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, n);
}
