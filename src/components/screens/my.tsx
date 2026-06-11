"use client";

/*
  My(마이) 탭 — 취향 학습 현황 + 설정. 구조 참고: mypage.jsx / README §8.
  핵심: 취향 키워드 바는 **실제 tasteProfile.vector**를 읽어 보여준다(화면용 가짜 숫자 아님).
  피드백 시트가 "방금 반영"이면 여기는 "누적된 취향"의 표면 — 같은 취향 벡터를 읽는 F6의 다른 면.
  ⚠️ 학습 링 %·추세(LEARN_TREND)는 현재 더미 — 이후 학습률 산출이 들어올 자리.
  ⚠️ 키워드별 델타(학습 추세)도 아직 미추적 — 이후 F6 델타 누적으로.
*/

import { useState } from "react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/lib/app-state";
import { useAppShell } from "@/lib/app-shell-state";
import { topTasteTags } from "@/lib/taste-vector";
import { LEARN_TREND } from "@/data";

export function My() {
  const app = useAppState();
  const shell = useAppShell();
  const [notify, setNotify] = useState(true);

  const keywords = topTasteTags(app.tasteProfile.vector, 6); // 실제 취향 벡터
  const overall = LEARN_TREND[LEARN_TREND.length - 1]; // ⚠️ 더미(학습률 산출 자리)

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 bg-paper px-5 pt-[56px] pb-3">
        <h1 className="text-h1 text-ink">마이</h1>
      </header>

      <div className="flex flex-col gap-7 px-5 pb-4">
        {/* 취향 학습 링 (전체 %) */}
        <section className="flex items-center gap-5">
          <Ring percent={overall} />
          <div className="flex flex-col gap-1">
            <span className="text-label text-ink-2 uppercase">취향 학습</span>
            <span className="text-h2 text-ink">{overall}% 학습됨</span>
            <Sparkline data={LEARN_TREND} />
          </div>
        </section>

        {/* 취향 키워드 바 — 실제 tasteProfile */}
        <section className="flex flex-col gap-3">
          <span className="text-label text-ink-2 uppercase">내 취향 키워드</span>
          {keywords.length === 0 ? (
            <div className="flex flex-col gap-2 rounded-card bg-paper-2 p-4">
              <p className="text-body-2 text-ink-2">아직 학습된 취향이 없어요.</p>
              <Button variant="primary" onClick={app.resetOnboarding}>
                취향 알려주기
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {keywords.map((k) => (
                <button
                  key={k.tag}
                  type="button"
                  onClick={() => shell.openList({ title: k.tag, keyword: k.tag })}
                  className="grid grid-cols-[72px_1fr_36px] items-center gap-2.5 rounded-btn px-1 py-1 text-left hover:bg-paper-3"
                >
                  <span className="text-body-2 font-medium text-ink">{k.tag}</span>
                  <span className="h-1.5 overflow-hidden rounded-full bg-paper-3">
                    <span
                      className="block h-full rounded-full bg-ink"
                      style={{ width: `${Math.round(k.weight * 100)}%` }}
                    />
                  </span>
                  <span className="text-right text-[11px] font-medium text-ink-2">
                    {Math.round(k.weight * 100)}%
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* 설정 */}
        <section className="flex flex-col">
          <span className="text-label mb-1 text-ink-2 uppercase">설정</span>
          <Row
            label="알림"
            trailing={
              <button
                type="button"
                role="switch"
                aria-checked={notify}
                onClick={() => setNotify((v) => !v)}
                className={`relative h-6 w-10 rounded-full transition-colors ${notify ? "bg-ink" : "bg-ink-soft"}`}
              >
                <span
                  className={`absolute top-0.5 size-5 rounded-full bg-paper transition-all ${notify ? "left-[18px]" : "left-0.5"}`}
                />
              </button>
            }
          />
          <Row label="계정" onClick={() => undefined} chevron />
          <Row label="취향 다시 설정하기" onClick={app.resetOnboarding} chevron />
          <Row label="로그아웃" onClick={app.logout} danger />
        </section>
      </div>
    </div>
  );
}

function Row({
  label,
  onClick,
  trailing,
  chevron = false,
  danger = false,
}: {
  label: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
  chevron?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick && !trailing}
      className="flex items-center justify-between border-b border-line-soft py-3.5 text-left last:border-0"
    >
      <span className={`text-body ${danger ? "text-hot" : "text-ink"}`}>{label}</span>
      {trailing ?? (chevron && <Icon name="chevron-right" size={18} color="var(--color-ink-3)" />)}
    </button>
  );
}

/* 취향 학습 링. ⚠️ percent는 현재 더미. */
function Ring({ percent }: { percent: number }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  return (
    <svg width="76" height="76" viewBox="0 0 76 76" className="shrink-0 -rotate-90">
      <circle cx="38" cy="38" r={r} fill="none" stroke="var(--color-paper-3)" strokeWidth="6" />
      <circle
        cx="38"
        cy="38"
        r={r}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - percent / 100)}
      />
    </svg>
  );
}

/* 학습 추세 스파크라인. ⚠️ 더미 데이터(LEARN_TREND). */
function Sparkline({ data }: { data: number[] }) {
  const w = 120;
  const h = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / span) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} className="mt-1">
      <polyline
        points={pts}
        fill="none"
        stroke="var(--color-ink-3)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
