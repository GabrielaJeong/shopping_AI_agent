"use client";

/*
  List 푸시 화면 — 키워드/제목 맥락으로 추린 상품 그리드. 구조 참고: list.jsx / README §10.
  데이터는 추천 경계 getList(keyword)만 소비(직접 mock 참조 X, D-012). back → home.
*/

import { useMemo } from "react";
import { Icon } from "@/components/icon";
import { ProductCard } from "@/components/product-card";
import { useAppShell } from "@/lib/app-shell-state";
import { getList } from "@/lib/recommend";

export function List() {
  const shell = useAppShell();
  const title = shell.listTitle ?? shell.listKeyword ?? "추천";
  const items = useMemo(
    () => getList(shell.listKeyword ?? shell.listTitle ?? ""),
    [shell.listKeyword, shell.listTitle],
  );

  return (
    <div className="flex flex-1 flex-col">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 flex items-center gap-2 bg-paper px-3 pt-[62px] pb-4">
        <button
          type="button"
          onClick={shell.back}
          aria-label="뒤로"
          className="flex size-[38px] shrink-0 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-paper-3"
        >
          <Icon name="back" size={22} />
        </button>
        <span className="text-h3 truncate text-ink">{title}</span>
      </header>

      {/* 검색 진입 */}
      <div className="px-5 pb-3">
        <button
          type="button"
          onClick={shell.openSearch}
          className="flex w-full items-center gap-2 rounded-[10px] bg-paper-3 px-3 py-2.5 text-ink-3"
        >
          <Icon name="search" size={18} />
          <span className="text-sm">다른 키워드로 검색</span>
        </button>
      </div>

      {/* 그리드 */}
      {items.length > 0 ? (
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
      ) : (
        <p className="px-5 pt-6 text-body-2 text-ink-2">
          &lsquo;{title}&rsquo;에 맞는 상품이 아직 없어요.
        </p>
      )}
    </div>
  );
}
