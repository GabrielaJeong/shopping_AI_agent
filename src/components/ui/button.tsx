"use client";

/*
  Button — styles.css의 .btn 재현.
  variant: primary(ink/paper) · neutral(paper-3/ink, 기본) · ghost(transparent/ink-2)
  size: md(기본) · lg
*/

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "neutral" | "ghost";
type Size = "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-accent-deep",
  neutral: "bg-paper-3 text-ink hover:bg-paper-deep",
  ghost: "bg-transparent text-ink-2 hover:text-ink",
};

const SIZE: Record<Size, string> = {
  md: "px-5 py-3.5 text-sm",
  lg: "px-5 py-4 text-[15px]",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
}

export function Button({
  variant = "neutral",
  size = "md",
  block = false,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-btn font-semibold tracking-[-0.2px] transition active:translate-y-0 active:opacity-90 hover:-translate-y-px disabled:pointer-events-none disabled:opacity-40",
        VARIANT[variant],
        SIZE[size],
        block && "w-full",
        className,
      )}
      {...rest}
    />
  );
}
