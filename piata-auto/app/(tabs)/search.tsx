import { ListingCard } from "@/components/ListingCard";
import { AppInput, AppTopBar, EmptyState } from "@/components/ui";
import { useDebounce } from "@/hooks/useDebounce";
import { useInfiniteListings } from "@/hooks/useListings";
import { ListingFilters } from "@/types/models";
import { FUELS, SORT_OPTIONS, TRANSMISSIONS } from "@/utils/constants";
import { useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";

export default function SearchScreen() {
  const [filters, setFilters] = useState<ListingFilters>({ sortBy: "newest" });
  const debouncedQuery = useDebounce(filters.query || "");
  const query = useInfiniteListings({ ...filters, query: debouncedQuery });
  const items = useMemo(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );
  const setSort = (sortBy: ListingFilters["sortBy"]) =>
    setFilters((f) => ({ ...f, sortBy }));

  return (
    <View className="flex-1 bg-slateBg">
      <AppTopBar
        title="Căutare"
        subtitle="Setează filtre și găsește rapid mașini"
      />
      <View className="rounded-b-[32px] bg-gradient-to-r from-primaryDark via-primary to-cyan-500 px-6 pb-6 pt-8 shadow-xl">
        <Text className="text-2xl font-extrabold text-white">
          Găsește mașina perfectă
        </Text>
        <Text className="mt-2 max-w-[280px] text-sm text-white/90">
          Caută cu filtre inteligente și descoperă mașina ideală într-un singur
          loc.
        </Text>
      </View>
      <View className="-mt-8 px-4">
        <View className="rounded-[32px] bg-slate-100 border border-slate-200 px-4 py-4 shadow-sm">
          <Text className="mb-3 text-sm font-semibold text-slate-700">
            Filtre rapide
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="space-x-3"
          >
            {SORT_OPTIONS.map((item) => (
              <Pressable
                key={item.value}
                onPress={() => setSort(item.value)}
                className={`rounded-full border px-4 py-2 ${filters.sortBy === item.value ? "border-primary bg-primary" : "border-slate-200 bg-slate-100"}`}
              >
                <Text
                  className={
                    filters.sortBy === item.value
                      ? "text-white"
                      : "text-slate-700"
                  }
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
      <ScrollView
        horizontal
        className="px-4 py-4"
        showsHorizontalScrollIndicator={false}
      >
        {FUELS.map((fuel) => (
          <Pressable
            key={fuel}
            onPress={() =>
              setFilters((f) => ({
                ...f,
                fuelType: f.fuelType === fuel ? undefined : fuel,
              }))
            }
            className={`mr-3 rounded-full px-4 py-2 ${filters.fuelType === fuel ? "bg-primary text-white border border-primary" : "bg-slate-100 text-slate-700 border border-slate-200"} shadow-sm`}
          >
            <Text
              className={
                filters.fuelType === fuel ? "text-white" : "text-slate-700"
              }
            >
              {fuel}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <ScrollView
        horizontal
        className="px-4 pb-2"
        showsHorizontalScrollIndicator={false}
      >
        {TRANSMISSIONS.map((item) => (
          <Pressable
            key={item}
            onPress={() =>
              setFilters((f) => ({
                ...f,
                transmission: f.transmission === item ? undefined : item,
              }))
            }
            className={`mr-3 rounded-full px-4 py-2 ${filters.transmission === item ? "bg-primary text-white border border-primary" : "bg-slate-100 text-slate-700 border border-slate-200"} shadow-sm`}
          >
            <Text
              className={
                filters.transmission === item ? "text-white" : "text-slate-700"
              }
            >
              {item}
            </Text>
          </Pressable>
        ))}
        <Pressable
          onPress={() => setFilters({ sortBy: "newest" })}
          className="mr-3 rounded-full bg-slate-100 px-4 py-2 shadow-sm"
        >
          <Text className="text-slate-700">Resetează filtrele</Text>
        </Pressable>
      </ScrollView>
      <View className="px-4">
        <AppInput
          label="Caută anunțuri"
          placeholder="BMW, Audi, Corolla..."
          onChangeText={(query) => setFilters((f) => ({ ...f, query }))}
        />
      </View>
      {!items.length ? (
        <EmptyState title="Nicio mașină nu se potrivește acestor filtre." />
      ) : (
        <FlatList
          className="px-4"
          data={items}
          keyExtractor={(item) => item.id}
          onEndReached={() => query.hasNextPage && query.fetchNextPage()}
          renderItem={({ item }) => <ListingCard item={item} />}
        />
      )}
      <Text className="pb-3 text-center text-xs text-slate-500">
        Filtrele sunt aplicate automat și rezultatele sunt paginate.
      </Text>
    </View>
  );
}
