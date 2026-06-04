/*
  임시 디자인 파운데이션 미리보기 (dev 스타일 레퍼런스).
  @theme 토큰이 Tailwind 유틸리티로 정상 생성되는지 확인하는 용도.
  런치 플로우/화면 구현 단계에서 실제 화면으로 대체된다.
*/

const COLORS: { name: string; cls: string; border?: boolean }[] = [
  { name: "paper", cls: "bg-paper", border: true },
  { name: "paper-2", cls: "bg-paper-2", border: true },
  { name: "paper-3", cls: "bg-paper-3", border: true },
  { name: "paper-deep", cls: "bg-paper-deep", border: true },
  { name: "ink", cls: "bg-ink" },
  { name: "ink-2", cls: "bg-ink-2" },
  { name: "ink-3", cls: "bg-ink-3" },
  { name: "ink-soft", cls: "bg-ink-soft" },
  { name: "line", cls: "bg-line", border: true },
  { name: "line-soft", cls: "bg-line-soft", border: true },
  { name: "accent-soft", cls: "bg-accent-soft", border: true },
  { name: "accent-deep", cls: "bg-accent-deep" },
  { name: "hot", cls: "bg-hot" },
  { name: "hot-soft", cls: "bg-hot-soft", border: true },
  { name: "down", cls: "bg-down" },
];

const TYPE: { name: string; cls: string }[] = [
  { name: "display", cls: "text-display" },
  { name: "h1", cls: "text-h1" },
  { name: "h2", cls: "text-h2" },
  { name: "h3", cls: "text-h3" },
  { name: "body", cls: "text-body" },
  { name: "body-2", cls: "text-body-2" },
  { name: "caption", cls: "text-caption" },
  { name: "price", cls: "text-price" },
];

const RADII = ["rounded-image", "rounded-chip", "rounded-btn", "rounded-card", "rounded-sheet"];
const SHADOWS = ["shadow-card", "shadow-elev"];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-label text-ink-2 uppercase">{title}</h2>
      {children}
    </section>
  );
}

export default function FoundationPreview() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col gap-8 bg-paper px-5 py-10">
      <header className="flex flex-col gap-1">
        <span className="text-label text-ink-3 uppercase">Design Foundation</span>
        <span className="font-brand text-h1 tracking-[-0.4px] text-ink">Moodyfit</span>
        <p className="text-body-2 text-ink-2">
          디자인 토큰 미리보기 · styles.css → Tailwind v4 @theme
        </p>
      </header>

      <Section title="Color">
        <div className="grid grid-cols-3 gap-3">
          {COLORS.map((c) => (
            <div key={c.name} className="flex flex-col gap-1.5">
              <div
                className={`${c.cls} h-12 w-full rounded-btn ${c.border ? "border border-line" : ""}`}
              />
              <span className="text-caption text-ink-2">{c.name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Type scale">
        <div className="flex flex-col gap-3">
          {TYPE.map((t) => (
            <div key={t.name} className="flex items-baseline justify-between gap-4">
              <span className={`${t.cls} text-ink`}>오늘의 무드 Moodyfit</span>
              <span className="text-caption shrink-0 text-ink-3">{t.name}</span>
            </div>
          ))}
          <span className="text-label text-ink uppercase">Label · 라벨 10px</span>
        </div>
      </Section>

      <Section title="Radius">
        <div className="flex flex-wrap gap-3">
          {RADII.map((r) => (
            <div key={r} className="flex flex-col items-center gap-1.5">
              <div className={`${r} h-14 w-14 border border-line bg-paper-3`} />
              <span className="text-caption text-ink-3">{r.replace("rounded-", "")}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Shadow">
        <div className="flex flex-wrap gap-4">
          {SHADOWS.map((s) => (
            <div key={s} className="flex flex-col items-center gap-1.5">
              <div className={`${s} h-14 w-20 rounded-card bg-paper-2`} />
              <span className="text-caption text-ink-3">{s.replace("shadow-", "")}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Surfaces">
        <div className="rounded-card bg-paper-2 p-4 shadow-card">
          <p className="text-h3 text-ink">카드 표면 (paper-2 · rounded-card · shadow-card)</p>
          <p className="text-body-2 mt-2 text-ink-2">
            추천 카드와 시트가 이 표면 위에 올라갑니다. 본문은 ink-2.
          </p>
          <div className="mt-3 flex gap-2">
            <span className="text-body-2 rounded-btn bg-ink px-4 py-2 font-semibold text-paper">
              primary
            </span>
            <span className="text-body-2 rounded-btn bg-paper-3 px-4 py-2 font-semibold text-ink">
              neutral
            </span>
            <span className="text-caption rounded-chip bg-accent-soft px-3 py-2 font-semibold text-ink">
              chip
            </span>
          </div>
        </div>
      </Section>
    </main>
  );
}
