/*
  Icon — Lucide 계열 outline(1.5 stroke) 아이콘 세트.
  구조 참고: docs/prototype-handoff/design_files/atoms.jsx (베끼지 않고 TS로 재현).
  currentColor 기반 → text-* 유틸로 색 제어. 이모지 사용 금지(라인 아이콘으로 등가 대체).
*/

import type { SVGProps } from "react";

export type IconName =
  | "home"
  | "grid"
  | "search"
  | "heart"
  | "heart-fill"
  | "user"
  | "bookmark"
  | "bookmark-fill"
  | "thumbs-down"
  | "shuffle"
  | "close"
  | "back"
  | "arrow-right"
  | "arrow-up"
  | "sparkle"
  | "chat"
  | "bell"
  | "check"
  | "send"
  | "plus"
  | "minus"
  | "chevron-right"
  | "star"
  | "trend";

const PATHS: Record<IconName, React.ReactNode> = {
  home: <path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-4v-7H9v7H5a1 1 0 0 1-1-1z" />,
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" />
      <rect x="13" y="4" width="7" height="7" />
      <rect x="4" y="13" width="7" height="7" />
      <rect x="13" y="13" width="7" height="7" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </>
  ),
  heart: <path d="M12 20.5s-7-4.3-7-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5c0 5.7-7 10-7 10z" />,
  "heart-fill": (
    <path
      fill="currentColor"
      stroke="none"
      d="M12 20.5s-7-4.3-7-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5c0 5.7-7 10-7 10z"
    />
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </>
  ),
  bookmark: <path d="M6 4h12v17l-6-4-6 4z" />,
  "bookmark-fill": <path fill="currentColor" stroke="none" d="M6 4h12v17l-6-4-6 4z" />,
  "thumbs-down": <path d="M7 14v-9a1 1 0 0 1 1-1h9l3 3v6l-3 1h-3l1 5a2 2 0 0 1-2 2l-3-7H7" />,
  shuffle: <path d="M3 6h4l10 12h4M3 18h4M17 6h4M17 18l3-3M17 6l3 3" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  back: <path d="M15 6l-6 6 6 6" />,
  "arrow-right": <path d="M5 12h14M13 5l7 7-7 7" />,
  "arrow-up": <path d="M12 19V5M5 12l7-7 7 7" />,
  sparkle: (
    <>
      <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z" />
      <path d="M19 14l.7 1.7L21 16l-1.3.3-.7 1.7-.7-1.7L17 16l1.3-.3z" />
    </>
  ),
  chat: <path d="M21 12a8 8 0 0 1-12.5 6.7L4 20l1.3-4.5A8 8 0 1 1 21 12z" />,
  bell: <path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 21a2 2 0 0 0 4 0" />,
  check: <path d="M5 12l5 5L20 7" />,
  send: <path d="M4 12l16-8-6 18-3-7z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  "chevron-right": <path d="M9 6l6 6-6 6" />,
  star: <path d="M12 3l2.5 6 6.5.5-5 4.5 1.5 6.5L12 17l-5.5 3.5L8 14l-5-4.5L9.5 9z" />,
  trend: <path d="M3 17l6-6 4 4 8-8M14 7h7v7" />,
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
