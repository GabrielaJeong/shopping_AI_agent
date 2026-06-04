// ╔══════════════════════════════════════════╗
// ║  List View — "전체보기" / 추천 상품 리스트  ║
// ╚══════════════════════════════════════════╝

function ListView({ title, keyword, onBack, onProduct, savedIds, onToggleFav, onChat, onSearch }) {
  const { PRODUCTS, CATS } = window.SHOP_DATA;
  const [cat, setCat] = React.useState('all');
  const [sort, setSort] = React.useState('match');

  // When a keyword is given, surface matches first, then the rest
  const matched = React.useMemo(
    () => keyword ? PRODUCTS.filter(p => p.tags.includes(keyword)) : [],
    [keyword]
  );

  const list = React.useMemo(() => {
    let arr;
    if (keyword) {
      const rest = PRODUCTS.filter(p => !p.tags.includes(keyword))
        .sort((a, b) => b.match - a.match);
      arr = [...matched, ...rest];
    } else {
      arr = [...PRODUCTS];
    }
    if (cat !== 'all') arr = arr.filter(p => p.cat === cat);
    if (sort === 'match' && !keyword) arr.sort((a, b) => b.match - a.match);
    else if (sort === 'price-low') arr = [...arr].sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') arr = [...arr].sort((a, b) => b.price - a.price);
    return arr;
  }, [sort, keyword, matched, cat]);

  return (
    <div className="app-scroll">
      {/* Header with back */}
      <div className="list-header">
        <button className="icon-btn" onClick={onBack}><Icon name="back" size={22} /></button>
        <div className="list-title">{keyword ? `'${keyword}' 추천` : (title || '오늘의 추천')}</div>
        <button className="icon-btn" onClick={onSearch}><Icon name="search" size={22} /></button>
      </div>

      {/* AI summary line */}
      <div className="px-20 mb-16 fade-up">
        <div className="ai-bubble" style={{
          background: 'var(--accent-soft)', color: 'var(--ink)',
          borderRadius: 10, padding: '12px 14px'
        }}>
          <div className="row gap-8" style={{ alignItems: 'center' }}>
            <Icon name="sparkle" size={15} color="var(--ink)" />
            <span style={{ fontSize: 12.5, lineHeight: 1.5 }}>
              {keyword
                ? <><strong>'{keyword}'</strong> 취향에 맞는 <strong>{matched.length}개</strong>를 먼저 모았어요</>
                : <>취향 매치도가 높은 순으로 <strong>{list.length}개</strong>를 정렬했어요</>}
            </span>
          </div>
        </div>
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
            이 카테고리엔 해당 상품이 없어요
          </div>
        )}
      </div>

      <div style={{ height: 24 }} />
    </div>
  );
}

Object.assign(window, { ListView });
