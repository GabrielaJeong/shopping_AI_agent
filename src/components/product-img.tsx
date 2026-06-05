"use client";

/*
  ProductImg — styles.css의 .product-img 재현.
  상품 이미지는 아직 실제 사진이 아니라 {light, base, dark} 톤 컬러 블록 플레이스홀더.
  (실제 사진으로 교체 예정 — 카드 비율은 유지: tall 3/4, square 1/1, base 4/5)
*/

import { Icon } from "@/components/icon";
import { cn } from "@/lib/cn";

export interface ProductImgColors {
  light: string;
  base: string;
  dark: string;
}

type Shape = "base" | "tall" | "square";

const SHAPE: Record<Shape, string> = {
  base: "aspect-[4/5]",
  tall: "aspect-[3/4]",
  square: "aspect-square",
};

interface ProductImgProps {
  colors: ProductImgColors;
  brand?: string;
  shape?: Shape;
  favBtn?: boolean;
  fav?: boolean;
  onFav?: () => void;
  className?: string;
}

export function ProductImg({
  colors,
  brand,
  shape = "base",
  favBtn = false,
  fav = false,
  onFav,
  className,
}: ProductImgProps) {
  const background = [
    "radial-gradient(ellipse at 28% 22%, rgba(255,255,255,0.22), transparent 55%)",
    "radial-gradient(ellipse at 75% 95%, rgba(0,0,0,0.10), transparent 60%)",
    `linear-gradient(160deg, ${colors.light} 0%, ${colors.base} 55%, ${colors.dark} 100%)`,
  ].join(", ");

  return (
    <div
      className={cn("relative w-full overflow-hidden rounded-image", SHAPE[shape], className)}
      style={{ background }}
    >
      {brand && (
        <div className="absolute bottom-2.5 left-2.5 text-[9px] font-semibold tracking-[0.08em] text-white/85 uppercase mix-blend-difference">
          {brand}
        </div>
      )}
      {favBtn && (
        <button
          type="button"
          aria-label={fav ? "찜 해제" : "찜하기"}
          aria-pressed={fav}
          onClick={(e) => {
            e.stopPropagation();
            onFav?.();
          }}
          className={cn(
            "absolute top-2 right-2 flex size-[30px] cursor-pointer items-center justify-center rounded-full backdrop-blur-sm",
            fav ? "bg-ink text-paper" : "bg-paper/85 text-ink",
          )}
        >
          <Icon name={fav ? "heart-fill" : "heart"} size={15} />
        </button>
      )}
    </div>
  );
}
