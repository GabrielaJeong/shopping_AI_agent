"use client";

/*
  Onboarding — 5단계 취향 퀴즈 (PRD F1: 취향 벡터 시드).
  이 화면의 본질은 UI가 아니라 "선택 → 취향 벡터 생성·저장"이다.
  - 선택 결과는 buildTasteProfile(lib/taste-vector)로 취향 프로필(벡터+예산)로 변환.
  - 저장은 onComplete(profile) → app-state.finishOnboarding → persistence(mock). (localStorage 직접 호출 X)
  - 건너뛰기는 onSkip → 빈 벡터로 app(콜드스타트, D-005).

  내부 phase: welcome → step 0..4 → analyzing(연출) → summary.
  구조 참고: onboarding.jsx / README §4.
*/

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { buildTasteProfile, topTasteTags } from "@/lib/taste-vector";
import {
  ANALYZING_STATUS,
  ONBOARDING_STEPS,
  ONBOARDING_WELCOME,
  type OnboardingStep,
  type StepKey,
} from "@/data/onboarding";
import type { TasteProfile } from "@/types";

const STRIPE = "repeating-linear-gradient(135deg, #ece6d6 0 7px, #f4eee0 7px 14px)";

/** ⚠️ summary 카드의 매치%는 표시용 더미 — 실제 매치는 추천 엔진(PRD F3)이 계산할 자리. */
const DUMMY_MATCH = [96, 93, 90, 87];

type Phase = "welcome" | number | "analyzing" | "summary";

const emptySelections = (): Record<StepKey, string[]> => ({
  mood: [],
  budget: [],
  category: [],
  color: [],
  lifestyle: [],
});

export function Onboarding({
  onComplete,
  onSkip,
}: {
  onComplete: (profile: TasteProfile) => void;
  onSkip: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [selections, setSelections] = useState<Record<StepKey, string[]>>(emptySelections);

  const profile = useMemo(() => buildTasteProfile(selections), [selections]);

  if (phase === "welcome") {
    return <Welcome onStart={() => setPhase(0)} onSkip={onSkip} />;
  }
  if (phase === "analyzing") {
    return <Analyzing onDone={() => setPhase("summary")} />;
  }
  if (phase === "summary") {
    return <Summary profile={profile} onComplete={() => onComplete(profile)} />;
  }

  // ── step phase (number) ──
  const stepIndex = phase;
  const step = ONBOARDING_STEPS[stepIndex];
  const selected = selections[step.key];
  const met = selected.length >= step.min;
  const isLast = stepIndex === ONBOARDING_STEPS.length - 1;

  const toggle = (id: string) => {
    setSelections((prev) => {
      const cur = prev[step.key];
      if (!step.multi) return { ...prev, [step.key]: [id] };
      return {
        ...prev,
        [step.key]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
      };
    });
  };

  const goBack = () => setPhase(stepIndex === 0 ? "welcome" : stepIndex - 1);
  const goNext = () => setPhase(isLast ? "analyzing" : stepIndex + 1);

  return (
    <div className="flex min-h-dvh flex-col px-5 pt-[54px] pb-[30px]">
      {/* 상단 바 */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={goBack}
          aria-label="이전"
          className="-ml-1.5 flex size-9 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-paper-3"
        >
          <Icon name="back" size={22} />
        </button>
        <span className="text-label text-ink-2 uppercase">STEP {stepIndex + 1} / 5</span>
        <button
          type="button"
          onClick={onSkip}
          className="cursor-pointer px-1.5 text-caption font-medium text-ink-3"
        >
          건너뛰기
        </button>
      </div>

      {/* 진행 바 */}
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-paper-3">
        <div
          className="h-full rounded-full bg-ink transition-[width] duration-500"
          style={{ width: `${((stepIndex + 1) / ONBOARDING_STEPS.length) * 100}%` }}
        />
      </div>

      {/* 타이틀 */}
      <div key={`t-${stepIndex}`} className="animate-fade-up mt-6">
        <h1 className="text-h1 text-ink">{step.title}</h1>
        <p className="text-body-2 mt-1 text-ink-2">{step.subtitle}</p>
      </div>

      {/* 옵션 */}
      <div key={`o-${stepIndex}`} className="animate-fade-up mt-5">
        <StepOptions step={step} selected={selected} onToggle={toggle} />
      </div>

      <div className="mt-auto" />

      {/* 카운트 + CTA */}
      <div className="pt-5">
        <p className="mb-3 text-center text-caption text-ink-3">
          선택 {selected.length}개{step.multi ? ` · 최소 ${step.min}개` : ""}
        </p>
        <Button variant="primary" size="lg" block disabled={!met} onClick={goNext}>
          {isLast ? "취향 분석 시작" : "다음"}
          {!isLast && <Icon name="arrow-right" size={16} />}
        </Button>
      </div>
    </div>
  );
}

/* ─── 옵션 렌더 ─── */
function StepOptions({
  step,
  selected,
  onToggle,
}: {
  step: OnboardingStep;
  selected: string[];
  onToggle: (id: string) => void;
}) {
  if (step.kind === "chip") {
    return (
      <div className="flex flex-wrap gap-2">
        {step.options.map((o) => (
          <Chip
            key={o.id}
            variant={selected.includes(o.id) ? "selected" : "default"}
            size="md"
            aria-pressed={selected.includes(o.id)}
            onClick={() => onToggle(o.id)}
          >
            {o.label}
          </Chip>
        ))}
      </div>
    );
  }

  if (step.kind === "color") {
    return (
      <div className="grid grid-cols-2 gap-3">
        {step.options.map((o) => {
          const on = selected.includes(o.id);
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(o.id)}
              className="flex cursor-pointer flex-col gap-2"
            >
              <span
                className={cn(
                  "h-16 w-full rounded-image ring-inset transition",
                  on ? "ring-2 ring-ink" : "ring-1 ring-line",
                )}
                style={{ background: o.swatch }}
              />
              <span className={cn("text-body-2", on ? "font-semibold text-ink" : "text-ink-2")}>
                {o.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // image: 룩북 스트라이프 플레이스홀더(실제 사진 전) + 선택 체크
  return (
    <div className="grid grid-cols-2 gap-3">
      {step.options.map((o) => {
        const on = selected.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(o.id)}
            className={cn(
              "relative flex aspect-[4/3] cursor-pointer items-end overflow-hidden rounded-card p-3 ring-inset transition",
              on ? "ring-2 ring-ink" : "ring-1 ring-line",
            )}
            style={{ background: STRIPE }}
          >
            <span className={cn("text-h3", on ? "text-ink" : "text-ink-2")}>{o.label}</span>
            {on && (
              <span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-ink text-paper">
                <Icon name="check" size={14} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ─── welcome ─── */
function Welcome({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
  return (
    <div className="flex min-h-dvh flex-col px-5 pt-[54px] pb-[30px]">
      <div className="flex items-center justify-end pt-2">
        <button
          type="button"
          onClick={onSkip}
          className="cursor-pointer px-1.5 text-caption font-medium text-ink-3"
        >
          둘러보기
        </button>
      </div>

      {/* 룩북 플레이스홀더 히어로 */}
      <div
        className="animate-fade-up mt-4 h-56 w-full rounded-card ring-1 ring-line ring-inset"
        style={{ background: STRIPE }}
      />

      <div className="animate-fade-up mt-7">
        <h1
          className="font-bold whitespace-pre-line text-ink"
          style={{ fontSize: 27, lineHeight: 1.3, letterSpacing: "-0.8px" }}
        >
          {ONBOARDING_WELCOME.title}
        </h1>
        <p className="text-body-2 mt-3 text-ink-2">{ONBOARDING_WELCOME.body}</p>
      </div>

      <div className="mt-auto" />

      <div className="pt-5">
        <Button variant="primary" size="lg" block onClick={onStart}>
          {ONBOARDING_WELCOME.cta}
          <Icon name="arrow-right" size={16} />
        </Button>
        <p className="mt-3 text-center text-caption text-ink-3">{ONBOARDING_WELCOME.caption}</p>
      </div>
    </div>
  );
}

/* ─── analyzing (연출) ───
   실제 분석이 아니라 진행 연출이다. 나중에 진짜 취향 벡터 생성 / 추천 준비 단계로 대체될 자리. */
function Analyzing({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const dur = 2400;
    const id = window.setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / dur);
      setPct(Math.round(t * 100));
      if (t >= 1) {
        window.clearInterval(id);
        onDone();
      }
    }, 40);
    return () => window.clearInterval(id);
  }, [onDone]);

  const r = 52;
  const circ = 2 * Math.PI * r;
  const status =
    ANALYZING_STATUS[Math.min(ANALYZING_STATUS.length - 1, Math.floor((pct / 100) * 3))];

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-7 px-5">
      <div className="relative size-[140px]">
        <svg width="140" height="140" viewBox="0 0 120 120" className="-rotate-90">
          <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-paper-3)" strokeWidth="6" />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - pct / 100)}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-h2 text-ink">{pct}%</span>
        </div>
        <span className="absolute -top-1 right-3 text-ink">
          <Icon name="sparkle" size={20} />
        </span>
      </div>
      <p className="text-body text-ink-2">{status}</p>
    </div>
  );
}

/* ─── summary ─── */
function Summary({ profile, onComplete }: { profile: TasteProfile; onComplete: () => void }) {
  // TODO: 이름은 추후 인증 사용자 정보에서. 지금은 일반 호칭.
  const name = "회원";
  const top = topTasteTags(profile.vector, 4);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setRevealed(true), 80);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col px-5 pt-[54px] pb-[30px]">
      <div className="animate-fade-up mt-6 flex flex-col items-center text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-ink text-paper">
          <Icon name="check" size={26} />
        </span>
        <h1 className="text-h1 mt-4 text-ink">취향 분석 완료!</h1>
        <p className="text-body-2 mt-2 text-ink-2">{name}님의 취향을 이렇게 파악했어요.</p>
      </div>

      {/* 취향 키워드 카드 (매치% 는 표시용 더미) */}
      <div className="animate-fade-up mt-7 grid grid-cols-2 gap-3">
        {top.map((t, i) => {
          const match = DUMMY_MATCH[i] ?? 80;
          return (
            <div key={t.tag} className="rounded-card bg-paper-2 p-3.5 shadow-card">
              <div className="flex items-baseline justify-between">
                <span className="text-h3 text-ink">{t.tag}</span>
                <span className="text-caption text-ink-2">AI {match}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper-3">
                <div
                  className="h-full rounded-full bg-ink transition-[width] duration-700 ease-out"
                  style={{ width: revealed ? `${match}%` : "0%" }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="animate-fade-up mt-4 rounded-card bg-accent-soft p-3.5">
        <p className="text-body-2 text-ink">
          오늘의 픽부터 이 취향을 반영해 보여드릴게요. 쓸수록 더 정확해져요.
        </p>
      </div>

      <div className="mt-auto" />

      <div className="pt-5">
        <Button variant="primary" size="lg" block onClick={onComplete}>
          내게 꼭 맞는 추천템 보러가기
          <Icon name="arrow-right" size={16} />
        </Button>
      </div>
    </div>
  );
}
