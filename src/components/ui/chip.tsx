"use client";

/*
  Chip — styles.css의 .chip 재현.
  variant: default · selected(ink/paper) · outline(line 테두리) · ai(accent-soft + 선행 dot)
  size: md(기본) · tiny
*/

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "default" | "selected" | "outline" | "ai";
type Size = "md" | "tiny";

const VARIANT: Record<Variant, string> = {
  default: "bg-paper-3 text-ink hover:bg-paper-deep",
  selected: "bg-ink text-paper",
  outline: "bg-transparent text-ink ring-1 ring-inset ring-line",
  ai: "bg-accent-soft text-ink font-semibold tracking-[0.05em]",
};

const SIZE: Record<Size, string> = {
  md: "px-2.5 py-1.5 text-xs",
  tiny: "px-2 py-1 text-[10px]",
};

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Chip({
  variant = "default",
  size = "md",
  className,
  type = "button",
  children,
  ...rest
}: ChipProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1 rounded-chip font-medium whitespace-nowrap tracking-[-0.1px] transition",
        VARIANT[variant],
        variant === "ai" ? SIZE.tiny : SIZE[size],
        className,
      )}
      {...rest}
    >
      {variant === "ai" && <span className="size-1 rounded-full bg-ink" aria-hidden="true" />}
      {children}
    </button>
  );
}
