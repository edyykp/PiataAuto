import { ListingFilters } from "@/types/models";
import { FontAwesome6 } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

type Props = {
  filters: ListingFilters;
  onFiltersChange: (filters: ListingFilters) => void;
  onSearch: () => void;
  onReset: () => void;
};

export const HomeHeader = ({
  filters,
  onFiltersChange,
  onSearch,
  onReset,
}: Props) => {
  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => key !== "sortBy" && value !== undefined && value !== "",
  ).length;

  return (
    <View className="bg-slate-900 px-5 pb-6 pt-8">
      {/* Header with logo and notifications */}
      <View className="mb-5 flex-row items-start justify-between">
        <View>
          <Text className="text-xs uppercase tracking-[0.25em] text-slate-400">
            PiataAuto
          </Text>
          <Text className="mt-1 text-2xl font-bold text-white">
            Găsește-ți mașina
          </Text>
        </View>
        <Link href="/messages" asChild>
          <Pressable className="rounded-2xl bg-white/10 p-3">
            <FontAwesome6 name="bell" size={16} color="#fff" />
            {activeFilterCount > 0 && (
              <View className="absolute -right-1 -top-1 rounded-full bg-amber-400 px-1.5 py-0.5">
                <Text className="text-[10px] font-bold text-slate-900">
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </Pressable>
        </Link>
      </View>

      {/* Filter subtitle */}
      <View className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
        <Text className="text-sm text-white/80">
          Setează filtrele și descoperă mașina perfectă în câteva secunde
        </Text>
      </View>
    </View>
  );
};
