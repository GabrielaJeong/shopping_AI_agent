"use client";

/*
  AppShell — app 스테이지 본체(셸). 런치 상태 머신(stage==='app')에서 마운트.
  이번 단계 범위: 하단 4탭 내비 + 탭/푸시(detail·list·search)/시트(feedback·chat) 상태 슬롯 + 전역 savedIds.
  각 탭/푸시/시트 내용은 플레이스홀더 — 실제 화면은 다음 단계(Home부터)에서 대체.
*/

import { useEffect, useState } from "react";
import { useAppState } from "@/lib/app-state";
import { AppShellProvider, useAppShell } from "@/lib/app-shell-state";
import { BottomNav } from "@/components/bottom-nav";
import { Home } from "@/components/screens/home";
import { Detail } from "@/components/screens/detail";
import { List } from "@/components/screens/list";
import { Search } from "@/components/screens/search";
import { Saved } from "@/components/screens/saved";
import { FeedbackSheet } from "@/components/sheets/feedback-sheet";
import { ChatSheet } from "@/components/sheets/chat-sheet";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { byId } from "@/data";

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

  return (
    <div className="flex flex-1 flex-col">
      <div className={`flex flex-1 flex-col overflow-y-auto ${showNav ? "pb-[100px]" : "pb-8"}`}>
        {shell.screen === "home" &&
          (shell.tab === "home" ? (
            <Home />
          ) : shell.tab === "saved" ? (
            <Saved />
          ) : (
            <TabPlaceholder />
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

/* ─── 탭 루트 플레이스홀더 ─── */
function TabPlaceholder() {
  const shell = useAppShell();
  const app = useAppState();

  return (
    <div className="flex flex-1 flex-col px-5 pt-[54px]">
      <div className="mt-6 flex flex-col gap-1">
        <span className="text-label text-ink-3 uppercase">app · tab · {shell.tab}</span>
        <h1 className="text-h1 text-ink">{TAB_TITLE[shell.tab]}</h1>
        <p className="text-body-2 text-ink-2">
          탭 셸 플레이스홀더입니다. 실제 화면은 다음 단계부터 채웁니다.
        </p>
      </div>

      {shell.tab === "explore" && (
        <SavedSummary note="탐색 탭(예정) — 전역 찜은 어디서나 공유됩니다." />
      )}
      {shell.tab === "my" && (
        <div className="mt-6 flex flex-col gap-3">
          <p className="text-body-2 text-ink-2">
            취향 태그 {Object.keys(app.tasteProfile.vector).length}개
            {app.tasteProfile.budget ? ` · 예산 ${app.tasteProfile.budget}` : ""}
          </p>
          <Button variant="neutral" block onClick={app.resetOnboarding}>
            취향 다시 설정하기
          </Button>
          <Button variant="ghost" block onClick={app.logout}>
            로그아웃
          </Button>
        </div>
      )}
    </div>
  );
}

const TAB_TITLE = {
  home: "홈",
  explore: "탐색",
  saved: "찜",
  my: "마이",
} as const;

/* 다른 탭에서 전역 saved가 공유됨을 보여주는 요약. */
function SavedSummary({ note }: { note: string }) {
  const shell = useAppShell();
  const ids = ["p01", "p02", "p03", "p04", "p05", "p06", "p07", "p08"].filter((id) =>
    shell.isSaved(id),
  );
  return (
    <div className="mt-6 flex flex-col gap-3">
      <p className="text-body-2 text-ink-2">{note}</p>
      <p className="text-caption text-ink-3">찜한 상품 {ids.length}개</p>
      <div className="flex flex-col gap-2">
        {ids.length === 0 && <p className="text-caption text-ink-3">아직 찜한 상품이 없어요.</p>}
        {ids.map((id) => (
          <div key={id} className="rounded-card bg-paper-2 px-4 py-3 text-body-2 text-ink">
            {byId(id)?.name ?? id}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── 푸시 화면 플레이스홀더(detail/list/search) ─── */
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
  const [shown, setShown] = useState(false);
  useEffect(() => setShown(true), []);

  const expanded = shell.sheet.mode === "chat"; // 챗 시트는 더 높게

  return (
    <>
      <div
        onClick={shell.closeSheet}
        className={`absolute inset-0 z-20 bg-ink/45 transition-opacity duration-300 ${
          shown ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`absolute right-0 bottom-0 left-0 z-30 flex flex-col rounded-t-[18px] bg-paper px-5 pb-8 shadow-sheet transition-transform duration-300 ${
          expanded ? "max-h-[92%]" : "max-h-[88%]"
        } ${shown ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="relative flex items-center justify-center pt-2 pb-3">
          <span className="absolute top-2 h-1 w-9 rounded-full bg-ink-soft" />
          <button
            type="button"
            onClick={shell.closeSheet}
            aria-label="닫기"
            className="absolute right-0 flex size-9 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-paper-3"
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        {shell.sheet.mode === "feedback" && <FeedbackSheet productId={shell.sheet.productId} />}
        {shell.sheet.mode === "chat" && (
          <ChatSheet productId={shell.sheet.productId} seed={shell.sheet.chatPrompt} />
        )}
      </div>
    </>
  );
}
