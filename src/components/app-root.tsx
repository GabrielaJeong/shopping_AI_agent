"use client";

/*
  AppRoot — 단일 루트 상태 머신 렌더러 (D-009).
  각 stage를 실제 화면으로 렌더. app 스테이지는 AppShell(별도 상태 컨텍스트)이 담당.
*/

import { useAppState } from "@/lib/app-state";
import { Splash } from "@/components/screens/splash";
import { Intro } from "@/components/screens/intro";
import { Login } from "@/components/screens/login";
import { Onboarding } from "@/components/screens/onboarding";
import { AppShell } from "@/components/app-shell";

export function AppRoot() {
  const s = useAppState();

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[420px] flex-col overflow-hidden bg-paper">
      {s.stage === "splash" && <Splash onDone={s.finishSplash} />}
      {s.stage === "intro" && <Intro onDone={s.finishIntro} />}
      {s.stage === "login" && <Login onLogin={s.login} />}
      {s.stage === "onboarding" && (
        <Onboarding onComplete={s.finishOnboarding} onSkip={s.skipOnboarding} />
      )}
      {s.stage === "app" && <AppShell />}
    </div>
  );
}
