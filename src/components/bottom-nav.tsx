"use client";

/*
  하단 내비 — styles.css의 .bottom-nav / .nav-item 재현. app 스테이지에서만 노출.
  active는 navActiveTab(list는 home 유지). 탭 클릭 시 selectTab(screen=home 리셋).
*/

import { Icon, type IconName } from "@/components/icon";
import { useAppShell, type Tab } from "@/lib/app-shell-state";
import { cn } from "@/lib/cn";

const TABS: { id: Tab; label: string; icon: IconName }[] = [
  { id: "home", label: "홈", icon: "home" },
  { id: "explore", label: "탐색", icon: "grid" },
  { id: "saved", label: "찜", icon: "heart" },
  { id: "my", label: "마이", icon: "user" },
];

export function BottomNav() {
  const { navActiveTab, selectTab } = useAppShell();

  return (
    <nav className="absolute right-0 bottom-0 left-0 z-10 flex justify-around border-t border-ink/5 bg-paper/90 px-4 pt-2 pb-7 backdrop-blur-md backdrop-saturate-150">
      {TABS.map((t) => {
        const active = navActiveTab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => selectTab(t.id)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-0.5 px-3 py-1.5",
              active ? "text-ink" : "text-ink-3",
            )}
          >
            <Icon name={t.id === "saved" && active ? "heart-fill" : t.icon} size={22} />
            <span className={cn("text-[10px] tracking-[0.04em]", active && "font-semibold")}>
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
