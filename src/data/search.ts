/*
  검색 화면 샘플 데이터.
  ⚠️ TRENDING의 change·delta는 데모 더미 — 실서비스는 실시간 집계값.
*/

import type { TrendingTerm } from "@/types";

/** 실시간 인기 검색어(라이브 랭킹). */
export const TRENDING: TrendingTerm[] = [
  { term: "오버사이즈 셔츠", change: "up", delta: 2 },
  { term: "카멜 코트", change: "up", delta: 1 },
  { term: "워시드 데님", change: "same", delta: 0 },
  { term: "캐시미어 베스트", change: "new", delta: 0 },
  { term: "미니멀 토트백", change: "down", delta: 1 },
  { term: "로우 스니커즈", change: "up", delta: 3 },
  { term: "울 머플러", change: "down", delta: 2 },
  { term: "와이드 슬랙스", change: "same", delta: 0 },
  { term: "린넨 셔츠", change: "new", delta: 0 },
  { term: "레이어드 니트", change: "up", delta: 1 },
];

/** AI 맞춤 추천 검색어(취향 기반 — 현재 더미). */
export const AI_SEARCHES: string[] = [
  "베이지 셔츠",
  "데일리 슬랙스",
  "가을 레이어드",
  "미니멀 가방",
];

/** 최근 검색어(현재 더미 — 실서비스는 사용자별 이력). */
export const RECENT: string[] = ["린넨 셔츠", "다크 브라운 가방"];
