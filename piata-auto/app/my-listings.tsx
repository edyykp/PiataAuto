import { Link } from "expo-router";
import { useMemo } from "react";
import { FlatList, Text, View } from "react-native";
import { ListingCard } from "@/components/ListingCard";
import { AppButton, EmptyState } from "@/components/ui";
import { useInfiniteListings } from "@/hooks/useListings";
import { useAuthStore } from "@/store/authStore";

export default function MyListingsScreen() {
  const user = useAuthStore((s) => s.user);
  const query = useInfiniteListings({ sortBy: "newest" });
  const items = useMemo(() => (query.data?.pages.flatMap((p) => p.data) ?? []).filter((x) => x.userId === user?.id), [query.data, user?.id]);
  if (!items.length) return <EmptyState title="You did not post any cars yet." />;

  return (
    <FlatList
      className="bg-slateBg px-4 pt-4"
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ListingCard
          item={item}
          rightAction={
            <View>
              <Text className="text-xs text-slate-500">Views: {item.viewsCount} | Favorites: {item.favoritesCount}</Text>
              <Link href={`/listings/edit/${item.id}` as never} asChild>
                <View className="mt-2"><AppButton title="Edit listing" onPress={() => {}} variant="ghost" /></View>
              </Link>
            </View>
          }
        />
      )}
    />
  );
}
