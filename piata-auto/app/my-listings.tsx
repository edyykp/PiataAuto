import { ListingCard } from "@/components/ListingCard";
import { AppButton, AppTopBar, EmptyState } from "@/components/ui";
import { useInfiniteListings } from "@/hooks/useListings";
import { useAuthStore } from "@/store/authStore";
import { Link } from "expo-router";
import { useMemo } from "react";
import { FlatList, Text, View } from "react-native";

export default function MyListingsScreen() {
  const user = useAuthStore((s) => s.user);
  const query = useInfiniteListings({ sortBy: "newest" });
  const items = useMemo(
    () =>
      (query.data?.pages.flatMap((p) => p.data) ?? []).filter(
        (x) => x.userId === user?.id,
      ),
    [query.data, user?.id],
  );
  if (!items.length)
    return (
      <View className="flex-1 bg-slateBg">
        <AppTopBar
          title="Anunțurile mele"
          subtitle="Gestionează anunțurile tale active"
        />
        <EmptyState title="Nu ai postat nicio mașină încă." />
      </View>
    );

  return (
    <View className="flex-1 bg-slateBg">
      <AppTopBar
        title="Anunțurile mele"
        subtitle="Gestionează anunțurile tale active"
      />
      <View className="rounded-b-[32px] bg-white px-6 py-6 shadow-sm">
        <Text className="text-xl font-semibold text-slate-900">
          Anunțurile mele
        </Text>
        <Text className="mt-1 text-sm text-slate-500">
          Gestionează-ți anunțurile actuale.
        </Text>
      </View>
      <FlatList
        className="px-4 pt-4"
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListingCard
            item={item}
            rightAction={
              <View>
                <Text className="text-xs text-slate-500">
                  Vizualizări: {item.viewsCount} | Preferate:{" "}
                  {item.favoritesCount}
                </Text>
                <Link href={`/listings/edit/${item.id}` as never} asChild>
                  <View className="mt-3">
                    <AppButton
                      title="Editează anunțul"
                      onPress={() => {}}
                      variant="ghost"
                    />
                  </View>
                </Link>
              </View>
            }
          />
        )}
      />
    </View>
  );
}
