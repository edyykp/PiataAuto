import { FiltersSheet } from "@/components/home/FiltersSheet";
import { HomeListingCard } from "@/components/home/HomeListingCard";
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
import { SORT_OPTIONS } from "@/utils/constants";
import { FontAwesome6 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchResultsScreen() {
  const params = useLocalSearchParams();
  const user = useAuthStore((s) => s.user);

  // Parse filters from params
  const initialFilters: ListingFilters = useMemo(() => {
    try {
      return params.filters
        ? JSON.parse(params.filters as string)
        : { sortBy: "newest" };
    } catch {
      return { sortBy: "newest" };
    }
  }, [params.filters]);

  const [filters, setFilters] = useState<ListingFilters>(initialFilters);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [isSortOpen, setSortOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<ListingFilters>(filters);

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

  if (query.isLoading || realtime.loading) {
    return (
      <SafeAreaView className="flex-1 bg-slateBg">
        <View className="flex-1 px-4 pt-4">
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </SafeAreaView>
    );
  }

  if (!items.length) {
    return (
      <SafeAreaView className="flex-1 bg-slateBg">
        <EmptyState title="Nu s-au găsit rezultate pentru filtrele selectate." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="relative flex-1 bg-slateBg">
      {/* Top Bar */}
      <View className="border-b border-slate-200 bg-white px-4 py-3">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="flex-row items-center gap-2"
          >
            <FontAwesome6 name="arrow-left" size={16} color="#374151" />
            <Text className="text-base font-medium text-slate-900">Înapoi</Text>
          </Pressable>

          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => {
                setPendingFilters(filters);
                setFilterOpen(true);
              }}
              className="flex-row items-center gap-2 rounded-full bg-slate-100 px-3 py-2"
            >
              <FontAwesome6 name="sliders" size={14} color="#374151" />
              <Text className="text-sm font-medium text-slate-700">Filtre</Text>
            </Pressable>

            {/* Sorting Dropdown */}
            <View className="flex-row items-center gap-2">
              <Text className="text-sm text-slate-600">Ordonează:</Text>
              <Pressable
                onPress={() => setSortOpen(true)}
                className="flex-row items-center gap-1 rounded-full bg-slate-100 px-3 py-2"
              >
                <Text className="text-sm font-medium text-slate-900">
                  {
                    SORT_OPTIONS.find((opt) => opt.value === filters.sortBy)
                      ?.label
                  }
                </Text>
                <FontAwesome6 name="chevron-down" size={12} color="#6b7280" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* Results Count */}
      <View className="bg-white px-4 py-2">
        <Text className="text-sm text-slate-600">
          {items.length} rezultate găsite
        </Text>
      </View>

      {/* Listings */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 36 }}
        onEndReached={() => query.hasNextPage && query.fetchNextPage()}
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
        onApply={() => {
          router.push({
            pathname: "/search",
            params: { filters: JSON.stringify(pendingFilters) },
          });
        }}
      />

      {isSortOpen && (
        <View className="absolute inset-0 z-50">
          {/* Full-screen backdrop — closes on outside tap */}
          <Pressable
            onPress={() => setSortOpen(false)}
            className="absolute inset-0"
          />
          {/* Dropdown card */}
          <View className="absolute inset-x-4 top-20 rounded-3xl bg-white p-4 shadow-lg">
            <Text className="mb-3 text-sm font-semibold text-slate-900">
              Ordonează după
            </Text>
            {SORT_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => {
                  setFilters({ ...filters, sortBy: option.value });
                  setSortOpen(false);
                }}
                className={`mb-2 rounded-2xl px-4 py-3 ${
                  filters.sortBy === option.value
                    ? "bg-slate-900"
                    : "bg-slate-100"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    filters.sortBy === option.value
                      ? "text-white"
                      : "text-slate-900"
                  }`}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
