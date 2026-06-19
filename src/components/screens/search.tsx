"use client";

/*
  Search 푸시 화면 — 정본 search.jsx / README §9.
  - 비어 있을 때: AI 추천 검색어 → 최근 검색어(칩) → 실시간 인기(LIVE 랭킹).
  - 입력 중: 자동완성 제안 + 결과를 페이지 내 인라인 표시(AI 요약 말풍선 + 2열 그리드).
  - 무결과: 안내 + "AI에게 물어보기" → 챗 시트(발화로 좁히기).
  데이터는 추천 경계 getList만 소비(D-012). 칩/제안/랭킹 클릭은 입력창을 채워(setQuery) 인라인 결과를 띄운다.
  ⚠️ 랭킹/추천어/최근어는 mock(더미). 실시간 집계·검색 엔진은 범위 밖.
  레이아웃(정본): 검색바 sticky 8/12/14 · 좌우 20 · 결과 그리드 gap 20·10 ·
    랭킹/제안 행 -mx-2 px-2(히트영역 확장, 시각 들여쓰기는 20 유지).
*/

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { useAppShell } from "@/lib/app-shell-state";
import { getList } from "@/lib/recommend";
import { AI_SEARCHES, PRODUCTS, RECENT, TRENDING } from "@/data";
import { cn } from "@/lib/cn";
import type { TrendingTerm, TrendChange } from "@/types";

// TODO: 이름은 추후 인증 사용자 정보에서. 지금은 게스트 호칭(마이 NAME과 동일 성격).
const USER_NAME = "회원";

/*
  ⚠️ mock 연출: "실시간 인기"가 살아있게 보이도록 주기적으로 순위를 미세 변동(인접 swap)시킨다.
  실제 집계/실시간 검색 엔진은 범위 밖 — 화면 연출일 뿐. change/delta는 이전 순위 대비 이동량.
*/
function mockRefresh(prev: TrendingTerm[]): TrendingTerm[] {
  const items = [...prev];
  const i = Math.floor(Math.random() * (items.length - 1));
  [items[i], items[i + 1]] = [items[i + 1], items[i]];
  return items.map((it, idx) => {
    const old = prev.findIndex((p) => p.term === it.term);
    const diff = old - idx;
    const change: TrendChange = diff > 0 ? "up" : diff < 0 ? "down" : "same";
    return { ...it, change, delta: Math.abs(diff) };
  });
}

// 자동완성 후보 풀(중복 제거) — 검색어 소스일 뿐 추천 데이터 아님.
const SUGGEST_POOL = Array.from(
  new Set([
    ...AI_SEARCHES,
    ...TRENDING.map((t) => t.term),
    ...PRODUCTS.flatMap((p) => p.tags),
    ...PRODUCTS.map((p) => p.name),
    ...PRODUCTS.map((p) => p.brand),
  ]),
);

export function Search() {
  const shell = useAppShell();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>(RECENT);
  const [trending, setTrending] = useState<TrendingTerm[]>(TRENDING);

  const q = query.trim();

  // 실시간 인기 자동 갱신 연출(약 3s). 입력 중엔 멈춤.
  useEffect(() => {
    if (q) return;
    const id = window.setInterval(() => setTrending((prev) => mockRefresh(prev)), 3000);
    return () => window.clearInterval(id);
  }, [q]);

  const suggestions = useMemo(() => {
    if (!q) return [];
    const lower = q.toLowerCase();
    return SUGGEST_POOL.filter((t) => t.toLowerCase().includes(lower) && t !== q).slice(0, 5);
  }, [q]);

  // 결과(인라인) — 경계 getList(토큰 매칭) → 취향 매치순 정렬.
  const results = useMemo(() => (q ? [...getList(q)].sort((a, b) => b.match - a.match) : []), [q]);

  const removeRecent = (term: string) => setRecent((r) => r.filter((x) => x !== term));
  const addRecent = (term: string) =>
    setRecent((r) => [term, ...r.filter((x) => x !== term)].slice(0, 10));

  return (
    <div className="flex flex-1 flex-col pb-10">
      {/* 검색 바 (sticky) */}
      <header className="sticky top-0 z-10 flex items-center gap-1.5 bg-paper px-3 pt-[62px] pb-3.5">
        <button
          type="button"
          onClick={shell.back}
          aria-label="뒤로"
          className="flex size-[38px] shrink-0 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-paper-3"
        >
          <Icon name="back" size={22} />
        </button>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (q) addRecent(q);
          }}
          className="flex flex-1 items-center gap-2 rounded-[10px] bg-paper-3 px-3 py-2.5"
        >
          <Icon name="search" size={18} color="var(--color-ink-3)" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="브랜드, 상품, 무드 검색"
            className="text-sm min-w-0 flex-1 bg-transparent tracking-[-0.2px] text-ink outline-none placeholder:text-ink-3"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="지우기"
              className="flex size-[18px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-ink-soft text-paper"
            >
              <Icon name="close" size={12} />
            </button>
          )}
        </form>
      </header>

      {!q ? (
        <>
          {/* AI 추천 검색어 */}
          <section className="mt-2 mb-6 px-5">
            <div className="mb-3 flex items-center gap-1.5">
              <Icon name="sparkle" size={15} color="var(--color-ink)" />
              <h2 className="text-h3 text-ink">{USER_NAME}님을 위한 추천 검색어</h2>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {AI_SEARCHES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  className="rounded-chip inline-flex cursor-pointer items-center gap-1 bg-accent-soft px-3 py-2 text-[12px] font-semibold tracking-[0.02em] text-ink"
                >
                  <span className="size-1 rounded-full bg-ink" aria-hidden="true" />
                  {s}
                </button>
              ))}
            </div>
          </section>

          {/* 최근 검색어 */}
          {recent.length > 0 && (
            <section className="mb-6 px-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-h3 text-ink">최근 검색어</h2>
                <button
                  type="button"
                  onClick={() => setRecent([])}
                  className="text-caption cursor-pointer font-medium text-ink-2"
                >
                  전체 삭제
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recent.map((s) => (
                  <span
                    key={s}
                    className="rounded-chip inline-flex items-center py-1.5 pr-2 pl-2.5 text-xs font-medium text-ink ring-1 ring-inset ring-line"
                  >
                    <button type="button" onClick={() => setQuery(s)} className="cursor-pointer">
                      {s}
                    </button>
                    <button
                      type="button"
                      aria-label={`${s} 삭제`}
                      onClick={() => removeRecent(s)}
                      className="ml-1 -mr-1 flex cursor-pointer p-1 text-ink-3 hover:text-ink-2"
                    >
                      <Icon name="close" size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* 실시간 인기 */}
          <section className="px-5">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-h3 text-ink">실시간 인기 검색어</h2>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.08em] text-hot uppercase">
                <span className="size-1.5 animate-pulse rounded-full bg-hot" aria-hidden="true" />
                LIVE
              </span>
            </div>
            <p className="text-caption mb-3 text-ink-3">방금 업데이트 · 1분마다 갱신</p>
            <div className="flex flex-col">
              {trending.map((t, i) => (
                <button
                  key={t.term}
                  type="button"
                  onClick={() => setQuery(t.term)}
                  className="rounded-btn -mx-2 flex items-center gap-3.5 px-2 py-[11px] text-left transition-colors hover:bg-paper-3"
                >
                  <span
                    className={cn(
                      "w-[18px] shrink-0 text-center text-[15px] font-bold tracking-[-0.5px]",
                      i < 3 ? "text-ink" : "text-ink-3",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm flex-1 font-medium tracking-[-0.2px] text-ink">
                    {t.term}
                  </span>
                  <RankChange change={t.change} delta={t.delta} />
                </button>
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className="flex flex-col">
          {/* 자동완성 제안 */}
          {suggestions.length > 0 && (
            <div className="mt-1 mb-2 px-5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  className="text-sm rounded-btn -mx-2 flex w-[calc(100%+16px)] items-center gap-3 px-2 py-3 text-left text-ink-2 transition-colors hover:bg-paper-3"
                >
                  <Icon name="search" size={16} color="var(--color-ink-3)" />
                  <Highlight term={s} query={q} />
                </button>
              ))}
            </div>
          )}

          {/* 결과 */}
          <div className="mt-3">
            {results.length > 0 ? (
              <>
                <div className="mb-4 px-5">
                  <div className="flex items-center gap-2 rounded-card bg-accent-soft px-3.5 py-3">
                    <Icon name="sparkle" size={15} color="var(--color-ink)" />
                    <span className="text-[12.5px] leading-relaxed text-ink">
                      <strong className="font-semibold">&lsquo;{q}&rsquo;</strong> 검색 결과{" "}
                      <strong className="font-semibold">{results.length}개</strong> · 취향 매치순
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-2.5 gap-y-5 px-5">
                  {results.map((r) => (
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
              </>
            ) : (
              <div className="flex flex-col items-center px-5 py-10 text-center">
                <span className="mb-3.5 flex size-[52px] items-center justify-center rounded-full bg-paper-3 text-ink-2">
                  <Icon name="search" size={22} />
                </span>
                <h3 className="text-h3 mb-1 text-ink">&lsquo;{q}&rsquo; 결과가 없어요</h3>
                <p className="text-body-2 mb-4 text-ink-2">
                  AI에게 비슷한 무드로 찾아달라고 해보세요
                </p>
                <Button
                  variant="primary"
                  onClick={() => shell.openSheet({ mode: "chat", chatPrompt: q })}
                >
                  <Icon name="sparkle" size={16} />
                  AI에게 물어보기
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Highlight({ term, query }: { term: string; query: string }) {
  const i = term.toLowerCase().indexOf(query.toLowerCase());
  if (i < 0) return <span>{term}</span>;
  return (
    <span>
      {term.slice(0, i)}
      <strong className="font-semibold text-ink">{term.slice(i, i + query.length)}</strong>
      {term.slice(i + query.length)}
    </span>
  );
}

function RankChange({ change, delta }: { change: TrendChange; delta: number }) {
  if (change === "new") {
    return (
      <span className="rounded bg-accent-soft px-[5px] py-0.5 text-[9px] font-semibold tracking-[0.06em] text-ink">
        NEW
      </span>
    );
  }
  if (change === "same") {
    return <span className="text-[11px] font-semibold text-ink-3">–</span>;
  }
  const up = change === "up";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[11px] font-semibold",
        up ? "text-hot" : "text-down",
      )}
    >
      <svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
        <path d={up ? "M5 1l4 6H1z" : "M5 9L1 3h8z"} />
      </svg>
      {delta}
    </span>
  );
}
