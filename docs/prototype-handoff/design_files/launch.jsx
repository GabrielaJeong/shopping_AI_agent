// ╔══════════════════════════════════════════════════╗
// ║  Moodyfit — Launch sequence                       ║
// ║  Brand logo · Splash · Intro carousel · Login     ║
// ╚══════════════════════════════════════════════════╝

const MF_MONO = 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace';

// ─── Brand mark: a "mood phase" crescent inside a ring ───
function MudifitMark({ size = 30, color = 'var(--ink)' }) {
  const rid = React.useId();
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <mask id={rid}>
          <rect width="40" height="40" fill="black" />
          <circle cx="20" cy="20" r="12.4" fill="white" />
          <circle cx="27.4" cy="18.6" r="13.4" fill="black" />
        </mask>
      </defs>
      <circle cx="20" cy="20" r="16.8" fill="none" stroke={color} strokeWidth="1.6" />
      <circle cx="20" cy="20" r="12.4" fill={color} mask={`url(#${rid})`} />
    </svg>
  );
}

function MudifitLogo({ size = 24, color = 'var(--ink)', gap = 11, stack = false }) {
  return (
    <div className={stack ? 'col' : 'row'} style={{ alignItems: 'center', gap }}>
      <MudifitMark size={Math.round(size * 1.5)} color={color} />
      <span style={{ fontSize: size, fontWeight: 700, letterSpacing: -0.4, color }}>Moodyfit</span>
    </div>
  );
}

// ─── Splash ───
function Splash({ onDone }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="splash">
      <div className="splash-inner">
        <MudifitLogo size={36} color="var(--paper)" stack={true} gap={18} />
      </div>
    </div>
  );
}

// ─── Mini service-screen mocks (used in intro) ───
function MiniFrame({ children, label }) {
  return (
    <div className="mini-frame">
      <div className="row between mb-12" style={{ alignItems: 'center' }}>
        <div className="row gap-6" style={{ alignItems: 'center' }}>
          <MudifitMark size={16} />
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: -0.2 }}>{label}</span>
        </div>
        <div className="row gap-4">
          <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--ink-soft)' }} />
          <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--ink-soft)' }} />
          <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--ink-soft)' }} />
        </div>
      </div>
      {children}
    </div>
  );
}

function MockReco() {
  const P = window.SHOP_DATA.PRODUCTS;
  return (
    <MiniFrame label="오늘의 픽">
      <div className="ai-bubble" style={{ padding: '12px 14px', fontSize: 12, borderRadius: '14px 14px 14px 4px' }}>
        <div className="who" style={{ marginBottom: 4 }}>AI · 큐레이션</div>
        내추럴·베이지 무드로 골라봤어요
      </div>
      <div className="row gap-8 mt-12">
        {[P[0], P[3]].map(p => (
          <div key={p.id} style={{ flex: 1 }}>
            <ProductImg product={p} shape="tall" />
            <div style={{ fontSize: 11, fontWeight: 500, marginTop: 6 }}>{p.name.slice(0, 9)}</div>
            <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>AI {p.match}% 매치</div>
          </div>
        ))}
      </div>
    </MiniFrame>
  );
}

function MockFeedback() {
  const P = window.SHOP_DATA.PRODUCTS;
  const acts = [['heart-fill', '좋아요', true], ['thumbs-down', '별로'], ['shuffle', '비슷한'], ['bookmark', '저장']];
  return (
    <MiniFrame label="피드백 학습">
      <div className="row gap-10">
        <div style={{ width: 90, flexShrink: 0 }}><ProductImg product={P[1]} shape="tall" /></div>
        <div className="col" style={{ flex: 1, justifyContent: 'center', gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>이 추천, 어떠세요?</div>
          <div style={{ height: 5, background: 'var(--paper-3)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '64%', background: 'var(--ink)', borderRadius: 999 }} />
          </div>
          <div style={{ fontSize: 10, color: 'var(--ink-2)', fontFamily: MF_MONO }}>취향 학습 +8% → 64%</div>
        </div>
      </div>
      <div className="row gap-6 mt-12">
        {acts.map(([ic, lb, on]) => (
          <div key={lb} className="col" style={{ flex: 1, alignItems: 'center', gap: 4, padding: '8px 0', borderRadius: 8, background: on ? 'var(--ink)' : 'var(--paper-3)', color: on ? 'var(--paper)' : 'var(--ink)' }}>
            <Icon name={ic} size={15} color={on ? 'var(--paper)' : 'var(--ink)'} />
            <span style={{ fontSize: 9 }}>{lb}</span>
          </div>
        ))}
      </div>
    </MiniFrame>
  );
}

function MockSaved() {
  const P = window.SHOP_DATA.PRODUCTS;
  return (
    <MiniFrame label="찜 · 컬렉션">
      <div className="card" style={{ background: 'var(--ink)', color: 'var(--paper)', padding: 12, marginBottom: 12 }}>
        <div className="row gap-6" style={{ alignItems: 'center', marginBottom: 6 }}>
          <Icon name="sparkle" size={12} color="var(--paper-3)" />
          <span style={{ fontSize: 10, color: 'var(--paper-3)' }}>AI 컬렉션 제안</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>"베이지 데일리"로 묶을까요?</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        {[P[0], P[3], P[6]].map(p => <ProductImg key={p.id} product={p} shape="square" brandTag={false} />)}
      </div>
    </MiniFrame>
  );
}

// ─── Intro carousel ───
function Intro({ onDone }) {
  const slides = [
    { tag: '01 · AI 추천', title: '취향을 아는\n추천', body: '고른 무드를 학습해, 매일 당신만을 위한 옷을 골라드려요.', mock: <MockReco /> },
    { tag: '02 · 학습 루프', title: '쓸수록\n정확해져요', body: '좋아요·별로예요 한 번이면 취향에 바로 반영돼요.', mock: <MockFeedback /> },
    { tag: '03 · 모으기', title: '찜하고,\nAI가 정리해요', body: '저장한 옷을 무드별 컬렉션으로 알아서 묶어드려요.', mock: <MockSaved /> },
  ];
  const [i, setI] = React.useState(0);
  const last = i === slides.length - 1;
  const s = slides[i];

  return (
    <div className="app-scroll" style={{ display: 'flex', flexDirection: 'column', paddingBottom: 0 }}>
      <div className="px-20 row between" style={{ paddingTop: 12, alignItems: 'center' }}>
        <MudifitLogo size={17} sub={false} gap={8} />
        <button className="icon-btn" onClick={onDone} style={{ width: 'auto', padding: '0 6px', fontSize: 12, color: 'var(--ink-3)', fontWeight: 500 }}>건너뛰기</button>
      </div>

      {/* Mock visual */}
      <div className="px-20" style={{ marginTop: 20 }} key={`m-${i}`}>
        <div className="fade-up">{s.mock}</div>
      </div>

      {/* Copy */}
      <div className="px-20" style={{ marginTop: 26 }} key={`c-${i}`}>
        <div className="fade-up d1">
          <div className="t-display" style={{ fontSize: 28, lineHeight: 1.25, letterSpacing: -0.9, whiteSpace: 'pre-line' }}>{s.title}</div>
          <div className="t-body-2 mt-12" style={{ fontSize: 14, lineHeight: 1.6 }}>{s.body}</div>
        </div>
      </div>

      <div style={{ marginTop: 'auto' }} />

      {/* Dots + CTA */}
      <div className="px-20" style={{ paddingTop: 20, paddingBottom: 30 }}>
        <div className="intro-dots mb-16">
          {slides.map((_, k) => <span key={k} className={`d ${k === i ? 'on' : ''}`} />)}
        </div>
        <button className="btn primary large block" onClick={() => last ? onDone() : setI(i + 1)}>
          {last ? '시작하기' : '다음'}
          <Icon name="arrow-right" size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Login ───
function Login({ onLogin }) {
  const P = window.SHOP_DATA.PRODUCTS;
  return (
    <div className="app-scroll" style={{ display: 'flex', flexDirection: 'column', paddingBottom: 0 }}>
      {/* Brand + hero */}
      <div className="px-20" style={{ paddingTop: 36 }}>
        <div className="fade-up"><MudifitLogo size={24} sub={true} gap={11} /></div>
        <div className="t-display fade-up d1" style={{ fontSize: 27, lineHeight: 1.3, letterSpacing: -0.8, marginTop: 26 }}>
          오늘의 무드를<br/>입어보세요
        </div>
        <div className="t-body-2 mt-12 fade-up d1" style={{ fontSize: 14, lineHeight: 1.6 }}>
          Moodyfit이 취향에 맞는 옷을 매일 골라드려요. 30초면 시작할 수 있어요.
        </div>
      </div>

      {/* Lookbook teaser */}
      <div className="px-20 fade-up d2" style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[P[0], P[3], P[1]].map(p => <ProductImg key={p.id} product={p} shape="tall" brandTag={false} />)}
      </div>

      <div style={{ marginTop: 'auto' }} />

      {/* Auth buttons */}
      <div className="px-20" style={{ paddingTop: 24, paddingBottom: 26 }}>
        <div className="col gap-8">
          <button className="btn primary large block" onClick={onLogin}>
            <Icon name="send" size={15} />
            이메일로 계속하기
          </button>
          <button className="btn large block" onClick={onLogin} style={{ background: 'var(--paper-2)' }}>
            Apple로 계속하기
          </button>
          <button className="btn large block" onClick={onLogin} style={{ background: 'var(--paper-2)' }}>
            카카오로 시작하기
          </button>
        </div>
        <button className="btn ghost block mt-12" onClick={onLogin}>로그인 없이 둘러보기</button>
        <div className="t-caption mt-16" style={{ textAlign: 'center', color: 'var(--ink-3)', lineHeight: 1.6 }}>
          계속 진행하면 Moodyfit의 <u>이용약관</u>과<br/><u>개인정보 처리방침</u>에 동의하게 됩니다.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MudifitMark, MudifitLogo, Splash, Intro, Login });
