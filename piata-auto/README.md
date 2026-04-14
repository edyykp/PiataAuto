# PiataAuto

Expo React Native marketplace app with Firebase (Auth + Firestore + Storage) and mock fallback.
Includes React Query offline cache persistence and in-app seller messaging.

## Run

1. Copy `.env.example` to `.env` and fill Firebase keys.
2. Install dependencies: `npm install`
3. Start app: `npm run start`

If no Firebase keys are set, the app runs in mock mode.

## Firebase deployment assets

- Firestore rules: `firebase/firestore.rules`
- Firestore indexes: `firebase/firestore.indexes.json`
- Storage rules: `firebase/storage.rules`

Example deploy commands:

- `firebase deploy --only firestore:rules`
- `firebase deploy --only firestore:indexes`
- `firebase deploy --only storage`

## Backend integration

- Push notifications contract (Cloud Functions): `docs/push-notifications-contract.md`
- Firebase Functions starter (trigger implementation): `functions/src/index.ts`
