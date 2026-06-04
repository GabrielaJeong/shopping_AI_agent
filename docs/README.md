# Handoff: Moodyfit — AI 스타일 큐레이션 쇼핑앱

## Overview
Moodyfit is a mobile fashion-commerce app whose core idea is **AI taste learning**: the user
teaches the app their style through a short onboarding quiz and ongoing per-product feedback
(like / dislike / "show similar" / save). The app responds with an increasingly personalized
feed, a conversational AI curator, and auto-organized saved collections.

This package documents the full **launch + core-loop** experience as designed in an HTML
prototype: Splash → Service Intro → Login → Taste Onboarding (5 steps) → Home, plus the four
main tabs (Home / Explore / Saved / My) and the two overlay sheets (Feedback, AI Chat).

## About the Design Files
The files in `design_files/` are **design references created in HTML/React-via-Babel** — they
are prototypes that demonstrate the intended look, motion, and behavior. **They are not
production code to copy verbatim.** The Babel-in-browser setup, the `window.SHOP_DATA` global,
and the `Object.assign(window, …)` cross-file sharing are prototype scaffolding only.

Your task is to **recreate these designs in the target codebase's environment** using its
established patterns, component library, routing, and state management. If no codebase exists
yet, choose an appropriate stack (e.g. React Native / Expo or SwiftUI for a real mobile app;
Next.js + a mobile-shell layout for web) and implement the designs there. Keep the visual
result faithful; replace the prototype's mechanics with real ones.

## Fidelity
**High-fidelity.** Colors, typography, spacing, radii, shadows, copy, and interactions are all
final-intent. Recreate the UI pixel-accurately using the codebase's libraries. The product
imagery is intentionally represented by **flat color blocks** (see Assets) — those are
placeholders for real photography, not a design choice to preserve.

The app canvas is designed at **390 × 844 (iOS, @1x logical)**. The prototype renders inside a
faux iOS device frame; in production this is simply the phone screen. A 54px top safe-area pad
is reserved for the status bar / dynamic island.

---

## Design Tokens

### Color
The palette is a **warm monochrome** ("paper" warm-whites against "ink" warm-charcoal), with a
single muted red used only for "live/hot" signals.

| Token | Hex | Usage |
|---|---|---|
| `--paper` | `#F7F4EF` | App background |
| `--paper-2` | `#FBF8F2` | Raised cards |
| `--paper-3` | `#EFE9DE` | Input fields, hover fills, chips |
| `--paper-deep` | `#E6DFD0` | Pressed / deeper fill |
| `--ink` | `#3A3633` | Primary text, primary buttons, active icons |
| `--ink-2` | `#6B655E` | Secondary text |
| `--ink-3` | `#9B948B` | Tertiary text, placeholders |
| `--ink-soft` | `#C9C2B4` | Disabled, dots, clear buttons |
| `--line` | `#E2DCD0` | Borders |
| `--line-soft` | `#ECE7DC` | Subtle dividers |
| `--accent` | `#3A3633` | = ink (no separate accent hue) |
| `--accent-soft` | `#ECE7DE` | Soft selected/tag fill, "like" button bg |
| `--accent-deep` | `#1F1C1A` | Primary button hover |
| `--hot` | `#C25450` | Live ranking, "up" trend (muted red) |
| `--hot-soft` | `#F2DCDA` | Hot background tint |
| Device letterbox | `#E8E4DC` | Page bg outside the phone (prototype only) |

Splash screen background = `--ink` (`#3A3633`), with all marks/text in `--paper`.

### Typography
- Font family: **Pretendard** (Korean-first variable font). Fallback stack:
  `"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif`
- Base body letter-spacing: `-0.01em`; `font-feature-settings: "ss06", "tnum"` (tabular numerals).
- The brand wordmark "Moodyfit" uses a **Helvetica/Arial-style bold** (Latin), 700 weight, `letter-spacing: -0.4px`.

| Style | Size | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|
| Display | 26px | 700 | -0.7px | 1.2 |
| H1 | 22px | 700 | -0.5px | 1.25 |
| H2 | 18px | 600 | -0.4px | 1.3 |
| H3 | 15px | 600 | -0.3px | 1.35 |
| Body | 14px | 400 | — | 1.55 |
| Body-2 | 13px | 400 | — | 1.5 (color ink-2) |
| Caption | 11px | 400 | — | 1.5 (color ink-3) |
| Label | 10px | 500 | 0.08em, UPPERCASE | — |
| Price | 16px | 600 | -0.3px | — |

Large display headlines in launch/onboarding go up to **27–28px / 700 / -0.8…-0.9px**, line-height ~1.25.

### Spacing
Spacing scale (used as gap / margin / padding utilities): **4, 6, 8, 10, 12, 16, 20, 24, 32**.
Standard horizontal screen padding is **20px** (`.px-20`). Cards pad **14–16px**. Scroll areas
reserve **100px** bottom padding to clear the bottom nav; pinned CTAs sit in a 14px/20px/30px
gradient-fade footer.

### Radius
| Token | Value | Usage |
|---|---|---|
| `--r-card` | 10px | Cards |
| `--r-image` | 6px | Product images |
| `--r-chip` | 6px | Chips/tags |
| `--r-btn` | 8px | Buttons |
| Sheet top corners | 20px | Bottom sheets |
| App icon squircle | 232/1024 ≈ 22.6% | Launcher icon |
| Pills / dots / icon-btn | 999px | Fully round |

### Shadows
| Token | Value |
|---|---|
| `--sh-card` | `0 1px 2px rgba(58,54,51,0.04), 0 4px 12px rgba(58,54,51,0.04)` |
| `--sh-sheet` | `0 -8px 30px rgba(58,54,51,0.10)` |
| `--sh-elev` | `0 12px 40px rgba(58,54,51,0.12), 0 2px 6px rgba(58,54,51,0.06)` |

### Motion
- `fade-up`: opacity 0→1 + translateY(8px→0), ~0.4s cubic-bezier(0.2,0.85,0.25,1). Stagger via
  `.d1/.d2/.d3` delay classes (~0.06–0.15s steps).
- `pulse`: subtle scale-in emphasis on confirmation badges.
- Splash mark/word: `splash-in` 0.7s ease-out, scale 0.92→1 + slight rise.
- Progress bars / learning bars: width transition 0.4–0.9s cubic-bezier(0.2,0.85,0.25,1).
- Live dot blink: 1.4s opacity loop. Chat "typing" dots: 1s staggered bounce.
- Respect `prefers-reduced-motion`: entrance states must resolve to the visible end-state.

### Iconography
Line icons, ~currentColor, sizes 13–26px. Names referenced in the prototype:
`home, grid, heart, heart-fill, user, sparkle, chat, search, close, back, arrow-right, arrow-up,
send, check, bookmark, thumbs-down, shuffle`. Use the target codebase's icon set with equivalents;
keep stroke weight light and consistent. **Emoji are not used.**

---

## App Structure & Navigation

A single root component owns a **`stage`** machine and, within the app stage, a **`tab` + `screen`** router.

```
stage: 'splash' → 'intro' → 'login' → 'onboarding' → 'app'
                                                        │
   first launch only (gated by persisted onboarded flag)│
                                                        ▼
   app stage:  tab ∈ {home, explore, saved, my}
               screen ∈ {home, detail, list, search}
               overlay sheet ∈ {none, feedback, chat}
```

- **Persistence**: an `onboarded` boolean is stored (prototype uses `localStorage["mudifit_onboarded"]`).
  On launch, Splash → if onboarded go straight to `app`, else → `intro`.
- **Login** is shown after intro; any auth button (or "둘러보기") proceeds. If already onboarded,
  login → `app`; otherwise login → `onboarding`.
- After onboarding completes, set the flag and enter `app` on the Home tab.
- From **My**: "로그아웃" returns to `login`; "취향 다시 설정하기" re-enters `onboarding`.
- **Bottom nav** (4 tabs) is visible only in the `app` stage. Switching tabs resets `screen` to `home`.
- `detail`, `list`, `search` are **pushed screens** over the Home tab (back returns to Home).
- The Home-tab active state also highlights while on `list` (it's a Home sub-flow).

### State variables (prototype reference)
- `stage` — launch machine (see above)
- `onboarded` — persisted boolean
- `tab` — active bottom-nav tab
- `screen` — pushed screen within a tab
- `productId` — currently opened product (detail)
- `listTitle` / `listKeyword` — context for the list view
- `savedIds` — Set of saved product ids (drives heart fill across all screens)
- `sheet` — `{ mode: 'feedback' | 'chat' | null, product, chatPrompt }`

Liking a product **adds it to `savedIds`** AND opens the feedback sheet. Saving toggles `savedIds`.
"Show similar" opens the chat sheet pre-seeded with the `similar_tone` prompt.

---

## Screens / Views

### 1. Splash
- **Purpose**: Brand moment while the app boots (~1.8s, then auto-advances).
- **Layout**: Full screen, `--ink` background. Vertically + horizontally centered stack:
  the **brand mark** above the **"Moodyfit"** wordmark (both in `--paper`).
- **Mark**: an SVG emblem — a thin outline **ring** with a **crescent ("mood phase")** inside it,
  rendered via a mask (a filled circle minus an offset circle). Ring stroke is light (~1.6px at
  small sizes). No tagline.

### 2. Service Intro (carousel)
- **Purpose**: Explain the 3 core value props before login.
- **Layout**: Top bar with small "Moodyfit" lockup (mark + word) left, "건너뛰기" (skip) right.
  A mini service-screen mock illustration, then headline + body, then dot indicators + a full-width
  CTA pinned near the bottom. 3 slides; last CTA reads **"시작하기"**, others **"다음"**.
- **Slides** (no numbered "01 ·" kicker — keep it clean):
  1. **취향을 아는 추천** — "고른 무드를 학습해, 매일 당신만을 위한 옷을 골라드려요." Mock: an AI chat
     bubble + 2 product thumbnails labeled with match %.
  2. **쓸수록 정확해져요** — "좋아요·별로예요 한 번이면 취향에 바로 반영돼요." Mock: a product thumb + a
     learning bar ("취향 학습 +8% → 64%") + the 4 feedback buttons row.
  3. **찜하고, AI가 정리해요** — "저장한 옷을 무드별 컬렉션으로 알아서 묶어드려요." Mock: an "AI 컬렉션 제안"
     dark card + a 3-up product grid.
- **Note**: These mocks are *miniatures of real features* (see Feedback sheet & Saved tab). Build the
  illustration from the same components at reduced scale, or as static representative cards.

### 3. Login
- **Purpose**: Account entry; allows guest browsing.
- **Layout** (top→bottom): "Moodyfit" lockup; headline **"오늘의 무드를\n입어보세요"** (27px/700);
  body "Moodyfit이 취향에 맞는 옷을 매일 골라드려요. 30초면 시작할 수 있어요."; a 3-up product teaser grid;
  then pinned auth stack:
  - **이메일로 계속하기** — primary (dark) button with a send icon
  - **Apple로 계속하기** — secondary (paper-2) button
  - **카카오로 시작하기** — secondary (paper-2) button
  - **로그인 없이 둘러보기** — ghost button
  - Legal caption: "계속 진행하면 Moodyfit의 이용약관과 개인정보 처리방침에 동의하게 됩니다." (terms underlined).
- In production, wire Apple/Kakao to real SDKs and apply their official button styling/branding;
  the prototype renders them in the app's mono tone as placeholders.

### 4. Onboarding (5-step taste quiz)
A `phase` machine: **welcome → steps(0..4) → analyzing → summary**.

- **Welcome**: "Moodyfit" lockup + "둘러보기" skip; a tall striped **lookbook placeholder** hero;
  headline "취향만 알려주세요,\n나머지는 AI가."; body about the 5 questions; pinned "시작하기" CTA;
  caption "약 30초 · 언제든 다시 설정할 수 있어요".
- **Steps** (order is fixed): a top bar (back / "STEP n / 5" / "건너뛰기"), a thin **progress bar**
  (fills (step+1)/5), a title + subtitle, the option UI, and a pinned **"다음"** CTA (disabled until
  the step's minimum selections are met; last step CTA = **"취향 분석 시작"**). A caption shows the
  current selection count / minimum.
  1. **무드** (min 3, multi) — 2-col image cards: 미니멀 / 내추럴 / 클래식 / 스트릿 / 빈티지 / 스포티.
     Selected card shows an ink check badge.
  2. **예산** (single select) — text chips: 5만원 이하 / 5–10만원 / 10–20만원 / 20–40만원 / 40만원 이상 / 상관 없어요.
  3. **카테고리** (min 2, multi) — 2-col image cards: 상의 / 하의 / 아우터 / 슈즈 / 가방 / 액세서리.
  4. **컬러** (min 2, multi) — 2-col **color swatch** tiles (gradient fills): 베이지 / 모노톤 / 어스 톤 /
     세이지 / 더스티 / 밝은 톤. Label below each swatch.
  5. **라이프스타일** (min 2, multi) — text chips: 데일리 / 출근룩 / 여행 / 데이트 / 파티 / 홈웨어.
- **Analyzing**: centered circular **progress ring** counting 0→100% (~2.4s) with a small sparkle
  orbiting the ring; rotating status copy ("취향을 분석하고 있어요" → "비슷한 무드를 찾는 중이에요" →
  "추천을 준비하고 있어요"); then auto-advances.
- **Summary**: a round ink check badge; headline **"취향 분석 완료!"**; body addressing the user by name
  ("지은님의 취향을 이렇게 파악했어요…"); a 2-col grid of **taste keyword cards**, each showing the
  keyword name + a **match %** (96, 93, 90, …) + an animated fill bar; a soft "오늘의 픽" note card;
  pinned CTA **"내게 꼭 맞는 추천템 보러가기"** → enters Home.

### 5. Home (tab)
- **Purpose**: Personalized AI feed.
- **Layout**: sticky app bar (greeting label + name on the left, notification + other icon-buttons on
  the right); a search entry; a horizontal category chip filter; an AI banner/chip that opens chat;
  an **"오늘의 픽" hero** product with reason copy + match %; horizontally swipeable pick row; sectioned
  product lists (with "전체보기" → list view). Product cards show brand, name, price, match %, and a
  heart toggle. Tapping a card → Detail. Tapping a keyword/section → List view.

### 6. Explore (tab)
- 2-column product **grid**; sort toggle (**AI 추천순 / 가격**); category filter; "AI 발견" category
  entries that open a list view. Same product-card vocabulary as Home.

### 7. Saved / 찜 (tab)
- Saved products as collections. A dark **"AI 컬렉션 제안"** card ("'베이지 데일리'로 묶을까요?") that can
  be created or dismissed; collection filter chips; **"새 컬렉션 생성"**; product grid. Heart toggles
  remove from saved.

### 8. My / 마이 (tab)
- A **taste-learning ring** (overall %); **taste keyword bars** (미니멀 78% +6, 베이지 71% +4, …, each with
  a delta); a learning trend; tappable taste keywords → list view; settings rows including notifications,
  account, **취향 다시 설정하기** (→ onboarding), and **로그아웃** (→ login).

### 9. Search (pushed screen)
- Sticky search field with clear button; **live "실시간 인기" ranking** list (rank number, term, and an
  up/down/same/NEW change indicator; top ranks emphasized; a blinking live dot) that auto-refreshes;
  **AI 추천 검색어** chips; **최근 검색어** with individual + clear-all delete; autocomplete suggestion rows
  (matched substring bolded). Selecting a term → list view; "결과 없음" path → chat. Back → Home.

### 10. List view (pushed screen)
- Sticky header (back + title); product list/grid filtered by `listKeyword` or titled by `listTitle`;
  search entry; same product cards. Back → Home.

### 11. Feedback sheet (overlay) — *core feature*
- **Trigger**: tapping **좋아요 (like)** on a product detail. Also adds the product to saved.
- **Layout** (bottom sheet, rounded 20px top, scrim behind): a `pulse` **success hero** — round ink
  check badge + **"취향에 반영했어요"** + subcopy "{tag1} · {tag2} 가중치가 올라갔어요"; a **"학습 변화"**
  card showing 2–3 boosted taste keywords as bars with +deltas (label "방금 업데이트"); a **"비슷한 상품도
  좋아하실 것 같아요"** 3-up product row (tappable → detail); CTAs: primary **"AI에게 더 물어보기"**
  (→ chat sheet) and ghost **"계속 둘러보기"** (close).
- The 4 feedback actions on the detail screen are: **좋아요 / 별로예요 / 비슷한 / 저장**. The "좋아요" button
  uses a **soft `--accent-soft` fill with an outline (not filled) heart** so it doesn't read as
  already-activated; the others share the neutral treatment.
- **Planned (not yet built):** when "별로예요" is tapped, present a quick reason picker (e.g. 색 / 핏 / 가격)
  before dismissing. Documented here so it isn't lost — implement only if in scope.

### 12. AI Chat sheet (overlay) — *core feature*
- **Trigger**: "AI에게 더 물어보기", "비슷한", a Home AI banner, or detail "더 묻기". Opens a taller sheet (~88%).
- **Layout**: header with a round sparkle avatar + "AI 큐레이터" / "취향 기반으로 골라드려요" + close; a scrolling
  message list (user bubbles right/ink, AI bubbles left/paper-3, with product cards inline in AI replies);
  a 3-dot **typing** indicator while "thinking"; a horizontally scrolling **quick-reply chip** row
  (비슷한 톤으로 / 더 라이트한 느낌 / 같은 브랜드 / 예산 10만원 이하 / 다른 컬러 / 비슷한 실루엣); a text input with a send button.
- The prototype fakes replies with keyword routing + canned product sets. **In production, wire this to your
  real recommendation/LLM service**; keep the bubble/quick-reply/typing UX.

---

## Interactions & Behavior (summary)
- **Heart/save** state is global (`savedIds`): toggling on any screen updates everywhere. Liking also opens
  feedback; saving just toggles.
- **Bottom sheets**: scrim fade-in, sheet slide-up; tapping scrim or close dismisses; chat sheet is taller
  than feedback.
- **Pushed screens** (detail/list/search) animate in over the active tab; back returns to Home.
- **Toasts**: transient confirmations (e.g. settings actions) appear via a global toaster.
- **Disabled CTAs**: onboarding "다음" is disabled (reduced opacity, non-interactive) until min selections met.
- **In-screen (non-navigation) interactions** to preserve: category chip filtering, horizontal pick swipe,
  Explore sort/filter, search live-ranking refresh + recent-term delete, detail image carousel + color/size
  select, Saved collection filter / create / dismiss, My settings toggles, learning-bar animations.

---

## Assets
- **Product imagery**: represented by flat color blocks. Each product has an `img` object with
  `{ light, base, dark }` hex values used to build a simple tonal block, plus a `colors` array (swatches).
  **Replace with real product photography** in production; keep the card aspect ratios (tall ≈ 3/4,
  square ≈ 1/1).
- **Brand assets** (provided as PNGs in this bundle's `brand/` folder if included, else regenerate):
  - App icon — ink squircle + paper ring/crescent emblem (1024².
  - Mark (ring + crescent) — ink and light variants, transparent.
  - Logo lockup — mark + "Moodyfit" wordmark, ink and light variants, transparent.
  - Splash composition — ink bg, centered emblem + "Moodyfit".
  The in-app mark is also available as inline SVG (see `launch.jsx` `MudifitMark`).
- **Font**: Pretendard (load via the codebase's font pipeline). Wordmark uses a Helvetica/Arial-class bold.
- **Lookbook placeholders**: diagonal stripe fills mark spots awaiting real photography.

## Sample data model (`design_files/data.js`)
A `SHOP_DATA` object: `PRODUCTS` (id, brand, name, price ₩, match %, cat, tags[], colors[], img{}, reason
HTML), `TASTE` (keyword + value 0–1 + delta), `LEARN_TREND` (weekly ints), `CATS`, `QUICK_REPLIES`,
`TRENDING` (term + up/down/same/new + delta), `AI_SEARCHES`, `RECENT`, `AI_REPLIES` (keyed canned responses
with product id sets), and helpers `format(price)` → "₩ 68,000" and `byId(id)`. Use this as a schema
reference for your real catalog/recommendation API. All copy is **Korean** — preserve it.

## Files
In `design_files/` (prototype source — React via in-browser Babel):
- `Shopping App Prototype.html` — entry; loads React + all `.jsx`/`.css`; renders inside an iOS frame.
- `styles.css` — all tokens + component styles (the source of truth for the token tables above).
- `data.js` — sample catalog + taste/search/chat data + helpers.
- `app.jsx` — root: stage machine, tab/screen router, sheet + saved state, bottom nav.
- `launch.jsx` — Splash, Intro carousel, Login, brand mark/logo SVG, intro mini-mocks.
- `onboarding.jsx` — welcome → 5 steps → analyzing ring → summary.
- `home.jsx`, `explore.jsx`, `saved.jsx`, `mypage.jsx` — the four tabs.
- `detail.jsx` — product detail + the 4 feedback actions.
- `search.jsx`, `list.jsx` — pushed screens.
- `feedback.jsx` — Feedback sheet + AI Chat sheet.
- `atoms.jsx` — shared primitives (Icon, ProductImg, buttons, chips, toaster, nav item, etc.).
- `charts.jsx` — BarList / rings / sparkline.
- `ios-frame.jsx` — prototype-only device bezel (do not port).

To run the prototype: open `Shopping App Prototype.html` in a browser. To reset first-launch, clear
`localStorage["mudifit_onboarded"]`.
