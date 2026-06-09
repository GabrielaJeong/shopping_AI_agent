"use client";

/*
  앱 런치 상태 머신 (D-009).
  단일 루트의 클라이언트 상태 머신 — handoff의 stage 머신을 그대로 따른다:
    splash → intro → login → onboarding → app
  onboarded 플래그와 취향 프로필(F1 산출물)은 persistence(mock 영속화 레이어, D-003)로 추상화해 읽고 쓴다.

  콜드스타트(D-005): 온보딩을 건너뛰거나 미완료여도 tasteProfile은 빈 프로필이라 app이 깨지지 않는다.
  app 스테이지 내부의 tab/screen/sheet 라우팅은 app 스테이지 구현 단계에서 확장한다.
*/

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { persistence } from "./persistence";
import { emptyTasteProfile } from "./taste-vector";
import { applyFeedback, type FeedbackSignal, type TasteChange } from "./feedback";
import { byId } from "@/data";
import type { TasteProfile } from "@/types";

export type Stage = "splash" | "intro" | "login" | "onboarding" | "app";

export interface AppState {
  stage: Stage;
  /** 온보딩 완료 여부(영속). 초기 로드 전에는 false. */
  onboarded: boolean;
  /** 취향 프로필(F1). 콜드스타트 기본값은 빈 프로필 — 추천이 읽을 데이터. */
  tasteProfile: TasteProfile;
  /** Splash 종료: 온보딩 완료자면 app으로, 아니면 intro로. */
  finishSplash: () => void;
  /** Intro 종료(또는 건너뛰기) → login. */
  finishIntro: () => void;
  /** 로그인/게스트 진입: 온보딩 완료자면 app, 아니면 onboarding. */
  login: () => void;
  /** 온보딩 완료 → 취향 프로필+완료 플래그 영속 후 app. */
  finishOnboarding: (profile: TasteProfile) => void;
  /** 온보딩 건너뛰기(게스트) → 빈 프로필로 app(완료 플래그는 세우지 않음, D-005). */
  skipOnboarding: () => void;
  /** 로그아웃 → login. */
  logout: () => void;
  /** 취향 다시 설정 → onboarding. */
  resetOnboarding: () => void;
  /**
   * 피드백 신호를 취향 벡터에 실제로 반영(F6) + 영속. 적용된 변화 목록을 반환(시트가 그대로 시각화).
   * 무관한 productId면 빈 배열. (현재 단순 +/−델타 — D-013)
   */
  recordFeedback: (productId: string, signal: FeedbackSignal) => TasteChange[];
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState<Stage>("splash");
  const [onboarded, setOnboarded] = useState(false);
  const [tasteProfile, setTasteProfile] = useState<TasteProfile>(emptyTasteProfile);

  // 초기 1회: 영속화 레이어에서 온보딩 플래그 + 취향 프로필 로드(없으면 빈 프로필 유지).
  useEffect(() => {
    let alive = true;
    void (async () => {
      const [v, profile] = await Promise.all([
        persistence.getOnboarded(),
        persistence.getTasteProfile(),
      ]);
      if (!alive) return;
      setOnboarded(v);
      if (profile) setTasteProfile(profile);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const finishSplash = useCallback(() => setStage(onboarded ? "app" : "intro"), [onboarded]);
  const finishIntro = useCallback(() => setStage("login"), []);
  const login = useCallback(() => setStage(onboarded ? "app" : "onboarding"), [onboarded]);
  const finishOnboarding = useCallback(async (profile: TasteProfile) => {
    await Promise.all([persistence.setTasteProfile(profile), persistence.setOnboarded(true)]);
    setTasteProfile(profile);
    setOnboarded(true);
    setStage("app");
  }, []);
  const skipOnboarding = useCallback(() => {
    // 콜드스타트: 빈 벡터로 app 진입(완료 플래그는 세우지 않음).
    setTasteProfile(emptyTasteProfile());
    setStage("app");
  }, []);
  const logout = useCallback(() => setStage("login"), []);
  const resetOnboarding = useCallback(() => setStage("onboarding"), []);
  const recordFeedback = useCallback(
    (productId: string, signal: FeedbackSignal): TasteChange[] => {
      const product = byId(productId);
      if (!product) return [];
      const { profile, changes } = applyFeedback(tasteProfile, product, signal);
      setTasteProfile(profile);
      void persistence.setTasteProfile(profile); // 영속(레이어 경유, D-003)
      return changes;
    },
    [tasteProfile],
  );

  const value = useMemo<AppState>(
    () => ({
      stage,
      onboarded,
      tasteProfile,
      finishSplash,
      finishIntro,
      login,
      finishOnboarding,
      skipOnboarding,
      logout,
      resetOnboarding,
      recordFeedback,
    }),
    [
      stage,
      onboarded,
      tasteProfile,
      finishSplash,
      finishIntro,
      login,
      finishOnboarding,
      skipOnboarding,
      logout,
      resetOnboarding,
      recordFeedback,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within <AppStateProvider>");
  return ctx;
}
