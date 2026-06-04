// ╔══════════════════════════════════════════════╗
// ║  Search — live trending + AI suggestions     ║
// ╚══════════════════════════════════════════════╝

function Search({ onBack, onProduct, savedIds, onToggleFav, onChat }) {
  const { PRODUCTS, TRENDING, AI_SEARCHES, RECENT, format } = window.SHOP_DATA;
  const [query, setQuery] = React.useState('');
  const [recent, setRecent] = React.useState(RECENT);
  const [trending, setTrending] = React.useState(() =>
    TRENDING.map((t, i) => ({ ...t, rank: i + 1 }))
  );
  const [pulseIdx, setPulseIdx] = React.useState(null);
  const inputRef = React.useRef(null);

  // Focus on mount
  React.useEffect(() => {
    const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 350);
    return () => clearTimeout(t);
  }, []);

  // Live ranking: occasionally swap two adjacent terms
  React.useEffect(() => {
    if (query) return; // pause while searching
    const iv = setInterval(() => {
      setTrending(prev => {
        const arr = [...prev];
        const i = Math.floor(Math.random() * (arr.length - 1));
        // swap i and i+1
        const a = { ...arr[i] }, b = { ...arr[i + 1] };
        const ra = a.rank, rb = b.rank;
        a.rank = rb; b.rank = ra;
        a.change = 'down'; a.delta = 1;
        b.change = 'up'; b.delta = 1;
        arr[i] = b; arr[i + 1] = a;
        setPulseIdx(b.term);
        setTimeout(() => setPulseIdx(null), 600);
        return arr.sort((x, y) => x.rank - y.rank);
      });
    }, 2600);
    return () => clearInterval(iv);
  }, [query]);

  // Search results — tokenized matching across name + brand + tags
  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const scored = PRODUCTS.map(p => {
      const hay = `${p.name} ${p.brand} ${p.tags.join(' ')}`.toLowerCase();
      const hits = tokens.filter(t => hay.includes(t)).length;
      return { p, hits };
    }).filter(x => x.hits > 0);
    // more token hits first, then taste match
    scored.sort((a, b) => b.hits - a.hits || b.p.match - a.p.match);
    return scored.map(x => x.p);
  }, [query]);

  // Autocomplete suggestions while typing
  const suggestions = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim();
    const pool = [...new Set([...AI_SEARCHES, ...TRENDING.map(t => t.term),
      ...PRODUCTS.flatMap(p => p.tags)])];
    return pool.filter(s => s.includes(q) && s !== q).slice(0, 5);
  }, [query]);

  return (
    <div className="app-scroll" style={{ paddingBottom: 40 }}>
      {/* Search bar */}
      <div className="search-bar">
        <button className="icon-btn" onClick={onBack}><Icon name="back" size={22} /></button>
        <div className="search-field">
          <Icon name="search" size={18} color="var(--ink-3)" />
          <input ref={inputRef} value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 placeholder="브랜드, 상품, 무드 검색" />
          {query && (
            <button className="search-clear" onClick={() => setQuery('')}>
              <Icon name="close" size={14} color="var(--paper)" />
            </button>
          )}
        </div>
      </div>

      {/* ── Empty state: AI + trending ── */}
      {!query && (
        <>
          {/* AI personalized searches */}
          <div className="px-20 mt-8 mb-24 fade-up">
            <div className="row gap-6 mb-12" style={{ alignItems: 'center' }}>
              <Icon name="sparkle" size={15} />
              <span className="t-h3">지은님을 위한 추천 검색어</span>
            </div>
            <div className="row gap-6" style={{ flexWrap: 'wrap' }}>
              {AI_SEARCHES.map(s => (
                <button key={s} className="chip ai" style={{ fontSize: 12, padding: '8px 12px' }}
                        onClick={() => setQuery(s)}>{s}</button>
              ))}
            </div>
          </div>

          {/* Recent */}
          {recent.length > 0 && (
            <div className="px-20 mb-24 fade-up d1">
              <div className="row between mb-12">
                <span className="t-h3">최근 검색어</span>
                <span className="more" onClick={() => setRecent([])}>전체 삭제</span>
              </div>
              <div className="row gap-6" style={{ flexWrap: 'wrap' }}>
                {recent.map(s => (
                  <button key={s} className="chip outline" style={{ gap: 6 }}
                          onClick={() => setQuery(s)}>
                    {s}
                    <span role="button" tabIndex={0}
                          onClick={(e) => { e.stopPropagation(); setRecent(prev => prev.filter(x => x !== s)); }}
                          style={{ display: 'inline-flex', alignItems: 'center', margin: '-4px -4px -4px 0', padding: 4 }}>
                      <Icon name="close" size={12} color="var(--ink-3)" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live trending ranking */}
          <div className="px-20 fade-up d2">
            <div className="row between mb-4">
              <span className="t-h3">실시간 인기 검색어</span>
              <span className="live-badge"><span className="live-dot" />LIVE</span>
            </div>
            <div className="t-caption mb-12">방금 업데이트 · 1분마다 갱신</div>
            <div className="rank-list">
              {trending.map((t) => (
                <button key={t.term}
                        className={`rank-row ${pulseIdx === t.term ? 'pulse-bg' : ''}`}
                        onClick={() => setQuery(t.term)}>
                  <span className={`rank-num ${t.rank <= 3 ? 'top' : ''}`}>{t.rank}</span>
                  <span className="rank-term">{t.term}</span>
                  <RankChange change={t.change} delta={t.delta} />
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Typing: suggestions ── */}
      {query && suggestions.length > 0 && (
        <div className="px-20 mt-4 mb-8 fade-up">
          <div className="col">
            {suggestions.map(s => (
              <button key={s} className="suggest-row" onClick={() => setQuery(s)}>
                <Icon name="search" size={16} color="var(--ink-3)" />
                <span dangerouslySetInnerHTML={{
                  __html: s.replace(query.trim(), `<strong>${query.trim()}</strong>`)
                }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Results ── */}
      {query && (
        <div className="mt-12">
          {results.length > 0 ? (
            <>
              <div className="px-20 mb-16 fade-up">
                <div className="ai-bubble" style={{
                  background: 'var(--accent-soft)', color: 'var(--ink)',
                  borderRadius: 10, padding: '12px 14px'
                }}>
                  <div className="row gap-8" style={{ alignItems: 'center' }}>
                    <Icon name="sparkle" size={15} color="var(--ink)" />
                    <span style={{ fontSize: 12.5, lineHeight: 1.5 }}>
                      <strong>'{query}'</strong> 검색 결과 <strong>{results.length}개</strong> · 취향 매치순
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-20 fade-up d1" style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 10px'
              }}>
                {results.map(p => (
                  <ProductCard key={p.id} product={p} size="auto"
                               fav={savedIds.has(p.id)}
                               onFav={() => onToggleFav(p.id)}
                               onClick={() => onProduct(p.id)} />
                ))}
              </div>
            </>
          ) : (
            <div className="px-20" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 999, background: 'var(--paper-3)',
                color: 'var(--ink-2)', display: 'inline-flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: 14
              }}>
                <Icon name="search" size={22} />
              </div>
              <div className="t-h3 mb-4">'{query}' 결과가 없어요</div>
              <div className="t-body-2 mb-16">AI에게 비슷한 무드로 찾아달라고 해보세요</div>
              <button className="btn primary" onClick={() => onChat && onChat('default')}>
                <Icon name="chat" size={16} />
                AI에게 물어보기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Rank change indicator
function RankChange({ change, delta }) {
  if (change === 'new') return <span className="rank-chg new">NEW</span>;
  if (change === 'same') return <span className="rank-chg same">–</span>;
  if (change === 'up') return (
    <span className="rank-chg up">
      <svg width="9" height="9" viewBox="0 0 10 10"><path d="M5 1l4 6H1z" fill="currentColor"/></svg>
      {delta}
    </span>
  );
  return (
    <span className="rank-chg down">
      <svg width="9" height="9" viewBox="0 0 10 10"><path d="M5 9L1 3h8z" fill="currentColor"/></svg>
      {delta}
    </span>
  );
}

Object.assign(window, { Search });
