// ╔════════════════════════════════════╗
// ║  Saved screen — 찜 컬렉션          ║
// ╚════════════════════════════════════╝

function Saved({ onProduct, savedIds, onToggleFav }) {
  const { PRODUCTS, format } = window.SHOP_DATA;

  // Pre-populate with a few items if savedIds is small (for demo)
  const allSaved = React.useMemo(() => {
    if (savedIds.size > 0) return PRODUCTS.filter(p => savedIds.has(p.id));
    // Demo fallback — show what saved screen would look like populated
    return PRODUCTS.slice(0, 6);
  }, [savedIds]);

  // Compute AI suggestion target — beige tones
  const beigeItems = PRODUCTS.filter(p =>
    p.tags.some(t => ['베이지', '오트밀', '카멜'].includes(t))
  );

  const [collections, setCollections] = React.useState([
    { id: 'daily', name: '데일리', members: ['p01', 'p03', 'p06'] },
    { id: 'work', name: '출근룩', members: ['p02', 'p04'] },
  ]);
  const [collection, setCollection] = React.useState('all');
  const [dismissed, setDismissed] = React.useState(false);

  const tabs = [
    { id: 'all', name: '전체', count: allSaved.length },
    ...collections.map(c => ({ id: c.id, name: c.name, count: c.members.length })),
  ];

  const shown = React.useMemo(() => {
    if (collection === 'all') return allSaved;
    const col = collections.find(c => c.id === collection);
    if (!col) return allSaved;
    return PRODUCTS.filter(p => col.members.includes(p.id));
  }, [collection, allSaved, collections]);

  function addCollection(name, members) {
    const id = 'col-' + Date.now();
    setCollections(prev => [...prev, { id, name, members }]);
    setCollection(id);
    toast(`'${name}' 컬렉션을 만들었어요`);
  }

  return (
    <div className="app-scroll">
      {/* App bar */}
      <div className="appbar">
        <div className="appbar-greet">
          <div className="name">찜한 상품</div>
        </div>
        <div className="appbar-actions">
          <button className="icon-btn" onClick={() => addCollection(`컬렉션 ${collections.length + 1}`, [])}><Icon name="plus" size={22} /></button>
        </div>
      </div>

      {/* Collection chips */}
      <div className="cat-row mb-16 fade-up">
        {tabs.map(c => (
          <button key={c.id}
                  className={`chip ${collection === c.id ? 'sel' : ''}`}
                  onClick={() => setCollection(c.id)}>
            {c.name}<span style={{ opacity: 0.55, marginLeft: 4 }}>{c.count}</span>
          </button>
        ))}
        <button className="chip outline" onClick={() => addCollection(`컬렉션 ${collections.length + 1}`, [])}>+ 새 컬렉션</button>
      </div>

      {/* AI auto-cluster suggestion */}
      {!dismissed && (
      <div className="px-20 mb-24 fade-up d1">
        <div className="card" style={{ background: 'var(--ink)', color: 'var(--paper)', padding: 16 }}>
          <div className="row between" style={{ marginBottom: 4 }}>
            <div className="row gap-6" style={{ alignItems: 'center' }}>
              <Icon name="sparkle" size={14} color="var(--paper-3)" />
              <span className="t-caption" style={{ color: 'var(--paper-3)' }}>AI 컬렉션 제안</span>
            </div>
            <button className="icon-btn" style={{ color: 'var(--paper-3)', width: 24, height: 24 }} onClick={() => setDismissed(true)}>
              <Icon name="close" size={14} />
            </button>
          </div>
          <div className="t-h2" style={{ color: 'var(--paper)' }}>"베이지 데일리"로 묶을까요?</div>
          <div className="t-body-2 mt-4" style={{ color: 'var(--paper-3)' }}>
            저장한 {beigeItems.length}개 상품이 비슷한 무드예요
          </div>
          <div className="row gap-4" style={{ marginTop: 14 }}>
            {beigeItems.slice(0, 4).map(p => (
              <div key={p.id} style={{
                flex: 1, aspectRatio: '1/1', borderRadius: 6,
                background: `linear-gradient(160deg, ${p.img.light}, ${p.img.dark})`
              }}/>
            ))}
          </div>
          <div className="row gap-6" style={{ marginTop: 14 }}>
            <button className="btn block" style={{ background: 'var(--paper)', color: 'var(--ink)', padding: '11px 16px' }}
                    onClick={() => { addCollection('베이지 데일리', beigeItems.map(p => p.id)); setDismissed(true); }}>
              컬렉션 만들기
            </button>
            <button className="btn ghost" style={{ color: 'var(--paper-3)', flexShrink: 0, padding: '11px 14px' }}
                    onClick={() => setDismissed(true)}>
              나중에
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Section header */}
      <div className="sec-head fade-up d2" style={{ marginTop: 8, marginBottom: 16 }}>
        <div className="t-h2">{collection === 'all' ? '최근 저장한 상품' : (collections.find(c => c.id === collection) || {}).name}</div>
        <span className="more">{shown.length}개</span>
      </div>

      {/* 2-col grid */}
      {shown.length > 0 ? (
        <div className="px-20 fade-up d3" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 10px'
        }}>
          {shown.map(p => (
            <ProductCard key={p.id} product={p} size="auto" showMatch={false}
                         fav={true}
                         onFav={() => onToggleFav(p.id)}
                         onClick={() => onProduct(p.id)} />
          ))}
        </div>
      ) : (
        <div className="px-20" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div className="t-body-2">{collection === 'all' ? '아직 저장한 상품이 없어요' : '이 컬렉션은 비어있어요'}</div>
        </div>
      )}

      <div style={{ height: 24 }} />
    </div>
  );
}

Object.assign(window, { Saved });
