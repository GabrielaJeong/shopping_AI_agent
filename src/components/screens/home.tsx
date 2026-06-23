"use client";

/*
  Home 탭 — 개인화 AI 피드. 구조·충실도: home.jsx / README §5.
  데이터는 추천 경계 getHomeFeed(tasteProfile)만 소비(mock 직접 참조 X, D-012).
  구성: 앱바 → AI 배너 → 오늘의 픽 슬라이더 → 내 취향 키워드(실제 벡터) → 오늘의 추천(카테고리 필터) → AI가 찾은 새 취향.
*/

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { Chip } from "@/components/ui/chip";
import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { TasteBars } from "@/components/taste-bars";
import { ProductImg } from "@/components/product-img";
import { Reason } from "@/components/reason";
import { useAppState } from "@/lib/app-state";
import { useAppShell } from "@/lib/app-shell-state";
import { useToast } from "@/lib/toast";
import { getHomeFeed, type Recommendation } from "@/lib/recommend";
import { topTasteTags } from "@/lib/taste-vector";
import { CATS, format } from "@/data";
import type { CategoryId } from "@/types";

// TODO: 이름은 추후 인증 사용자에서. 지금은 일반 호칭.
const NAME = "회원";

export function Home() {
  const { tasteProfile } = useAppState();
  const shell = useAppShell();
  const { toast } = useToast();
  const feed = useMemo(() => getHomeFeed(tasteProfile), [tasteProfile]);
  const keywords = topTasteTags(tasteProfile.vector, 4); // 실제 취향 벡터
  const [cat, setCat] = useState<CategoryId>("all");

  const today = cat === "all" ? feed.today : feed.today.filter((r) => r.product.category === cat);

  return (
    <div className="flex flex-1 flex-col">
      {/* 앱바 */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-paper px-5 pt-[70px] pb-5">
        <h1 className="text-h1 text-ink">안녕하세요, {NAME}님</h1>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="검색"
            onClick={shell.openSearch}
            className="flex size-[38px] cursor-pointer items-center justify-center rounded-full text-ink hover:bg-paper-3"
          >
            <Icon name="search" size={22} />
          </button>
          <button
            type="button"
            aria-label="알림"
            onClick={() => toast("새로운 알림이 없어요")}
            className="relative flex size-[38px] cursor-pointer items-center justify-center rounded-full text-ink hover:bg-paper-3"
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
          <div className="rounded-card bg-paper-2 p-3.5">
            <TasteBars
              items={keywords}
              onPick={(k) => shell.openList({ title: k.tag, keyword: k.tag })}
            />
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

/* 가로 스크롤 카드 row. wide=발견 섹션(넓은 카드). 마우스 기기엔 반투명 화살표(페이지 단위 스크롤). */
function Row({ items, wide = false }: { items: Recommendation[]; wide?: boolean }) {
  const shell = useAppShell();
  const ref = useRef<HTMLDivElement>(null);
  const page = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  return (
    <div className="relative">
      <div ref={ref} className="flex gap-2.5 overflow-x-auto px-5 [scrollbar-width:none]">
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
      {items.length > 2 && (
        <>
          <SliderArrow dir="prev" onClick={() => page(-1)} />
          <SliderArrow dir="next" onClick={() => page(1)} />
        </>
      )}
    </div>
  );
}

/* 가로 슬라이더 반투명 화살표 — 마우스(hover 가능) 기기에서만 노출(터치는 스와이프 그대로). */
function SliderArrow({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={dir === "prev" ? "이전" : "다음"}
      onClick={onClick}
      className={`absolute top-1/2 z-10 hidden size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-ink/35 text-paper backdrop-blur-sm transition hover:bg-ink/60 [@media(hover:hover)]:flex ${
        dir === "prev" ? "left-2.5" : "right-2.5"
      }`}
    >
      <Icon name={dir === "prev" ? "back" : "chevron-right"} size={20} />
    </button>
  );
}

/* 오늘의 픽 — 가로 스냅 슬라이더 + 무한 루프(정본 home.jsx).
   loop=[clone(last), ...real, clone(first)]: 첫 실제 슬라이드에서도 양쪽 peek이 보인다.
   마운트 시 첫 실제 슬라이드로 위치, 경계(clone)서 워프. 자동 넘김(호버/터치/reduced-motion 시 정지) + 반투명 화살표(마우스 기기). */
function HeroSlider({ picks, onOpen }: { picks: Recommendation[]; onOpen: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const settle = useRef<number | undefined>(undefined);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = picks.length;
  const loop = n > 1 ? [picks[n - 1], ...picks, picks[0]] : picks;

  // 카드 폭이 calc(100%-40px)라 stride를 clientWidth로 추정하면 스냅점과 어긋난다 →
  // 실제 DOM offsetLeft로 중앙 판정/워프. clone↔real 거리는 정확히 n×stride라 상대 이동이 seamless.
  const cardEls = () => Array.from(ref.current?.children ?? []) as HTMLElement[];
  const centerLeft = (c: HTMLElement, el: HTMLElement) =>
    c.offsetLeft - (el.clientWidth - c.offsetWidth) / 2;

  // 마운트 시 첫 실제 슬라이드(loop index 1)를 중앙에.
  useEffect(() => {
    const el = ref.current;
    if (!el || n <= 1) return;
    const id = requestAnimationFrame(() => {
      const c = el.children[1] as HTMLElement | undefined;
      if (c) el.scrollLeft = centerLeft(c, el);
    });
    return () => cancelAnimationFrame(id);
  }, [n]);

  // 한 칸 이동(화살표/자동 넘김) — 중앙 카드 기준 dir칸. clone로 가도 onScroll 워프가 seamless로 되돌린다.
  const go = useCallback(
    (dir: 1 | -1) => {
      const el = ref.current;
      if (!el || n <= 1) return;
      const cs = Array.from(el.children) as HTMLElement[];
      const viewCenter = el.scrollLeft + el.clientWidth / 2;
      let j = 0;
      let best = Infinity;
      cs.forEach((c, k) => {
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - viewCenter);
        if (d < best) {
          best = d;
          j = k;
        }
      });
      const t = cs[j + dir];
      if (t)
        el.scrollTo({
          left: t.offsetLeft - (el.clientWidth - t.offsetWidth) / 2,
          behavior: "smooth",
        });
    },
    [n],
  );

  // 자동 넘김(4.5s). 호버/터치(paused)·비가시 탭·reduced-motion 시 정지.
  useEffect(() => {
    if (n <= 1 || paused) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!document.hidden) go(1);
    }, 4500);
    return () => window.clearInterval(id);
  }, [n, paused, go]);

  const onScroll = () => {
    const el = ref.current;
    if (!el || n <= 1) return;
    const cs = cardEls();
    const viewCenter = el.scrollLeft + el.clientWidth / 2;
    // 화면 중앙에 가장 가까운 카드(loop index j)
    let j = 0;
    let best = Infinity;
    cs.forEach((c, k) => {
      const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - viewCenter);
      if (d < best) {
        best = d;
        j = k;
      }
    });
    const live = (((j - 1) % n) + n) % n; // 점 인디케이터용 실제 index
    if (live !== idx) setIdx(live);
    // 스크롤이 멎으면 clone 경계를 가로질러 워프. 상대 이동(거리=clone↔real offsetLeft 차)이라
    // 정확히 스냅점에 떨어져 시각적 점프가 없다.
    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(() => {
      const c = cardEls();
      if (j === 0 && c[n]) el.scrollLeft += c[n].offsetLeft - c[0].offsetLeft;
      else if (j === n + 1 && c[1]) el.scrollLeft += c[1].offsetLeft - c[n + 1].offsetLeft;
    }, 140);
  };

  return (
    <>
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          ref={ref}
          onScroll={onScroll}
          onPointerDown={() => setPaused(true)}
          className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-5 [scrollbar-width:none]"
        >
          {loop.map((r, i) => (
            <div
              key={i}
              className="flex w-[calc(100%-40px)] shrink-0 snap-center flex-col gap-3.5 rounded-[12px] bg-paper-2 p-4"
            >
              <div className="flex items-stretch gap-3">
                <div className="w-[130px] shrink-0">
                  <ProductImg colors={r.product.img} brand={r.product.brand} shape="tall" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <div className="text-label text-ink-2 uppercase">{r.product.brand}</div>
                    <div className="text-h3 mt-1 line-clamp-2 text-ink">{r.product.name}</div>
                    <div className="text-price mt-2 text-ink">{format(r.product.price)}</div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {r.product.tags.slice(0, 2).map((t) => (
                        <Tag key={t}>{t}</Tag>
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
        {n > 1 && (
          <>
            <SliderArrow dir="prev" onClick={() => go(-1)} />
            <SliderArrow dir="next" onClick={() => go(1)} />
          </>
        )}
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
