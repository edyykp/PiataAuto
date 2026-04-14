import { useMemo } from "react";
import { FlatList } from "react-native";
import { ListingCard } from "@/components/ListingCard";
import { EmptyState } from "@/components/ui";
import { useFavorites } from "@/hooks/useFavorites";
import { useInfiniteListings } from "@/hooks/useListings";
import { useRealtimeFavoriteIds, useRealtimeListings } from "@/hooks/useRealtime";
import { db } from "@/services/firebase";
import { useAuthStore } from "@/store/authStore";

export default function FavoritesScreen() {
  const user = useAuthStore((s) => s.user);
  const favorites = useFavorites(user?.id);
  const realtimeFavoriteIds = useRealtimeFavoriteIds(user?.id);
  const ids = db ? realtimeFavoriteIds : favorites.data ?? [];
  const all = useInfiniteListings({ sortBy: "newest" });
  const realtime = useRealtimeListings();
  const source = db ? realtime.items : all.data?.pages.flatMap((p) => p.data) ?? [];
  const items = useMemo(() => source.filter((x) => ids.includes(x.id)), [source, ids]);

  if (!items.length) return <EmptyState title="No favorites yet." />;
  return <FlatList className="bg-slateBg px-4 pt-4" data={items} keyExtractor={(item) => item.id} renderItem={({ item }) => <ListingCard item={item} />} />;
}
