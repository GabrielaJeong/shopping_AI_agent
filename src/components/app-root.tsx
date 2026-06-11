"use client";

/*
  AppRoot — 단일 루트 상태 머신 렌더러 (D-009).
  각 stage를 실제 화면으로 렌더. app 스테이지는 AppShell(별도 상태 컨텍스트)이 담당.
*/

import { useAppState } from "@/lib/app-state";
import { Toaster } from "@/lib/toast";
import { Splash } from "@/components/screens/splash";
import { Intro } from "@/components/screens/intro";
import { Login } from "@/components/screens/login";
import { Onboarding } from "@/components/screens/onboarding";
import { AppShell } from "@/components/app-shell";

export function AppRoot() {
  const s = useAppState();

  return (
    // 모바일: 풀-블리드 폰 화면. 큰 화면(sm↑): 레터박스 배경 위 가운데 정렬된 디바이스 프레임.
    <div className="flex min-h-dvh flex-col items-center bg-paper sm:justify-center sm:bg-[#e8e4dc]">
      <div className="relative flex h-dvh w-full max-w-[420px] flex-col overflow-hidden bg-paper sm:h-[844px] sm:max-h-[calc(100dvh_-_3rem)] sm:rounded-[2rem] sm:shadow-elev">
        {s.stage === "splash" && <Splash onDone={s.finishSplash} />}
        {s.stage === "intro" && <Intro onDone={s.finishIntro} />}
        {s.stage === "login" && <Login onLogin={s.login} />}
        {s.stage === "onboarding" && (
          <Onboarding onComplete={s.finishOnboarding} onSkip={s.skipOnboarding} />
        )}
        {s.stage === "app" && <AppShell />}

        {/* 전역 토스터 — stage 전환(로그아웃 등)에도 살아남도록 셸 루트에 둠 */}
        <Toaster />
      </div>
    </div>
  );
}
