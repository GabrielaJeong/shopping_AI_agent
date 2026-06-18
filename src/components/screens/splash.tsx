"use client";

/*
  Splash — 부팅 브랜드 모먼트. ink 배경 위 마크+워드마크(paper), ~1.8s 후 자동 전환.
  구조 참고: docs/prototype-handoff/design_files/launch.jsx (Splash).
*/

import { useEffect } from "react";
import { MoodyfitLogo } from "@/components/brand";

export function Splash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-ink text-paper">
      <div className="animate-splash-in">
        <MoodyfitLogo size={36} stack gap={18} />
      </div>
    </div>
  );
}
