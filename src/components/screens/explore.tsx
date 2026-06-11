"use client";

/*
  Explore(탐색) 탭 — 2-col 그리드 + 정렬(AI추천순/가격) + 카테고리 필터 + "AI 발견" → list.
  구조 참고: explore.jsx / README §6. 상품은 추천 경계 getExplore()만 소비(D-012).
*/

import { useMemo, useState } from "react";
import { Chip } from "@/components/ui/chip";
import { ProductCard } from "@/components/product-card";
import { useAppShell } from "@/lib/app-shell-state";
import { getExplore } from "@/lib/recommend";
import { CATS, AI_SEARCHES } from "@/data";
import type { CategoryId } from "@/types";

type Sort = "ai" | "price";

export function Explore() {
  const shell = useAppShell();
  const feed = useMemo(() => getExplore(), []);
  const [cat, setCat] = useState<CategoryId>("all");
  const [sort, setSort] = useState<Sort>("ai");

  const items = useMemo(() => {
    const filtered = cat === "all" ? feed : feed.filter((r) => r.product.category === cat);
    return [...filtered].sort((a, b) =>
      sort === "price" ? a.product.price - b.product.price : b.match - a.match,
    );
  }, [feed, cat, sort]);

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 bg-paper px-5 pt-[56px] pb-3">
        <h1 className="text-h1 text-ink">탐색</h1>
      </header>

      {/* AI 발견 */}
      <section className="flex flex-col gap-2 px-5 pb-3">
        <span className="text-label text-ink-2 uppercase">AI 발견</span>
        <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
          {AI_SEARCHES.map((term) => (
            <Chip
              key={term}
              variant="ai"
              onClick={() => shell.openList({ title: term, keyword: term })}
            >
              {term}
            </Chip>
          ))}
        </div>
      </section>

      {/* 카테고리 필터 */}
      <div className="flex gap-1.5 overflow-x-auto px-5 pb-3 [scrollbar-width:none]">
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

      {/* 정렬 토글 */}
      <div className="flex items-center gap-4 px-5 pb-3">
        {(
          [
            ["ai", "AI 추천순"],
            ["price", "가격순"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setSort(key)}
            className={`text-[13px] ${sort === key ? "font-semibold text-ink" : "text-ink-3"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 그리드 */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-5 pt-1">
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
    </div>
  );
}
