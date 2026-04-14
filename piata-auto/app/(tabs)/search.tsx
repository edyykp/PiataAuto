import { useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { ListingCard } from "@/components/ListingCard";
import { AppInput, EmptyState } from "@/components/ui";
import { useDebounce } from "@/hooks/useDebounce";
import { useInfiniteListings } from "@/hooks/useListings";
import { ListingFilters } from "@/types/models";
import { FUELS, SORT_OPTIONS, TRANSMISSIONS } from "@/utils/constants";

export default function SearchScreen() {
  const [filters, setFilters] = useState<ListingFilters>({ sortBy: "newest" });
  const debouncedQuery = useDebounce(filters.query || "");
  const query = useInfiniteListings({ ...filters, query: debouncedQuery });
  const items = useMemo(() => query.data?.pages.flatMap((p) => p.data) ?? [], [query.data]);
  const setSort = (sortBy: ListingFilters["sortBy"]) => setFilters((f) => ({ ...f, sortBy }));

  return (
    <View className="flex-1 bg-slateBg">
      <ScrollView horizontal className="px-4 pt-2" showsHorizontalScrollIndicator={false}>
        {SORT_OPTIONS.map((item) => (
          <Pressable
            key={item.value}
            onPress={() => setSort(item.value)}
            className={`mr-2 rounded-full px-3 py-2 ${filters.sortBy === item.value ? "bg-primary" : "bg-white"}`}
          >
            <Text className={filters.sortBy === item.value ? "text-white" : "text-slate-700"}>{item.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <ScrollView horizontal className="px-4 py-2" showsHorizontalScrollIndicator={false}>
        <View className="w-44 pr-2"><AppInput label="Min price" keyboardType="numeric" onChangeText={(v) => setFilters((f) => ({ ...f, minPrice: Number(v) || undefined }))} /></View>
        <View className="w-44 pr-2"><AppInput label="Max price" keyboardType="numeric" onChangeText={(v) => setFilters((f) => ({ ...f, maxPrice: Number(v) || undefined }))} /></View>
        <View className="w-44 pr-2"><AppInput label="Brand" onChangeText={(v) => setFilters((f) => ({ ...f, brand: v || undefined }))} /></View>
        <View className="w-44 pr-2"><AppInput label="Model" onChangeText={(v) => setFilters((f) => ({ ...f, model: v || undefined }))} /></View>
        <View className="w-44 pr-2"><AppInput label="Min year" keyboardType="numeric" onChangeText={(v) => setFilters((f) => ({ ...f, minYear: Number(v) || undefined }))} /></View>
        <View className="w-44 pr-2"><AppInput label="Max year" keyboardType="numeric" onChangeText={(v) => setFilters((f) => ({ ...f, maxYear: Number(v) || undefined }))} /></View>
        <View className="w-44 pr-2"><AppInput label="Min mileage" keyboardType="numeric" onChangeText={(v) => setFilters((f) => ({ ...f, minMileage: Number(v) || undefined }))} /></View>
        <View className="w-44 pr-2"><AppInput label="Max mileage" keyboardType="numeric" onChangeText={(v) => setFilters((f) => ({ ...f, maxMileage: Number(v) || undefined }))} /></View>
        <View className="w-44 pr-2"><AppInput label="City" onChangeText={(v) => setFilters((f) => ({ ...f, location: v || undefined }))} /></View>
      </ScrollView>
      <ScrollView horizontal className="px-4 pb-2" showsHorizontalScrollIndicator={false}>
        {FUELS.map((fuel) => (
          <Pressable
            key={fuel}
            onPress={() => setFilters((f) => ({ ...f, fuelType: f.fuelType === fuel ? undefined : fuel }))}
            className={`mr-2 rounded-full px-3 py-2 ${filters.fuelType === fuel ? "bg-primary" : "bg-white"}`}
          >
            <Text className={filters.fuelType === fuel ? "text-white" : "text-slate-700"}>{fuel}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <ScrollView horizontal className="px-4 pb-2" showsHorizontalScrollIndicator={false}>
        {TRANSMISSIONS.map((item) => (
          <Pressable
            key={item}
            onPress={() => setFilters((f) => ({ ...f, transmission: f.transmission === item ? undefined : item }))}
            className={`mr-2 rounded-full px-3 py-2 ${filters.transmission === item ? "bg-primary" : "bg-white"}`}
          >
            <Text className={filters.transmission === item ? "text-white" : "text-slate-700"}>{item}</Text>
          </Pressable>
        ))}
        <Pressable onPress={() => setFilters({ sortBy: "newest" })} className="mr-2 rounded-full bg-slate-200 px-3 py-2">
          <Text className="text-slate-700">Reset filters</Text>
        </Pressable>
      </ScrollView>
      <View className="px-4">
        <AppInput label="Search listings" placeholder="BMW, Audi, Corolla..." onChangeText={(query) => setFilters((f) => ({ ...f, query }))} />
      </View>
      {!items.length ? (
        <EmptyState title="No cars match these filters." />
      ) : (
        <FlatList
          className="px-4"
          data={items}
          keyExtractor={(item) => item.id}
          onEndReached={() => query.hasNextPage && query.fetchNextPage()}
          renderItem={({ item }) => <ListingCard item={item} />}
        />
      )}
      <Text className="pb-3 text-center text-xs text-slate-500">Filters are debounced and paginated.</Text>
    </View>
  );
}
