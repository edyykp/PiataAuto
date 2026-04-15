import { FiltersSheet } from "@/components/home/FiltersSheet";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeListingCard } from "@/components/home/HomeListingCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { EmptyState } from "@/components/ui";
import { useDebounce } from "@/hooks/useDebounce";
import { useFavorites, useToggleFavorite } from "@/hooks/useFavorites";
import { useInfiniteListings } from "@/hooks/useListings";
import {
  useRealtimeFavoriteIds,
  useRealtimeListings,
} from "@/hooks/useRealtime";
import { db } from "@/services/firebase";
import { useAuthStore } from "@/store/authStore";
import { ListingFilters } from "@/types/models";
import { BRANDS } from "@/utils/constants";
import { useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const brandCategories = BRANDS.slice(0, 6);

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const [search, setSearch] = useState("");
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<ListingFilters>({ sortBy: "newest" });
  const [pendingFilters, setPendingFilters] = useState<ListingFilters>({
    sortBy: "newest",
  });
  const debouncedSearch = useDebounce(search, 400);

  const favorites = useFavorites(user?.id);
  const toggle = useToggleFavorite(user?.id);
  const query = useInfiniteListings({ ...filters, query: debouncedSearch });
  const realtime = useRealtimeListings();
  const realtimeFavoriteIds = useRealtimeFavoriteIds(user?.id);
  const items = useMemo(
    () =>
      db ? realtime.items : (query.data?.pages.flatMap((p) => p.data) ?? []),
    [query.data, realtime.items],
  );
  const favoriteIds = db ? realtimeFavoriteIds : (favorites.data ?? []);
  const featured = items.slice(0, 8);
  const activeFilterCount = Math.max(
    0,
    Object.entries(filters).filter(
      ([key, value]) => key !== "sortBy" && value !== undefined && value !== "",
    ).length,
  );

  const openFilter = () => {
    setPendingFilters(filters);
    setFilterOpen(true);
  };

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
      <SafeAreaView className="flex-1 bg-slateBg">
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 36 }}
          onEndReached={() => query.hasNextPage && query.fetchNextPage()}
          ListHeaderComponent={
            <View className="mb-4">
              <HomeHeader
                search={search}
                onChangeSearch={setSearch}
                onPressFilters={openFilter}
                activeFilterCount={activeFilterCount}
              />

              <View className="mt-5">
                <Text className="px-4 text-lg font-semibold text-slate-900">
                  Popular brands
                </Text>
                <ScrollView
                  horizontal
                  className="mt-3 px-4"
                  showsHorizontalScrollIndicator={false}
                >
                  {brandCategories.map((brand) => {
                    const active = filters.brand === brand;
                    return (
                      <Pressable
                        key={brand}
                        onPress={() =>
                          setFilters((prev) => ({
                            ...prev,
                            brand: prev.brand === brand ? undefined : brand,
                          }))
                        }
                        className={`mr-2 rounded-full px-4 py-2 ${active ? "bg-slate-900" : "bg-white"}`}
                      >
                        <Text
                          className={`text-sm font-medium ${active ? "text-white" : "text-slate-700"}`}
                        >
                          {brand}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              <View className="mt-6">
                <View className="mb-3 flex-row items-center justify-between px-4">
                  <Text className="text-lg font-semibold text-slate-900">
                    Featured for you
                  </Text>
                  <Text className="text-sm font-medium text-primary">
                    {featured.length} cars
                  </Text>
                </View>
                <ScrollView
                  horizontal
                  contentContainerStyle={{ paddingHorizontal: 16 }}
                  showsHorizontalScrollIndicator={false}
                >
                  {featured.map((item) => (
                    <View
                      key={`featured-${item.id}`}
                      className="mr-3 w-[300px]"
                    >
                      <HomeListingCard
                        item={item}
                        favorite={favoriteIds.includes(item.id)}
                        onFavorite={() => toggle.mutate(item.id)}
                      />
                    </View>
                  ))}
                </ScrollView>
              </View>

              <View className="mb-2 mt-6 flex-row items-center justify-between px-4">
                <Text className="text-lg font-semibold text-slate-900">
                  Latest listings
                </Text>
                <Text className="text-sm text-slate-500">
                  {items.length} rezultate
                </Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View className="px-4">
              <HomeListingCard
                item={item}
                favorite={favoriteIds.includes(item.id)}
                onFavorite={() => toggle.mutate(item.id)}
              />
            </View>
          )}
        />

        <FiltersSheet
          visible={isFilterOpen}
          value={pendingFilters}
          onChange={setPendingFilters}
          onClose={() => setFilterOpen(false)}
          onReset={() => {
            setPendingFilters({ sortBy: "newest" });
            setFilters({ sortBy: "newest" });
            setFilterOpen(false);
          }}
          onApply={() => {
            setFilters(pendingFilters);
            setFilterOpen(false);
          }}
        />
      </SafeAreaView>
  );
}
