// ╔════════════════════════════════════════════════╗
// ║  Atoms — shared UI primitives for the prototype ║
// ╚════════════════════════════════════════════════╝

// ─── Icons (Lucide-style outline, 1.5 stroke) ───
function Icon({ name, size = 20, color }) {
  const c = color || 'currentColor';
  const p = { fill: 'none', stroke: c, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const v = `0 0 24 24`;
  switch (name) {
    case 'home': return (<svg width={size} height={size} viewBox={v}><path {...p} d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-4v-7H9v7H5a1 1 0 0 1-1-1z"/></svg>);
    case 'search': return (<svg width={size} height={size} viewBox={v}><circle {...p} cx="11" cy="11" r="7"/><path {...p} d="M20 20l-3.5-3.5"/></svg>);
    case 'heart': return (<svg width={size} height={size} viewBox={v}><path {...p} d="M12 20.5s-7-4.3-7-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5c0 5.7-7 10-7 10z"/></svg>);
    case 'heart-fill': return (<svg width={size} height={size} viewBox={v}><path fill={c} d="M12 20.5s-7-4.3-7-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5c0 5.7-7 10-7 10z"/></svg>);
    case 'user': return (<svg width={size} height={size} viewBox={v}><circle {...p} cx="12" cy="8" r="4"/><path {...p} d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>);
    case 'bookmark': return (<svg width={size} height={size} viewBox={v}><path {...p} d="M6 4h12v17l-6-4-6 4z"/></svg>);
    case 'bookmark-fill': return (<svg width={size} height={size} viewBox={v}><path fill={c} d="M6 4h12v17l-6-4-6 4z"/></svg>);
    case 'thumbs-down': return (<svg width={size} height={size} viewBox={v}><path {...p} d="M7 14v-9a1 1 0 0 1 1-1h9l3 3v6l-3 1h-3l1 5a2 2 0 0 1-2 2l-3-7H7"/></svg>);
    case 'shuffle': return (<svg width={size} height={size} viewBox={v}><path {...p} d="M3 6h4l10 12h4M3 18h4M17 6h4M17 18l3-3M17 6l3 3"/></svg>);
    case 'close': return (<svg width={size} height={size} viewBox={v}><path {...p} d="M6 6l12 12M18 6L6 18"/></svg>);
    case 'back': return (<svg width={size} height={size} viewBox={v}><path {...p} d="M15 6l-6 6 6 6"/></svg>);
    case 'arrow-right': return (<svg width={size} height={size} viewBox={v}><path {...p} d="M5 12h14M13 5l7 7-7 7"/></svg>);
    case 'arrow-up': return (<svg width={size} height={size} viewBox={v}><path {...p} d="M12 19V5M5 12l7-7 7 7"/></svg>);
    case 'sparkle': return (<svg width={size} height={size} viewBox={v}><path {...p} d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z"/><path {...p} d="M19 14l.7 1.7L21 16l-1.3.3-.7 1.7-.7-1.7L17 16l1.3-.3z"/></svg>);
    case 'chat': return (<svg width={size} height={size} viewBox={v}><path {...p} d="M21 12a8 8 0 0 1-12.5 6.7L4 20l1.3-4.5A8 8 0 1 1 21 12z"/></svg>);
    case 'bell': return (<svg width={size} height={size} viewBox={v}><path {...p} d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 21a2 2 0 0 0 4 0"/></svg>);
    case 'check': return (<svg width={size} height={size} viewBox={v}><path {...p} d="M5 12l5 5L20 7"/></svg>);
    case 'send': return (<svg width={size} height={size} viewBox={v}><path {...p} d="M4 12l16-8-6 18-3-7z"/></svg>);
    case 'plus': return (<svg width={size} height={size} viewBox={v}><path {...p} d="M12 5v14M5 12h14"/></svg>);
    case 'minus': return (<svg width={size} height={size} viewBox={v}><path {...p} d="M5 12h14"/></svg>);
    case 'grid': return (<svg width={size} height={size} viewBox={v}><rect {...p} x="4" y="4" width="7" height="7"/><rect {...p} x="13" y="4" width="7" height="7"/><rect {...p} x="4" y="13" width="7" height="7"/><rect {...p} x="13" y="13" width="7" height="7"/></svg>);
    case 'chevron-right': return (<svg width={size} height={size} viewBox={v}><path {...p} d="M9 6l6 6-6 6"/></svg>);
    case 'star': return (<svg width={size} height={size} viewBox={v}><path {...p} d="M12 3l2.5 6 6.5.5-5 4.5 1.5 6.5L12 17l-5.5 3.5L8 14l-5-4.5L9.5 9z"/></svg>);
    case 'trend': return (<svg width={size} height={size} viewBox={v}><path {...p} d="M3 17l6-6 4 4 8-8M14 7h7v7"/></svg>);
    default: return null;
  }
}

// ─── Product image (color block with brand-tag) ───
function ProductImg({ product, shape = 'tall', favBtn = false, fav = false, onFav, brandTag = true }) {
  const style = {
    '--c-light': product.img.light,
    '--c-base': product.img.base,
    '--c-dark': product.img.dark,
  };
  return (
    <div className={`product-img ${shape}`} style={style}>
      {brandTag && <div className="brand-tag">{product.brand}</div>}
      {favBtn && (
        <button className={`fav-btn ${fav ? 'on' : ''}`} onClick={(e) => { e.stopPropagation(); onFav && onFav(); }}>
          <Icon name={fav ? 'heart-fill' : 'heart'} size={15} />
        </button>
      )}
    </div>
  );
}

// ─── Product card (used in grids & h-scrolls) ───
function ProductCard({ product, onClick, showMatch = true, fav, onFav, size = 'md' }) {
  const widths = { sm: 130, md: 160, lg: 180, auto: 'auto' };
  return (
    <div className="p-card tap" style={{ width: widths[size] || 'auto' }} onClick={onClick}>
      <ProductImg product={product} favBtn fav={fav} onFav={onFav} />
      <div className="meta">
        <div className="brand">{product.brand}</div>
        <div className="name">{product.name}</div>
        <div className="row gap-6 mt-4" style={{ alignItems: 'baseline' }}>
          <div className="price">{window.SHOP_DATA.format(product.price)}</div>
          {showMatch && <div className="match">AI {product.match}%</div>}
        </div>
      </div>
    </div>
  );
}

// ─── Chat-style product card (compact) ───
function ChatProductCard({ product, onClick }) {
  return (
    <div className="chat-product" onClick={onClick} style={{ '--c-base': product.img.base }}>
      <div className="img" style={{
        background: `linear-gradient(160deg, ${product.img.light} 0%, ${product.img.base} 60%, ${product.img.dark} 100%)`
      }} />
      <div className="info">
        <div className="brand">{product.brand}</div>
        <div className="name">{product.name}</div>
        <div className="price">{window.SHOP_DATA.format(product.price)}</div>
      </div>
      <Icon name="chevron-right" size={18} color="var(--ink-3)" />
    </div>
  );
}

// ─── Tappable nav-item for bottom bar ───
function NavItem({ icon, label, active, onClick }) {
  return (
    <button className={`nav-item tap ${active ? 'active' : ''}`} onClick={onClick}>
      <Icon name={icon} size={22} />
      <span className="label">{label}</span>
    </button>
  );
}

// ─── Toast (global, fire-and-forget) ───
function toast(msg) {
  window.dispatchEvent(new CustomEvent('app-toast', { detail: msg }));
}

function Toaster() {
  const [items, setItems] = React.useState([]);
  React.useEffect(() => {
    function on(e) {
      const id = Date.now() + Math.random();
      setItems(prev => [...prev, { id, msg: e.detail }]);
      setTimeout(() => setItems(prev => prev.filter(t => t.id !== id)), 2200);
    }
    window.addEventListener('app-toast', on);
    return () => window.removeEventListener('app-toast', on);
  }, []);
  return (
    <div className="toaster">
      {items.map(t => <div key={t.id} className="toast">{t.msg}</div>)}
    </div>
  );
}

Object.assign(window, { Icon, ProductImg, ProductCard, ChatProductCard, NavItem, toast, Toaster });
