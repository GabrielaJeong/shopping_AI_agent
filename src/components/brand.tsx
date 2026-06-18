"use client";

/*
  Moodyfit 브랜드 마크/로고.
  마크 = 얇은 ring 안의 crescent("mood phase") — 채운 원에서 오프셋 원을 mask로 빼서 표현.
  currentColor 기반: 부모의 text-* 로 색을 제어한다 (예: splash는 text-paper).
  구조 참고: launch.jsx의 마크/로고(프로토타입은 옛 'Mudifit' 명칭) — 여기선 Moodyfit*로 통일(D-006).
*/

import { useId } from "react";
import { cn } from "@/lib/cn";

export function MoodyfitMark({ size = 30, className }: { size?: number; className?: string }) {
  const maskId = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <defs>
        <mask id={maskId}>
          <rect width="40" height="40" fill="black" />
          <circle cx="20" cy="20" r="12.4" fill="white" />
          <circle cx="27.4" cy="18.6" r="13.4" fill="black" />
        </mask>
      </defs>
      <circle cx="20" cy="20" r="16.8" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="20" cy="20" r="12.4" mask={`url(#${maskId})`} />
    </svg>
  );
}

export function MoodyfitLogo({
  size = 24,
  stack = false,
  gap = 11,
  className,
}: {
  /** 워드마크 글자 크기(px). 마크는 1.5배. */
  size?: number;
  stack?: boolean;
  gap?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("flex items-center", stack ? "flex-col" : "flex-row", className)}
      style={{ gap }}
    >
      <MoodyfitMark size={Math.round(size * 1.5)} />
      <span
        className="font-brand font-bold"
        style={{ fontSize: size, letterSpacing: "-0.4px", lineHeight: 1 }}
      >
        Moodyfit
      </span>
    </div>
  );
}
