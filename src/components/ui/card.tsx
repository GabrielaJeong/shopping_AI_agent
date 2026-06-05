/*
  Card — styles.css의 .card 재현. paper-2 표면 + rounded-card + 기본 패딩.
  추천 카드/시트 등이 올라가는 기본 표면. 순수 표현 컴포넌트.
*/

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-card bg-paper-2 p-3.5", className)} {...rest} />;
}
