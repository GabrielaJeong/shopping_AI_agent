"use client";

/*
  Home 탭 — 개인화 AI 피드. 데이터는 추천 경계 함수 getHomeFeed(tasteProfile)만 소비(mock 직접 참조 X).
  카드 탭 → detail, "전체보기"/키워드 → list, AI 배너 → chat 시트, 찜은 전역 savedIds.
  구조 참고: home.jsx / README §5.
*/

import { useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import { Chip } from "@/components/ui/chip";
import { ProductCard } from "@/components/product-card";
import { ProductImg } from "@/components/product-img";
import { Reason } from "@/components/reason";
import { useAppState } from "@/lib/app-state";
import { useAppShell } from "@/lib/app-shell-state";
import { getHomeFeed, type Recommendation } from "@/lib/recommend";
import { CATS, format } from "@/data";
import type { CategoryId } from "@/types";

export function Home() {
  const { tasteProfile } = useAppState();
  const shell = useAppShell();
  const feed = useMemo(() => getHomeFeed(tasteProfile), [tasteProfile]);
  const [cat, setCat] = useState<CategoryId>("all");

  const filter = (items: Recommendation[]) =>
    cat === "all" ? items : items.filter((r) => r.product.category === cat);

  const picks = filter(feed.picks);

  return (
    <div className="flex flex-1 flex-col">
      {/* 앱바 */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-paper px-5 pt-[58px] pb-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-caption text-ink-3">오늘의 무드</span>
          <span className="text-h1 text-ink">회원님</span>
        </div>
        <button
          type="button"
          aria-label="알림"
          className="relative flex size-9 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-paper-3"
        >
          <Icon name="bell" size={22} />
          <span className="absolute top-2 right-2 size-1.5 rounded-full bg-hot" />
        </button>
      </header>

      {/* 검색 진입 */}
      <div className="px-5 pb-3">
        <button
          type="button"
          onClick={shell.openSearch}
          className="flex w-full items-center gap-2 rounded-[10px] bg-paper-3 px-3 py-2.5 text-ink-3"
        >
          <Icon name="search" size={18} />
          <span className="text-sm">어떤 옷을 찾으세요?</span>
        </button>
      </div>

      {/* 카테고리 칩 필터(인스크린) */}
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

      {/* AI 배너 → 챗 시트 */}
      <div className="px-5 pb-4">
        <button
          type="button"
          onClick={() => shell.openSheet({ mode: "chat" })}
          className="w-full rounded-[16px_16px_16px_4px] bg-ink px-4 py-3.5 text-left text-paper"
        >
          <span className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.08em] text-paper-3 uppercase">
            <Icon name="sparkle" size={12} />
            AI 큐레이터
          </span>
          <span className="text-body-2 text-paper">
            &ldquo;더 라이트한 느낌으로&rdquo; 같은 말로 추천을 다시 골라드려요.
          </span>
        </button>
      </div>

      {/* 오늘의 픽 히어로 */}
      <section className="px-5 pb-5">
        <h2 className="text-label mb-3 text-ink-2 uppercase">오늘의 픽</h2>
        <Hero rec={feed.hero} />
      </section>

      {/* 픽 가로 스크롤 */}
      <section className="pb-5">
        <SectionHead title="당신을 위한 추천" />
        {picks.length > 0 ? <Row items={picks} /> : <EmptyRow />}
      </section>

      {/* 섹션별 추천 */}
      {feed.sections.map((sec) => {
        const items = filter(sec.items);
        return (
          <section key={sec.title} className="pb-5">
            <SectionHead
              title={sec.title}
              onMore={() => shell.openList({ title: sec.title, keyword: sec.keyword })}
            />
            {items.length > 0 ? <Row items={items} /> : <EmptyRow />}
          </section>
        );
      })}
    </div>
  );
}

/* 오늘의 픽 히어로 카드. */
function Hero({ rec }: { rec: Recommendation }) {
  const shell = useAppShell();
  const { product, match, reason } = rec;
  return (
    <div className="flex flex-col gap-3 rounded-card bg-paper-2 p-4 shadow-card">
      <div
        role="button"
        tabIndex={0}
        onClick={() => shell.openDetail(product.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            shell.openDetail(product.id);
          }
        }}
        className="cursor-pointer text-left"
      >
        <ProductImg
          colors={product.img}
          brand={product.brand}
          shape="base"
          favBtn
          fav={shell.isSaved(product.id)}
          onFav={() => shell.toggleSaved(product.id)}
        />
        <div className="mt-3 flex items-baseline justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-caption text-ink-2">{product.brand}</span>
            <span className="text-h3 text-ink">{product.name}</span>
          </div>
          <span className="text-price text-ink">{format(product.price)}</span>
        </div>
      </div>
      <div className="rounded-btn bg-accent-soft px-3.5 py-3">
        <span className="mr-1.5 inline-block rounded bg-paper px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.1em] text-ink uppercase">
          AI {match}%
        </span>
        <Reason html={reason} className="text-[12.5px] leading-relaxed text-ink" />
      </div>
    </div>
  );
}

function SectionHead({ title, onMore }: { title: string; onMore?: () => void }) {
  return (
    <div className="mb-3 flex items-baseline justify-between px-5">
      <h2 className="text-h3 text-ink">{title}</h2>
      {onMore && (
        <button
          type="button"
          onClick={onMore}
          className="cursor-pointer text-[12px] font-medium tracking-[-0.1px] text-ink-2"
        >
          전체보기
        </button>
      )}
    </div>
  );
}

function Row({ items }: { items: Recommendation[] }) {
  const shell = useAppShell();
  return (
    <div className="flex gap-2.5 overflow-x-auto px-5 [scrollbar-width:none]">
      {items.map((r) => (
        <ProductCard
          key={r.product.id}
          rec={r}
          size="md"
          saved={shell.isSaved(r.product.id)}
          onToggleSaved={() => shell.toggleSaved(r.product.id)}
          onClick={() => shell.openDetail(r.product.id)}
        />
      ))}
    </div>
  );
}

function EmptyRow() {
  return <p className="px-5 text-caption text-ink-3">이 카테고리에 맞는 추천이 아직 없어요.</p>;
}
