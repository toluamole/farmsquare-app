# FarmSquare — Gaps & Outstanding Tasks (PRD-traceable)

Backlog derived from a codebase audit against **Farmsquare Mobile App PRD v1.1
(May 2026)**. Each item carries its PRD reference: section (`§5.3`) and/or
screen ID (`E-3`) from the PRD's User Flow Documentation (§14).

**Verdict:** ~48 of the PRD's 50 Phase 1 screens exist as UI, but only the
Store pillar is functionally live. Group Buy and Advisory have no backend, and
the transactional core (payments, real orders, push) is missing. Today this is
a high-fidelity Phase 1 prototype, not a launchable Phase 1.

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
  - [ ] Restore Paystack (dev-build webview crash — see memory/infra) and
        decide on Flutterwave as second option (PRD lists both).
  - [ ] Wire `markOrderPaid` (`wooApi`) after a successful charge.
  - [ ] Verify transaction server-side, not client-side (§ note in
        `woocommerce.ts` `markOrderPaid`; PRD F-6 dev note: webhook callbacks).
- [ ] **(P0) Order creation is mock** (§5.1 `/orders`). Read-only WC keys →
      `createOrder` 401 → random local `FS-#####` id. Provision write keys;
      confirm real orders land in WooCommerce.
- [ ] **(P1) Product detail dead spots** (F-3): related-products carousel maps
      ids through the stubbed `fsProduct` (`ProductScreen.tsx:67`) so it's
      always empty; Group Buy cross-sell callout has no data source
      (`p.deal`). Wire related products from WC `related_ids` and the callout
      from the Group Buy API once it exists.
- [ ] **(P1) Listing gaps** (§5.2.2, F-2): no server-side pagination /
      infinite scroll (single `per_page: 50` fetch, client-side filtering);
      no brand filter; no grid/list toggle. PRD wants WC API paging +
      skeleton loaders.
- [ ] **(P1) Search** (F-7): client-side over the loaded list — PRD wants
      debounced server search + autocomplete. `TRENDING` / `RECENT_SEARCHES`
      in `SearchScreen.tsx:12-13` are still hardcoded mock (survived the mock
      purge): recent should come from AsyncStorage, trending from backend.
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
checkout + confirmation, E-7 reservation detail) and render empty states via
the typed stub `src/services/groupbuy.ts` (`getDeals()` → `[]`,
`reserveDeal()` throws). Everything below is backend + wiring:

- [ ] **(P0) Custom Group Buy API** (§5.3.10): deals, reservations, fill
      tracking, closure logic (`group_buy_deals`, `group_buy_reservations`,
      `group_buy_shares`). Wire `getDeals`/`reserveDeal`.
- [ ] **(P0) Escrow payment flow** (§5.3.6): pay-on-reserve, funds held until
      minimum fill threshold; auto-refund if deal fails (§5.3.8). Coordinate
      with Paystack/Flutterwave on delayed settlement.
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
UI built (MyFarm G-1, Journey G-3, Activity G-4) with empty states via
`src/services/advisory.ts` stubs.

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
Flow screens built (H-1 → H-4a); fake 3.5s "AI analysis" removed —
`diagnose()`/`getCommonProblems()` in `src/services/diagnosis.ts` return empty.

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
forgot password (A-4b/A-5/A-6), OTP screens (A-4a/A-4c), guest mode,
3-step progressive profile setup (B-1/B-2/B-3).

- [ ] **(P0) Phone OTP is dormant** (§4.2 — PRD: "critical for Nigerian
      farmers"): `sendPhoneOTP`/`confirmPhoneOTP` return
      `mock-verification-id`; reCAPTCHA web-only in Expo Go. Needs dev-build
      native Firebase phone auth.
- [ ] **(P1) Firebase mock mode** — when unconfigured, `mockUser()` makes
      *any* email/password succeed (`firebase.ts`). Require prod config.
- [ ] **(P1) Google sign-in** (§4.2): needs dev build + native
      `@react-native-google-signin`; non-functional in Expo Go.
- [ ] **(P1) Email verification not enforced** (A-4d): no "check your inbox"
      gate after email sign-up.
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
      (`src/services/notifications.ts` stub returns `[]`).
- [ ] **(P0) WooCommerce write keys** for real orders (currently read-only).
- [ ] **(P0) Cloudflare bot-fight** properly disabled for prod (currently
      paused as a temp workaround).
- [ ] **(P1) Firestore (or equivalent) profile/crop/notification sync** —
      everything is local redux-persist; nothing survives reinstall or syncs
      across devices/web.
- [ ] **(P1) Analytics** (§9: Firebase Analytics + Mixpanel) — none of the
      PRD §2.2 KPIs (retention, advisory-to-store CVR, Group Buy conversion)
      are measurable today.
- [ ] **(P1) Deep linking** — required for the Group Buy viral loop (§5.3.7)
      and notification tap-through (J-1); not configured.
- [ ] **(P2) Sentry crash reporting** (§9).
- [ ] **(Restore)** Paystack unwired from App root + checkout — dep still
      installed; see memory for restore steps.

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
3. **Flutterwave** (§5.2.4, §9) — PRD treats it as a co-equal payment/escrow
   option; only Paystack was ever integrated (and is currently unwired).

---

## Kept intentionally (not gaps)

- **Shipping** — `src/services/shipping.ts` (`FS_PRODUCT_CLASSES` + zones) is
  local logic, not WooCommerce shipping zones/rates. (Kept: logic, not mock.)
- **Geography / crops** — `FS_STATES`, `FS_LGAS`, `FS_CROPS` static lists.
  (Kept: legitimate static reference data.)
- **Problem-type taxonomy** — static UI config in `services/diagnosis.ts`.

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
