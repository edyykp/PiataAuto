import { AppButton, AppInput } from "@/components/ui";
import {
  useMarkNotificationDelivered,
  useMarkThreadRead,
  useSendMessage,
  useThread,
  useThreadMessages,
  useTypingState,
} from "@/hooks/useMessages";
import { useAuthStore } from "@/store/authStore";
import { formatDateTime } from "@/utils/format";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const [text, setText] = useState("");
  const messages = useThreadMessages(id);
  const thread = useThread(id);
  const send = useSendMessage(user?.id);
  const markRead = useMarkThreadRead(user?.id);
  const typingState = useTypingState(user?.id);
  const markDelivered = useMarkNotificationDelivered();

  useEffect(() => {
    if (!user?.id) return;
    markRead.mutate({ threadId: id });
  }, [id, user?.id]);

  useEffect(() => {
    if (!user?.id || !text.trim()) return;
    typingState.mutate({ threadId: id, typing: true });
    const timeout = setTimeout(() => {
      typingState.mutate({ threadId: id, typing: false });
    }, 1500);
    return () => clearTimeout(timeout);
  }, [text, id, user?.id]);

  const onSend = async () => {
    if (!text.trim() || !user) return;
    await send.mutateAsync({
      threadId: id,
      senderId: user.id,
      text: text.trim(),
    });
    typingState.mutate({ threadId: id, typing: false });
    setText("");
  };

  const otherParticipants = (thread?.participantIds ?? []).filter(
    (participantId) => participantId !== user?.id,
  );
  const isOtherTyping = otherParticipants.some((participantId) => {
    const timestamp = thread?.typingBy?.[participantId];
    if (!timestamp) return false;
    return Date.now() - new Date(timestamp).getTime() < 4000;
  });

  return (
    <View className="flex-1 bg-slateBg">
      <FlatList
        className="flex-1 px-4 pt-4"
        data={messages}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={({ viewableItems }) => {
          viewableItems.forEach(({ item }) => {
            if (
              !user?.id ||
              item.senderId === user.id ||
              item.notificationMeta?.delivered
            )
              return;
            markDelivered.mutate({ threadId: id, messageId: item.id });
          });
        }}
        renderItem={({ item }) => (
          <View
            className={`mb-2 max-w-[80%] rounded-2xl px-3 py-2 ${item.senderId === user?.id ? "self-end bg-primary" : "self-start bg-white"}`}
          >
            <Text
              className={
                item.senderId === user?.id ? "text-white" : "text-slate-900"
              }
            >
              {item.text}
            </Text>
            <Text
              className={`mt-1 text-[10px] ${item.senderId === user?.id ? "text-blue-100" : "text-slate-400"}`}
            >
              {formatDateTime(item.createdAt)}
            </Text>
            {item.senderId === user?.id && (
              <Text className="mt-1 text-[10px] text-blue-100">
                {otherParticipants.some((participantId) =>
                  Boolean(item.readBy?.[participantId]),
                )
                  ? "Citit"
                  : "Trimis"}
              </Text>
            )}
          </View>
        )}
      />
      <View className="border-t border-slate-200 bg-white px-3 py-3">
        <AppInput
          label="Mesaj"
          value={text}
          onChangeText={setText}
          placeholder="Scrie un mesaj..."
        />
        {isOtherTyping && (
          <Text className="mb-2 text-xs text-slate-500">
            Celălalt utilizator scrie...
          </Text>
        )}
        <AppButton title="Trimite" onPress={onSend} />
      </View>
    </View>
  );
}
