import { ListingCard } from "@/components/ListingCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { AppTopBar, EmptyState } from "@/components/ui";
import { useFavorites, useToggleFavorite } from "@/hooks/useFavorites";
import { useInfiniteListings } from "@/hooks/useListings";
import {
  useRealtimeFavoriteIds,
  useRealtimeListings,
} from "@/hooks/useRealtime";
import { db } from "@/services/firebase";
import { useAuthStore } from "@/store/authStore";
import { useMemo } from "react";
import { FlatList, Text, View } from "react-native";

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const favorites = useFavorites(user?.id);
  const toggle = useToggleFavorite(user?.id);
  const query = useInfiniteListings({ sortBy: "newest" });
  const realtime = useRealtimeListings();
  const realtimeFavoriteIds = useRealtimeFavoriteIds(user?.id);
  const items = useMemo(
    () =>
      db ? realtime.items : (query.data?.pages.flatMap((p) => p.data) ?? []),
    [query.data, realtime.items],
  );
  const favoriteIds = db ? realtimeFavoriteIds : (favorites.data ?? []);

  if (query.isLoading || realtime.loading) {
    return (
      <View className="flex-1 bg-slateBg px-4 pt-4">
        <SkeletonCard />
        <SkeletonCard />
      </View>
    );
  }
  if (!items.length) return <EmptyState title="Nu există anunțuri încă." />;

  return (
    <View className="flex-1 bg-slateBg">
      <AppTopBar
        title="Acasă"
        subtitle="Anunțuri recente și recomandate pentru tine"
      />
      <View className="rounded-b-[32px] bg-gradient-to-r from-primaryDark via-primary to-cyan-500 px-6 pb-6 pt-10 shadow-xl">
        <Text className="text-3xl font-extrabold text-white">
          Descoperă următorul tău automobil
        </Text>
        <Text className="mt-3 max-w-[260px] text-base text-white/90">
          Răsfoiește mașini premium de la vânzători de încredere și găsește
          potrivirea perfectă în câteva secunde.
        </Text>
        <View className="mt-5 flex-row items-center justify-between rounded-3xl bg-slate-900/15 border border-white/20 px-4 py-4 shadow-sm">
          <View>
            <Text className="text-sm uppercase tracking-[0.3em] text-white/80">
              Listings
            </Text>
            <Text className="text-2xl font-bold text-white">
              {items.length}
            </Text>
          </View>
          <View>
            <Text className="text-sm uppercase tracking-[0.3em] text-white/80">
              Favorites
            </Text>
            <Text className="text-2xl font-bold text-white">
              {favoriteIds.length}
            </Text>
          </View>
        </View>
      </View>
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 24,
          paddingBottom: 24,
        }}
        data={items}
        keyExtractor={(item) => item.id}
        onEndReached={() => query.hasNextPage && query.fetchNextPage()}
        renderItem={({ item }) => (
          <ListingCard
            item={item}
            rightAction={
              <Text
                onPress={() => toggle.mutate(item.id)}
                className="font-semibold text-primary"
              >
                {favoriteIds.includes(item.id)
                  ? "Șterge din preferate"
                  : "Adaugă la preferate"}
              </Text>
            }
          />
        )}
      />
    </View>
  );
}
