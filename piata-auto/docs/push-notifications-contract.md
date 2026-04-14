# Push Notification Contract (Cloud Functions)

This document defines the backend contract for message push notifications in PiataAuto.

## Goal

When a new message is written to `threads/{threadId}/messages/{messageId}`, a backend worker should:

1. Read `notificationMeta`.
2. Resolve push tokens for each `targetUserIds` user.
3. Send notification(s) through Expo push service.
4. Mark `notificationMeta.delivered = true` on success.

The mobile app already writes the required metadata.

## Firestore Trigger

- **Path:** `threads/{threadId}/messages/{messageId}`
- **Event:** `onCreate`
- **Runtime suggestion:** Firebase Functions v2 (`onDocumentCreated`)

## Message Payload (written by app)

```json
{
  "senderId": "uid_sender",
  "text": "Salut, mai este disponibila masina?",
  "createdAt": "2026-04-14T10:25:00.000Z",
  "readBy": {
    "uid_sender": "2026-04-14T10:25:00.000Z"
  },
  "notificationMeta": {
    "targetUserIds": ["uid_receiver"],
    "channel": "push-ready",
    "delivered": false
  }
}
```

## Thread Payload (relevant fields)

```json
{
  "listingId": "listing_123",
  "participantIds": ["uid_sender", "uid_receiver"],
  "lastMessage": "Salut, mai este disponibila masina?",
  "lastMessageAt": "2026-04-14T10:25:00.000Z",
  "lastMessageSenderId": "uid_sender",
  "unreadBy": {
    "uid_sender": 0,
    "uid_receiver": 3
  },
  "typingBy": {
    "uid_sender": null,
    "uid_receiver": null
  }
}
```

## User Push Token Schema (recommended)

Store Expo push tokens in `users/{userId}`:

```json
{
  "expoPushTokens": [
    "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
  ]
}
```

Multiple tokens are supported per user (multi-device sessions).

## Function Processing Rules

1. Ignore message if:
   - `notificationMeta` is missing,
   - `notificationMeta.channel !== "push-ready"`,
   - `notificationMeta.delivered === true`.
2. Load sender profile (`users/{senderId}`) and thread (`threads/{threadId}`).
3. For each target user:
   - read `expoPushTokens`,
   - skip if no tokens.
4. Build notification payload:
   - `title`: sender name or `"PiataAuto"`
   - `body`: message text
   - `data`: `{ threadId, messageId, listingId, senderId, type: "chat_message" }`
5. Send via Expo push API.
6. If at least one send succeeds, update:
   - `threads/{threadId}/messages/{messageId}.notificationMeta.delivered = true`
   - optionally append delivery metadata: timestamp/provider response id.

## Idempotency

Use these protections:

- Check `notificationMeta.delivered` before send.
- Re-check inside transaction/batch or compare update preconditions if needed.
- Make handler safe for retries and duplicate events.

## Security / Permissions

- Function should run with admin SDK.
- Client rules already allow participants to update `messages`, but backend should still validate:
  - sender belongs to `participantIds`,
  - target users are participants excluding sender.

## Example Response Tracking (optional)

You can extend `notificationMeta`:

```json
{
  "targetUserIds": ["uid_receiver"],
  "channel": "push-ready",
  "delivered": true,
  "deliveredAt": "2026-04-14T10:25:03.000Z",
  "providerMessageIds": ["expo_ticket_id_1"]
}
```

## Client Expectations

The app currently:

- sets `notificationMeta.delivered = false` on send,
- marks delivery `true` when message is seen in conversation as a temporary fallback.

Backend push delivery should be treated as source of truth in production.
