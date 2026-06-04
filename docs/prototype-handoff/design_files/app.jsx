// ╔══════════════════════════════════════════╗
// ║  Main App — state + screen routing       ║
// ╚══════════════════════════════════════════╝

function App() {
  const [screen, setScreen] = React.useState('home');
  const [productId, setProductId] = React.useState(null);
  const [listTitle, setListTitle] = React.useState('');
  const [listKeyword, setListKeyword] = React.useState(null);
  const [tab, setTab] = React.useState('home');
  const [savedIds, setSavedIds] = React.useState(() => new Set());
  const [onboarded, setOnboarded] = React.useState(() => {
    try { return !!localStorage.getItem('mudifit_onboarded'); } catch (e) { return false; }
  });
  const [stage, setStage] = React.useState('splash'); // splash | intro | login | onboarding | app

  function afterSplash() { setStage(onboarded ? 'app' : 'intro'); }
  function afterIntro() { setStage('login'); }
  function afterLogin() { setStage(onboarded ? 'app' : 'onboarding'); }
  function finishOnboarding() {
    try { localStorage.setItem('mudifit_onboarded', '1'); } catch (e) {}
    setOnboarded(true);
    setStage('app');
    setTab('home');
    setScreen('home');
  }
  function doLogout() { setStage('login'); }
  function reOnboard() { setStage('onboarding'); }

  // sheet state: { mode: 'feedback' | 'chat' | null, product, chatPrompt }
  const [sheet, setSheet] = React.useState({ mode: null, product: null, chatPrompt: null });

  function goProduct(id) {
    setProductId(id);
    setScreen('detail');
  }
  function goList(title) {
    setListTitle(title || '오늘의 추천');
    setListKeyword(null);
    setScreen('list');
  }
  function goSearch() {
    setScreen('search');
  }
  function goKeyword(keyword) {
    setListKeyword(keyword);
    setListTitle('');
    setScreen('list');
  }
  function goHome() {
    setScreen('home');
    setProductId(null);
  }
  function goBackFromSearch() {
    // clearing the search screen returns to whichever tab is active
    setScreen('home');
  }
  function toggleFav(id) {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }
  function handleLike(product) {
    setSavedIds(prev => new Set(prev).add(product.id));
    setSheet({ mode: 'feedback', product, chatPrompt: null });
  }
  function handleSave(product) {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(product.id)) next.delete(product.id);
      else next.add(product.id);
      return next;
    });
  }
  function handleSimilar(product) {
    setSheet({ mode: 'chat', product, chatPrompt: 'similar_tone' });
  }
  function openChat(prompt = 'default') {
    const p = productId ? window.SHOP_DATA.byId(productId) : null;
    setSheet({ mode: 'chat', product: p, chatPrompt: prompt });
  }
  function closeSheet() {
    setSheet({ mode: null, product: null, chatPrompt: null });
  }
  function goFromChat(id) {
    closeSheet();
    setTimeout(() => goProduct(id), 100);
  }

  // Tab switching
  function switchTab(t) {
    setTab(t);
    setScreen('home');
    if (t === 'home') goHome();
  }

  const sheetOpen = sheet.mode !== null;

  return (
    <div className="app">
      {/* ── Launch sequence ── */}
      {stage === 'splash' && <Splash onDone={afterSplash} />}
      {stage === 'intro' && <Intro onDone={afterIntro} />}
      {stage === 'login' && <Login onLogin={afterLogin} />}
      {stage === 'onboarding' && (
        <Onboarding onComplete={finishOnboarding} onSkip={finishOnboarding} />
      )}

      {/* Top: screen content */}
      {stage === 'app' && screen === 'home' && tab === 'home' && (
        <Home onProduct={goProduct} onChat={openChat} onList={goList} onKeyword={goKeyword} onSearch={goSearch}
              savedIds={savedIds} onToggleFav={toggleFav} />
      )}
      {stage === 'app' && screen === 'detail' && (
        <Detail productId={productId} onBack={goHome}
                onLike={handleLike} onSave={handleSave}
                onSimilar={handleSimilar} onChat={openChat}
                onProduct={goProduct} onToggleFav={toggleFav}
                savedIds={savedIds} />
      )}
      {stage === 'app' && screen === 'list' && (
        <ListView title={listTitle} keyword={listKeyword} onBack={goHome}
                  onProduct={goProduct} onChat={openChat} onSearch={goSearch}
                  savedIds={savedIds} onToggleFav={toggleFav} />
      )}
      {stage === 'app' && screen === 'search' && (
        <Search onBack={goBackFromSearch}
                onProduct={goProduct} onChat={openChat}
                savedIds={savedIds} onToggleFav={toggleFav} />
      )}
      {stage === 'app' && screen === 'home' && tab === 'explore' && (
        <Explore onProduct={goProduct}
                 savedIds={savedIds} onToggleFav={toggleFav}
                 onChat={openChat} onSearch={goSearch} onKeyword={goKeyword} />
      )}
      {stage === 'app' && screen === 'home' && tab === 'saved' && (
        <Saved onProduct={goProduct}
               savedIds={savedIds} onToggleFav={toggleFav} />
      )}
      {stage === 'app' && screen === 'home' && tab === 'my' && (
        <MyPage onOnboarding={reOnboard} onLogout={doLogout} onKeyword={goKeyword}
                savedCount={savedIds.size} />
      )}

      {/* Scrim */}
      <div className={`scrim ${sheetOpen ? 'on' : ''}`} onClick={closeSheet} />

      {/* Toaster */}
      <Toaster />

      {/* Sheet */}
      <div className={`sheet ${sheetOpen ? 'open' : ''} ${sheet.mode === 'chat' ? 'expanded' : ''}`}
           style={sheet.mode === 'chat' ? { height: '88%' } : {}}>
        <div className="handle" />
        <div className="sheet-content" style={sheet.mode === 'chat' ? { display: 'flex', flexDirection: 'column' } : null}>
          {sheet.mode === 'feedback' && sheet.product && (
            <FeedbackContent product={sheet.product}
                             onChat={(p) => setSheet(s => ({ ...s, mode: 'chat', chatPrompt: p }))}
                             onProduct={goFromChat}
                             onClose={closeSheet} />
          )}
          {sheet.mode === 'chat' && (
            <ChatContent initialPrompt={sheet.chatPrompt} product={sheet.product}
                         onProduct={goFromChat} onClose={closeSheet} />
          )}
        </div>
      </div>

      {/* Bottom nav */}
      {stage === 'app' && (
      <div className="bottom-nav">
        <NavItem icon="home" label="홈" active={tab === 'home' && (screen === 'home' || screen === 'list')}
                 onClick={() => switchTab('home')} />
        <NavItem icon="grid" label="탐색" active={tab === 'explore'}
                 onClick={() => switchTab('explore')} />
        <NavItem icon="heart" label="찜" active={tab === 'saved'}
                 onClick={() => switchTab('saved')} />
        <NavItem icon="user" label="마이" active={tab === 'my'}
                 onClick={() => switchTab('my')} />
      </div>
      )}
    </div>
  );
}

// ─── Mount ───
function Mount() {
  return (
    <div className="page">
      <div className="page-intro">
        <h1>Moodyfit · 인터랙티브 프로토타입</h1>
        <p>스플래시 → 서비스 인트로 → 로그인 → 취향 온보딩(5단계) → 홈까지 전체 시작 플로우가 연결돼 있어요. 마이페이지에서 로그아웃·취향 다시 설정으로 각 단계 재진입이 가능합니다.</p>
        <div className="legend"><span className="dot" />MOODYFIT · AI STYLING · MONO · KR</div>
      </div>
      <IOSDevice width={390} height={844}>
        <App />
      </IOSDevice>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Mount />);
