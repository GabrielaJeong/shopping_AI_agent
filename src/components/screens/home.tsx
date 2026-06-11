"use client";

/*
  Home 탭 — 개인화 AI 피드. 구조·충실도: home.jsx / README §5.
  데이터는 추천 경계 getHomeFeed(tasteProfile)만 소비(mock 직접 참조 X, D-012).
  구성: 앱바 → AI 배너 → 오늘의 픽 슬라이더 → 내 취향 키워드(실제 벡터) → 오늘의 추천(카테고리 필터) → AI가 찾은 새 취향.
*/

import { useMemo, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { ProductImg } from "@/components/product-img";
import { Reason } from "@/components/reason";
import { useAppState } from "@/lib/app-state";
import { useAppShell } from "@/lib/app-shell-state";
import { getHomeFeed, type Recommendation } from "@/lib/recommend";
import { topTasteTags } from "@/lib/taste-vector";
import { CATS, format } from "@/data";
import type { CategoryId } from "@/types";

// TODO: 이름은 추후 인증 사용자에서. 지금은 일반 호칭.
const NAME = "회원";

export function Home() {
  const { tasteProfile } = useAppState();
  const shell = useAppShell();
  const feed = useMemo(() => getHomeFeed(tasteProfile), [tasteProfile]);
  const keywords = topTasteTags(tasteProfile.vector, 4); // 실제 취향 벡터
  const [cat, setCat] = useState<CategoryId>("all");

  const today = cat === "all" ? feed.today : feed.today.filter((r) => r.product.category === cat);

  return (
    <div className="flex flex-1 flex-col">
      {/* 앱바 */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-paper px-5 pt-[58px] pb-2">
        <h1 className="text-h1 text-ink">안녕하세요, {NAME}님</h1>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="검색"
            onClick={shell.openSearch}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-paper-3"
          >
            <Icon name="search" size={22} />
          </button>
          <button
            type="button"
            aria-label="알림"
            onClick={() => shell.toast("새로운 알림이 없어요")}
            className="relative flex size-9 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-paper-3"
          >
            <Icon name="bell" size={22} />
            <span className="absolute top-2 right-2 size-1.5 rounded-full bg-hot" />
          </button>
        </div>
      </header>

      {/* AI 큐레이션 배너 */}
      <div className="px-5 pb-6">
        <div className="rounded-[16px_16px_16px_4px] bg-ink px-4 py-4 text-paper">
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.08em] text-paper-3 uppercase">
            <span className="size-[5px] rounded-full bg-paper" />
            AI · 큐레이션
          </div>
          <p className="text-[13px] leading-relaxed">
            오늘은 평소 좋아하시는 <strong className="font-semibold">내추럴·베이지</strong> 무드로
            골라봤어요. 출근룩으로 입기 좋은 셔츠 위주예요.
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <BannerChip
              onClick={() => shell.openSheet({ mode: "chat", chatPrompt: "다른 무드로" })}
            >
              다른 무드
            </BannerChip>
            <BannerChip
              onClick={() => shell.openSheet({ mode: "chat", chatPrompt: "예산 10만원 이하" })}
            >
              예산별로
            </BannerChip>
            <BannerChip onClick={() => shell.openSheet({ mode: "chat" })}>AI에게 묻기</BannerChip>
          </div>
        </div>
      </div>

      {/* 오늘의 픽 슬라이더 */}
      <section className="pb-1">
        <div className="mb-3 px-5">
          <h2 className="text-h2 text-ink">오늘의 픽</h2>
        </div>
        <HeroSlider picks={feed.heroPicks} onOpen={(id) => shell.openDetail(id)} />
      </section>

      {/* 내 취향 키워드 — 실제 tasteProfile */}
      {keywords.length > 0 && (
        <section className="mt-8 px-5">
          <h2 className="text-h2 mb-3 text-ink">내 취향 키워드</h2>
          <div className="flex flex-col gap-3 rounded-card bg-paper-2 p-4">
            {keywords.map((k) => (
              <button
                key={k.tag}
                type="button"
                onClick={() => shell.openList({ title: k.tag, keyword: k.tag })}
                className="grid grid-cols-[64px_1fr_36px] items-center gap-2.5 text-left"
              >
                <span className="text-body-2 font-medium text-ink">{k.tag}</span>
                <span className="h-1.5 overflow-hidden rounded-full bg-paper-3">
                  <span
                    className="block h-full rounded-full bg-ink"
                    style={{ width: `${Math.round(k.weight * 100)}%` }}
                  />
                </span>
                <span className="text-right text-[11px] font-medium text-ink-2">
                  {Math.round(k.weight * 100)}%
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 오늘의 추천 (카테고리 필터) */}
      <section className="mt-8">
        <div className="mb-3 flex items-baseline justify-between px-5">
          <h2 className="text-h2 text-ink">오늘의 추천</h2>
          <button
            type="button"
            onClick={() => shell.openList({ title: "오늘의 추천" })}
            className="cursor-pointer text-[12px] font-medium text-ink-2"
          >
            전체보기 →
          </button>
        </div>
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
        {today.length > 0 ? (
          <Row items={today} />
        ) : (
          <p className="px-5 text-body-2 text-ink-2">이 카테고리엔 아직 추천이 없어요.</p>
        )}
      </section>

      {/* AI가 찾은 새 취향 */}
      <section className="mt-8 pb-2">
        <div className="mb-1.5 flex items-center gap-1.5 px-5">
          <Icon name="sparkle" size={14} />
          <h2 className="text-h2 text-ink">AI가 찾은 새 취향</h2>
        </div>
        <p className="text-body-2 mb-4 px-5 text-ink-2">
          기존 선호에 가까우면서 살짝 새로운 것들. 한 번 봐주실래요?
        </p>
        <Row items={feed.discoveries} wide />
      </section>
    </div>
  );
}

function BannerChip({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-chip bg-paper/12 px-2.5 py-1.5 text-[11px] font-medium text-paper hover:bg-paper/20"
    >
      {children}
    </button>
  );
}

/* 가로 스크롤 카드 row. wide=발견 섹션(넓은 카드). */
function Row({ items, wide = false }: { items: Recommendation[]; wide?: boolean }) {
  const shell = useAppShell();
  return (
    <div className="flex gap-2.5 overflow-x-auto px-5 [scrollbar-width:none]">
      {items.map((r) =>
        wide ? (
          <div key={r.product.id} className="w-[190px] shrink-0">
            <ProductCard
              rec={r}
              size="auto"
              saved={shell.isSaved(r.product.id)}
              onToggleSaved={() => shell.toggleSaved(r.product.id)}
              onClick={() => shell.openDetail(r.product.id)}
            />
          </div>
        ) : (
          <ProductCard
            key={r.product.id}
            rec={r}
            size="md"
            saved={shell.isSaved(r.product.id)}
            onToggleSaved={() => shell.toggleSaved(r.product.id)}
            onClick={() => shell.openDetail(r.product.id)}
          />
        ),
      )}
    </div>
  );
}

/* 오늘의 픽 — 가로 스냅 슬라이더 + 점 인디케이터. (무한 루프는 생략, 스냅으로 대체) */
function HeroSlider({ picks, onOpen }: { picks: Recommendation[]; onOpen: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const stride = el.clientWidth - 40;
    setIdx(Math.max(0, Math.min(picks.length - 1, Math.round(el.scrollLeft / stride))));
  };

  return (
    <>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-5 [scrollbar-width:none]"
      >
        {picks.map((r) => (
          <div
            key={r.product.id}
            className="flex w-[calc(100%-40px)] shrink-0 snap-center flex-col gap-3 rounded-card bg-paper-2 p-4"
          >
            <div className="flex items-stretch gap-3">
              <div className="w-[118px] shrink-0">
                <ProductImg colors={r.product.img} brand={r.product.brand} shape="tall" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <div className="text-label text-ink-2 uppercase">{r.product.brand}</div>
                  <div className="text-h3 mt-1 line-clamp-2 text-ink">{r.product.name}</div>
                  <div className="text-price mt-2 text-ink">{format(r.product.price)}</div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {r.product.tags.slice(0, 2).map((t) => (
                      <Chip key={t} variant="outline" size="tiny">
                        {t}
                      </Chip>
                    ))}
                  </div>
                </div>
                <Button
                  variant="primary"
                  block
                  className="mt-3"
                  onClick={() => onOpen(r.product.id)}
                >
                  자세히 보기
                  <Icon name="arrow-right" size={16} />
                </Button>
              </div>
            </div>
            <div className="rounded-btn bg-accent-soft px-3.5 py-3">
              <span className="mr-1.5 inline-block rounded bg-paper px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.1em] text-ink uppercase">
                AI {r.match}%
              </span>
              <Reason html={r.reason} className="text-[12.5px] leading-relaxed text-ink" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3.5 flex justify-center gap-1.5">
        {picks.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === idx ? "w-[18px] bg-ink" : "w-1.5 bg-ink-soft"}`}
          />
        ))}
      </div>
    </>
  );
}
