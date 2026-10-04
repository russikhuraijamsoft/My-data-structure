# TalkOS

Restaurant operations application built with React, Firebase, and an Express server.

## Run locally

Use Node.js 22.12 or newer.

```sh
npm ci
cp .env.example .env
npm run dev
```

For production:

```sh
npm run lint
npm test
npm run build
NODE_ENV=production npm start
```

The production build includes `dist/` and `server.js`. Cloud Run listens on `PORT` (default 8080).

## Account setup

Enable the required Firebase Authentication providers and add the application domain to their authorized domains. Firebase client configuration comes from `firebase-applet-config.json`, with `VITE_FIREBASE_*` build-time overrides.

New accounts have no permissions until approved. Bootstrap the first owner using the trusted Firebase console: in `users/{authentication UID}`, set `roles` to `["OWNER"]`, `permissions` to `["*"]`, and `branches` to the actual restaurant branch IDs. Never grant owner access automatically during public sign-up. Review existing users because earlier versions assigned owner roles to every registration.

Review and deploy `firestore.rules` to the configured Firestore database before using real data. The rules in this change have not been run against a Firebase emulator or the live project. Code changes do not automatically deploy database rules.

## Current readiness

The application is still under development. Passing the build and unit tests does not make every module production-ready.

- Orders now fail visibly when Firestore rejects a save; the POS cart remains available. Durable offline order synchronization is not implemented.
- POS bills and kitchen tickets now save in one atomic batch. Concurrent checkout clicks are blocked. Inventory deductions remain separate and need a reconciled/idempotent workflow before live service. Refresh/retry recovery also needs a durable checkout identifier.
- Public kiosk ordering is disabled until a secure backend order/payment flow is configured; simulation methods cannot write paid orders.
- PIN/biometric login is not implemented.
- The home dashboard and sales reports now use saved paid orders with India calendar dates. They show zero for an empty database and errors when reads fail. Profit/expense data is not fabricated. Other business modules still need sample data removed before operational use.
- AI chat no longer fabricates fallback statistics. Live reporting data is not connected to chat. Before setting a production Gemini key, add server-side authentication, authorization, and rate limiting to the AI endpoint.
- Role restrictions are a first pass, not complete multi-tenant/branch isolation. Review role access and test the rules before deployment.
- Finance, payroll, purchasing, refunds, inventory reversal, and backups require end-to-end validation.

## Verification

`npm run lint`, `npm test`, and `npm run build` validate types, unit tests, and production compilation. Tests cover failed POS writes, retention of the cart after failure, optional-field serialization, and preventing menu overwrites during reads.

## Counter and kitchen test flow

After configuring Firebase and assigning an owner role:

1. Open the counter, choose menu items, and select the order type/table.
2. Enter actual cash received. Check the bill and change before recording payment.
3. Confirm the receipt and corresponding kitchen ticket. Both are committed together.
4. In the kitchen, accept the ticket, start preparation, mark ready, and mark served.
5. Refresh Sales Reports to verify the paid bill. Failed writes must retain the cart and show an error.

The counter currently preserves the previous 5% tax configuration, with each component rounded to paise. Confirm your applicable tax treatment and menu prices before launch. Card/UPI collection is not integrated. Sales are restaurant-wide; branch-specific isolation is still pending.
