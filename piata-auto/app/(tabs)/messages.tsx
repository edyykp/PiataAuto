import { Link } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { EmptyState } from "@/components/ui";
import { useThreads } from "@/hooks/useMessages";
import { useAuthStore } from "@/store/authStore";
import { formatDateTime } from "@/utils/format";

export default function MessagesScreen() {
  const user = useAuthStore((s) => s.user);
  const threads = useThreads(user?.id);
  const data = threads.data ?? [];

  if (!data.length) return <EmptyState title="No conversations yet. Contact a seller to start chatting." />;

  return (
    <FlatList
      className="flex-1 bg-slateBg px-4 pt-4"
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Link href={`/messages/${item.id}` as never} asChild>
          <Pressable className="mb-3 rounded-2xl bg-white p-4">
            <Text className="font-semibold text-slate-900">Listing #{item.listingId.slice(0, 8)}</Text>
            <Text className="mt-1 text-slate-600">{item.lastMessage || "No messages yet"}</Text>
            <View className="mt-1 flex-row items-center justify-between">
              <Text className="text-xs text-slate-400">{formatDateTime(item.lastMessageAt)}</Text>
              {!!item.unreadBy?.[user?.id ?? ""] && (
                <View className="rounded-full bg-primary px-2 py-1">
                  <Text className="text-xs font-semibold text-white">{item.unreadBy?.[user?.id ?? ""]}</Text>
                </View>
              )}
            </View>
          </Pressable>
        </Link>
      )}
    />
  );
}
