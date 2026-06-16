"use client";

/*
  TasteBars — 취향 키워드 가중치 바 목록. 출처: styles.css `.bar-list`/`.bar-row`(charts.jsx BarList).
  Home·My가 각자 다른 그리드/패딩/hover로 구현해 어긋났던 걸 정본 스펙으로 통일(공용 컴포넌트).
  스펙: 라벨 80px · 1fr · 36px, gap 10px. onPick이 있으면 tappable 행(<button>, -mx-2 px-2 py-1.5,
  rounded-btn, hover bg-paper-3). 값은 11px ink-2 우측 정렬.
*/

import { cn } from "@/lib/cn";

export interface TasteBarItem {
  tag: string;
  /** 0~1 가중치 */
  weight: number;
}

export function TasteBars({
  items,
  onPick,
  className,
}: {
  items: TasteBarItem[];
  /** 행 클릭(예: 키워드 리스트 열기). 없으면 표시 전용(비대화형). */
  onPick?: (item: TasteBarItem) => void;
  className?: string;
}) {
  const base = "grid grid-cols-[80px_1fr_36px] items-center gap-2.5 text-left";
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {items.map((it) => {
        const pct = Math.round(it.weight * 100);
        const inner = (
          <>
            <span className="text-[12px] font-medium text-ink">{it.tag}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-paper-3">
              <span
                className="block h-full rounded-full bg-ink transition-[width] duration-700 ease-out"
                style={{ width: `${pct}%` }}
              />
            </span>
            <span className="text-right text-[11px] font-medium tracking-[0.02em] text-ink-2">
              {pct}%
            </span>
          </>
        );
        return onPick ? (
          <button
            key={it.tag}
            type="button"
            onClick={() => onPick(it)}
            className={cn(base, "rounded-btn -mx-2 px-2 py-1.5 transition-colors hover:bg-paper-3")}
          >
            {inner}
          </button>
        ) : (
          <div key={it.tag} className={base}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}
