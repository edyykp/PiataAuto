import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messagesService } from "@/services/messagesService";
import { ChatMessage, ChatThread } from "@/types/models";

export const useThreads = (userId?: string) =>
  useQuery({
    queryKey: ["threads", userId],
    enabled: Boolean(userId),
    queryFn: () => messagesService.getThreads(userId!),
    initialData: [],
  });

export const useCreateOrGetThread = () =>
  useMutation({
    mutationFn: ({ userId, otherUserId, listingId }: { userId: string; otherUserId: string; listingId: string }) =>
      messagesService.getOrCreateThread(userId, otherUserId, listingId),
  });

export const useSendMessage = (userId?: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ threadId, senderId, text }: { threadId: string; senderId: string; text: string }) =>
      messagesService.sendMessage(threadId, senderId, text),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["threads", userId] }),
  });
};

export const useMarkThreadRead = (userId?: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ threadId }: { threadId: string }) => messagesService.markThreadRead(threadId, userId!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["threads", userId] }),
  });
};

export const useThread = (threadId?: string) => {
  const [thread, setThread] = useState<ChatThread | null>(null);
  useEffect(() => {
    if (!threadId) return;
    return messagesService.subscribeThread(threadId, setThread);
  }, [threadId]);
  return thread;
};

export const useTypingState = (userId?: string) =>
  useMutation({
    mutationFn: ({ threadId, typing }: { threadId: string; typing: boolean }) =>
      messagesService.setTypingState(threadId, userId!, typing),
  });

export const useMarkNotificationDelivered = () =>
  useMutation({
    mutationFn: ({ threadId, messageId }: { threadId: string; messageId: string }) =>
      messagesService.markNotificationDelivered(threadId, messageId),
  });

export const useThreadMessages = (threadId?: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  useEffect(() => {
    if (!threadId) return;
    return messagesService.subscribeMessages(threadId, setMessages);
  }, [threadId]);
  return messages;
};
