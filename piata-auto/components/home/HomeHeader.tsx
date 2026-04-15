import { FontAwesome6 } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { AppInput } from "@/components/ui";

type Props = {
  search: string;
  onChangeSearch: (value: string) => void;
  onPressFilters: () => void;
  activeFilterCount: number;
};

export const HomeHeader = ({
  search,
  onChangeSearch,
  onPressFilters,
  activeFilterCount,
}: Props) => (
  <View className="rounded-b-[36px] bg-slate-900 px-5 pb-6 pt-14">
    <View className="mb-5 flex-row items-start justify-between">
      <View>
        <Text className="text-xs uppercase tracking-[0.25em] text-slate-400">
          PiataAuto
        </Text>
        <Text className="mt-1 text-2xl font-bold text-white">
          Find your next car
        </Text>
      </View>
      <Link href="/messages" asChild>
        <Pressable className="rounded-2xl bg-white/10 p-3">
          <FontAwesome6 name="bell" size={16} color="#fff" />
        </Pressable>
      </Link>
    </View>

    <View className="flex-row items-center gap-3">
      <View className="flex-1 rounded-2xl bg-white px-3">
        <AppInput
          label="Search by brand, model, city"
          value={search}
          onChangeText={onChangeSearch}
          placeholder="BMW X5, Cluj, automatic..."
        />
      </View>
      <Pressable
        onPress={onPressFilters}
        className="h-14 w-14 items-center justify-center rounded-2xl bg-primary"
      >
        <FontAwesome6 name="sliders" size={16} color="#fff" />
        {activeFilterCount > 0 && (
          <View className="absolute -right-1 -top-1 rounded-full bg-amber-400 px-1.5 py-0.5">
            <Text className="text-[10px] font-bold text-slate-900">
              {activeFilterCount}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  </View>
);
