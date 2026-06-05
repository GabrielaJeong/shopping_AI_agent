"use client";

/*
  앱 런치 상태 머신 (D-009).
  단일 루트의 클라이언트 상태 머신 — handoff의 stage 머신을 그대로 따른다:
    splash → intro → login → onboarding → app
  onboarded 플래그는 persistence(mock 영속화 레이어, D-003)로 추상화해 읽고 쓴다.

  app 스테이지 내부의 tab/screen/sheet 라우팅은 app 스테이지 구현 단계에서 확장한다.
*/

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { persistence } from "./persistence";

export type Stage = "splash" | "intro" | "login" | "onboarding" | "app";

export interface AppState {
  stage: Stage;
  /** 온보딩 완료 여부(영속). 초기 로드 전에는 false. */
  onboarded: boolean;
  /** Splash 종료: 온보딩 완료자면 app으로, 아니면 intro로. */
  finishSplash: () => void;
  /** Intro 종료(또는 건너뛰기) → login. */
  finishIntro: () => void;
  /** 로그인/게스트 진입: 온보딩 완료자면 app, 아니면 onboarding. */
  login: () => void;
  /** 온보딩 완료 → 플래그 영속 후 app. */
  finishOnboarding: () => void;
  /** 로그아웃 → login. */
  logout: () => void;
  /** 취향 다시 설정 → onboarding. */
  resetOnboarding: () => void;
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState<Stage>("splash");
  const [onboarded, setOnboarded] = useState(false);

  // 초기 1회: 영속화 레이어에서 온보딩 플래그 로드.
  useEffect(() => {
    let alive = true;
    persistence.getOnboarded().then((v) => {
      if (alive) setOnboarded(v);
    });
    return () => {
      alive = false;
    };
  }, []);

  const finishSplash = useCallback(() => setStage(onboarded ? "app" : "intro"), [onboarded]);
  const finishIntro = useCallback(() => setStage("login"), []);
  const login = useCallback(() => setStage(onboarded ? "app" : "onboarding"), [onboarded]);
  const finishOnboarding = useCallback(async () => {
    await persistence.setOnboarded(true);
    setOnboarded(true);
    setStage("app");
  }, []);
  const logout = useCallback(() => setStage("login"), []);
  const resetOnboarding = useCallback(() => setStage("onboarding"), []);

  const value = useMemo<AppState>(
    () => ({
      stage,
      onboarded,
      finishSplash,
      finishIntro,
      login,
      finishOnboarding,
      logout,
      resetOnboarding,
    }),
    [stage, onboarded, finishSplash, finishIntro, login, finishOnboarding, logout, resetOnboarding],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within <AppStateProvider>");
  return ctx;
}
