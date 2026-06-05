"use client";

/*
  ProductCard — styles.css의 .p-card 재현. 추천(Recommendation)을 카드로 노출.
  브랜드·이름·가격·match% + heart(전역 savedIds 연동). reason은 옵션(기본 미표시 — 카드엔 match만).
  match·reason은 추천 엔진이 계산할 자리의 더미(recommend.ts 참고).
*/

import { ProductImg } from "@/components/product-img";
import { Reason } from "@/components/reason";
import { format } from "@/data";
import { cn } from "@/lib/cn";
import type { Recommendation } from "@/lib/recommend";

type Size = "sm" | "md" | "auto";

const WIDTH: Record<Size, string> = {
  sm: "w-[132px]",
  md: "w-[160px]",
  auto: "w-full",
};

interface ProductCardProps {
  rec: Recommendation;
  saved: boolean;
  onToggleSaved: () => void;
  onClick: () => void;
  size?: Size;
  showMatch?: boolean;
  showReason?: boolean;
}

export function ProductCard({
  rec,
  saved,
  onToggleSaved,
  onClick,
  size = "md",
  showMatch = true,
  showReason = false,
}: ProductCardProps) {
  const { product, match, reason } = rec;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn("flex shrink-0 cursor-pointer flex-col gap-2", WIDTH[size])}
    >
      <ProductImg
        colors={product.img}
        brand={product.brand}
        shape="tall"
        favBtn
        fav={saved}
        onFav={onToggleSaved}
      />
      <div className="flex flex-col gap-0.5 px-0.5">
        <span className="text-[11px] font-medium tracking-[0.02em] text-ink-2">
          {product.brand}
        </span>
        <span className="text-[13px] leading-snug font-medium text-ink">{product.name}</span>
        <div className="mt-0.5 flex items-baseline gap-1.5">
          <span className="text-[14px] font-semibold tracking-[-0.2px] text-ink">
            {format(product.price)}
          </span>
          {showMatch && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium tracking-[0.04em] text-ink-2">
              <span className="size-1 rounded-full bg-accent-deep" aria-hidden="true" />
              AI {match}%
            </span>
          )}
        </div>
        {showReason && <Reason html={reason} className="mt-1 text-caption text-ink-2" />}
      </div>
    </div>
  );
}
