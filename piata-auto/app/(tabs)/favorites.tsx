import { ListingCard } from "@/components/ListingCard";
import { AppTopBar, EmptyState } from "@/components/ui";
import { useFavorites } from "@/hooks/useFavorites";
import { useInfiniteListings } from "@/hooks/useListings";
import {
  useRealtimeFavoriteIds,
  useRealtimeListings,
} from "@/hooks/useRealtime";
import { db } from "@/services/firebase";
import { useAuthStore } from "@/store/authStore";
import { useMemo } from "react";
import { FlatList, Text, View } from "react-native";

export default function FavoritesScreen() {
  const user = useAuthStore((s) => s.user);
  const favorites = useFavorites(user?.id);
  const realtimeFavoriteIds = useRealtimeFavoriteIds(user?.id);
  const ids = db ? realtimeFavoriteIds : (favorites.data ?? []);
  const all = useInfiniteListings({ sortBy: "newest" });
  const realtime = useRealtimeListings();
  const source = db
    ? realtime.items
    : (all.data?.pages.flatMap((p) => p.data) ?? []);
  const items = useMemo(
    () => source.filter((x) => ids.includes(x.id)),
    [source, ids],
  );

  if (!items.length) return <EmptyState title="Nu ai preferate încă." />;
  return (
    <View className="flex-1 bg-slateBg">
      <AppTopBar title="Preferate" subtitle="Vizionează anunțurile salvate" />
      <View className="rounded-b-[32px] bg-white px-6 py-6 shadow-sm">
        <Text className="text-xl font-semibold text-slate-900">
          Preferate salvate
        </Text>
        <Text className="mt-1 text-sm text-slate-500">
          Mașinile tale salvate sunt afișate mai jos.
        </Text>
      </View>
      <FlatList
        className="px-4 pt-4"
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListingCard item={item} />}
      />
    </View>
  );
}
