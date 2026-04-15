import { AppTopBar, EmptyState } from "@/components/ui";
import { useThreads } from "@/hooks/useMessages";
import { useAuthStore } from "@/store/authStore";
import { formatDateTime } from "@/utils/format";
import { Link } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";

export default function MessagesScreen() {
  const user = useAuthStore((s) => s.user);
  const threads = useThreads(user?.id);
  const data = threads.data ?? [];

  if (!data.length)
    return (
      <View className="flex-1 bg-slateBg">
        <AppTopBar
          title="Mesaje"
          subtitle="Gestionare conversații cu vânzătorii"
        />
        <EmptyState title="Nu ai conversații încă. Contactează un vânzător pentru a începe o discuție." />
      </View>
    );

  return (
    <View className="flex-1 bg-slateBg">
      <AppTopBar
        title="Mesaje"
        subtitle="Gestionare conversații cu vânzătorii"
      />
      <FlatList
        className="flex-1 px-4 pt-4"
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/messages/${item.id}` as never} asChild>
            <Pressable className="mb-4 rounded-[28px] bg-white px-4 py-5 shadow-lg">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-base font-semibold text-slate-900">
                    Anunț #{item.listingId.slice(0, 8)}
                  </Text>
                  <Text className="mt-2 text-sm leading-6 text-slate-600">
                    {item.lastMessage || "Niciun mesaj încă"}
                  </Text>
                </View>
                <Text className="text-xs text-slate-400">
                  {formatDateTime(item.lastMessageAt)}
                </Text>
              </View>
              {!!item.unreadBy?.[user?.id ?? ""] && (
                <View className="mt-3 self-start rounded-full bg-primary px-3 py-1 shadow-sm">
                  <Text className="text-xs font-semibold text-white">
                    {item.unreadBy?.[user?.id ?? ""]} noi
                  </Text>
                </View>
              )}
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}
