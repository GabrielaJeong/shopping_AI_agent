"use client";

/*
  My(마이페이지) 탭 — 프로필 + AI 학습 현황 + 취향 키워드 + 설정. 구조·충실도: mypage.jsx / README §8.
  핵심: 취향 키워드 바는 **실제 tasteProfile.vector**를 읽는다(가짜 숫자 아님). 정본 My는 델타 미표시(showDelta=false).
  ⚠️ 더미(F2~F6가 채울 자리, D-002): 학습률(%)·피드백 수·좋아요/별로예요 카운트는 아직 미추적 →
     정적 더미로 표시(기존 LEARN_TREND 더미와 동일 성격). 저장 수만 실제(savedIds). 키워드 델타도 F6 보류.
  레이아웃 값(정본): 프로필 22/20·r12 · 학습카드 18·r12 · 설정행 14/16·r8 · 좌우 20 · 섹션 간 mt-32.
*/

import { Icon, type IconName } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { TasteBars } from "@/components/taste-bars";
import { useAppState } from "@/lib/app-state";
import { useAppShell } from "@/lib/app-shell-state";
import { useToast } from "@/lib/toast";
import { topTasteTags } from "@/lib/taste-vector";
import { LEARN_TREND } from "@/data";

// TODO: 이름/이메일/아바타는 추후 인증 사용자 정보에서. 지금은 게스트 호칭.
const NAME = "회원";

export function My() {
  const app = useAppState();
  const shell = useAppShell();
  const { toast } = useToast();

  const onReset = () => {
    toast("취향을 다시 설정할게요");
    app.resetOnboarding();
  };
  const onLogout = () => {
    toast("로그아웃됐어요");
    app.logout();
  };

  const keywords = topTasteTags(app.tasteProfile.vector, 6); // 실제 취향 벡터
  const savedCount = shell.savedIds.length; // 실제

  // ⚠️ 더미 — F6(취향 변화/신호 추적) 들어오면 실제값으로 교체.
  const learningPct = LEARN_TREND[LEARN_TREND.length - 1];
  const feedbackCount = 36;
  const likeCount = 28;
  const dislikeCount = 8;

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 bg-paper px-5 pt-[70px] pb-5">
        <h1 className="text-h1 text-ink">마이페이지</h1>
      </header>

      <div className="flex flex-col px-5 pb-6">
        {/* 프로필 카드 */}
        <button
          type="button"
          onClick={() => toast("프로필 편집은 준비 중이에요")}
          className="flex items-center gap-4 rounded-[12px] bg-paper-2 px-5 py-[22px] text-left"
        >
          <span className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-accent-soft text-[20px] font-semibold tracking-[-0.4px] text-ink">
            {NAME.slice(0, 1)}
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="text-h3 text-ink">{NAME}</span>
            <span className="text-caption mt-1 text-ink-3">프로필을 완성해 보세요</span>
          </span>
          <Icon name="chevron-right" size={18} color="var(--color-ink-3)" />
        </button>

        {/* AI 학습 카드 (다크) — 수치는 더미(저장만 실제) */}
        <div className="mt-2 rounded-[12px] bg-ink p-[18px] text-paper">
          <div className="flex items-center gap-4">
            <LearningRingDark value={learningPct / 100} />
            <div className="flex flex-1 flex-col gap-1">
              <span className="text-h2 text-paper">취향 학습 중</span>
              <span className="text-body-2 leading-relaxed text-paper-3">
                피드백을 {feedbackCount}번 주셨어요.
                <br />
                계속 학습하고 있어요.
              </span>
            </div>
          </div>
          <div className="mt-4 flex gap-4 border-t border-paper/12 pt-[14px]">
            <Stat n={likeCount} label="좋아요" />
            <Stat n={dislikeCount} label="별로예요" />
            <Stat n={savedCount} label="저장" />
          </div>
        </div>

        {/* 취향 키워드 — 실제 벡터, 델타는 F6 보류(정본 My도 미표시) */}
        <section className="mt-8 flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-h2 text-ink">내 취향 키워드</h2>
            <button
              type="button"
              onClick={() => toast("취향 키워드 편집은 준비 중이에요")}
              className="text-[12px] font-medium text-ink-2"
            >
              편집
            </button>
          </div>
          {keywords.length === 0 ? (
            <div className="flex flex-col gap-2 rounded-card bg-paper-2 p-3.5">
              <p className="text-body-2 text-ink-2">아직 학습된 취향이 없어요.</p>
              <Button variant="primary" onClick={onReset}>
                취향 알려주기
              </Button>
            </div>
          ) : (
            <div className="rounded-card bg-paper-2 p-3.5">
              <TasteBars
                items={keywords}
                onPick={(k) => shell.openList({ title: k.tag, keyword: k.tag })}
              />
            </div>
          )}
        </section>

        {/* 설정 */}
        <section className="mt-8 flex flex-col">
          <h2 className="text-h2 mb-3 text-ink">설정</h2>
          <div className="flex flex-col gap-1.5">
            <SettingsRow
              icon="sparkle"
              label="취향 다시 설정하기"
              hint="처음부터 무드 선택"
              onClick={onReset}
            />
            <SettingsRow
              icon="bell"
              label="알림 설정"
              onClick={() => toast("알림 설정은 준비 중이에요")}
            />
            <SettingsRow
              icon="user"
              label="계정 정보"
              onClick={() => toast("계정 정보는 준비 중이에요")}
            />
            <SettingsRow icon="arrow-right" label="로그아웃" onClick={onLogout} />
          </div>
        </section>

        {/* 푸터 */}
        <p className="text-caption mt-10 text-center text-ink-3">Moodyfit · MVP Prototype</p>
      </div>
    </div>
  );
}

/* 통계(좋아요/별로예요/저장) — 다크 카드용. */
function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[18px] font-bold tracking-[-0.4px] text-paper">{n}</span>
      <span className="text-caption mt-0.5 text-paper-3">{label}</span>
    </div>
  );
}

/* 설정 행 — paper-2 카드 버튼(아이콘 + 라벨/힌트 + chevron). 정본 14×16·r8. */
function SettingsRow({
  icon,
  label,
  hint,
  onClick,
}: {
  icon: IconName;
  label: string;
  hint?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-btn bg-paper-2 px-4 py-3.5 text-left text-ink"
    >
      <Icon name={icon} size={18} color="var(--color-ink-2)" />
      <span className="flex flex-1 flex-col">
        <span className="text-[13px] font-medium text-ink">{label}</span>
        {hint && <span className="text-caption mt-0.5 text-ink-3">{hint}</span>}
      </span>
      <Icon name="chevron-right" size={16} color="var(--color-ink-3)" />
    </button>
  );
}

/* 다크 카드용 학습 링(흰색). 정본 LearningRingDark(72, stroke 6). ⚠️ value는 더미. */
function LearningRingDark({
  value,
  size = 72,
  stroke = 6,
}: {
  value: number;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(247,244,239,0.18)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--color-paper)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={off}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--color-paper)"
        fontSize="16"
        fontWeight="700"
        letterSpacing="-0.5"
      >
        {Math.round(value * 100)}%
      </text>
    </svg>
  );
}
