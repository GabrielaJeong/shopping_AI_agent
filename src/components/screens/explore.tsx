"use client";

/*
  Explore(탐색) 탭 — 정본 explore.jsx / README §6.
  타이틀 "취향에 맞는 모든 것" + 검색 / AI 발견 배너(→list) / 카테고리 칩 / 총N개+정렬 칩 /
  2열 그리드(행 20·열 10) / 하단 "AI에게 묻기" 배너(→chat). 상품은 추천 경계 getExplore()만 소비(D-012).
*/

import { useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { useAppShell } from "@/lib/app-shell-state";
import { getExplore } from "@/lib/recommend";
import { CATS } from "@/data";
import type { CategoryId } from "@/types";

type Sort = "match" | "price-low" | "price-high";

const SORTS: [Sort, string][] = [
  ["match", "AI 추천순"],
  ["price-low", "낮은 가격"],
  ["price-high", "높은 가격"],
];

export function Explore() {
  const shell = useAppShell();
  const feed = useMemo(() => getExplore(), []);
  const [cat, setCat] = useState<CategoryId>("all");
  const [sort, setSort] = useState<Sort>("match");

  const items = useMemo(() => {
    const filtered = cat === "all" ? feed : feed.filter((r) => r.product.category === cat);
    return [...filtered].sort((a, b) =>
      sort === "price-low"
        ? a.product.price - b.product.price
        : sort === "price-high"
          ? b.product.price - a.product.price
          : b.match - a.match,
    );
  }, [feed, cat, sort]);

  return (
    <div className="flex flex-1 flex-col">
      {/* 앱바: 타이틀 + 검색 */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-paper px-5 pt-[70px] pb-5">
        <h1 className="text-h1 text-ink">취향에 맞는 모든 것</h1>
        <button
          type="button"
          aria-label="검색"
          onClick={shell.openSearch}
          className="flex size-[38px] cursor-pointer items-center justify-center rounded-full text-ink hover:bg-paper-3"
        >
          <Icon name="search" size={22} />
        </button>
      </header>

      {/* AI 발견 배너 → list */}
      <div className="mb-4 px-5">
        <button
          type="button"
          onClick={() => shell.openList({ title: "레이어드", keyword: "레이어드" })}
          className="flex w-full items-center gap-2.5 rounded-card bg-paper-2 p-3.5 text-left"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
            <Icon name="sparkle" size={15} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="text-caption mb-0.5 block text-ink-2">AI가 발견한 새 카테고리</span>
            <span className="text-body block font-semibold tracking-[-0.3px] text-ink">
              <strong className="font-semibold">레이어드 니트</strong>를 좋아하실 것 같아요
            </span>
          </span>
          <Icon name="chevron-right" size={18} color="var(--color-ink-2)" />
        </button>
      </div>

      {/* 카테고리 칩 */}
      <div className="mb-4 flex gap-1.5 overflow-x-auto px-5 [scrollbar-width:none]">
        {CATS.map((c) => (
          <Chip
            key={c.id}
            variant={cat === c.id ? "selected" : "default"}
            onClick={() => setCat(c.id)}
          >
            {c.name}
          </Chip>
        ))}
      </div>

      {/* 총 N개 + 정렬 칩 */}
      <div className="mb-4 flex items-center justify-between px-5">
        <span className="text-caption text-ink-3">총 {items.length}개</span>
        <div className="flex gap-1.5">
          {SORTS.map(([key, label]) => (
            <Chip
              key={key}
              variant={sort === key ? "selected" : "outline"}
              size="tiny"
              onClick={() => setSort(key)}
            >
              {label}
            </Chip>
          ))}
        </div>
      </div>

      {/* 2열 그리드 (행 20 · 열 10) */}
      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-5 px-5">
          {items.map((r) => (
            <ProductCard
              key={r.product.id}
              rec={r}
              size="auto"
              saved={shell.isSaved(r.product.id)}
              onToggleSaved={() => shell.toggleSaved(r.product.id)}
              onClick={() => shell.openDetail(r.product.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-body-2 px-5 py-6 text-center text-ink-2">
          이 카테고리엔 아직 추천이 없어요
        </p>
      )}

      {/* 하단 "AI에게 묻기" 배너 → chat */}
      <div className="mt-8 px-5 pb-6">
        <div className="rounded-card bg-paper-2 px-4 py-5 text-center">
          <p className="text-body font-medium text-ink">찾는 게 없으세요?</p>
          <p className="text-body-2 mt-1 text-ink-2">AI에게 직접 물어보세요</p>
          <Button
            variant="primary"
            className="mt-3"
            onClick={() => shell.openSheet({ mode: "chat" })}
          >
            <Icon name="chat" size={16} />
            AI에게 묻기
          </Button>
        </div>
      </div>
    </div>
  );
}
