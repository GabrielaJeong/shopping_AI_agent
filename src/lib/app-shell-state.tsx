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
import { useToast } from "./toast";
import type { Collection } from "@/types";

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
  /** 하단 내비에서 하이라이트할 탭(list일 때 home 유지). */
  navActiveTab: Tab;

  selectTab: (tab: Tab) => void;
  openDetail: (productId: string) => void;
  openList: (opts?: { title?: string; keyword?: string }) => void;
  openSearch: () => void;
  /** 푸시 화면에서 탭 홈으로 복귀. */
  back: () => void;

  /** 찜한 상품 id 목록(저장 순). */
  savedIds: string[];
  isSaved: (id: string) => boolean;
  /** 전역 찜 토글(영속). */
  toggleSaved: (id: string) => void;

  /** 찜 컬렉션 목록(영속). 탭 전환/리로드에도 유지. */
  collections: Collection[];
  /** 컬렉션 생성(영속) → 생성된 id 반환(생성 직후 해당 컬렉션으로 필터하려고). */
  createCollection: (name: string, productIds: string[]) => string;

  openSheet: (sheet: {
    mode: Exclude<SheetMode, null>;
    productId?: string;
    chatPrompt?: string;
  }) => void;
  closeSheet: () => void;
}

const AppShellContext = createContext<AppShellState | null>(null);

// 시트 상태는 별도 컨텍스트로 분리한다(D-016). 시트 open/close가 위 AppShellContext 값을 바꾸면
// 그걸 소비하는 현재 화면 전체(무거운 Home 등)가 재렌더돼 시트 슬라이드업이 끊긴다(jank).
// 시트 상태를 읽는 곳은 시트 오버레이뿐이므로 여기만 구독하게 한다(진입점은 openSheet 콜백만 사용).
const SheetStateContext = createContext<SheetState>(CLOSED_SHEET);

export function AppShellProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("home");
  const [screen, setScreen] = useState<Screen>("home");
  const [productId, setProductId] = useState<string | null>(null);
  const [listTitle, setListTitle] = useState<string | null>(null);
  const [listKeyword, setListKeyword] = useState<string | null>(null);
  const [sheet, setSheet] = useState<SheetState>(CLOSED_SHEET);
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());
  const [collections, setCollections] = useState<Collection[]>([]);

  // 초기 1회: 영속화에서 찜 목록·컬렉션 로드.
  useEffect(() => {
    let alive = true;
    persistence.getSavedIds().then((ids) => {
      if (alive) setSavedIds(new Set(ids));
    });
    persistence.getCollections().then((cols) => {
      if (alive) setCollections(cols);
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

  const toggleSaved = useCallback(
    (id: string) => {
      const willRemove = savedIds.has(id);
      const next = new Set(savedIds);
      if (willRemove) next.delete(id);
      else next.add(id);
      setSavedIds(next);
      void persistence.setSavedIds([...next]); // 영속화(레이어 경유)
      toast(willRemove ? "찜을 해제했어요" : "찜했어요");
    },
    [savedIds, toast],
  );

  const createCollection = useCallback(
    (name: string, productIds: string[]): string => {
      const id = `col-${Date.now()}`;
      setCollections((prev) => {
        const next = [...prev, { id, name, productIds }];
        void persistence.setCollections(next); // 영속화(레이어 경유)
        return next;
      });
      toast(`'${name}' 컬렉션을 만들었어요`);
      return id;
    },
    [toast],
  );

  const openSheet = useCallback(
    (s: { mode: Exclude<SheetMode, null>; productId?: string; chatPrompt?: string }) => {
      setSheet({ mode: s.mode, productId: s.productId ?? null, chatPrompt: s.chatPrompt ?? null });
    },
    [],
  );
  const closeSheet = useCallback(() => setSheet(CLOSED_SHEET), []);

  const navActiveTab: Tab = screen === "list" ? "home" : tab;

  // sheet는 의도적으로 제외(D-016) — 시트 open/close가 이 값을 바꾸지 않아야 화면이 재렌더되지 않는다.
  const value = useMemo<AppShellState>(
    () => ({
      tab,
      screen,
      productId,
      listTitle,
      listKeyword,
      navActiveTab,
      savedIds: [...savedIds],
      selectTab,
      openDetail,
      openList,
      openSearch,
      back,
      isSaved,
      toggleSaved,
      collections,
      createCollection,
      openSheet,
      closeSheet,
    }),
    [
      tab,
      screen,
      productId,
      listTitle,
      listKeyword,
      navActiveTab,
      savedIds,
      selectTab,
      openDetail,
      openList,
      openSearch,
      back,
      isSaved,
      toggleSaved,
      collections,
      createCollection,
      openSheet,
      closeSheet,
    ],
  );

  return (
    <AppShellContext.Provider value={value}>
      <SheetStateContext.Provider value={sheet}>{children}</SheetStateContext.Provider>
    </AppShellContext.Provider>
  );
}

export function useAppShell(): AppShellState {
  const ctx = useContext(AppShellContext);
  if (!ctx) throw new Error("useAppShell must be used within <AppShellProvider>");
  return ctx;
}

/** 시트 상태 구독(시트 오버레이 전용 — D-016). 화면 컴포넌트는 이걸 구독하지 말 것(재렌더 유발). */
export function useSheet(): SheetState {
  return useContext(SheetStateContext);
}
