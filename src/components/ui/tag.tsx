/*
  Tag — 상품 속성 태그(미니멀·베이지 등)의 표시 전용 칩. styles.css `.chip.tiny.outline` 재현.
  ⚠️ Chip(=<button>)과 달리 비대화형 <span>이다. 정본(home.jsx/detail.jsx)에서 태그는
  `<span class="chip tiny outline">`로 클릭 동작이 없다 — 가짜 클릭 affordance를 주지 않으려 span으로 둔다.
  (필터/리스트로 연결하려면 정본 의도를 바꾸는 별도 결정이 필요.)
*/

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Tag({ className, children, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-chip bg-transparent px-2 py-1 text-[10px] font-medium tracking-[-0.1px] whitespace-nowrap text-ink ring-1 ring-line ring-inset",
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
