"use client";

/*
  AppShell — app 스테이지 본체(셸). 런치 상태 머신(stage==='app')에서 마운트.
  하단 4탭 내비 + 탭(Home/Explore/Saved/My) + 푸시(Detail/List/Search) + 시트(Feedback/Chat) + 전역 savedIds.
  모든 표면 구현됨. 추천/피드백/재랭킹은 lib 경계(D-012·D-013·D-014)의 mock 위에서 동작.
*/

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AppShellProvider, useAppShell, type Screen, type Tab } from "@/lib/app-shell-state";
import { BottomNav } from "@/components/bottom-nav";
import { Home } from "@/components/screens/home";
import { Detail } from "@/components/screens/detail";
import { List } from "@/components/screens/list";
import { Search } from "@/components/screens/search";
import { Saved } from "@/components/screens/saved";
import { Explore } from "@/components/screens/explore";
import { My } from "@/components/screens/my";
import { FeedbackSheet } from "@/components/sheets/feedback-sheet";
import { ChatSheet } from "@/components/sheets/chat-sheet";
import { Icon } from "@/components/icon";

export function AppShell() {
  return (
    <AppShellProvider>
      <AppShellInner />
    </AppShellProvider>
  );
}

function AppShellInner() {
  const shell = useAppShell();
  const showNav = shell.screen === "home" || shell.screen === "list";

  // ── 스크롤 위치 관리(표준 모바일) ──
  // 화면이 단일 overflow 컨테이너 안에서 교체되므로 scrollTop이 내비게이션에 걸쳐 남는다.
  // 푸시 화면(detail/list/search)·탭 전환은 맨 위에서 시작하고, 푸시에서 back으로 탭 홈에
  // 복귀하면 직전 스크롤 위치를 복원한다. (탭별 위치를 기록 → back일 때만 복원)
  const scrollRef = useRef<HTMLDivElement>(null);
  const positions = useRef<Map<Tab, number>>(new Map());
  const prevScreen = useRef<Screen>("home");

  // 탭 홈을 보는 동안 스크롤을 계속 기록(back 복원용). 푸시 화면 스크롤은 기록하지 않음.
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (el && prevScreen.current === "home") positions.current.set(shell.tab, el.scrollTop);
  }, [shell.tab]);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const backToHome = shell.screen === "home" && prevScreen.current !== "home";
    // back(푸시→홈)이면 복원, 그 외(푸시 진입·탭 전환·초기)는 맨 위.
    el.scrollTop = backToHome ? (positions.current.get(shell.tab) ?? 0) : 0;
    prevScreen.current = shell.screen;
  }, [shell.screen, shell.tab, shell.productId, shell.listKeyword, shell.listTitle]);

  return (
    // min-h-0: 고정 높이 셸(h-dvh, → 디바이스 프레임) 안에서 flex 자식이 내용만큼 커지지 않고
    // 줄어들어 안쪽 overflow-y-auto가 실제로 스크롤되게 한다(없으면 내용이 넘쳐 잘림).
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={`flex min-h-0 flex-1 flex-col overflow-y-auto ${showNav ? "pb-[100px]" : "pb-8"}`}
      >
        {shell.screen === "home" &&
          (shell.tab === "home" ? (
            <Home />
          ) : shell.tab === "saved" ? (
            <Saved />
          ) : shell.tab === "explore" ? (
            <Explore />
          ) : (
            <My />
          ))}
        {shell.screen === "detail" &&
          (shell.productId ? (
            <Detail productId={shell.productId} />
          ) : (
            <PushPlaceholder title="상품 상세" subtitle="productId 없음" />
          ))}
        {shell.screen === "list" && <List />}
        {shell.screen === "search" && <Search />}
      </div>

      {showNav && <BottomNav />}
      <SheetOverlay />
    </div>
  );
}

/* ─── 푸시 화면 플레이스홀더(detail fallback 전용) ─── */
function PushPlaceholder({ title, subtitle }: { title: string; subtitle: string }) {
  const shell = useAppShell();
  return (
    <div className="flex flex-1 flex-col px-5 pt-[54px]">
      <div className="flex items-center gap-2 pt-2">
        <button
          type="button"
          onClick={shell.back}
          aria-label="뒤로"
          className="-ml-1.5 flex size-9 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-paper-3"
        >
          <Icon name="back" size={22} />
        </button>
        <span className="text-h3 text-ink">{title}</span>
      </div>
      <div className="mt-10 flex flex-col gap-1">
        <span className="text-label text-ink-3 uppercase">push · {shell.screen}</span>
        <p className="text-body-2 text-ink-2">{subtitle}</p>
        <p className="text-body-2 text-ink-2">
          푸시 화면 플레이스홀더 — 다음 단계에서 실제 화면으로.
        </p>
      </div>
    </div>
  );
}

/* ─── 시트 오버레이 (feedback=실제, chat=플레이스홀더) ─── */
function SheetOverlay() {
  const shell = useAppShell();
  if (shell.sheet.mode === null) return null;
  return <SheetContainer />;
}

/** 열릴 때만 마운트 → 마운트 후 슬라이드업. (시트별 내용은 1회 마운트되어 effect도 1회) */
function SheetContainer() {
  const shell = useAppShell();
  const closeSheet = shell.closeSheet;
  const [shown, setShown] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // 접근성: 열릴 때 시트로 포커스 이동 + Esc 닫기 + 닫힐 때 직전 포커스 복원.
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    setShown(true);
    // preventScroll: 시트는 화면 하단 absolute라, 포커스 시 브라우저가 강제로 스크롤(점프)하는 것 방지.
    dialogRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSheet();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prevFocus?.focus?.();
    };
  }, [closeSheet]);

  const expanded = shell.sheet.mode === "chat"; // 챗 시트는 더 높게
  const label = shell.sheet.mode === "chat" ? "AI 큐레이터" : "취향 반영";

  return (
    <>
      <div
        onClick={closeSheet}
        className={`absolute inset-0 z-20 bg-ink/45 transition-opacity duration-300 ${
          shown ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`absolute right-0 bottom-0 left-0 z-30 flex flex-col rounded-t-[18px] bg-paper px-5 pb-8 shadow-sheet transition-transform duration-300 outline-none ${
          expanded ? "max-h-[92%]" : "max-h-[88%]"
        } ${shown ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* 드래그 핸들(중앙) */}
        <div className="flex justify-center pt-2.5 pb-2">
          <span className="h-1 w-9 rounded-full bg-ink-soft" />
        </div>
        {/* 닫기 — 시트 우상단 코너 */}
        <button
          type="button"
          onClick={shell.closeSheet}
          aria-label="닫기"
          className="absolute top-2 right-3 flex size-9 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-paper-3"
        >
          <Icon name="close" size={20} />
        </button>
        {shell.sheet.mode === "feedback" && <FeedbackSheet productId={shell.sheet.productId} />}
        {shell.sheet.mode === "chat" && (
          <ChatSheet productId={shell.sheet.productId} seed={shell.sheet.chatPrompt} />
        )}
      </div>
    </>
  );
}
