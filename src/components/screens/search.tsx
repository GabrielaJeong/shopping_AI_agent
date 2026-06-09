"use client";

/*
  Search 푸시 화면 — 구조 참고: search.jsx / README §9.
  비어 있을 때: 실시간 인기 랭킹 + AI 추천 검색어 + 최근 검색어.
  입력 중: 자동완성(매칭 substring 볼드). 선택/제출 → 결과 있으면 list, 없으면 chat 시트(발화로).
  ⚠️ 랭킹·추천어·최근어는 mock(더미). 실시간 집계/검색 엔진은 범위 밖. back → home.
*/

import { useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import { Chip } from "@/components/ui/chip";
import { useAppShell } from "@/lib/app-shell-state";
import { getList } from "@/lib/recommend";
import { AI_SEARCHES, PRODUCTS, RECENT, TRENDING } from "@/data";
import type { TrendChange } from "@/types";

// 자동완성 후보 풀(중복 제거). 검색어 소스일 뿐 추천 데이터 아님.
const SUGGEST_POOL = Array.from(
  new Set([
    ...TRENDING.map((t) => t.term),
    ...AI_SEARCHES,
    ...PRODUCTS.map((p) => p.name),
    ...PRODUCTS.map((p) => p.brand),
  ]),
);

export function Search() {
  const shell = useAppShell();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>(RECENT);

  const q = query.trim();

  const suggestions = useMemo(() => {
    if (!q) return [];
    const lower = q.toLowerCase();
    return SUGGEST_POOL.filter((t) => t.toLowerCase().includes(lower)).slice(0, 8);
  }, [q]);

  const submit = (term: string) => {
    const t = term.trim();
    if (!t) return;
    setRecent((r) => [t, ...r.filter((x) => x !== t)].slice(0, 8));
    if (getList(t).length > 0) {
      shell.openList({ title: t, keyword: t });
    } else {
      // 결과 없음 → 챗으로 좁히기(발화로 전달)
      shell.openSheet({ mode: "chat", chatPrompt: t });
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* 검색 바 */}
      <header className="sticky top-0 z-10 flex items-center gap-2 bg-paper px-3 pt-[56px] pb-3">
        <button
          type="button"
          onClick={shell.back}
          aria-label="뒤로"
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-paper-3"
        >
          <Icon name="back" size={22} />
        </button>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(query);
          }}
          className="flex flex-1 items-center gap-2 rounded-[10px] bg-paper-3 px-3 py-2.5"
        >
          <Icon name="search" size={18} color="var(--color-ink-3)" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="브랜드, 상품, 무드로 검색"
            className="text-sm min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-ink-3"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="지우기"
              className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-ink-soft text-paper"
            >
              <Icon name="close" size={12} />
            </button>
          )}
        </form>
      </header>

      <div className="flex flex-col gap-6 px-5 pt-2 pb-8">
        {q ? (
          /* 자동완성 */
          <div className="flex flex-col">
            {suggestions.length === 0 && (
              <p className="text-body-2 text-ink-2">
                &lsquo;{q}&rsquo; 추천 검색어가 없어요. 엔터로 AI에게 물어볼 수 있어요.
              </p>
            )}
            {suggestions.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => submit(term)}
                className="flex items-center gap-3 py-3 text-left text-sm text-ink-2"
              >
                <Icon name="search" size={16} color="var(--color-ink-3)" />
                <Highlight term={term} query={q} />
              </button>
            ))}
          </div>
        ) : (
          <>
            {/* 실시간 인기 */}
            <section className="flex flex-col gap-1">
              <div className="mb-2 flex items-center gap-1.5">
                <span className="size-1.5 animate-pulse rounded-full bg-hot" aria-hidden="true" />
                <span className="text-[10px] font-semibold tracking-[0.08em] text-hot uppercase">
                  실시간 인기
                </span>
              </div>
              {TRENDING.map((t, i) => (
                <button
                  key={t.term}
                  type="button"
                  onClick={() => submit(t.term)}
                  className="flex items-center gap-3.5 rounded-btn px-1 py-2.5 text-left hover:bg-paper-3"
                >
                  <span
                    className={`w-4 shrink-0 text-center text-[15px] font-bold tracking-[-0.5px] ${
                      i < 3 ? "text-ink" : "text-ink-3"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm font-medium text-ink">{t.term}</span>
                  <TrendBadge change={t.change} delta={t.delta} />
                </button>
              ))}
            </section>

            {/* AI 추천 검색어 */}
            <section className="flex flex-col gap-2">
              <span className="text-label text-ink-2 uppercase">AI 추천 검색어</span>
              <div className="flex flex-wrap gap-1.5">
                {AI_SEARCHES.map((term) => (
                  <Chip key={term} variant="ai" onClick={() => submit(term)}>
                    {term}
                  </Chip>
                ))}
              </div>
            </section>

            {/* 최근 검색어 */}
            {recent.length > 0 && (
              <section className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-label text-ink-2 uppercase">최근 검색어</span>
                  <button
                    type="button"
                    onClick={() => setRecent([])}
                    className="text-caption text-ink-3"
                  >
                    전체 삭제
                  </button>
                </div>
                <div className="flex flex-col">
                  {recent.map((term) => (
                    <div key={term} className="flex items-center gap-2 py-2">
                      <button
                        type="button"
                        onClick={() => submit(term)}
                        className="flex-1 text-left text-sm text-ink"
                      >
                        {term}
                      </button>
                      <button
                        type="button"
                        aria-label={`${term} 삭제`}
                        onClick={() => setRecent((r) => r.filter((x) => x !== term))}
                        className="flex size-6 items-center justify-center rounded-full text-ink-soft hover:text-ink-2"
                      >
                        <Icon name="close" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
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

function TrendBadge({ change, delta }: { change: TrendChange; delta: number }) {
  if (change === "new") {
    return (
      <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.06em] text-ink">
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
      className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${up ? "text-hot" : "text-down"}`}
    >
      <Icon name="arrow-up" size={11} className={up ? "" : "rotate-180"} />
      {delta}
    </span>
  );
}
