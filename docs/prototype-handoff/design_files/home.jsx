// ╔══════════════════════════════╗
// ║  Home screen                 ║
// ╚══════════════════════════════╝

function Home({ onProduct, onChat, onList, onKeyword, onSearch, savedIds, onToggleFav }) {
  const { PRODUCTS, TASTE, CATS, format } = window.SHOP_DATA;
  const [cat, setCat] = React.useState('all');
  const [pickIdx, setPickIdx] = React.useState(0);
  const scrollerRef = React.useRef(null);
  const settleRef = React.useRef(null);
  const todays = React.useMemo(() => {
    if (cat === 'all') return PRODUCTS.slice(1, 6);
    return PRODUCTS.filter(p => p.cat === cat);
  }, [cat]);
  const discoveries = PRODUCTS.slice(5, 8);

  const heroPicks = PRODUCTS.slice(0, 5);
  const n = heroPicks.length;
  // [clone(last), ...real, clone(first)] for seamless infinite loop
  const loopPicks = [heroPicks[n - 1], ...heroPicks, heroPicks[0]];

  const stride = () => {
    const el = scrollerRef.current;
    return el ? el.clientWidth - 30 : 1;
  };

  // Position at the first real slide on mount
  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollLeft = stride(); // index 1 = real first
    });
  }, []);

  function onHeroScroll(e) {
    const el = e.target;
    const s = stride();
    const raw = Math.round(el.scrollLeft / s); // 0..n+1
    // live dot update (map clone positions to real)
    const live = ((raw - 1) % n + n) % n;
    if (live !== pickIdx) setPickIdx(live);
    // debounce: after scroll settles, jump across the clone boundary
    clearTimeout(settleRef.current);
    settleRef.current = setTimeout(() => {
      if (raw === 0) el.scrollTo({ left: s * n, behavior: 'auto' });
      else if (raw === n + 1) el.scrollTo({ left: s, behavior: 'auto' });
    }, 140);
  }

  return (
    <div className="app-scroll">
      {/* App bar */}
      <div className="appbar">
        <div className="appbar-greet">
          <div className="name">안녕하세요, 지은님</div>
        </div>
        <div className="appbar-actions">
          <button className="icon-btn" onClick={onSearch}><Icon name="search" size={22} /></button>
          <button className="icon-btn" onClick={() => toast('새로운 알림이 없어요')}>
            <Icon name="bell" size={22} />
            <span className="badge" />
          </button>
        </div>
      </div>

      {/* AI conversational banner */}
      <div className="px-20 fade-up" style={{ marginBottom: 24 }}>
        <div className="ai-bubble">
          <div className="who">AI · 큐레이션</div>
          오늘은 평소 좋아하시는 <strong>내추럴·베이지</strong> 무드로 골라봤어요.
          출근룩으로 입기 좋은 셔츠 위주예요.
          <div className="actions">
            <button className="chip" onClick={() => onChat && onChat('similar_tone')}>다른 무드</button>
            <button className="chip" onClick={() => onChat && onChat('cheaper')}>예산별로</button>
            <button className="chip" onClick={() => onChat && onChat('default')}>AI에게 묻기</button>
          </div>
        </div>
      </div>

      {/* Hero pick slider */}
      <div className="fade-up d1">
        <div className="sec-head" style={{ marginBottom: 12 }}>
          <div className="t-h2">오늘의 픽</div>
        </div>
        <div className="hero-scroller" ref={scrollerRef} onScroll={onHeroScroll}>
          {loopPicks.map((pick, i) => (
            <div className="hero-pick" key={i}>
              <div className="row gap-12" style={{ alignItems: 'stretch' }}>
                <div style={{ flex: '0 0 130px' }}>
                  <ProductImg product={pick} shape="tall" />
                </div>
                <div className="col" style={{ flex: 1, justifyContent: 'space-between', minWidth: 0 }}>
                  <div>
                    <div className="t-label" style={{ color: 'var(--ink-2)' }}>{pick.brand}</div>
                    <div className="t-h3 mt-4" style={{
                      overflow: 'hidden', textOverflow: 'ellipsis',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                    }}>{pick.name}</div>
                    <div className="t-price mt-8">{format(pick.price)}</div>
                    <div className="row gap-4 mt-8" style={{ flexWrap: 'wrap' }}>
                      {pick.tags.slice(0, 2).map(t => (
                        <span key={t} className="chip tiny outline">{t}</span>
                      ))}
                    </div>
                  </div>
                  <button className="btn primary block" onClick={() => onProduct(pick.id)}>
                    자세히 보기
                    <Icon name="arrow-right" size={16} />
                  </button>
                </div>
              </div>
              <div className="reason">
                <span className="label">AI</span>
                <span dangerouslySetInnerHTML={{ __html: pick.reason }} />
              </div>
            </div>
          ))}
        </div>
        <div className="hero-dots">
          {heroPicks.map((_, i) => (
            <span key={i} className={`dot ${i === pickIdx ? 'active' : ''}`} />
          ))}
        </div>
      </div>

      {/* Taste keyword chart */}
      <div className="mt-32 px-20 fade-up d2">
        <div className="mb-12">
          <div className="t-h2">내 취향 키워드</div>
        </div>
        <div className="card">
          <BarList items={TASTE.slice(0, 4)} onPick={onKeyword} />
        </div>
      </div>

      {/* Category chips */}
      <div className="mt-32 fade-up d3">
        <div className="sec-head">
          <div className="t-h2">오늘의 추천</div>
          <span className="more" onClick={() => onList && onList('오늘의 추천')}>전체보기 →</span>
        </div>
        <div className="cat-row mb-16">
          {CATS.map(c => (
            <button key={c.id}
                    className={`chip ${cat === c.id ? 'sel' : ''}`}
                    onClick={() => setCat(c.id)}>{c.name}</button>
          ))}
        </div>
        <div className="h-scroll">
          {todays.length > 0 ? todays.map(p => (
            <ProductCard key={p.id} product={p}
                         fav={savedIds.has(p.id)}
                         onFav={() => onToggleFav(p.id)}
                         onClick={() => onProduct(p.id)} />
          )) : (
            <div className="px-20 t-body-2" style={{ paddingTop: 4, paddingBottom: 8 }}>
              이 카테고리엔 아직 추천이 없어요
            </div>
          )}
        </div>
      </div>

      {/* AI discoveries */}
      <div className="mt-32 fade-up">
        <div className="sec-head" style={{ marginBottom: 6 }}>
          <div className="row gap-6" style={{ alignItems: 'baseline' }}>
            <Icon name="sparkle" size={14} />
            <div className="t-h2">AI가 찾은 새 취향</div>
          </div>
        </div>
        <div className="px-20 mb-16">
          <div className="t-body-2">기존 선호에 가까우면서 살짝 새로운 것들. 한 번 봐주실래요?</div>
        </div>
        <div className="h-scroll">
          {discoveries.map((p) => (
            <div key={p.id} style={{ width: 200 }}>
              <ProductCard product={p} size="auto"
                           fav={savedIds.has(p.id)}
                           onFav={() => onToggleFav(p.id)}
                           onClick={() => onProduct(p.id)} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 24 }} />
    </div>
  );
}

Object.assign(window, { Home });
