/*
  취향 키워드 / 학습 추세 샘플.
  ⚠️ value·delta·추세 수치는 정적 더미 — 실제로는 취향 벡터(PRD F1 시드 / F6 갱신)가 산출.
*/

import type { TasteKeyword } from "@/types";

/** "내 취향 키워드" 막대 데이터(마이/온보딩 요약). */
export const TASTE: TasteKeyword[] = [
  { name: "미니멀", value: 0.78, delta: 0.06 },
  { name: "베이지", value: 0.71, delta: 0.04 },
  { name: "오버사이즈", value: 0.62, delta: 0.08 },
  { name: "내추럴", value: 0.55, delta: 0.02 },
  { name: "레이어드", value: 0.42, delta: 0 },
];

/** 학습 스파크라인(주간 진행률, 더미). */
export const LEARN_TREND: number[] = [42, 47, 51, 55, 58, 60, 64];
