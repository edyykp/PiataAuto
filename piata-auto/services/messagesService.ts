import { db } from "@/services/firebase";
import { ChatMessage, ChatThread } from "@/types/models";
import {
  addDoc,
  writeBatch,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

let mockThreads: ChatThread[] = [];
let mockMessages: ChatMessage[] = [];

export const messagesService = {
  async getOrCreateThread(userId: string, otherUserId: string, listingId: string) {
    if (!db) {
      const existing = mockThreads.find(
        (thread) =>
          thread.listingId === listingId &&
          thread.participantIds.includes(userId) &&
          thread.participantIds.includes(otherUserId),
      );
      if (existing) return existing;
      const next: ChatThread = {
        id: `thread-${Date.now()}`,
        listingId,
        participantIds: [userId, otherUserId],
        lastMessage: "",
        lastMessageAt: new Date().toISOString(),
        lastMessageSenderId: "",
        unreadBy: { [userId]: 0, [otherUserId]: 0 },
        typingBy: { [userId]: null, [otherUserId]: null },
      };
      mockThreads = [next, ...mockThreads];
      return next;
    }

    const q = query(
      collection(db, "threads"),
      where("listingId", "==", listingId),
      where("participantIds", "array-contains", userId),
      limit(20),
    );
    const snap = await getDocs(q);
    const existing = snap.docs
      .map((item) => ({ id: item.id, ...(item.data() as Omit<ChatThread, "id">) }))
      .find((thread) => thread.participantIds.includes(otherUserId));
    if (existing) return existing;

    const draft: Omit<ChatThread, "id"> = {
      listingId,
      participantIds: [userId, otherUserId],
      lastMessage: "",
      lastMessageAt: new Date().toISOString(),
      lastMessageSenderId: "",
      unreadBy: { [userId]: 0, [otherUserId]: 0 },
      typingBy: { [userId]: null, [otherUserId]: null },
    };
    const created = doc(collection(db, "threads"));
    await setDoc(created, draft);
    return { id: created.id, ...draft };
  },

  async sendMessage(threadId: string, senderId: string, text: string) {
    const createdAt = new Date().toISOString();
    const thread = await this.getThreadById(threadId);
    const targetUserIds = (thread?.participantIds ?? []).filter((participantId) => participantId !== senderId);
    if (!db) {
      const msg: ChatMessage = {
        id: `message-${Date.now()}`,
        threadId,
        senderId,
        text,
        createdAt,
        readBy: { [senderId]: createdAt },
        notificationMeta: { targetUserIds, channel: "push-ready", delivered: false },
      };
      mockMessages = [...mockMessages, msg];
      mockThreads = mockThreads.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              lastMessage: text,
              lastMessageAt: createdAt,
              lastMessageSenderId: senderId,
              typingBy: { ...(thread.typingBy ?? {}), [senderId]: null },
              unreadBy: Object.fromEntries(
                thread.participantIds.map((participantId) => [
                  participantId,
                  participantId === senderId ? 0 : (thread.unreadBy?.[participantId] ?? 0) + 1,
                ]),
              ),
            }
          : thread,
      );
      return msg;
    }

    const created = await addDoc(collection(db, "threads", threadId, "messages"), {
      senderId,
      text,
      createdAt,
      readBy: { [senderId]: createdAt },
      notificationMeta: { targetUserIds, channel: "push-ready", delivered: false },
    });
    await setDoc(
      doc(db, "threads", threadId),
      { lastMessage: text, lastMessageAt: createdAt, lastMessageSenderId: senderId, [`typingBy.${senderId}`]: null },
      { merge: true },
    );
    if (thread?.participantIds?.length) {
      const unreadBy = Object.fromEntries(
        thread.participantIds.map((participantId) => [
          participantId,
          participantId === senderId ? 0 : (thread.unreadBy?.[participantId] ?? 0) + 1,
        ]),
      );
      await setDoc(doc(db, "threads", threadId), { unreadBy }, { merge: true });
    }
    return { id: created.id, threadId, senderId, text, createdAt };
  },

  async getThreadById(threadId: string) {
    if (!db) return mockThreads.find((thread) => thread.id === threadId) ?? null;
    const snap = await getDoc(doc(db, "threads", threadId));
    return snap.exists() ? ({ id: snap.id, ...(snap.data() as Omit<ChatThread, "id">) } as ChatThread) : null;
  },

  async getThreads(userId: string) {
    if (!db) {
      return mockThreads
        .filter((thread) => thread.participantIds.includes(userId))
        .sort((a, b) => +new Date(b.lastMessageAt) - +new Date(a.lastMessageAt));
    }
    const q = query(collection(db, "threads"), where("participantIds", "array-contains", userId), orderBy("lastMessageAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<ChatThread, "id">) }));
  },

  subscribeMessages(threadId: string, cb: (messages: ChatMessage[]) => void) {
    if (!db) {
      cb(
        mockMessages
          .filter((msg) => msg.threadId === threadId)
          .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)),
      );
      return () => {};
    }
    const q = query(collection(db, "threads", threadId, "messages"), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snap) => {
      const rows = snap.docs.map((item) => {
        const data = item.data() as Omit<ChatMessage, "id" | "threadId">;
        return { id: item.id, threadId, ...data };
      });
      cb(rows);
    });
  },

  subscribeThread(threadId: string, cb: (thread: ChatThread | null) => void) {
    if (!db) {
      cb(mockThreads.find((thread) => thread.id === threadId) ?? null);
      return () => {};
    }
    return onSnapshot(doc(db, "threads", threadId), (snap) => {
      if (!snap.exists()) return cb(null);
      cb({ id: snap.id, ...(snap.data() as Omit<ChatThread, "id">) });
    });
  },

  async setTypingState(threadId: string, userId: string, typing: boolean) {
    const now = new Date().toISOString();
    if (!db) {
      mockThreads = mockThreads.map((thread) =>
        thread.id === threadId
          ? { ...thread, typingBy: { ...(thread.typingBy ?? {}), [userId]: typing ? now : null } }
          : thread,
      );
      return;
    }
    await setDoc(
      doc(db, "threads", threadId),
      { [`typingBy.${userId}`]: typing ? now : null },
      { merge: true },
    );
  },

  async markThreadRead(threadId: string, userId: string) {
    if (!db) {
      mockThreads = mockThreads.map((thread) =>
        thread.id === threadId
          ? { ...thread, unreadBy: { ...(thread.unreadBy ?? {}), [userId]: 0 } }
          : thread,
      );
      mockMessages = mockMessages.map((message) =>
        message.threadId === threadId
          ? { ...message, readBy: { ...(message.readBy ?? {}), [userId]: new Date().toISOString() } }
          : message,
      );
      return;
    }
    const firestore = db;
    const batch = writeBatch(firestore);
    batch.update(doc(firestore, "threads", threadId), { [`unreadBy.${userId}`]: 0 });
    const messagesSnap = await getDocs(
      query(collection(firestore, "threads", threadId, "messages"), orderBy("createdAt", "asc")),
    );
    messagesSnap.docs.forEach((messageDoc) => {
      batch.set(
        doc(firestore, "threads", threadId, "messages", messageDoc.id),
        { [`readBy.${userId}`]: new Date().toISOString() },
        { merge: true },
      );
    });
    await batch.commit();
  },

  async markNotificationDelivered(threadId: string, messageId: string) {
    if (!db) {
      mockMessages = mockMessages.map((message) =>
        message.id === messageId && message.threadId === threadId
          ? { ...message, notificationMeta: { ...(message.notificationMeta ?? { targetUserIds: [], channel: "push-ready", delivered: false }), delivered: true } }
          : message,
      );
      return;
    }
    await updateDoc(doc(db, "threads", threadId, "messages", messageId), {
      "notificationMeta.delivered": true,
    });
  },
};
