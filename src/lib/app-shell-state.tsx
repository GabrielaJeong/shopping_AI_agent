"use client";

/*
  app 스테이지 상태 (런치 상태 머신 D-009와 분리). app 진입 시에만 마운트.
  - tab: 하단 4탭. 탭 전환 시 screen=home으로 리셋(handoff).
  - screen: 탭 위로 푸시되는 화면(detail/list/search). back으로 home 복귀.
  - sheet: 오버레이 시트(feedback/chat) 상태 슬롯.
  - savedIds: 전역 찜 상태 — 어느 화면에서 토글해도 전역 반영(handoff). persistence로 영속(D-003).

  내비 active 규칙: list는 home 서브플로우라 home 하이라이트 유지(handoff) → navActiveTab으로 표현.
  (이번 단계는 셸·내비·전역 상태까지. 각 탭/푸시/시트 내용은 다음 단계.)
*/

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { persistence } from "./persistence";

export type Tab = "home" | "explore" | "saved" | "my";
export type Screen = "home" | "detail" | "list" | "search";
export type SheetMode = "feedback" | "chat" | null;

export interface SheetState {
  mode: SheetMode;
  productId: string | null;
  chatPrompt: string | null;
}

const CLOSED_SHEET: SheetState = { mode: null, productId: null, chatPrompt: null };

export interface AppShellState {
  tab: Tab;
  screen: Screen;
  /** detail 대상 상품 id. */
  productId: string | null;
  /** list 컨텍스트(제목/키워드). */
  listTitle: string | null;
  listKeyword: string | null;
  sheet: SheetState;
  /** 하단 내비에서 하이라이트할 탭(list일 때 home 유지). */
  navActiveTab: Tab;

  selectTab: (tab: Tab) => void;
  openDetail: (productId: string) => void;
  openList: (opts?: { title?: string; keyword?: string }) => void;
  openSearch: () => void;
  /** 푸시 화면에서 탭 홈으로 복귀. */
  back: () => void;

  isSaved: (id: string) => boolean;
  /** 전역 찜 토글(영속). */
  toggleSaved: (id: string) => void;

  openSheet: (sheet: {
    mode: Exclude<SheetMode, null>;
    productId?: string;
    chatPrompt?: string;
  }) => void;
  closeSheet: () => void;
}

const AppShellContext = createContext<AppShellState | null>(null);

export function AppShellProvider({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useState<Tab>("home");
  const [screen, setScreen] = useState<Screen>("home");
  const [productId, setProductId] = useState<string | null>(null);
  const [listTitle, setListTitle] = useState<string | null>(null);
  const [listKeyword, setListKeyword] = useState<string | null>(null);
  const [sheet, setSheet] = useState<SheetState>(CLOSED_SHEET);
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());

  // 초기 1회: 영속화에서 찜 목록 로드.
  useEffect(() => {
    let alive = true;
    persistence.getSavedIds().then((ids) => {
      if (alive) setSavedIds(new Set(ids));
    });
    return () => {
      alive = false;
    };
  }, []);

  const selectTab = useCallback((next: Tab) => {
    setTab(next);
    setScreen("home"); // 탭 전환 시 푸시 화면 리셋
    setProductId(null);
    setListTitle(null);
    setListKeyword(null);
  }, []);

  const openDetail = useCallback((id: string) => {
    setProductId(id);
    setScreen("detail");
  }, []);

  const openList = useCallback((opts?: { title?: string; keyword?: string }) => {
    setListTitle(opts?.title ?? null);
    setListKeyword(opts?.keyword ?? null);
    setScreen("list");
  }, []);

  const openSearch = useCallback(() => setScreen("search"), []);

  const back = useCallback(() => {
    setScreen("home");
    setProductId(null);
    setListTitle(null);
    setListKeyword(null);
  }, []);

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds]);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      void persistence.setSavedIds([...next]); // 영속화(레이어 경유)
      return next;
    });
  }, []);

  const openSheet = useCallback(
    (s: { mode: Exclude<SheetMode, null>; productId?: string; chatPrompt?: string }) => {
      setSheet({ mode: s.mode, productId: s.productId ?? null, chatPrompt: s.chatPrompt ?? null });
    },
    [],
  );
  const closeSheet = useCallback(() => setSheet(CLOSED_SHEET), []);

  const navActiveTab: Tab = screen === "list" ? "home" : tab;

  const value = useMemo<AppShellState>(
    () => ({
      tab,
      screen,
      productId,
      listTitle,
      listKeyword,
      sheet,
      navActiveTab,
      selectTab,
      openDetail,
      openList,
      openSearch,
      back,
      isSaved,
      toggleSaved,
      openSheet,
      closeSheet,
    }),
    [
      tab,
      screen,
      productId,
      listTitle,
      listKeyword,
      sheet,
      navActiveTab,
      selectTab,
      openDetail,
      openList,
      openSearch,
      back,
      isSaved,
      toggleSaved,
      openSheet,
      closeSheet,
    ],
  );

  return <AppShellContext.Provider value={value}>{children}</AppShellContext.Provider>;
}

export function useAppShell(): AppShellState {
  const ctx = useContext(AppShellContext);
  if (!ctx) throw new Error("useAppShell must be used within <AppShellProvider>");
  return ctx;
}
