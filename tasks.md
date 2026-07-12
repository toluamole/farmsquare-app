# FarmSquare — Gaps & Outstanding Tasks (PRD-traceable)

Backlog derived from a codebase audit against **Farmsquare Mobile App PRD v1.1
(May 2026)**. Each item carries its PRD reference: section (`§5.3`) and/or
screen ID (`E-3`) from the PRD's User Flow Documentation (§14).

**Verdict:** ~48 of the PRD's 50 Phase 1 screens exist as UI, but only the
Store pillar is functionally live (catalog + real orders via the
farmsquare-api Worker). Group Buy and Advisory have no backend, and payments
and push are missing. Today this is a high-fidelity Phase 1 prototype, not a
launchable Phase 1.

Legend: `[x]` done · `[ ]` open · **(P0/P1/P2)** launch priority ·
*(PRD Phase 2)* = deferred by the PRD itself, listed for traceability.

---

## Pillar 1 — Online Store (§5, Flow F)

### Done
- [x] Products / categories / product detail live via WC REST v3
      (§5.1, F-1/F-2/F-3) — RTK Query `fetchBaseQuery`, live-only, empty/error
      states (no mock fallback).
- [x] Order history, order tracking with live WC status read, one-tap reorder
      (§5.2.5, F-9).
- [x] Cart with quantity controls, persisted via redux-persist (F-4).
- [x] Two-step checkout UI: address & shipping → payment (F-5/F-6).

### Open
- [ ] **(P0) Checkout takes no payment** (§5.2.4, F-6). `CheckoutStep2Screen`
      `finalize()` creates the order for *all* methods with no charge.
      **Deferred (2026-07-04):** all Paystack tasks removed from the backlog
      for now per decision. Provider integration (charge flow, `markOrderPaid`
      wiring, server-side verification) resumes once a payment provider is
      re-selected.
- [x] **(P0) Order creation is real** (§5.1 `/orders`) — resolved 2026-07-06.
      The key pair was Read/Write all along (earlier 401s were the Cloudflare
      bot-challenge era); orders placed in the app land in WooCommerce admin
      via the Worker. Keys rotated (old bundle-exposed pair revoked) and the
      `tryApi` silent mock fallback removed — order failures now surface.
- [ ] **(P1) Product detail dead spots** (F-3): related-products carousel maps
      ids through the stubbed `fsProduct` (`ProductScreen.tsx:67`) so it's
      always empty; Group Buy cross-sell callout has no data source
      (`p.deal`). Wire related products from WC `related_ids` and the callout
      from the Group Buy API once it exists.
- [x] **(P1) Listing pagination + server filters** (§5.2.2, F-2) — resolved
      2026-07-07. `browseProducts` infinite query (RTK `builder.infiniteQuery`,
      20/page, totals from the `X-WP-Total*` headers the Worker forwards);
      Listing is a `FlatList` with infinite scroll and all filter/sort as WC
      query params (`category` by numeric id, `on_sale`, `stock_status`,
      `max_price`, `orderby`). Home/Shop rails are dedicated server queries
      (`on_sale` / popularity / date) instead of slices of one page.
- [ ] **(P1) Listing gaps — remainder** (§5.2.2, F-2): brand filter and
      grid/list toggle (needs a WC brand-taxonomy decision); skeleton loaders
      (spinners today).
- [x] **(P1) Search** (F-7) — server search resolved 2026-07-07: debounced
      (400ms) WC `search` param over the full catalog with paginated results;
      recent searches persisted in `searchSlice` (redux-persist) with a
      working Clear. Remainder below.
- [ ] **(P2) Search remainder** (F-7): autocomplete suggestions and
      backend-driven trending terms (`TRENDING` in `SearchScreen.tsx` is
      curated static until search analytics exist).
- [ ] **(Decision) Local Redux cart vs CoCart** (§5.1). PRD calls CoCart
      "critical" for web↔app cart sync; app deliberately uses a local
      persisted cart. Sign off the deviation or adopt CoCart.
- [ ] **(P1) Customer profile sync** (§5.1 `/customers`): profile lives only
      in redux-persist; PRD expects sync between web & app.
- [ ] Coupons / discount codes (§5.1, F-4) — *(PRD Phase 2)*.
- [ ] Cart prices are add-time snapshots — won't reflect live WC price
      changes (F-4).
- [ ] Product image fallback relies on placeholder icons when WC has no
      photo (`productImages.ts`).

---

## Pillar 2 — Group Buy (§5.3, Flow E) — flagship gap, 0% functional

All screens exist (E-1 deal listing, E-3 detail, E-4 quantity, E-5/E-6
checkout + confirmation, E-7 reservation detail) and render empty states
(`AppContext.deals` is empty; the interim service stub was removed
2026-07-06 — the client layer will be RTK Query endpoints against the
farmsquare-api Worker, like the catalog). Everything below is backend +
wiring:

- [ ] **(P0) Custom Group Buy API** (§5.3.10): deals, reservations, fill
      tracking, closure logic (`group_buy_deals`, `group_buy_reservations`,
      `group_buy_shares`). Wire `getDeals`/`reserveDeal`.
- [ ] **(P0) Escrow payment flow** (§5.3.6): pay-on-reserve, funds held until
      minimum fill threshold; auto-refund if deal fails (§5.3.8). Coordinate
      with the chosen payment provider on delayed settlement (provider
      selection currently deferred).
- [ ] **(P1) Real-time progress** (§5.3.10): WebSocket/long-poll progress bar;
      server-side UTC deadlines with client-rendered countdowns (currently
      local `t0` offsets).
- [ ] **(P1) Social sharing + viral loop** (§5.3.7): real share intents
      (WhatsApp `SEND` intent, share sheet) with pre-filled captions and deep
      links — currently toast stubs. Post-payment share prompt on E-6.
- [ ] **(P1) Referral tracking** (§5.3.7): UTM-tagged deep links, ₦500 credit
      attribution — *(credit payout is PRD Phase 2)*.
- [ ] **(P1) Lifecycle push notifications** (§5.3.10): new deal, 50%/80%
      filled, 24h-to-deadline, closed/failed (depends on FCM, below).
- [ ] **(P2) Incoming Deal Teaser screen** (E-2): "Coming Soon" + Remind Me —
      the one PRD screen not built.
- [ ] Group Buy badge + status progression in order history (§5.3.9:
      Reserved → Deal Closed → Packing → Dispatched → Delivered).

---

## Pillar 3 — Farm Advisory (§6, Flows G/H)

### Crop Calendar (§6.1, Flow G)
UI built (MyFarm G-1, Journey G-3, Activity G-4) rendering empty states
directly (stub service removed 2026-07-06; guide types + `cropLabel` live in
`src/data/crops.ts`).

- [ ] **(P0) 5-crop agronomist content** (§6.1.2, PRD Phase 1 item #7:
      Tomato, Maize, Pepper, Sesame, Cucumber as *static agronomist-built
      guides*). The curated journey content was removed in the mock purge —
      it must return via the Advisory API or be re-bundled as static content.
      **PRD is content-first, AI-later; current app is backend-first — decide.**
- [ ] **(P1) Crop setup flow** (G-2/G-2b): per-crop planting date, state,
      farming system → generated calendar. Today MyFarm just lists
      `profile.crops` and opens Journey with today's date.
- [ ] **(P1) Mark-as-Done sync** (G-4): completion timestamps persisted
      (PRD: Firestore) — currently local `doneToday` only.
- [ ] **(P1) "Today on Your Farm" home card** (D-1, PRD Phase 1 item #8) —
      PRD calls it "the single most important retention hook"; needs real
      stage data.
- [ ] Multiple simultaneous crop tracking with real timelines (§6.1.1).
- [ ] Adaptive calendar / weather adjustments (§6.1.4 AI) — *(PRD Phase 2)*.

### Problem Solver (§6.2, Flow H)
Flow screens built (H-1 → H-4a); fake 3.5s "AI analysis" removed. Stub
service removed 2026-07-06 — Analyzing hands off to Results' no-matches
state; taxonomy + `Diagnosis` types live in `src/data/problems.ts`.

- [ ] **(P0) FAQ/symptom database** (§6.2.1, H-5, PRD Phase 1 item #9): top
      50 problems with solutions + product links, browsable/searchable list.
      PRD: created by certified agronomists *before launch*.
- [ ] **(P0) Expert escalation queue** (H-4b): route unmatched queries to an
      agronomist with 24h SLA + reference number — screen doesn't exist.
- [ ] **(P1) Photo upload** (H-3): currently a toast stub ("available in the
      mobile app"); needs camera/gallery picker + storage upload (PRD:
      Firebase Storage, up to 3 photos).
- [ ] Solution detail screen with full treatment protocol + "add all to
      cart" (H-4c).
- [ ] Voice-to-text input (H-3) — *(PRD Phase 2, Whisper)*.
- [ ] AI diagnosis (vision + LLM, §6.2.2) — *(PRD Phase 2)*.
- [ ] "Full solution guides are coming soon" stub in problem guides.

---

## Auth & Onboarding (§4, Flows A–C)

Done: splash (A-1), carousel (A-2), auth gate (A-3), email sign-up/login +
forgot password (A-4b/A-5/A-6), guest mode, 3-step progressive profile
setup (B-1/B-2/B-3).

- [x] **(P0) Phone OTP is dormant** (§4.2) — *(dropped 2026-07-12: phone OTP
      is no longer planned — email verification (A-4d) covers account
      confirmation; deleted the dormant PhoneScreen/OtpScreen and the
      firebase.ts phone helpers. Revisit only if PRD's phone-first login
      returns, which would need dev-build native Firebase auth.)*
- [x] **(P1) Firebase mock mode** — *(resolved 2026-07-10: mock mode removed
      entirely — `mockUser()`, `isFirebaseConfigured`, and the phone-OTP
      `mock-verification-id` branches deleted; Firebase config is mandatory
      and auth calls fail honestly without it.)*
- [ ] **(P1) Google sign-in** (§4.2): needs dev build + native
      `@react-native-google-signin`; non-functional in Expo Go.
- [x] **(P1) Email verification not enforced** (A-4d) — *(resolved
      2026-07-12: soft gate — verification email sent at sign-up, skippable
      VerifyEmail screen (re-check + resend w/ 60s cooldown), Account-screen
      reminder row until verified, `emailVerified` tracked in auth state;
      Google users arrive verified and never see either.)*
- [ ] **(P2) Guest gating softer than spec** (C-1/C-2): PRD wants an
      auth-prompt bottom sheet on gated actions with the "deep return"
      pattern (complete the intended action after login), and a blurred
      Group Buy preview rather than hard gating.
- [ ] Apple Sign-In — *(PRD Phase 2, App Store requirement once social login
      ships on iOS)*.

---

## Cross-cutting infrastructure (§9)

- [ ] **(P0) Push notifications — FCM** (PRD Phase 1 item #10): daily
      activity reminders, Group Buy alerts, order updates; in-app inbox
      persistence so J-1 reflects missed pushes. Nothing is wired
      (nothing is wired; the inbox renders its empty state — stub service
      removed 2026-07-06).
- [x] **(P0) WooCommerce write keys** — resolved 2026-07-06: Read/Write pair
      rotated and held only in Worker secrets; real orders confirmed landing.
- [x] **(P0) Cloudflare bot-fight** — resolved 2026-07-05: zone un-paused and
      Bot Fight Mode enabled. App traffic routes via the farmsquare-api
      Worker (workers.dev, outside the zone's bot checks); Worker→origin
      fetches verified passing (200), direct keyless API calls now 401.
- [ ] **(P1) Firestore (or equivalent) profile/crop/notification sync** —
      everything is local redux-persist; nothing survives reinstall or syncs
      across devices/web.
- [ ] **(P1) Analytics** (§9: Firebase Analytics + Mixpanel) — none of the
      PRD §2.2 KPIs (retention, advisory-to-store CVR, Group Buy conversion)
      are measurable today.
- [ ] **(P1) Deep linking** — required for the Group Buy viral loop (§5.3.7)
      and notification tap-through (J-1); not configured.
- [ ] **(P2) Sentry crash reporting** (§9).

---

## Account & misc (Flows I/J)

- [ ] **(P1) Saved cards don't persist** (I-1): `PaymentsScreen` local
      `useState` only; remove fake `DEFAULT_PAYMENTS` (Zenith ••4821) seed
      in `AppContext.tsx:23`.
- [ ] **(P1) Address editing stubbed** (I-3/I-4): "coming soon"; delete is
      local-only; PRD also wants sync to WC customer API + default address.
- [ ] **(P1) Notification prefs not persisted** (J-2): local `useState`;
      PRD wants per-category toggles → FCM topic subscriptions.
- [ ] **(P2) Support actions are toasts** (I-1): add `Linking.openURL`
      (`tel:` / `wa.me` / email).
- [ ] **(P2) Referral screen static** (I-5): copy/share are toasts; code is
      static; no stats — *(full programme is PRD Phase 2)*.
- [ ] **(P3)** Home top-bar location hardcoded "Ikeja, Lagos" (D-1) — read
      from profile.
- [ ] **(P3)** No product reviews list/submission (F-3 shows aggregate only).
- [ ] **(P3)** No wishlist/favorites.
- [ ] Notifications screen (J-1): built with empty state; PRD filter tabs
      (All | Orders | Group Buy | Advisory | Promotions) and grouped-by-date
      inbox arrive with real data.

---

## Deviations from PRD to sign off

1. **Local Redux cart vs CoCart** (§5.1) — PRD flags CoCart as critical for
   web↔app cart sync; app uses a local persisted cart.
2. **Advisory content strategy** (§6.1) — PRD Phase 1 is content-first
   (static agronomist guides); app is currently backend-first (empty stubs
   awaiting an Advisory API).
3. **Payment provider** (§5.2.4, §9) — PRD lists Paystack and Flutterwave as
   co-equal options. Paystack was previously integrated but is unwired, and
   all provider work is deferred as of 2026-07-04 pending re-selection.

---

## Kept intentionally (not gaps)

- **Shipping** — `src/services/shipping.ts` (`FS_PRODUCT_CLASSES` + zones) is
  local logic, not WooCommerce shipping zones/rates. (Kept: logic, not mock.)
- **Geography / crops** — `FS_STATES`, `FS_LGAS`, `FS_CROPS` static lists.
  (Kept: legitimate static reference data.)
- **Problem-type taxonomy** — static UI config in `src/data/problems.ts`.

## Completed (mock-data removal, July 2026)

- [x] Catalog live-only via RTK Query `fetchBaseQuery` (WC auth as query
      params); no `FS_PRODUCTS`/`FS_CATEGORIES` fallback; empty/error states.
- [x] Group Buy — `getDeals()`/`reserveDeal()` stubs; GroupBuy/DealDetail/Home
      empty states; `addDealToCart(deal, product, qty)` (no `FS_DEALS`).
- [x] Notifications — `getNotifications()` stub; empty state; hardcoded home
      bell badge removed.
- [x] Advisory — `getCropJourney`/`getCropStage` stubs; MyFarm lists the
      user's real crops; Journey/Activity empty states.
- [x] Problem diagnosis — `diagnose()`/`getCommonProblems()` stubs; fake
      `Analyzing` setTimeout removed; Results empty state.
- [x] Deleted `FS_PRODUCTS`/`FS_DEALS`/`FS_NOTIFS`/`FS_DIAGNOSES`/
      `FS_CALENDAR`/`FS_LIBRARY`, `src/data/advisory.ts`,
      `screens/problem/diagnoses.ts`; OrderTracking fake fallback removed.
