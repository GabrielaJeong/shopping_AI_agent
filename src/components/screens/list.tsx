"use client";

/*
  List 푸시 화면 — 전체보기 / 키워드·AI 발견 추천. 정본 list.jsx / README §10.
  헤더(← + "'키워드' 추천" + 검색) · AI 요약 배너 · 카테고리 칩 · 총N개+정렬3종 · 2열 그리드(행20·열10).
  키워드가 있으면 매칭 우선("먼저 모았어요") + 나머지. 추천 경계 getExplore/getList만 소비(D-012). back → home.

  ⚠️ 탐색의 "AI가 발견한 새 카테고리" 배너가 이 화면을 연다(현재 keyword="레이어드" mock).
     실제 "발견" 로직(어떤 카테고리를 어떻게 제안할지)은 이후 F2(후보 생성)/F3(랭킹) 영역 — 지금은 화면만.
*/

import { useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import { Chip } from "@/components/ui/chip";
import { ProductCard } from "@/components/product-card";
import { useAppShell } from "@/lib/app-shell-state";
import { getExplore, getList } from "@/lib/recommend";
import { CATS } from "@/data";
import type { CategoryId } from "@/types";

type Sort = "match" | "price-low" | "price-high";

const SORTS: [Sort, string][] = [
  ["match", "AI 추천순"],
  ["price-low", "낮은 가격"],
  ["price-high", "높은 가격"],
];

export function List() {
  const shell = useAppShell();
  const keyword = shell.listKeyword;
  const title = keyword ? `'${keyword}' 추천` : (shell.listTitle ?? "오늘의 추천");

  const [cat, setCat] = useState<CategoryId>("all");
  const [sort, setSort] = useState<Sort>("match");

  const all = useMemo(() => getExplore(), []);
  const matched = useMemo(() => (keyword ? getList(keyword) : []), [keyword]);

  const items = useMemo(() => {
    // 키워드: 매칭 우선 + 나머지. 키워드 없음: 전체.
    const matchedIds = new Set(matched.map((r) => r.product.id));
    let arr = keyword
      ? [...matched, ...all.filter((r) => !matchedIds.has(r.product.id))]
      : [...all];
    if (cat !== "all") arr = arr.filter((r) => r.product.category === cat);
    if (sort === "price-low") arr = [...arr].sort((a, b) => a.product.price - b.product.price);
    else if (sort === "price-high")
      arr = [...arr].sort((a, b) => b.product.price - a.product.price);
    else if (!keyword) arr = [...arr].sort((a, b) => b.match - a.match); // 키워드일 땐 매칭 우선 순서 유지
    return arr;
  }, [all, matched, keyword, cat, sort]);

  return (
    <div className="flex flex-1 flex-col">
      {/* 헤더 (← + 제목 + 검색) */}
      <header className="sticky top-0 z-10 flex items-center gap-2 bg-paper px-3 pt-[62px] pb-4">
        <button
          type="button"
          onClick={shell.back}
          aria-label="뒤로"
          className="flex size-[38px] shrink-0 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-paper-3"
        >
          <Icon name="back" size={22} />
        </button>
        <span className="text-h3 flex-1 truncate text-center text-ink">{title}</span>
        <button
          type="button"
          onClick={shell.openSearch}
          aria-label="검색"
          className="flex size-[38px] shrink-0 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-paper-3"
        >
          <Icon name="search" size={22} />
        </button>
      </header>

      {/* AI 요약 배너 */}
      <div className="mb-4 px-5">
        <div className="flex items-center gap-2 rounded-card bg-accent-soft px-3.5 py-3">
          <Icon name="sparkle" size={15} color="var(--color-ink)" />
          <span className="text-[12.5px] leading-relaxed text-ink">
            {keyword ? (
              <>
                <strong className="font-semibold">&lsquo;{keyword}&rsquo;</strong> 취향에 맞는{" "}
                <strong className="font-semibold">{matched.length}개</strong>를 먼저 모았어요
              </>
            ) : (
              <>
                취향 매치도가 높은 순으로{" "}
                <strong className="font-semibold">{items.length}개</strong>를 정렬했어요
              </>
            )}
          </span>
        </div>
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

      {/* 총 N개 + 정렬 */}
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
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-5 px-5 pb-6">
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
          이 카테고리엔 해당 상품이 없어요
        </p>
      )}
    </div>
  );
}
