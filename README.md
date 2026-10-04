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
- Order, kitchen ticket, and inventory writes still need a shared atomic/idempotent workflow before live service. A partial failure can leave the systems inconsistent.
- The public kiosk has simulated payments and needs a secure backend order/payment flow.
- PIN/biometric login is not implemented.
- Several dashboards and business services still use sample data. They must be connected to verified restaurant records before operational use.
- AI chat no longer fabricates fallback statistics. Live reporting data is not connected to chat. Before setting a production Gemini key, add server-side authentication, authorization, and rate limiting to the AI endpoint.
- Role restrictions are a first pass, not complete multi-tenant/branch isolation. Review role access and test the rules before deployment.
- Finance, payroll, purchasing, refunds, inventory reversal, and backups require end-to-end validation.

## Verification

`npm run lint`, `npm test`, and `npm run build` validate types, unit tests, and production compilation. Tests cover failed POS writes, retention of the cart after failure, optional-field serialization, and preventing menu overwrites during reads.
