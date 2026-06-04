// ╔═══════════════════════════════════════════════╗
// ║  Feedback sheet + AI Chat interface           ║
// ╚═══════════════════════════════════════════════╝

// ─── Step 1: Feedback success + delta visualization ───
function FeedbackContent({ product, onChat, onClose, onProduct }) {
  const { TASTE, byId, format } = window.SHOP_DATA;
  // Boosted tastes derived from product tags
  const boosted = TASTE.filter(t => product.tags.some(tag => tag.includes(t.name) || t.name.includes(tag)))
    .concat(TASTE.filter(t => t.name === '미니멀'))
    .slice(0, 3);
  const similar = window.SHOP_DATA.PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <>
      <div className="fb-hero pulse">
        <div className="badge">
          <Icon name="check" size={26} />
        </div>
        <div className="t-h2" style={{ textAlign: 'center' }}>취향에 반영했어요</div>
        <div className="t-body-2 mt-4" style={{ textAlign: 'center' }}>
          {product.tags.slice(0,2).join(' · ')} 가중치가 올라갔어요
        </div>
      </div>

      <div className="card" style={{ background: 'var(--paper-2)' }}>
        <div className="row between mb-12">
          <div className="t-label" style={{ color: 'var(--ink-2)' }}>학습 변화</div>
          <div className="t-caption">방금 업데이트</div>
        </div>
        <BarList items={boosted.map(t => ({ ...t, delta: 0.08 }))} />
      </div>

      <div className="mt-20">
        <div className="t-h3 mb-12">비슷한 상품도 좋아하실 것 같아요</div>
        <div className="row gap-8">
          {similar.map(p => (
            <div key={p.id} style={{ flex: 1 }} onClick={() => onProduct && onProduct(p.id)}>
              <ProductImg product={p} shape="square" />
              <div className="mt-4">
                <div className="t-caption" style={{ color: 'var(--ink-2)', fontSize: 10 }}>{p.brand}</div>
                <div style={{ fontSize: 11, fontWeight: 500, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col gap-8 mt-24">
        <button className="btn primary large block" onClick={() => onChat('default')}>
          <Icon name="chat" size={16} />
          AI에게 더 물어보기
        </button>
        <button className="btn ghost block" onClick={onClose}>계속 둘러보기</button>
      </div>
    </>
  );
}

// ─── Step 2: AI Chat interface ───
function ChatContent({ initialPrompt, product, onClose, onProduct }) {
  const { AI_REPLIES, QUICK_REPLIES, byId } = window.SHOP_DATA;
  const [messages, setMessages] = React.useState([]);
  const [text, setText] = React.useState('');
  const [thinking, setThinking] = React.useState(false);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    // Seed conversation
    const opener = product
      ? { who: 'ai', text: `"${product.name}" 마음에 드셨군요. 어떻게 더 찾아드릴까요?`, intro: true }
      : { who: 'ai', text: '오늘 어떤 무드 보고 계세요?', intro: true };
    setMessages([opener]);
    // Auto-trigger if initial prompt was passed
    if (initialPrompt && initialPrompt !== 'default') {
      setTimeout(() => handleQuick(initialPrompt), 600);
    }
  }, []);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  function handleQuick(key) {
    const reply = AI_REPLIES[key] || AI_REPLIES.default;
    // map key to user-facing label
    const userText = {
      similar_tone: '비슷한 톤으로 보여줘',
      lighter: '더 라이트한 느낌으로',
      same_brand: '같은 브랜드 다른 거',
      cheaper: '예산 10만원 이하로',
      different_color: '다른 컬러로',
      silhouette: '비슷한 실루엣으로',
    }[key] || '비슷한 걸로 찾아줘';
    setMessages(m => [...m, { who: 'me', text: userText }]);
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMessages(m => [...m, { who: 'ai', text: reply.text, products: reply.products }]);
    }, 700);
  }

  function handleSend(e) {
    e && e.preventDefault();
    if (!text.trim()) return;
    const userText = text.trim();
    setText('');
    setMessages(m => [...m, { who: 'me', text: userText }]);
    setThinking(true);
    // Naive routing
    setTimeout(() => {
      setThinking(false);
      let key = 'default';
      const t = userText.toLowerCase();
      if (t.includes('비슷') && t.includes('톤')) key = 'similar_tone';
      else if (t.includes('라이트') || t.includes('밝')) key = 'lighter';
      else if (t.includes('브랜드')) key = 'same_brand';
      else if (t.includes('가격') || t.includes('만원') || t.includes('저렴')) key = 'cheaper';
      else if (t.includes('컬러') || t.includes('색')) key = 'different_color';
      else if (t.includes('실루엣') || t.includes('핏')) key = 'silhouette';
      const reply = AI_REPLIES[key];
      setMessages(m => [...m, { who: 'ai', text: reply.text, products: reply.products }]);
    }, 800);
  }

  return (
    <div className="col" style={{ flex: 1, minHeight: 0 }}>
      <div className="row between" style={{ padding: '4px 0 12px' }}>
        <div className="row gap-8" style={{ alignItems: 'center' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 999, background: 'var(--ink)',
            color: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon name="sparkle" size={16} />
          </div>
          <div>
            <div className="t-h3" style={{ lineHeight: 1.1 }}>AI 큐레이터</div>
            <div className="t-caption">취향 기반으로 골라드려요</div>
          </div>
        </div>
        <button className="icon-btn" onClick={onClose}><Icon name="close" size={20} /></button>
      </div>

      <div ref={scrollRef} className="col gap-12" style={{
        flex: 1, overflowY: 'auto', paddingBottom: 12,
        scrollbarWidth: 'none'
      }}>
        <style>{`.col::-webkit-scrollbar{display:none;}`}</style>
        {messages.map((m, i) => (
          m.who === 'me' ? (
            <div key={i} className="user-bubble fade-up">{m.text}</div>
          ) : (
            <div key={i} className="col gap-6 fade-up" style={{ maxWidth: '92%' }}>
              <div className="ai-bubble" style={{ background: 'var(--paper-3)', color: 'var(--ink)', borderTopLeftRadius: i === 0 ? 16 : 4 }}>
                {!m.intro && <div className="who" style={{ color: 'var(--ink-2)' }}>AI</div>}
                {m.text}
              </div>
              {m.products && (
                <div className="col gap-6">
                  {m.products.map(pid => {
                    const p = byId(pid);
                    return p ? (
                      <ChatProductCard key={pid} product={p} onClick={() => onProduct(pid)} />
                    ) : null;
                  })}
                </div>
              )}
            </div>
          )
        ))}
        {thinking && (
          <div className="ai-bubble fade-up" style={{ background: 'var(--paper-3)', color: 'var(--ink-2)', borderTopLeftRadius: 4 }}>
            <div className="row gap-4">
              <span className="dot-typ" />
              <span className="dot-typ" />
              <span className="dot-typ" />
            </div>
            <style>{`
              .dot-typ { width:6px; height:6px; border-radius:50%; background: var(--ink-2);
                animation: typ 1s infinite ease-in-out; }
              .dot-typ:nth-child(2){ animation-delay:0.15s; }
              .dot-typ:nth-child(3){ animation-delay:0.30s; }
              @keyframes typ { 0%,80%,100% { opacity:0.3; transform:translateY(0); } 40% { opacity:1; transform:translateY(-2px); } }
            `}</style>
          </div>
        )}
      </div>

      {/* Quick replies */}
      <div className="row gap-6 mt-8" style={{ overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 6 }}>
        {QUICK_REPLIES.map((q, i) => {
          const keyMap = ['similar_tone', 'lighter', 'same_brand', 'cheaper', 'different_color', 'silhouette'];
          return (
            <button key={i} className="chip outline" style={{ flexShrink: 0, fontSize: 11 }}
                    onClick={() => handleQuick(keyMap[i])}>{q}</button>
          );
        })}
      </div>

      {/* Input */}
      <form className="chat-input" onSubmit={handleSend}>
        <input value={text} onChange={(e) => setText(e.target.value)}
               placeholder="원하는 무드를 자유롭게 말해주세요"/>
        <button type="submit"><Icon name="arrow-up" size={18} /></button>
      </form>
    </div>
  );
}

Object.assign(window, { FeedbackContent, ChatContent });
