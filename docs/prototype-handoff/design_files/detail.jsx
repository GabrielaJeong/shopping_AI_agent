// ╔══════════════════════════════╗
// ║  Product Detail screen        ║
// ╚══════════════════════════════╝

function Detail({ productId, onBack, onLike, onSave, onSimilar, onChat, onProduct, onToggleFav, savedIds }) {
  const { byId, format, PRODUCTS } = window.SHOP_DATA;
  const product = byId(productId);
  const [sz, setSz] = React.useState('M');
  const [colorIdx, setColorIdx] = React.useState(0);
  const [imgIdx, setImgIdx] = React.useState(0);
  const saved = savedIds.has(productId);
  const sizes = ['S', 'M', 'L', 'XL'];
  const moreFromBrand = PRODUCTS.filter(p => p.brand === product.brand && p.id !== product.id);
  const similar = PRODUCTS.filter(p => p.id !== product.id && p.tags.some(t => product.tags.includes(t))).slice(0, 4);

  if (!product) return null;

  return (
    <div className="app-scroll">
      {/* Hero */}
      <div className="detail-hero" style={{
        background: `linear-gradient(160deg, ${product.img.light} 0%, ${product.img.base} 55%, ${product.img.dark} 100%)`
      }}>
        <button className="back" onClick={onBack}><Icon name="back" size={20} /></button>
        <div className="indicator">{imgIdx + 1} / 4</div>
      </div>

      {/* Thumbs */}
      <div className="detail-thumbs">
        {[0,1,2,3].map(i => (
          <div key={i} className={`t ${i === imgIdx ? 'active' : ''}`} onClick={() => setImgIdx(i)}
               style={{
                 background: i === 0
                   ? `linear-gradient(160deg, ${product.img.light}, ${product.img.dark})`
                   : `linear-gradient(${160 + i * 30}deg, ${product.img.base}, ${product.img.light})`
               }}
          />
        ))}
      </div>

      {/* Product meta */}
      <div className="px-20 mt-16">
        <div className="t-label" style={{ color: 'var(--ink-2)' }}>{product.brand}</div>
        <h1 className="t-h1 mt-4" style={{ margin: '4px 0 0' }}>{product.name}</h1>
        <div className="row gap-12 mt-8" style={{ alignItems: 'baseline' }}>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>{format(product.price)}</div>
          <span className="chip ai">AI MATCH {product.match}%</span>
        </div>
        <div className="row gap-4 mt-12" style={{ flexWrap: 'wrap' }}>
          {product.tags.map(t => <span key={t} className="chip tiny outline">{t}</span>)}
        </div>
      </div>

      {/* AI reason */}
      <div className="px-20 mt-20">
        <div className="card" style={{ background: 'var(--accent-soft)' }}>
          <div className="row gap-8" style={{ alignItems: 'flex-start' }}>
            <div style={{
              flexShrink: 0, width: 28, height: 28, borderRadius: 999,
              background: 'var(--ink)', color: 'var(--paper)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="sparkle" size={15} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="t-label" style={{ color: 'var(--ink-2)' }}>왜 이 상품?</div>
              <div className="t-body mt-4" dangerouslySetInnerHTML={{ __html: product.reason }} />
              <button className="row gap-4 mt-12" style={{
                background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
                color: 'var(--ink)', fontSize: 12, fontWeight: 600, alignItems: 'center'
              }} onClick={() => onChat('default')}>
                <Icon name="chat" size={14} />
                AI에게 더 물어보기
                <Icon name="arrow-right" size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="px-20 mt-24">
        <div className="t-label mb-8" style={{ color: 'var(--ink-2)' }}>컬러 · {colorIdx === 0 ? '오리지널' : colorIdx === 1 ? '딥 블랙' : '세이지'}</div>
        <div className="opt-row mb-16">
          {product.colors.map((c, i) => (
            <button key={i} className={`opt-color ${colorIdx === i ? 'sel' : ''}`}
                    style={{ background: c }} onClick={() => setColorIdx(i)} />
          ))}
        </div>
        <div className="t-label mb-8" style={{ color: 'var(--ink-2)' }}>사이즈</div>
        <div className="opt-row">
          {sizes.map(s => (
            <button key={s} className={`opt-sz ${sz === s ? 'sel' : ''} ${s === 'XL' ? 'dis' : ''}`}
                    onClick={() => s !== 'XL' && setSz(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback prompt */}
      <div className="px-20 mt-24">
        <div className="row between mb-12">
          <div className="t-h3">이 추천이 어떠세요?</div>
          <span className="t-caption">탭하면 학습돼요</span>
        </div>
        <div className="fb-grid">
          <button className="fb-btn like tap" onClick={() => onLike(product)}>
            <Icon name="heart" size={18} />
            <span className="lbl">좋아요</span>
          </button>
          <button className="fb-btn tap" onClick={onBack}>
            <Icon name="thumbs-down" size={18} />
            <span className="lbl">별로예요</span>
          </button>
          <button className="fb-btn tap" onClick={() => onSimilar(product)}>
            <Icon name="shuffle" size={18} />
            <span className="lbl">비슷한</span>
          </button>
          <button className="fb-btn tap" onClick={() => onSave(product)}>
            <Icon name={saved ? 'bookmark-fill' : 'bookmark'} size={18} />
            <span className="lbl">{saved ? '저장됨' : '저장'}</span>
          </button>
        </div>
      </div>

      {/* Spec list */}
      <div className="px-20 mt-32">
        <div className="t-h3 mb-12">상품 정보</div>
        <div className="col gap-8">
          {[
            ['소재', '100% 면 (워싱 가공)'],
            ['실루엣', '오버사이즈 · 박시 핏'],
            ['컬러', '에크루 베이지'],
            ['제조국', '대한민국'],
          ].map(([k, v]) => (
            <div key={k} className="row between" style={{ paddingBottom: 8, borderBottom: '1px solid var(--line-soft)' }}>
              <span className="t-body-2">{k}</span>
              <span className="t-body" style={{ fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* More from brand */}
      {moreFromBrand.length > 0 && (
        <div className="mt-32">
          <div className="sec-head mb-12">
            <div className="t-h3">{product.brand}의 다른 상품</div>
          </div>
          <div className="h-scroll">
            {moreFromBrand.map(p => (
              <ProductCard key={p.id} product={p} showMatch={false}
                           fav={savedIds.has(p.id)} onFav={() => onToggleFav && onToggleFav(p.id)}
                           onClick={() => onProduct && onProduct(p.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Similar */}
      <div className="mt-32">
        <div className="sec-head mb-12">
          <div className="t-h3">비슷한 무드</div>
          <span className="more" onClick={() => onSimilar(product)}>전체보기 →</span>
        </div>
        <div className="h-scroll">
          {similar.map(p => (
            <ProductCard key={p.id} product={p}
                         fav={savedIds.has(p.id)}
                         onFav={() => onToggleFav && onToggleFav(p.id)}
                         onClick={() => onProduct && onProduct(p.id)} />
          ))}
        </div>
      </div>

      <div style={{ height: 32 }} />
    </div>
  );
}

Object.assign(window, { Detail });
