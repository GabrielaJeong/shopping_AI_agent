// ╔══════════════════════════════════╗
// ║  Charts — Sparkline + BarList     ║
// ╚══════════════════════════════════╝

// ─── Sparkline (learning trend) ───
function Sparkline({ data, height = 60, color = '#3A3633', showFill = true, animate = true }) {
  const ref = React.useRef(null);
  const [w, setW] = React.useState(280);
  React.useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = Math.max(1, max - min);
  const pad = 6;
  const step = (w - pad * 2) / Math.max(1, data.length - 1);
  const points = data.map((v, i) => {
    const x = pad + i * step;
    const y = pad + ((max - v) / range) * (height - pad * 2);
    return { x, y, v };
  });
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length-1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <div className="spark-wrap" ref={ref} style={{ height }}>
      <svg className="spark" viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {showFill && <path d={areaD} fill="url(#sparkFill)" />}
        <path d={pathD} fill="none" stroke={color} strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"
              style={animate ? { strokeDasharray: 1000, strokeDashoffset: 1000, animation: 'spark-draw 1.2s ease forwards' } : null}/>
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={i === points.length - 1 ? 3 : 0} fill={color}/>
        ))}
        {/* End label */}
        <g transform={`translate(${points[points.length-1].x}, ${points[points.length-1].y})`}>
          <circle r="5" fill={color} fillOpacity="0.18"/>
        </g>
      </svg>
      <style>{`
        @keyframes spark-draw { to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  );
}

// ─── Animated bar list (taste keywords) ───
function BarList({ items, animate = true, showDelta = true, onPick }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="bar-list">
      {items.map((it, i) => {
        const pct = Math.round(it.value * 100);
        const before = Math.max(0, it.value - (it.delta || 0)) * 100;
        const dW = mounted && showDelta && it.delta > 0 ? (it.value * 100 - before) : 0;
        const clickable = !!onPick;
        return (
          <div className={`bar-row ${clickable ? 'tappable' : ''}`} key={it.name}
               style={{ animationDelay: `${i * 60}ms` }}
               onClick={clickable ? () => onPick(it.name) : undefined}>
            <div className="lbl row gap-4" style={{ alignItems: 'center' }}>
              {it.name}
              {clickable && <Icon name="chevron-right" size={13} color="var(--ink-3)" />}
            </div>
            <div className="bar-bar">
              <div className="bar-fill" style={{ width: `${before}%` }} />
              {showDelta && it.delta > 0 && (
                <div className="bar-fill delta" style={{
                  width: mounted ? `${pct - before}%` : '0%',
                  left: `${before}%`, position: 'absolute',
                  background: 'var(--ink)', opacity: 0.6,
                }} />
              )}
            </div>
            <div className="val">{pct}%
              {showDelta && it.delta > 0 && <span style={{ color: 'var(--ink-2)', marginLeft: 3, fontSize: 9 }}>+{Math.round(it.delta * 100)}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Donut-ish progress (learning %) ───
function LearningRing({ value, size = 80, stroke = 6 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--paper-3)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--ink)" strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={c} strokeDashoffset={off}
              transform={`rotate(-90 ${size/2} ${size/2})`}
              style={{ transition: 'stroke-dashoffset 1s ease' }}/>
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
            fontSize="16" fontWeight="700" fill="var(--ink)" letterSpacing="-0.5">
        {Math.round(value * 100)}%
      </text>
    </svg>
  );
}

Object.assign(window, { Sparkline, BarList, LearningRing });
