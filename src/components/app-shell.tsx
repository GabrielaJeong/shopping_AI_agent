"use client";

/*
  AppShell — app 스테이지 본체(셸). 런치 상태 머신(stage==='app')에서 마운트.
  이번 단계 범위: 하단 4탭 내비 + 탭/푸시(detail·list·search)/시트(feedback·chat) 상태 슬롯 + 전역 savedIds.
  각 탭/푸시/시트 내용은 플레이스홀더 — 실제 화면은 다음 단계(Home부터)에서 대체.
*/

import { useAppState } from "@/lib/app-state";
import { AppShellProvider, useAppShell } from "@/lib/app-shell-state";
import { BottomNav } from "@/components/bottom-nav";
import { Home } from "@/components/screens/home";
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
        {shell.screen === "home" && (shell.tab === "home" ? <Home /> : <TabPlaceholder />)}
        {shell.screen === "detail" && (
          <PushPlaceholder title="상품 상세" subtitle={`productId · ${shell.productId ?? "—"}`} />
        )}
        {shell.screen === "list" && (
          <PushPlaceholder
            title={shell.listTitle ?? "리스트"}
            subtitle={`keyword · ${shell.listKeyword ?? "—"}`}
          />
        )}
        {shell.screen === "search" && (
          <PushPlaceholder title="검색" subtitle="실시간 인기·자동완성" />
        )}
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
      {shell.tab === "saved" && <SavedSummary note="찜 탭(예정) — 저장한 상품 목록." />}
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

/* ─── 시트 오버레이 플레이스홀더(feedback/chat) ─── */
function SheetOverlay() {
  const shell = useAppShell();
  const open = shell.sheet.mode !== null;

  return (
    <>
      <div
        onClick={shell.closeSheet}
        className={`absolute inset-0 z-20 bg-ink/45 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />
      <div
        className={`absolute right-0 bottom-0 left-0 z-30 flex max-h-[88%] flex-col rounded-t-[18px] bg-paper px-5 pt-2 pb-8 shadow-sheet transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="mx-auto mt-2 mb-4 h-1 w-9 rounded-full bg-ink-soft" />
        <div className="flex items-center justify-between">
          <span className="text-h3 text-ink">
            {shell.sheet.mode === "feedback" ? "취향에 반영했어요 (예정)" : "AI 큐레이터 (예정)"}
          </span>
          <button
            type="button"
            onClick={shell.closeSheet}
            aria-label="닫기"
            className="flex size-9 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-paper-3"
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        <p className="text-body-2 mt-3 text-ink-2">
          {shell.sheet.mode === "feedback"
            ? `피드백 시트 플레이스홀더 · productId ${shell.sheet.productId ?? "—"}`
            : `AI 챗 시트 플레이스홀더 · prompt ${shell.sheet.chatPrompt ?? "—"}`}
        </p>
      </div>
    </>
  );
}
