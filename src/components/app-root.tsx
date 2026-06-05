"use client";

/*
  AppRoot — 단일 루트 상태 머신 렌더러 (D-009).
  현재: Splash 실제 구현 + 나머지 스테이지(intro/login/onboarding/app)는 전이 검증용 플레이스홀더.
  다음 단계에서 각 플레이스홀더를 실제 화면으로 대체한다.
*/

import { useAppState } from "@/lib/app-state";
import { Splash } from "@/components/screens/splash";
import { Intro } from "@/components/screens/intro";
import { Login } from "@/components/screens/login";
import { Onboarding } from "@/components/screens/onboarding";
import { MudifitLogo } from "@/components/brand";
import { Button } from "@/components/ui/button";

/** 모바일 셸 위에 올라가는 임시 스테이지 화면. (54px 상단 safe-area) */
function StagePlaceholder({
  stage,
  caption,
  children,
}: {
  stage: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col px-5 pt-[54px] pb-8">
      <div className="mt-8">
        <MudifitLogo size={20} />
      </div>
      <div className="mt-10 flex flex-col gap-1">
        <span className="text-label text-ink-3 uppercase">stage · {stage}</span>
        <h1 className="text-h1 text-ink">{caption}</h1>
        <p className="text-body-2 text-ink-2">
          이 화면은 상태 머신 전이를 확인하는 임시 플레이스홀더입니다. 곧 실제 화면으로 대체됩니다.
        </p>
      </div>
      <div className="mt-auto flex flex-col gap-2">{children}</div>
    </div>
  );
}

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

      {s.stage === "app" && (
        <StagePlaceholder stage="app" caption={s.onboarded ? "홈 (온보딩 완료)" : "홈 (게스트)"}>
          <p className="text-caption text-ink-3">
            취향 태그 {Object.keys(s.tasteProfile.vector).length}개
            {s.tasteProfile.budget ? ` · 예산 ${s.tasteProfile.budget}` : ""} · onboarded ={" "}
            {String(s.onboarded)}
          </p>
          <p className="text-caption text-ink-3">
            (빈 벡터여도 앱은 깨지지 않음 — 콜드스타트 D-005)
          </p>
          <Button variant="neutral" block onClick={s.resetOnboarding}>
            취향 다시 설정하기
          </Button>
          <Button variant="ghost" block onClick={s.logout}>
            로그아웃
          </Button>
        </StagePlaceholder>
      )}
    </div>
  );
}
