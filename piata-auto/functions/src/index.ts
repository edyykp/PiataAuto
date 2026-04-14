import { Expo, ExpoPushMessage } from "expo-server-sdk";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

initializeApp();
const db = getFirestore();
const expo = new Expo();

type MessageDoc = {
  senderId: string;
  text: string;
  createdAt: string;
  notificationMeta?: {
    targetUserIds: string[];
    channel: "push-ready";
    delivered: boolean;
  };
};

type ThreadDoc = {
  listingId: string;
  participantIds: string[];
};

type UserDoc = {
  name?: string;
  expoPushTokens?: string[];
};

export const onChatMessageCreated = onDocumentCreated(
  "threads/{threadId}/messages/{messageId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const threadId = event.params.threadId;
    const messageId = event.params.messageId;
    const message = snapshot.data() as MessageDoc;
    const meta = message.notificationMeta;

    if (!meta || meta.channel !== "push-ready" || meta.delivered) {
      return;
    }

    const threadSnap = await db.collection("threads").doc(threadId).get();
    if (!threadSnap.exists) {
      logger.warn("Thread not found", { threadId, messageId });
      return;
    }

    const thread = threadSnap.data() as ThreadDoc;
    if (!thread.participantIds.includes(message.senderId)) {
      logger.warn("Sender is not a thread participant", { threadId, messageId, senderId: message.senderId });
      return;
    }

    const targetUserIds = meta.targetUserIds.filter(
      (id) => id !== message.senderId && thread.participantIds.includes(id),
    );
    if (!targetUserIds.length) {
      logger.info("No valid recipients for push", { threadId, messageId });
      return;
    }

    const senderSnap = await db.collection("users").doc(message.senderId).get();
    const sender = senderSnap.data() as UserDoc | undefined;
    const senderName = sender?.name || "PiataAuto";

    const userSnaps = await Promise.all(targetUserIds.map((id) => db.collection("users").doc(id).get()));
    const allTokens = userSnaps.flatMap((docSnap) => ((docSnap.data() as UserDoc | undefined)?.expoPushTokens ?? []));
    const validTokens = allTokens.filter((token) => Expo.isExpoPushToken(token));

    if (!validTokens.length) {
      logger.info("No Expo push tokens available", { threadId, messageId, targetUserIds });
      return;
    }

    const notifications: ExpoPushMessage[] = validTokens.map((token) => ({
      to: token,
      title: senderName,
      body: message.text,
      data: {
        type: "chat_message",
        threadId,
        messageId,
        listingId: thread.listingId,
        senderId: message.senderId,
      },
      sound: "default",
      priority: "high",
    }));

    const chunks = expo.chunkPushNotifications(notifications);
    let sentAny = false;

    for (const chunk of chunks) {
      try {
        const tickets = await expo.sendPushNotificationsAsync(chunk);
        if (tickets.some((ticket) => ticket.status === "ok")) {
          sentAny = true;
        }
      } catch (error) {
        logger.error("Expo send failed for chunk", { error, threadId, messageId });
      }
    }

    if (!sentAny) {
      logger.warn("No successful push sends", { threadId, messageId });
      return;
    }

    await db
      .collection("threads")
      .doc(threadId)
      .collection("messages")
      .doc(messageId)
      .set(
        {
          notificationMeta: {
            ...meta,
            delivered: true,
            deliveredAt: new Date().toISOString(),
          },
        },
        { merge: true },
      );
  },
);
