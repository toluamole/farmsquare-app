# Farmsquare Mobile App

Nigerian agri-commerce mobile app built with React Native / Expo. Shop farm inputs at wholesale prices, join Group Buy deals, and get stage-by-stage farm advisory — all with realistic Nigerian content (₦ pricing, NPK deals, Lagos/Kano delivery zones).

Implemented from the Claude Design prototype in `../project/`.

## Features

- **Onboarding & auth** — splash, intro slides, phone number + OTP sign-in (Firebase), guest mode, 3-step profile setup (location, crops, farm size)
- **Home** — rotating advert carousel, active Group Buy deals with live countdowns, "Today on Your Farm" card, category grid, flash deals
- **Shop** — brand-deal carousel, category listings, product detail with inline add-to-cart (description → specifications → purchase block), cart, 2-step checkout
- **Shipping** — zone-based methods (Courier / Cargo / Commercial / Office Pickup) with fees calculated from the Farmsquare rate tables per product shipping class, sorted cheapest-first
- **Group Buy** — deal list with status filters, deal detail with countdown + progress, "Buy Your Portion" (defaults to deal minimum), shares live in the cart, checkout limited to Bulk Cargo + Office Pickup with escrow refund assurance and "we'll reach out once the deal fills" delivery model
- **Advisory** — farm enterprises from your onboarding crops, date-driven illustrated stage journeys (planting/stocking date → pre-planting stages auto-passed), detailed Nigerian agronomy through post-harvest, inputs purchasable per stage
- **Problem solver** — crop + category → describe → analyzing → ranked diagnoses with treatments and product recommendations
- **Account** — orders, addresses, payment methods, profile editor, notification preferences, referral programme, support FAQ

## Tech stack

- Expo SDK 52 (managed), TypeScript
- React Navigation 6 (bottom tabs + native stacks)
- Firebase JS SDK v10 — phone authentication
- WooCommerce REST API client (axios) with mock-data fallback
- AsyncStorage persistence

## Getting started

This project uses [Bun](https://bun.sh) as its package manager and runner.

```bash
bun install
cp .env.example .env   # then fill in your keys
bun start              # or: bunx expo start
```

Scan the QR code with Expo Go (Android), or press `a` to launch an Android emulator.

> First install runs a `protobufjs` postinstall script (a Firebase dependency); it's allowlisted via `trustedDependencies` in `package.json`, so Bun runs it automatically.

## Configuration (`.env`)

| Variable | Where to get it |
|---|---|
| `EXPO_PUBLIC_FIREBASE_*` | Firebase console → Project settings → your web app config |
| `EXPO_PUBLIC_WC_URL` | Your WordPress site URL (default `https://farmsquare.ng`) |
| `EXPO_PUBLIC_WC_KEY` / `EXPO_PUBLIC_WC_SECRET` | WP Admin → WooCommerce → Settings → Advanced → REST API → Add key (read/write) |

Without keys the app still runs fully on bundled mock data — the WooCommerce service falls back automatically, and auth can be bypassed with **Continue as Guest**.

### Firebase phone auth notes

Enable **Phone** as a sign-in provider in Firebase console → Authentication. On a real device build you'll also need SHA-1/SHA-256 fingerprints registered for Android. In Expo Go, phone auth uses a reCAPTCHA fallback.

## Project structure

```
src/
├── theme/          # Design tokens (Farmsquare green #046307, Montserrat + Poppins)
├── navigation/     # Root navigator, bottom tabs, per-tab stacks
├── context/        # Global app state (cart, auth, profile) + AsyncStorage persistence
├── services/       # firebase.ts, woocommerce.ts, shipping.ts (zone/rate engine)
├── data/           # Products, deals, advisory journeys (Nigerian content)
├── components/     # Design-system primitives (FsButton, FsCarousel, countdowns…)
└── screens/        # onboarding / home / shop / groupbuy / advisory / problem / account
```

## Shipping engine

`src/services/shipping.ts` mirrors the Farmsquare shipping documentation: states resolve to zones A–D, each zone offers Courier / Cargo / Commercial / Office Pickup, and fees are computed from per-class rate tables (first unit + additional units, or percentage-of-value classes). Group Buy carts are restricted to **Bulk Cargo** (fee confirmed after the deal fills) and **free Office Pickup (Ibadan)**. Swap the functions for live API calls when the endpoints are ready.
