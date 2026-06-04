// ╔══════════════════════════════════╗
// ║  MyPage — profile + AI learning  ║
// ╚══════════════════════════════════╝

function MyPage({ onOnboarding, onLogout, onKeyword, savedCount }) {
  const { TASTE, LEARN_TREND } = window.SHOP_DATA;
  const learning = 0.64;
  const feedbackCount = 36;

  return (
    <div className="app-scroll">
      {/* App bar */}
      <div className="appbar">
        <div className="appbar-greet">
          <div className="name">마이페이지</div>
        </div>
      </div>

      {/* Profile */}
      <div className="px-20 fade-up" style={{ marginBottom: 8 }}>
        <div className="row" onClick={() => toast('프로필 편집은 준비 중이에요')} style={{
          background: 'var(--paper-2)', padding: '22px 20px', borderRadius: 12,
          alignItems: 'center', gap: 16, cursor: 'pointer'
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 999,
            background: 'var(--accent-soft)', color: 'var(--ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 600, flexShrink: 0, letterSpacing: -0.4
          }}>J</div>
          <div style={{ flex: 1 }}>
            <div className="t-h3">지은</div>
            <div className="t-caption" style={{ marginTop: 4 }}>jieun@email.com</div>
          </div>
          <Icon name="chevron-right" size={18} color="var(--ink-3)" />
        </div>
      </div>

      {/* AI Learning card */}
      <div className="px-20 mb-20 fade-up d1">
        <div className="card" style={{ background: 'var(--ink)', color: 'var(--paper)', padding: 18 }}>
          <div className="row gap-16" style={{ alignItems: 'center' }}>
            <LearningRingDark value={learning} />
            <div className="col gap-4" style={{ flex: 1 }}>
              <div className="t-h2" style={{ color: 'var(--paper)' }}>취향 학습 중</div>
              <div className="t-body-2" style={{ color: 'var(--paper-3)', lineHeight: 1.5 }}>
                피드백을 {feedbackCount}번 주셨어요.<br/>
                계속 학습하고 있어요.
              </div>
            </div>
          </div>
          <div className="row gap-16 mt-16" style={{
            paddingTop: 14, borderTop: '1px solid rgba(247,244,239,0.12)'
          }}>
            <Stat n="28" label="좋아요" />
            <Stat n="8" label="별로예요" />
            <Stat n={savedCount > 0 ? savedCount : 12} label="저장" />
          </div>
        </div>
      </div>

      {/* Taste keywords */}
      <div className="mt-32 fade-up d2">
        <div className="sec-head">
          <div className="t-h2">내 취향 키워드</div>
          <span className="more" onClick={() => toast('취향 키워드 편집은 준비 중이에요')}>편집</span>
        </div>
        <div className="px-20">
          <div className="card">
            <BarList items={TASTE} showDelta={false} onPick={onKeyword} />
          </div>
        </div>
      </div>

      {/* Settings list */}
      <div className="px-20 mt-32 fade-up d3">
        <div className="t-h2 mb-12">설정</div>
        <div className="col" style={{ gap: 6 }}>
          <SettingsRow icon="sparkle" label="취향 다시 설정하기"
                       hint="처음부터 무드 선택" onClick={onOnboarding}/>
          <SettingsRow icon="bell" label="알림 설정" onClick={() => toast('알림 설정은 준비 중이에요')}/>
          <SettingsRow icon="user" label="계정 정보" onClick={() => toast('계정 정보는 준비 중이에요')}/>
          <SettingsRow icon="arrow-right" label="로그아웃" onClick={onLogout}/>
        </div>
      </div>

      <div style={{ height: 40 }} />
      <div className="px-20" style={{ textAlign: 'center' }}>
        <div className="t-caption" style={{ color: 'var(--ink-3)' }}>v0.1.0 · MVP Prototype</div>
      </div>
      <div style={{ height: 24 }} />
    </div>
  );
}

function Stat({ n, label }) {
  return (
    <div className="col">
      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--paper)', letterSpacing: -0.4 }}>{n}</div>
      <div className="t-caption" style={{ color: 'var(--paper-3)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

function SettingsRow({ icon, label, hint, onClick }) {
  return (
    <button className="row gap-12" onClick={onClick} style={{
      width: '100%', background: 'var(--paper-2)', border: 0,
      borderRadius: 8, padding: '14px 16px',
      cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
      color: 'var(--ink)', alignItems: 'center'
    }}>
      <Icon name={icon} size={18} color="var(--ink-2)" />
      <div className="col" style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
        {hint && <div className="t-caption mt-4" style={{ color: 'var(--ink-3)' }}>{hint}</div>}
      </div>
      <Icon name="chevron-right" size={16} color="var(--ink-3)" />
    </button>
  );
}

// Dark variant of learning ring for the dark card
function LearningRingDark({ value, size = 72, stroke = 6 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(247,244,239,0.18)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--paper)" strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={c} strokeDashoffset={off}
              transform={`rotate(-90 ${size/2} ${size/2})`}
              style={{ transition: 'stroke-dashoffset 1s ease' }}/>
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
            fontSize="16" fontWeight="700" fill="var(--paper)" letterSpacing="-0.5">
        {Math.round(value * 100)}%
      </text>
    </svg>
  );
}

Object.assign(window, { MyPage });
