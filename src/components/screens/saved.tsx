"use client";

/*
  Saved(찜) 탭 — 저장 상품 + 컬렉션 칩 + AI 컬렉션 제안. 정본 saved.jsx / README §7.
  - 전역 savedIds가 "전체"의 출처. 컬렉션은 app-shell-state(영속 D-003) — 탭 전환/리로드에도 유지.
  - AI 컬렉션 제안: 저장 상품을 무드로 묶자고 제안(다크 카드) → "컬렉션 만들기"가 사용자 컬렉션 칩을 생성.
  - 컬렉션 카운트/그리드는 savedSet과 교차(해제된 항목은 제외) — savedIds를 단일 출처로 일관.
  ⚠️ "어떤 무드로 묶을지"의 실제 클러스터링은 이후 F2/F3·취향 벡터가 산출할 자리.
     지금은 베이지 계열 태그(베이지/오트밀/카멜) 매칭 mock — 데이터상 p01·p02·p04·p07 = 4개.
  레이아웃(정본): 앱바 16/20/20 · 좌우 20 · 칩 6×10(gap6, count opacity .55) · AI카드 다크 16/r10 ·
    썸네일 1:1 gap4 r6 · 버튼 11×16 / 11×14 · 섹션헤더 mt8 mb16 · 그리드 gap 20·10 · showMatch=false.
*/

import { useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import { Chip } from "@/components/ui/chip";
import { ProductCard } from "@/components/product-card";
import { useAppShell } from "@/lib/app-shell-state";
import { byId } from "@/data";
import type { Product } from "@/types";

// AI 제안 mock — 베이지 무드 클러스터. 이후 취향 벡터 기반 클러스터링으로 대체(F2/F3).
const MOOD_TAGS = ["베이지", "오트밀", "카멜"];
const MOOD_NAME = "베이지 데일리";

export function Saved() {
  const shell = useAppShell();
  const savedSet = useMemo(() => new Set(shell.savedIds), [shell.savedIds]);
  const savedProducts = useMemo(
    () => shell.savedIds.map((id) => byId(id)).filter((p): p is Product => Boolean(p)),
    [shell.savedIds],
  );

  const [selected, setSelected] = useState<string | null>(null); // null=전체, else 컬렉션 id
  const [dismissed, setDismissed] = useState(false);

  // AI 제안 후보(mock): 저장 상품 중 무드 태그 매칭. 2개 이상 & 아직 안 만들었을 때만 제안.
  const moodItems = useMemo(
    () => savedProducts.filter((p) => p.tags.some((t) => MOOD_TAGS.includes(t))),
    [savedProducts],
  );
  const alreadyMade = shell.collections.some((c) => c.name === MOOD_NAME);
  const showSuggestion = !dismissed && !alreadyMade && moodItems.length >= 2;

  // 컬렉션 칩(저장된 항목만 카운트)
  const chips = useMemo(
    () =>
      shell.collections.map((c) => ({
        id: c.id,
        name: c.name,
        count: c.productIds.filter((id) => savedSet.has(id)).length,
      })),
    [shell.collections, savedSet],
  );

  const active = shell.collections.find((c) => c.id === selected);
  const shown = active
    ? savedProducts.filter((p) => active.productIds.includes(p.id))
    : savedProducts;

  const createFromView = () => {
    const name = `컬렉션 ${shell.collections.length + 1}`;
    setSelected(
      shell.createCollection(
        name,
        shown.map((p) => p.id),
      ),
    );
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* 앱바 */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-paper px-5 pt-[70px] pb-5">
        <h1 className="text-h1 text-ink">찜한 상품</h1>
        <button
          type="button"
          onClick={createFromView}
          aria-label="새 컬렉션"
          disabled={savedProducts.length === 0}
          className="flex size-[38px] shrink-0 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-paper-3 disabled:cursor-default disabled:opacity-40"
        >
          <Icon name="plus" size={22} />
        </button>
      </header>

      {savedProducts.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 pb-16 text-center">
          <Icon name="heart" size={28} color="var(--color-ink-soft)" />
          <p className="text-body-2 text-ink-2">아직 찜한 상품이 없어요.</p>
          <button
            type="button"
            onClick={() => shell.selectTab("home")}
            className="text-body-2 text-ink underline"
          >
            추천 보러가기
          </button>
        </div>
      ) : (
        <>
          {/* 컬렉션 칩 */}
          <div className="mb-4 flex gap-1.5 overflow-x-auto px-5 [scrollbar-width:none]">
            <Chip
              variant={selected === null ? "selected" : "default"}
              onClick={() => setSelected(null)}
            >
              전체<span className="opacity-[0.55]">{savedProducts.length}</span>
            </Chip>
            {chips.map((c) => (
              <Chip
                key={c.id}
                variant={selected === c.id ? "selected" : "default"}
                onClick={() => setSelected(c.id)}
              >
                {c.name}
                <span className="opacity-[0.55]">{c.count}</span>
              </Chip>
            ))}
            <Chip variant="outline" onClick={createFromView}>
              + 새 컬렉션
            </Chip>
          </div>

          {/* AI 컬렉션 제안 (다크) */}
          {showSuggestion && (
            <div className="mb-6 px-5">
              <div className="rounded-card bg-ink p-4 text-paper">
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Icon name="sparkle" size={14} color="var(--color-paper-3)" />
                    <span className="text-label text-paper-3 uppercase">AI 컬렉션 제안</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDismissed(true)}
                    aria-label="제안 닫기"
                    className="flex size-6 cursor-pointer items-center justify-center rounded-full text-paper-3 hover:bg-paper/10"
                  >
                    <Icon name="close" size={14} />
                  </button>
                </div>
                <p className="text-h2 text-paper">&ldquo;{MOOD_NAME}&rdquo;로 묶을까요?</p>
                <p className="text-body-2 mt-1 text-paper-3">
                  저장한 {moodItems.length}개 상품이 비슷한 무드예요
                </p>
                <div className="mt-3.5 flex gap-1">
                  {moodItems.slice(0, 4).map((p) => (
                    <span
                      key={p.id}
                      className="aspect-square flex-1 rounded-image"
                      style={{
                        background: `linear-gradient(160deg, ${p.img.light}, ${p.img.dark})`,
                      }}
                    />
                  ))}
                </div>
                <div className="mt-3.5 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(
                        shell.createCollection(
                          MOOD_NAME,
                          moodItems.map((p) => p.id),
                        ),
                      );
                      setDismissed(true);
                    }}
                    className="rounded-btn flex-1 bg-paper px-4 py-[11px] text-[13px] font-semibold text-ink"
                  >
                    컬렉션 만들기
                  </button>
                  <button
                    type="button"
                    onClick={() => setDismissed(true)}
                    className="rounded-btn shrink-0 px-3.5 py-[11px] text-[13px] font-medium text-paper-3"
                  >
                    나중에
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 섹션 헤더 */}
          <div className="mt-2 mb-4 flex items-baseline justify-between px-5">
            <h2 className="text-h2 text-ink">{active ? active.name : "최근 저장한 상품"}</h2>
            <span className="text-caption text-ink-3">{shown.length}개</span>
          </div>

          {/* 2열 그리드 (행 20 · 열 10) */}
          {shown.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-2.5 gap-y-5 px-5 pb-6">
              {shown.map((p) => (
                <ProductCard
                  key={p.id}
                  rec={{ product: p, match: p.match, reason: p.reason }}
                  size="auto"
                  showMatch={false}
                  saved
                  onToggleSaved={() => shell.toggleSaved(p.id)}
                  onClick={() => shell.openDetail(p.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-body-2 px-5 py-10 text-center text-ink-2">이 컬렉션은 비어있어요</p>
          )}
        </>
      )}
    </div>
  );
}
