// ╔══════════════════════════════════════════╗
// ║  Data: fictional Korean fashion catalog  ║
// ╚══════════════════════════════════════════╝

window.SHOP_DATA = (() => {
  const PRODUCTS = [
    {
      id: 'p01', brand: 'MUMYUNG', name: '워싱 코튼 와이드 셔츠',
      price: 68000, match: 96, cat: 'top', tags: ['미니멀', '베이지', '오버사이즈'],
      colors: ['#E8DFCB', '#3A3633', '#9FA89B'],
      img: { light: '#E8DDC4', base: '#D6C8A4', dark: '#A89070' },
      reason: '평소 좋아하시는 <strong>내추럴·미니멀</strong> 무드 + 베이지 톤이 잘 맞아요.',
    },
    {
      id: 'p02', brand: 'STUDIO LOTRE', name: '오버사이즈 트렌치 코트',
      price: 289000, match: 91, cat: 'outer', tags: ['클래식', '카멜', '아우터'],
      colors: ['#9F7A4F', '#3A3633', '#5E4A38'],
      img: { light: '#C9A576', base: '#9F7A4F', dark: '#6E5333' },
      reason: '최근 본 <strong>카멜 톤 아우터</strong> 3개와 유사한 실루엣이에요.',
    },
    {
      id: 'p03', brand: 'HODU', name: '하이라이즈 와이드 슬랙스',
      price: 89000, match: 89, cat: 'bottom', tags: ['미니멀', '차콜', '데일리'],
      colors: ['#4A4640', '#7A746D', '#3A3633'],
      img: { light: '#605A52', base: '#454039', dark: '#2E2A26' },
      reason: '저장하신 <strong>차콜·미니멀</strong> 상품과 같은 분위기예요.',
    },
    {
      id: 'p04', brand: 'LATÉ NU', name: '캐시미어 V넥 베스트',
      price: 138000, match: 85, cat: 'top', tags: ['오트밀', '레이어드', '니트'],
      colors: ['#E5DABD', '#C9A576', '#857865'],
      img: { light: '#EFE6D0', base: '#DACEAF', dark: '#A89678' },
      reason: '이번 주 <strong>베이지 톤 레이어드</strong> 조합을 자주 보셨어요.',
    },
    {
      id: 'p05', brand: 'KARUSO', name: '미니멀 가죽 토트백',
      price: 245000, match: 82, cat: 'bag', tags: ['가죽', '다크브라운', '에브리데이'],
      colors: ['#5C4632', '#3A3633', '#8A6E50'],
      img: { light: '#7D5F44', base: '#5C4632', dark: '#3E2E1F' },
      reason: '<strong>가죽 소품</strong> 카테고리 첫 추천이에요.',
    },
    {
      id: 'p06', brand: 'THE OTHER STUDIO', name: '클래식 로우 스니커즈',
      price: 168000, match: 78, cat: 'shoes', tags: ['화이트', '미니멀', '슈즈'],
      colors: ['#EFECE4', '#3A3633', '#9FA89B'],
      img: { light: '#F4F0E6', base: '#E2DCC9', dark: '#B5AC93' },
      reason: '미니멀 무드의 <strong>데일리 슈즈</strong> 후보예요.',
    },
    {
      id: 'p07', brand: 'ATELIER 88', name: '울 캐시미어 머플러',
      price: 88000, match: 76, cat: 'acc', tags: ['카멜', '울', '액세서리'],
      colors: ['#9F7A4F', '#E5DABD', '#5E4A38'],
      img: { light: '#C49870', base: '#9F7A4F', dark: '#6E5333' },
      reason: '곧 추워져요. <strong>카멜 머플러</strong>는 평소 컬러 팔레트랑 잘 어울려요.',
    },
    {
      id: 'p08', brand: 'LOMOND', name: '워시드 데님 와이드 팬츠',
      price: 79000, match: 73, cat: 'bottom', tags: ['데님', '미디엄 워시', '와이드'],
      colors: ['#7A8A9F', '#5A6A7D', '#3A3633'],
      img: { light: '#9AAABD', base: '#7A8A9F', dark: '#56657A' },
      reason: '와이드 실루엣을 좋아하셔서요.',
    },
  ];

  // Bar chart data for "내 취향 키워드"
  const TASTE = [
    { name: '미니멀', value: 0.78, delta: 0.06 },
    { name: '베이지', value: 0.71, delta: 0.04 },
    { name: '오버사이즈', value: 0.62, delta: 0.08 },
    { name: '내추럴', value: 0.55, delta: 0.02 },
    { name: '레이어드', value: 0.42, delta: 0 },
  ];

  // Learning sparkline (week)
  const LEARN_TREND = [42, 47, 51, 55, 58, 60, 64];

  // Categories
  const CATS = [
    { id: 'all', name: '전체' },
    { id: 'top', name: '상의' },
    { id: 'bottom', name: '하의' },
    { id: 'outer', name: '아우터' },
    { id: 'shoes', name: '슈즈' },
    { id: 'bag', name: '가방' },
    { id: 'acc', name: '액세서리' },
  ];

  // Quick replies for chat
  const QUICK_REPLIES = [
    '비슷한 톤으로',
    '더 라이트한 느낌',
    '같은 브랜드',
    '예산 10만원 이하',
    '다른 컬러',
    '비슷한 실루엣',
  ];

  // 실시간 인기 검색어 (라이브 랭킹)
  const TRENDING = [
    { term: '오버사이즈 셔츠', change: 'up', delta: 2 },
    { term: '카멜 코트', change: 'up', delta: 1 },
    { term: '워시드 데님', change: 'same', delta: 0 },
    { term: '캐시미어 베스트', change: 'new', delta: 0 },
    { term: '미니멀 토트백', change: 'down', delta: 1 },
    { term: '로우 스니커즈', change: 'up', delta: 3 },
    { term: '울 머플러', change: 'down', delta: 2 },
    { term: '와이드 슬랙스', change: 'same', delta: 0 },
    { term: '린넨 셔츠', change: 'new', delta: 0 },
    { term: '레이어드 니트', change: 'up', delta: 1 },
  ];

  // AI 맞춤 추천 검색어 (취향 기반)
  const AI_SEARCHES = ['베이지 셔츠', '데일리 슬랙스', '가을 레이어드', '미니멀 가방'];

  // 최근 검색어
  const RECENT = ['린넨 셔츠', '다크 브라운 가방'];

  // Fake conversational responses
  const AI_REPLIES = {
    similar_tone: {
      text: '비슷한 베이지·내추럴 톤으로 골라봤어요.',
      products: ['p04', 'p07', 'p01'],
    },
    lighter: {
      text: '조금 더 라이트하고 부드러운 톤이에요.',
      products: ['p06', 'p04', 'p01'],
    },
    same_brand: {
      text: 'MUMYUNG의 다른 상품들이에요.',
      products: ['p01', 'p03', 'p04'],
    },
    cheaper: {
      text: '10만원 이하로 보여드릴게요.',
      products: ['p01', 'p07', 'p03'],
    },
    different_color: {
      text: '같은 무드의 다른 컬러로요.',
      products: ['p02', 'p05', 'p07'],
    },
    silhouette: {
      text: '비슷한 오버사이즈 실루엣이에요.',
      products: ['p03', 'p08', 'p02'],
    },
    default: {
      text: '잠깐, 비슷한 분위기로 찾아볼게요…',
      products: ['p04', 'p01', 'p07'],
    },
  };

  function format(price) {
    return '₩ ' + price.toLocaleString('ko-KR');
  }

  function byId(id) { return PRODUCTS.find(p => p.id === id); }

  return { PRODUCTS, TASTE, LEARN_TREND, CATS, QUICK_REPLIES, AI_REPLIES, TRENDING, AI_SEARCHES, RECENT, format, byId };
})();
