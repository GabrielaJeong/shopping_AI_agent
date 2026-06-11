"use client";

/*
  Saved(찜) 탭 — 저장한 상품 + AI 컬렉션 제안. 구조 참고: saved.jsx / README §7.
  전역 savedIds 그대로 사용(하트 토글로 해제 → 그리드 갱신). 추천 경계 불필요(이미 저장한 것 표시).
  ⚠️ 컬렉션 자동 분류는 현재 mock(저장 상품 태그 빈도). 이후 취향 벡터/태그 기반 클러스터링이 들어올 자리.
*/

import { useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import { Chip } from "@/components/ui/chip";
import { ProductCard } from "@/components/product-card";
import { useAppShell } from "@/lib/app-shell-state";
import { useToast } from "@/lib/toast";
import { byId } from "@/data";
import type { Product } from "@/types";

interface Collection {
  name: string;
  ids: string[];
}

/** ⚠️ mock 클러스터링: 저장 상품 태그 빈도로 묶음(2개 이상). 이후 취향 벡터 기반으로 대체. */
function deriveCollections(products: Product[]): Collection[] {
  const byTag = new Map<string, string[]>();
  for (const p of products) {
    for (const tag of p.tags) {
      const ids = byTag.get(tag) ?? [];
      ids.push(p.id);
      byTag.set(tag, ids);
    }
  }
  return [...byTag.entries()]
    .filter(([, ids]) => ids.length >= 2)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 4)
    .map(([name, ids]) => ({ name, ids }));
}

export function Saved() {
  const shell = useAppShell();
  const { toast } = useToast();
  const products = useMemo(
    () => shell.savedIds.map((id) => byId(id)).filter((p): p is Product => Boolean(p)),
    [shell.savedIds],
  );
  const collections = useMemo(() => deriveCollections(products), [products]);

  const [selected, setSelected] = useState<string | null>(null); // 컬렉션 필터(null=전체)
  const [dismissed, setDismissed] = useState(false);

  const activeCollection = collections.find((c) => c.name === selected);
  const shown = activeCollection
    ? products.filter((p) => activeCollection.ids.includes(p.id))
    : products;

  const suggestion =
    collections.length >= 2
      ? `${collections[0].name} ${collections[1].name}`
      : collections[0]?.name;

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 flex items-baseline gap-2 bg-paper px-5 pt-[56px] pb-3">
        <h1 className="text-h1 text-ink">찜</h1>
        <span className="text-caption text-ink-3">{products.length}개</span>
      </header>

      {products.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 pt-16 text-center">
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
        <div className="flex flex-col gap-4 px-5 pb-2">
          {/* AI 컬렉션 제안 */}
          {suggestion && !dismissed && (
            <div className="rounded-card bg-ink p-4 text-paper">
              <div className="mb-1.5 flex items-center gap-1.5">
                <Icon name="sparkle" size={13} color="var(--color-paper-3)" />
                <span className="text-[10px] font-semibold tracking-[0.08em] text-paper-3 uppercase">
                  AI 컬렉션 제안
                </span>
              </div>
              <p className="text-body text-paper">&ldquo;{suggestion}&rdquo;로 묶어드릴까요?</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelected(collections[0]?.name ?? null); // mock: 제안 컬렉션으로 필터
                    setDismissed(true);
                    toast(`"${suggestion}" 컬렉션을 만들었어요`);
                  }}
                  className="rounded-btn bg-paper px-3.5 py-2 text-[13px] font-semibold text-ink"
                >
                  만들기
                </button>
                <button
                  type="button"
                  onClick={() => setDismissed(true)}
                  className="rounded-btn px-3.5 py-2 text-[13px] font-medium text-paper-3"
                >
                  닫기
                </button>
              </div>
            </div>
          )}

          {/* 컬렉션 필터 칩 */}
          {collections.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
              <Chip
                variant={selected === null ? "selected" : "default"}
                onClick={() => setSelected(null)}
              >
                전체
              </Chip>
              {collections.map((c) => (
                <Chip
                  key={c.name}
                  variant={selected === c.name ? "selected" : "default"}
                  onClick={() => setSelected(c.name)}
                >
                  {c.name}
                </Chip>
              ))}
              {/* 새 컬렉션 생성 슬롯(이후 사용자 정의 컬렉션) */}
              <Chip variant="outline" onClick={() => undefined}>
                + 새 컬렉션
              </Chip>
            </div>
          )}

          {/* 저장 그리드 */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 pt-1">
            {shown.map((p) => (
              <ProductCard
                key={p.id}
                rec={{ product: p, match: p.match, reason: p.reason }}
                size="auto"
                saved
                onToggleSaved={() => shell.toggleSaved(p.id)}
                onClick={() => shell.openDetail(p.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
