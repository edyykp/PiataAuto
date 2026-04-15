import { FiltersSheet } from "@/components/home/FiltersSheet";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeListingCard } from "@/components/home/HomeListingCard";
import { HomeSearchFilters } from "@/components/home/HomeSearchFilters";
import { SkeletonCard } from "@/components/SkeletonCard";
import { EmptyState } from "@/components/ui";
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
  const [filters, setFilters] = useState<ListingFilters>({ sortBy: "newest" });
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<ListingFilters>({
    sortBy: "newest",
  });

  const favorites = useFavorites(user?.id);
  const toggle = useToggleFavorite(user?.id);
  const query = useInfiniteListings(filters);
  const realtime = useRealtimeListings();
  const realtimeFavoriteIds = useRealtimeFavoriteIds(user?.id);
  const items = useMemo(
    () =>
      db ? realtime.items : (query.data?.pages.flatMap((p) => p.data) ?? []),
    [query.data, realtime.items],
  );
  const favoriteIds = db ? realtimeFavoriteIds : (favorites.data ?? []);
  const featured = items.slice(0, 8);

  const handleSearch = () => {
    setFilters(filters);
  };

  const handleReset = () => {
    setFilters({ sortBy: "newest" });
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
          <View>
            <HomeHeader
              filters={filters}
              onFiltersChange={setFilters}
              onSearch={handleSearch}
              onReset={handleReset}
            />

            {/* Structured Filters UI */}
            <View className="rounded-b-[36px] bg-slate-900 px-4 pb-6 shadow-sm">
              <HomeSearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                onAdvancedPress={() => {
                  setPendingFilters(filters);
                  setFilterOpen(true);
                }}
                onReset={handleReset}
              />
            </View>

            {/* Popular Brands */}
            <View className="mt-6">
              <Text className="px-4 text-lg font-semibold text-slate-900">
                Marci populare
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
                          model: undefined,
                          generation: undefined,
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

            {/* Featured Section */}
            {featured.length > 0 && (
              <View className="mt-6">
                <View className="mb-3 flex-row items-center justify-between px-4">
                  <Text className="text-lg font-semibold text-slate-900">
                    Anunțuri recomandate
                  </Text>
                  <Text className="text-sm font-medium text-primary">
                    {featured.length} anunțuri
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
            )}

            {/* Latest Listings Header */}
            <View className="mb-2 mt-6 flex-row items-center justify-between px-4">
              <Text className="text-lg font-semibold text-slate-900">
                Anunțuri recente
              </Text>
              <Text className="text-sm text-slate-500">
                {items.length} rezultate
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View className="px-4 pb-4">
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
