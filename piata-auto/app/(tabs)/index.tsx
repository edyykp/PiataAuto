import { useMemo } from "react";
import { FlatList, Text, View } from "react-native";
import { ListingCard } from "@/components/ListingCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { EmptyState } from "@/components/ui";
import { useFavorites, useToggleFavorite } from "@/hooks/useFavorites";
import { useInfiniteListings } from "@/hooks/useListings";
import { useRealtimeFavoriteIds, useRealtimeListings } from "@/hooks/useRealtime";
import { db } from "@/services/firebase";
import { useAuthStore } from "@/store/authStore";

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const favorites = useFavorites(user?.id);
  const toggle = useToggleFavorite(user?.id);
  const query = useInfiniteListings({ sortBy: "newest" });
  const realtime = useRealtimeListings();
  const realtimeFavoriteIds = useRealtimeFavoriteIds(user?.id);
  const items = useMemo(
    () => (db ? realtime.items : query.data?.pages.flatMap((p) => p.data) ?? []),
    [query.data, realtime.items],
  );
  const favoriteIds = db ? realtimeFavoriteIds : favorites.data ?? [];

  if (query.isLoading || realtime.loading) {
    return (
      <View className="flex-1 bg-slateBg px-4 pt-4">
        <SkeletonCard />
        <SkeletonCard />
      </View>
    );
  }
  if (!items.length) return <EmptyState title="No listings yet." />;

  return (
    <FlatList
      className="bg-slateBg px-4 pt-4"
      data={items}
      keyExtractor={(item) => item.id}
      onEndReached={() => query.hasNextPage && query.fetchNextPage()}
      renderItem={({ item }) => (
        <ListingCard
          item={item}
          rightAction={
            <Text onPress={() => toggle.mutate(item.id)} className="font-medium text-primary">
              {favoriteIds.includes(item.id) ? "Remove favorite" : "Add favorite"}
            </Text>
          }
        />
      )}
    />
  );
}
