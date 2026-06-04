// ╔══════════════════════════════════╗
// ║  Explore screen — 2-col grid     ║
// ╚══════════════════════════════════╝

function Explore({ onProduct, savedIds, onToggleFav, onChat, onSearch, onKeyword }) {
  const { PRODUCTS, CATS } = window.SHOP_DATA;
  const [cat, setCat] = React.useState('all');
  const [sort, setSort] = React.useState('match');

  // Filter by category, then sort
  const list = React.useMemo(() => {
    let arr = cat === 'all' ? [...PRODUCTS] : PRODUCTS.filter(p => p.cat === cat);
    if (sort === 'match') arr.sort((a, b) => b.match - a.match);
    else if (sort === 'price-low') arr.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') arr.sort((a, b) => b.price - a.price);
    return arr;
  }, [sort, cat]);

  return (
    <div className="app-scroll">
      {/* App bar */}
      <div className="appbar">
        <div className="appbar-greet">
          <div className="name">취향에 맞는 모든 것</div>
        </div>
        <div className="appbar-actions">
          <button className="icon-btn" onClick={onSearch}><Icon name="search" size={22} /></button>
        </div>
      </div>

      {/* AI discovery line */}
      <div className="px-20 mb-16 fade-up">
        <button className="row gap-10" onClick={() => onKeyword && onKeyword('레이어드')} style={{
          width: '100%', textAlign: 'left', border: 0, cursor: 'pointer', fontFamily: 'inherit',
          background: 'var(--paper-2)', borderRadius: 10, padding: '14px', alignItems: 'center'
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 999, background: 'var(--ink)',
            color: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Icon name="sparkle" size={15} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="t-caption" style={{ color: 'var(--ink-2)', marginBottom: 2 }}>AI가 발견한 새 카테고리</div>
            <div className="t-body" style={{ fontWeight: 600, letterSpacing: -0.3 }}>
              <strong>레이어드 니트</strong>를 좋아하실 것 같아요
            </div>
          </div>
          <Icon name="chevron-right" size={18} color="var(--ink-2)" />
        </button>
      </div>

      {/* Category chips */}
      <div className="cat-row mb-16 fade-up d1">
        {CATS.map(c => (
          <button key={c.id}
                  className={`chip ${cat === c.id ? 'sel' : ''}`}
                  onClick={() => setCat(c.id)}>{c.name}</button>
        ))}
      </div>

      {/* Sort row */}
      <div className="row between px-20 mb-16">
        <span className="t-caption">총 {list.length}개</span>
        <div className="row gap-6">
          <button className={`chip tiny ${sort === 'match' ? 'sel' : 'outline'}`}
                  onClick={() => setSort('match')}>AI 추천순</button>
          <button className={`chip tiny ${sort === 'price-low' ? 'sel' : 'outline'}`}
                  onClick={() => setSort('price-low')}>낮은 가격</button>
          <button className={`chip tiny ${sort === 'price-high' ? 'sel' : 'outline'}`}
                  onClick={() => setSort('price-high')}>높은 가격</button>
        </div>
      </div>

      {/* 2-col grid */}
      <div className="px-20 fade-up d2" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 10px'
      }}>
        {list.length > 0 ? list.map(p => (
          <ProductCard key={p.id} product={p} size="auto"
                       fav={savedIds.has(p.id)}
                       onFav={() => onToggleFav(p.id)}
                       onClick={() => onProduct(p.id)} />
        )) : (
          <div className="t-body-2" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '24px 0' }}>
            이 카테고리엔 아직 추천이 없어요
          </div>
        )}
      </div>

      {/* End banner */}
      <div className="px-20 mt-32 mb-16">
        <div style={{ textAlign: 'center', padding: '20px 16px', background: 'var(--paper-2)', borderRadius: 10 }}>
          <div className="t-body" style={{ fontWeight: 500 }}>찾는 게 없으세요?</div>
          <div className="t-body-2 mt-4">AI에게 직접 물어보세요</div>
          <button className="btn primary mt-12" onClick={() => onChat && onChat('default')}>
            <Icon name="chat" size={16} />
            AI에게 묻기
          </button>
        </div>
      </div>

      <div style={{ height: 24 }} />
    </div>
  );
}

Object.assign(window, { Explore });
