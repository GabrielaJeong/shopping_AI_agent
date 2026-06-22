"use client";

/*
  Intro — 로그인 전 3가지 핵심 가치 소개 캐러셀.
  구조 참고: launch.jsx (Intro). 카피·구성은 디자인 정본(README §2). 숫자 kicker는 쓰지 않음(클린).
  mock 비주얼은 실제 기능(피드백 시트·Saved 등)의 미니어처 — 같은 프리미티브로 축소 재현.
*/

import { useState } from "react";
import { Icon, type IconName } from "@/components/icon";
import { MoodyfitLogo, MoodyfitMark } from "@/components/brand";
import { ProductImg } from "@/components/product-img";
import { Button } from "@/components/ui/button";
import { byId } from "@/data";
import type { Product } from "@/types";

function MiniFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-paper-2 p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <MoodyfitMark size={16} />
          <span className="text-xs font-semibold tracking-[-0.2px]">{label}</span>
        </div>
        <div className="flex gap-1">
          <span className="size-[5px] rounded-full bg-ink-soft" />
          <span className="size-[5px] rounded-full bg-ink-soft" />
          <span className="size-[5px] rounded-full bg-ink-soft" />
        </div>
      </div>
      {children}
    </div>
  );
}

/** 추천 미니 목업: AI 버블 + 매치% 썸네일 2개. */
function MockReco() {
  const items = [byId("p01"), byId("p04")].filter(Boolean) as Product[];
  return (
    <MiniFrame label="오늘의 픽">
      <div className="rounded-[14px_14px_14px_4px] bg-ink px-3.5 py-3 text-xs leading-relaxed text-paper">
        <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.08em] text-paper-3 uppercase">
          <span className="size-[5px] rounded-full bg-paper" />
          AI · 큐레이션
        </div>
        내추럴·베이지 무드로 골라봤어요
      </div>
      <div className="mt-3 flex gap-2">
        {items.map((p) => (
          <div key={p.id} className="flex-1">
            <ProductImg colors={p.img} shape="tall" />
            <div className="mt-1.5 text-[11px] font-medium">{p.name.slice(0, 9)}</div>
            <div className="text-[10px] text-ink-3">AI {p.match}% 매치</div>
          </div>
        ))}
      </div>
    </MiniFrame>
  );
}

/** 피드백 학습 미니 목업: 썸네일 + 학습 바 + 4버튼. */
function MockFeedback() {
  const p = byId("p02");
  const acts: { icon: IconName; label: string; on?: boolean }[] = [
    { icon: "heart-fill", label: "좋아요", on: true },
    { icon: "thumbs-down", label: "별로" },
    { icon: "shuffle", label: "비슷한" },
    { icon: "bookmark", label: "저장" },
  ];
  return (
    <MiniFrame label="피드백 학습">
      <div className="flex gap-2.5">
        {p && (
          <div className="w-[90px] shrink-0">
            <ProductImg colors={p.img} shape="tall" />
          </div>
        )}
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="text-xs font-semibold">이 추천, 어떠세요?</div>
          <div className="h-[5px] overflow-hidden rounded-full bg-paper-3">
            <div className="h-full w-[64%] rounded-full bg-ink" />
          </div>
          <div className="text-[10px] text-ink-2">취향 학습 +8% → 64%</div>
        </div>
      </div>
      <div className="mt-3 flex gap-1.5">
        {acts.map((a) => (
          <div
            key={a.label}
            className={`flex flex-1 flex-col items-center gap-1 rounded-btn py-2 ${
              a.on ? "bg-ink text-paper" : "bg-paper-3 text-ink"
            }`}
          >
            <Icon name={a.icon} size={15} />
            <span className="text-[9px]">{a.label}</span>
          </div>
        ))}
      </div>
    </MiniFrame>
  );
}

/** 찜·컬렉션 미니 목업: AI 컬렉션 제안 카드 + 3-up 그리드. */
function MockSaved() {
  const items = [byId("p01"), byId("p04"), byId("p07")].filter(Boolean) as Product[];
  return (
    <MiniFrame label="찜 · 컬렉션">
      <div className="mb-3 rounded-card bg-ink p-3 text-paper">
        <div className="mb-1.5 flex items-center gap-1.5">
          <Icon name="sparkle" size={12} className="text-paper-3" />
          <span className="text-[10px] text-paper-3">AI 컬렉션 제안</span>
        </div>
        <div className="text-[13px] font-semibold">&ldquo;베이지 데일리&rdquo;로 묶을까요?</div>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {items.map((p) => (
          <ProductImg key={p.id} colors={p.img} shape="square" />
        ))}
      </div>
    </MiniFrame>
  );
}

interface Slide {
  title: string;
  body: string;
  mock: React.ReactNode;
}

const SLIDES: Slide[] = [
  {
    title: "취향을 아는\n추천",
    body: "고른 무드를 학습해, 매일 당신만을 위한 옷을 골라드려요.",
    mock: <MockReco />,
  },
  {
    title: "쓸수록\n정확해져요",
    body: "좋아요·별로예요 한 번이면 취향에 바로 반영돼요.",
    mock: <MockFeedback />,
  },
  {
    title: "찜하고,\nAI가 정리해요",
    body: "저장한 옷을 무드별 컬렉션으로 알아서 묶어드려요.",
    mock: <MockSaved />,
  },
];

export function Intro({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const last = i === SLIDES.length - 1;
  const slide = SLIDES[i];

  return (
    <div className="flex h-full flex-col overflow-y-auto px-5 pt-[54px] pb-[30px] [scrollbar-width:none]">
      {/* 상단 바 */}
      <div className="flex items-center justify-between pt-3">
        <MoodyfitLogo size={17} gap={8} />
        <button
          type="button"
          onClick={onDone}
          className="cursor-pointer px-1.5 text-caption font-medium text-ink-3"
        >
          건너뛰기
        </button>
      </div>

      {/* mock 비주얼 (슬라이드 전환 시 재진입 애니메이션) */}
      <div key={`m-${i}`} className="mt-5">
        <div className="animate-fade-up">{slide.mock}</div>
      </div>

      {/* 카피 */}
      <div key={`c-${i}`} className="mt-6">
        <div className="animate-fade-up">
          <h1
            className="font-bold whitespace-pre-line text-ink"
            style={{ fontSize: 28, lineHeight: 1.25, letterSpacing: "-0.9px" }}
          >
            {slide.title}
          </h1>
          <p className="mt-3 text-ink-2" style={{ fontSize: 14, lineHeight: 1.6 }}>
            {slide.body}
          </p>
        </div>
      </div>

      <div className="mt-auto" />

      {/* 점 인디케이터 + CTA */}
      <div className="pt-5">
        <div className="mb-4 flex justify-center gap-1.5">
          {SLIDES.map((_, k) => (
            <span
              key={k}
              className={`h-1.5 rounded-full transition-all ${
                k === i ? "w-[18px] bg-ink" : "w-1.5 bg-ink-soft"
              }`}
            />
          ))}
        </div>
        <Button
          variant="primary"
          size="lg"
          block
          onClick={() => (last ? onDone() : setI((v) => v + 1))}
        >
          {last ? "시작하기" : "다음"}
          <Icon name="arrow-right" size={16} />
        </Button>
      </div>
    </div>
  );
}
