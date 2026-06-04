// ╔══════════════════════════════════════════════════╗
// ║  Onboarding flow                                  ║
// ║  welcome → 5 steps → analyzing → summary          ║
// ╚══════════════════════════════════════════════════╝

const OB_MONO = 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace';

const OB_STEPS = [
{
  id: 'mood', kind: 'photo', tag: 'MOOD', min: 3,
  title: '어떤 무드를 좋아하세요?', sub: '3개 이상 골라주세요',
  options: [
  { id: 'minimal', label: '미니멀' }, { id: 'natural', label: '내추럴' },
  { id: 'classic', label: '클래식' }, { id: 'street', label: '스트릿' },
  { id: 'vintage', label: '빈티지' }, { id: 'sporty', label: '스포티' }]

},
{
  id: 'budget', kind: 'text', single: true, min: 1,
  title: '평소 예산은 어느 정도예요?', sub: '상의 한 벌 기준이에요',
  options: [
  { id: 'b1', label: '5만원 이하' }, { id: 'b2', label: '5–10만원' },
  { id: 'b3', label: '10–20만원' }, { id: 'b4', label: '20–40만원' },
  { id: 'b5', label: '40만원 이상' }, { id: 'b6', label: '상관 없어요' }]

},
{
  id: 'category', kind: 'photo', tag: 'ITEM', min: 2,
  title: '어떤 카테고리에 관심 있으세요?', sub: '자주 찾는 걸 골라주세요',
  options: [
  { id: 'top', label: '상의' }, { id: 'bottom', label: '하의' },
  { id: 'outer', label: '아우터' }, { id: 'shoes', label: '슈즈' },
  { id: 'bag', label: '가방' }, { id: 'acc', label: '액세서리' }]

},
{
  id: 'color', kind: 'swatch', min: 2,
  title: '선호하는 컬러 팔레트는요?', sub: '여러 개 선택 가능해요',
  options: [
  { id: 'beige', label: '베이지', img: 'linear-gradient(160deg, #EBE1CC, #C9B58F)' },
  { id: 'mono', label: '모노톤', img: 'linear-gradient(160deg, #DCD7CE, #3A3633)' },
  { id: 'earth', label: '어스 톤', img: 'linear-gradient(160deg, #A88862, #5E4A38)' },
  { id: 'sage', label: '세이지', img: 'linear-gradient(160deg, #B7BCA8, #6F7864)' },
  { id: 'dusty', label: '더스티', img: 'linear-gradient(160deg, #C8B5B5, #75605F)' },
  { id: 'bright', label: '밝은 톤', img: 'linear-gradient(160deg, #F5F0E5, #E2D9C0)' }]

},
{
  id: 'lifestyle', kind: 'text', min: 2,
  title: '어떤 상황에 자주 입나요?', sub: '여러 개 선택할 수 있어요',
  options: [
  { id: 'daily', label: '데일리' }, { id: 'work', label: '출근룩' },
  { id: 'travel', label: '여행' }, { id: 'date', label: '데이트' },
  { id: 'party', label: '파티' }, { id: 'home', label: '홈웨어' }]

}];


function Onboarding({ onComplete, onSkip }) {
  const [phase, setPhase] = React.useState('welcome'); // welcome | steps | analyzing | summary
  const [step, setStep] = React.useState(0);
  const [picks, setPicks] = React.useState({});

  if (phase === 'welcome') {
    return <OBWelcome onStart={() => setPhase('steps')} onSkip={onSkip} />;
  }
  if (phase === 'analyzing') {
    return <OBAnalyzing onDone={() => setPhase('summary')} />;
  }
  if (phase === 'summary') {
    return <OBSummary picks={picks} onComplete={() => onComplete(picks)} />;
  }
  return (
    <OBSteps step={step} setStep={setStep} picks={picks} setPicks={setPicks}
    onBackOut={() => setPhase('welcome')}
    onFinish={() => setPhase('analyzing')}
    onSkip={onSkip} />);

}

// ─── Welcome ───
function OBWelcome({ onStart, onSkip }) {
  return (
    <div className="app-scroll" style={{ display: 'flex', flexDirection: 'column', paddingBottom: 0 }}>
      <div className="px-20" style={{ paddingTop: 12 }}>
        <div className="row between">
          <MudifitLogo size={17} sub={false} gap={8} />
          <button className="icon-btn" onClick={onSkip} style={{ width: 'auto', padding: '0 6px', fontSize: 12, color: 'var(--ink-3)', fontWeight: 500 }}>둘러보기</button>
        </div>
      </div>

      {/* Hero lookbook placeholder */}
      <div className="px-20" style={{ marginTop: 18 }}>
        <div className="ob-stripe fade-up" style={{
          aspectRatio: '4/5', borderRadius: 14, position: 'relative', overflow: 'hidden'
        }}>
          <span style={{ position: 'absolute', top: 12, left: 12, fontFamily: OB_MONO, fontSize: 9.5, letterSpacing: '0.1em', color: 'var(--ink-3)' }}>LOOKBOOK · 1080×1350</span>
          <div className="row gap-4" style={{ position: 'absolute', bottom: 12, left: 12 }}>
            <span className="chip tiny" style={{ background: 'rgba(247,244,239,0.9)' }}>미니멀</span>
            <span className="chip tiny" style={{ background: 'rgba(247,244,239,0.9)' }}>베이지</span>
            <span className="chip tiny" style={{ background: 'rgba(247,244,239,0.9)' }}>내추럴</span>
          </div>
        </div>
      </div>

      {/* Copy */}
      <div className="px-20 fade-up d1" style={{ marginTop: 24 }}>
        <div className="t-display" style={{ fontSize: 28, lineHeight: 1.25, letterSpacing: -0.9 }}>
          취향만 알려주세요,<br />나머지는 AI가.
        </div>
        <div className="t-body-2 mt-12" style={{ fontSize: 14, lineHeight: 1.6 }}>
          5가지 질문이면 충분해요. 고른 무드를 바탕으로 AI가 매일 당신만을 위한 옷을 골라드려요.
        </div>
      </div>

      {/* CTA pinned */}
      <div style={{ marginTop: 'auto' }} />
      <div className="px-20" style={{ paddingTop: 20, paddingBottom: 30 }}>
        <button className="btn primary large block" onClick={onStart}>
          시작하기
          <Icon name="arrow-right" size={16} />
        </button>
        <div className="t-caption mt-12" style={{ textAlign: 'center', color: 'var(--ink-3)' }}>
          약 30초 · 언제든 다시 설정할 수 있어요
        </div>
      </div>
    </div>);

}

// ─── Steps ───
function OBSteps({ step, setStep, picks, setPicks, onBackOut, onFinish, onSkip }) {
  const current = OB_STEPS[step];
  const selected = picks[current.id] || [];
  const canNext = selected.length >= current.min;
  const progress = (step + 1) / OB_STEPS.length;

  function toggle(id) {
    setPicks((prev) => {
      const cur = prev[current.id] || [];
      if (current.single) return { ...prev, [current.id]: [id] };
      if (cur.includes(id)) return { ...prev, [current.id]: cur.filter((x) => x !== id) };
      return { ...prev, [current.id]: [...cur, id] };
    });
  }
  function next() {
    if (step < OB_STEPS.length - 1) setStep(step + 1);else
    onFinish();
  }
  function prev() {
    if (step > 0) setStep(step - 1);else onBackOut();
  }

  return (
    <div className="app-scroll" style={{ paddingBottom: 120 }}>
      {/* Top bar */}
      <div className="row between" style={{ padding: '8px 20px 4px' }}>
        <button className="icon-btn" onClick={prev}><Icon name="back" size={22} /></button>
        <div className="t-label" style={{ color: 'var(--ink-2)' }}>STEP {step + 1} / {OB_STEPS.length}</div>
        <button className="icon-btn" onClick={onSkip} style={{ width: 'auto', padding: '0 12px', fontSize: 12, color: 'var(--ink-3)', fontWeight: 500 }}>건너뛰기</button>
      </div>

      {/* Progress */}
      <div className="px-20 mt-8 mb-24">
        <div style={{ height: 3, background: 'var(--paper-3)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--ink)', borderRadius: 999, width: `${progress * 100}%`, transition: 'width 0.4s cubic-bezier(0.2,0.85,0.25,1)' }} />
        </div>
      </div>

      {/* Title */}
      <div className="px-20 mb-24 fade-up" key={`t-${step}`}>
        <div className="t-display" style={{ letterSpacing: -0.8 }}>{current.title}</div>
        <div className="t-body-2 mt-8">{current.sub}</div>
      </div>

      {/* Options */}
      {current.kind === 'text' ?
      <div className="px-20 fade-up d1" key={`l-${step}`} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {current.options.map((opt) => {
          const on = selected.includes(opt.id);
          return (
            <button key={opt.id} onClick={() => toggle(opt.id)} style={{
              border: 0, padding: '13px 18px', borderRadius: 8,
              background: on ? 'var(--ink)' : 'var(--paper-2)',
              color: on ? 'var(--paper)' : 'var(--ink)',
              fontFamily: 'inherit', fontSize: 13.5, fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.15s'
            }}>{opt.label}</button>);

        })}
        </div> :

      <div className="px-20 fade-up d1" key={`g-${step}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {current.options.map((opt) => {
          const on = selected.includes(opt.id);
          const swatch = current.kind === 'swatch';
          return (
            <button key={opt.id} onClick={() => toggle(opt.id)} style={{
              position: 'relative', border: 0, padding: 0, background: 'transparent',
              cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left'
            }}>
                <div className={swatch ? '' : 'ob-stripe'} style={{
                aspectRatio: swatch ? '1/1' : '3/4', borderRadius: 8, position: 'relative', overflow: 'hidden',
                background: swatch ? opt.img : undefined,
                outline: on ? '2px solid var(--ink)' : 'none', outlineOffset: '-2px',
                transition: 'outline 0.15s ease'
              }}>
                  {!swatch &&
                <>
                      <span style={{ position: 'absolute', top: 8, left: 8, fontFamily: OB_MONO, fontSize: 9, letterSpacing: '0.08em', color: 'var(--ink-3)' }}>{current.tag}</span>
                      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '20px 10px 9px', background: 'linear-gradient(transparent, rgba(58,54,51,0.16))' }}>
                        <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{opt.label}</span>
                      </div>
                    </>
                }
                  {on &&
                <div className="pulse" style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: 999, background: 'var(--ink)', color: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="check" size={13} color="var(--paper)" />
                    </div>
                }
                </div>
                {swatch &&
              <div className="mt-8" style={{ fontSize: 13, fontWeight: on ? 600 : 500, color: 'var(--ink)', paddingLeft: 2 }}>{opt.label}</div>
              }
              </button>);

        })}
        </div>
      }

      {/* CTA */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 20px 30px', background: 'linear-gradient(to top, var(--paper) 60%, rgba(247,244,239,0))', pointerEvents: 'none', zIndex: 7 }}>
        <button onClick={next} disabled={!canNext} className="btn primary large block" style={{ opacity: canNext ? 1 : 0.4, pointerEvents: 'auto', cursor: canNext ? 'pointer' : 'not-allowed' }}>
          {step === OB_STEPS.length - 1 ? '취향 분석 시작' : '다음'}
          <Icon name="arrow-right" size={16} />
        </button>
        <div className="t-caption mt-8" style={{ textAlign: 'center', color: 'var(--ink-3)' }}>
          {selected.length > 0 ?
          `${selected.length}개 선택됨${!current.single ? ` · 최소 ${current.min}개` : ''}` :
          current.single ? '하나 선택해주세요' : `최소 ${current.min}개 선택해주세요`}
        </div>
      </div>
    </div>);

}

// ─── Analyzing ───
function OBAnalyzing({ onDone }) {
  const [p, setP] = React.useState(0);
  React.useEffect(() => {
    const start = Date.now(),dur = 2400;
    const iv = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / dur);
      setP(t);
      if (t >= 1) {clearInterval(iv);setTimeout(onDone, 380);}
    }, 40);
    return () => clearInterval(iv);
  }, []);

  const size = 132,stroke = 6,r = (size - stroke) / 2,c = 2 * Math.PI * r,off = c * (1 - p);
  const msg = p < 0.4 ? '취향을 분석하고 있어요' :
  p < 0.8 ? '비슷한 무드를 찾는 중이에요' :
  '추천을 준비하고 있어요';

  return (
    <div className="app-scroll" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: 60 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--paper-3)" strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ink)" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
          transform={`rotate(-90 ${size / 2} ${size / 2})`} />
          <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" fontSize="26" fontWeight="700" fill="var(--ink)" letterSpacing="-1">{Math.round(p * 100)}%</text>
        </svg>
        <div className="ob-spin" style={{ position: 'absolute', top: -2, left: '50%', marginLeft: -11, width: 22, height: 22, borderRadius: 999, background: 'var(--ink)', color: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', transformOrigin: `11px ${size / 2 + 2}px` }}>
          <Icon name="sparkle" size={12} color="var(--paper)" />
        </div>
      </div>
      <div className="t-h2 mt-32" style={{ textAlign: 'center' }}>{msg}</div>
      <div className="t-body-2 mt-8" style={{ textAlign: 'center', color: 'var(--ink-3)' }}>잠깐이면 돼요</div>
    </div>);

}

// ─── Summary ───
function OBSummary({ picks, onComplete }) {
  const labelOf = (sid, oid) => {
    const s = OB_STEPS.find((x) => x.id === sid);
    const o = s && s.options.find((o) => o.id === oid);
    return o ? o.label : oid;
  };
  const order = ['mood', 'color', 'category', 'lifestyle'];
  let kws = [];
  order.forEach((sid) => (picks[sid] || []).forEach((oid) => kws.push(labelOf(sid, oid))));
  kws = [...new Set(kws)];
  if (kws.length === 0) kws = ['미니멀', '베이지', '내추럴', '데일리'];
  const cards = kws.slice(0, 6).map((k, i) => ({ name: k, val: Math.max(74, 96 - i * 3) }));

  return (
    <div className="app-scroll" style={{ paddingBottom: 120 }}>
      <div className="px-20" style={{ paddingTop: 28 }}>
        <div className="fade-up" style={{ width: 52, height: 52, borderRadius: 999, background: 'var(--ink)', color: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
          <Icon name="check" size={26} color="var(--paper)" />
        </div>
        <div className="t-display fade-up d1" style={{ letterSpacing: -0.8 }}>취향 분석 완료!</div>
        <div className="t-body-2 mt-8 fade-up d1">지은님의 취향을 이렇게 파악했어요. 이 기준으로 추천을 시작할게요.</div>
      </div>

      {/* Keyword + match cards */}
      <div className="px-20 mt-24 fade-up d2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {cards.map((kw, i) =>
        <div key={kw.name} className="card" style={{ background: 'var(--paper-2)', padding: '14px 14px 16px' }}>
            <div className="row between" style={{ alignItems: 'baseline' }}>
              <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: -0.3 }}>{kw.name}</span>
              <span style={{ fontFamily: OB_MONO, fontSize: 11, color: 'var(--ink-2)' }}>{kw.val}%</span>
            </div>
            <div style={{ height: 5, background: 'var(--paper-3)', borderRadius: 999, overflow: 'hidden', marginTop: 10 }}>
              <div style={{ height: '100%', background: 'var(--ink)', borderRadius: 999, width: `${kw.val}%`, transition: 'width 0.9s cubic-bezier(0.2,0.85,0.25,1)', transitionDelay: `${0.15 + i * 0.06}s` }} />
            </div>
          </div>
        )}
      </div>

      <div className="px-20 mt-24 fade-up d3">
        <div className="card" style={{ background: 'var(--accent-soft)', display: 'flex', gap: 10, alignItems: 'center' }}>
          <Icon name="sparkle" size={16} color="var(--ink)" />
          <span className="t-body-2" style={{ color: 'var(--ink)' }}>이 취향에 맞춰 <strong>오늘의 픽</strong>을 준비했어요. 보면서 ♥로 알려주면 더 정확해져요.</span>
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 20px 30px', background: 'linear-gradient(to top, var(--paper) 60%, rgba(247,244,239,0))', zIndex: 7 }}>
        <button onClick={onComplete} className="btn primary large block">
          내게 꼭 맞는 추천템 보러가기
          <Icon name="arrow-right" size={16} />
        </button>
      </div>
    </div>);

}

Object.assign(window, { Onboarding });