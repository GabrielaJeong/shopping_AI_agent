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
import { MoodyfitLogo } from "@/components/brand";
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
    // 일반 블록 스크롤(flex-col 아님!) — flex-col이면 긴 옵션 영역이 0으로 수축돼 안 보인다.
    // position static 유지 → 하단 CTA(absolute)가 프레임 바닥에 핀. pb-[120px]로 CTA 가림 방지.
    <div className="h-full overflow-y-auto px-5 pt-[54px] pb-[120px] [scrollbar-width:none]">
      {/* 상단 바 (back / STEP / 건너뛰기) */}
      <div className="flex items-center justify-between pt-2 pb-1">
        <button
          type="button"
          onClick={goBack}
          aria-label="이전"
          className="-ml-1.5 flex size-[38px] cursor-pointer items-center justify-center rounded-full text-ink hover:bg-paper-3"
        >
          <Icon name="back" size={22} />
        </button>
        <span className="text-label text-ink-2 uppercase">STEP {stepIndex + 1} / 5</span>
        <button
          type="button"
          onClick={onSkip}
          className="cursor-pointer px-3 text-caption font-medium text-ink-3"
        >
          건너뛰기
        </button>
      </div>

      {/* 진행 바 — 헤더 아래 */}
      <div className="mt-2 mb-6 h-[3px] overflow-hidden rounded-full bg-paper-3">
        <div
          className="h-full rounded-full bg-ink transition-[width] duration-500"
          style={{ width: `${((stepIndex + 1) / ONBOARDING_STEPS.length) * 100}%` }}
        />
      </div>

      {/* 타이틀 (display) */}
      <div key={`t-${stepIndex}`} className="animate-fade-up mb-6">
        <h1 className="text-display text-ink">{step.title}</h1>
        <p className="text-body-2 mt-2 text-ink-2">{step.subtitle}</p>
      </div>

      {/* 옵션 */}
      <div key={`o-${stepIndex}`} className="animate-fade-up">
        <StepOptions step={step} selected={selected} onToggle={toggle} />
      </div>

      {/* CTA — 하단 고정 그라데이션 바(정본 14/20/30, 프레임 바닥 핀). 바는 클릭 통과, 버튼만 활성. */}
      <div className="absolute right-0 bottom-0 left-0 z-[7] px-5 pt-[14px] pb-[30px] [background:linear-gradient(to_top,var(--color-paper)_62%,transparent)] [pointer-events:none]">
        <Button
          variant="primary"
          size="lg"
          block
          disabled={!met}
          onClick={goNext}
          className="[pointer-events:auto]"
        >
          {isLast ? "취향 분석 시작" : "다음"}
          <Icon name="arrow-right" size={16} />
        </Button>
        <p className="mt-2 text-center text-caption text-ink-3">
          {selected.length > 0
            ? `${selected.length}개 선택됨${step.multi ? ` · 최소 ${step.min}개` : ""}`
            : step.multi
              ? `최소 ${step.min}개 선택해주세요`
              : "하나 선택해주세요"}
        </p>
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
  // 텍스트 칩: 정본 커스텀 버튼(13×18·r8·13.5px). 일반 Chip(6/10)보다 큼.
  if (step.kind === "chip") {
    return (
      <div className="flex flex-wrap gap-2">
        {step.options.map((o) => {
          const on = selected.includes(o.id);
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(o.id)}
              className={cn(
                "rounded-btn px-[18px] py-[13px] text-[13.5px] font-medium transition-colors",
                on ? "bg-ink text-paper" : "bg-paper-2 text-ink",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    );
  }

  // 컬러 스와치: aspect 1/1, gap 10, r8, 라벨 아래.
  if (step.kind === "color") {
    return (
      <div className="grid grid-cols-2 gap-2.5">
        {step.options.map((o) => {
          const on = selected.includes(o.id);
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(o.id)}
              className="cursor-pointer text-left"
            >
              <span
                className={cn(
                  "relative block aspect-square w-full overflow-hidden rounded-btn ring-inset transition",
                  on && "ring-2 ring-ink",
                )}
                style={{ background: o.swatch }}
              >
                {on && (
                  <span className="absolute top-2 right-2 flex size-[22px] items-center justify-center rounded-full bg-ink text-paper">
                    <Icon name="check" size={13} />
                  </span>
                )}
              </span>
              <span className={cn("mt-2 block pl-0.5 text-[13px] text-ink", on && "font-semibold")}>
                {o.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // 이미지 카드: aspect 3/4·gap 10·r8, 좌상단 태그 + 하단 그라데이션 라벨 + 선택 badge 22.
  const tag = step.key === "category" ? "ITEM" : "MOOD";
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {step.options.map((o) => {
        const on = selected.includes(o.id);
        return (
          <button key={o.id} type="button" aria-pressed={on} onClick={() => onToggle(o.id)}>
            <span
              className={cn(
                "relative block aspect-[3/4] overflow-hidden rounded-btn ring-inset transition",
                on && "ring-2 ring-ink",
              )}
              style={{ background: STRIPE }}
            >
              <span className="absolute top-2 left-2 text-[9px] tracking-[0.08em] text-ink-3">
                {tag}
              </span>
              <span className="absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgba(58,54,51,0.16))] px-2.5 pt-5 pb-[9px] text-left">
                <span className="text-[13.5px] font-semibold text-ink">{o.label}</span>
              </span>
              {on && (
                <span className="absolute top-2 right-2 flex size-[22px] items-center justify-center rounded-full bg-ink text-paper">
                  <Icon name="check" size={13} />
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── welcome ─── */
function Welcome({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto px-5 pt-[54px] pb-[30px] [scrollbar-width:none]">
      <div className="flex items-center justify-between pt-3">
        <MoodyfitLogo size={17} gap={8} />
        <button
          type="button"
          onClick={onSkip}
          className="cursor-pointer px-1.5 text-caption font-medium text-ink-3"
        >
          둘러보기
        </button>
      </div>

      {/* 룩북 플레이스홀더 히어로 (4/5, LOOKBOOK 라벨 + 무드 칩) */}
      <div
        className="animate-fade-up relative mt-[18px] aspect-[4/5] w-full overflow-hidden rounded-[14px]"
        style={{ background: STRIPE }}
      >
        <span className="absolute top-3 left-3 text-[9.5px] tracking-[0.1em] text-ink-3">
          LOOKBOOK · 1080×1350
        </span>
        <div className="absolute bottom-3 left-3 flex gap-1">
          {["미니멀", "베이지", "내추럴"].map((t) => (
            <span
              key={t}
              className="rounded-chip bg-paper/90 px-2 py-1 text-[10px] font-medium text-ink"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

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

  const r = 63;
  const circ = 2 * Math.PI * r;
  const status =
    ANALYZING_STATUS[Math.min(ANALYZING_STATUS.length - 1, Math.floor((pct / 100) * 3))];

  return (
    <div className="flex h-full flex-col items-center justify-center gap-7 px-5 pb-[60px]">
      <div className="relative size-[132px]">
        <svg width="132" height="132" viewBox="0 0 132 132" className="-rotate-90">
          <circle cx="66" cy="66" r={r} fill="none" stroke="var(--color-paper-3)" strokeWidth="6" />
          <circle
            cx="66"
            cy="66"
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
          <span className="text-[26px] font-bold text-ink">{pct}%</span>
        </div>
        {/* 링을 도는 스파클(정본 ob-spin: 22 원 + 흰 sparkle). reduced-motion 전역 가드로 정지. */}
        <div className="absolute inset-0 animate-[spin_6s_linear_infinite]">
          <span className="absolute -top-[2px] left-1/2 flex size-[22px] -translate-x-1/2 items-center justify-center rounded-full bg-ink text-paper">
            <Icon name="sparkle" size={12} />
          </span>
        </div>
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
    <div className="h-full overflow-y-auto px-5 pt-[54px] pb-[120px] [scrollbar-width:none]">
      <div className="animate-fade-up mt-7">
        <span className="mb-[18px] flex size-[52px] items-center justify-center rounded-full bg-ink text-paper">
          <Icon name="check" size={26} />
        </span>
        <h1 className="text-display text-ink">취향 분석 완료!</h1>
        <p className="text-body-2 mt-2 text-ink-2">
          {name}님의 취향을 이렇게 파악했어요. 이 기준으로 추천을 시작할게요.
        </p>
      </div>

      {/* 취향 키워드 카드 (매치% 는 표시용 더미) */}
      <div className="animate-fade-up mt-6 grid grid-cols-2 gap-2.5">
        {top.map((t, i) => {
          const match = DUMMY_MATCH[i] ?? 80;
          return (
            <div key={t.tag} className="rounded-card bg-paper-2 px-3.5 pt-3.5 pb-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[14px] font-semibold tracking-[-0.3px] text-ink">
                  {t.tag}
                </span>
                <span className="text-[11px] text-ink-2">{match}%</span>
              </div>
              <div className="mt-2.5 h-[5px] overflow-hidden rounded-full bg-paper-3">
                <div
                  className="h-full rounded-full bg-ink transition-[width] duration-700 ease-out"
                  style={{ width: revealed ? `${match}%` : "0%" }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="animate-fade-up mt-6 flex items-center gap-2.5 rounded-card bg-accent-soft p-3.5">
        <Icon name="sparkle" size={16} color="var(--color-ink)" />
        <p className="text-body-2 text-ink">
          이 취향에 맞춰 <strong className="font-semibold">오늘의 픽</strong>을 준비했어요. 보면서
          좋아요로 알려주면 더 정확해져요.
        </p>
      </div>

      {/* CTA — 하단 고정 그라데이션 바 */}
      <div className="absolute right-0 bottom-0 left-0 z-[7] px-5 pt-[14px] pb-[30px] [background:linear-gradient(to_top,var(--color-paper)_62%,transparent)]">
        <Button variant="primary" size="lg" block onClick={onComplete}>
          내게 꼭 맞는 추천템 보러가기
          <Icon name="arrow-right" size={16} />
        </Button>
      </div>
    </div>
  );
}
