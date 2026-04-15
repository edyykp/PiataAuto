import { CarListing } from "@/types/models";
import { formatNumber, formatPrice } from "@/utils/format";
import { FontAwesome6 } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

type Props = {
  item: CarListing;
  favorite: boolean;
  onFavorite: () => void;
};

export const HomeListingCard = ({ item, favorite, onFavorite }: Props) => (
  <Link href={`/listings/${item.id}` as never} asChild>
    <Pressable className="mb-4 overflow-hidden rounded-[28px] bg-white shadow-sm">
      <View className="relative">
        <Image source={{ uri: item.images[0] }} className="h-48 w-full" />
        <View className="absolute inset-x-0 top-4 flex-row items-center justify-between px-4">
          <View className="rounded-full bg-slate-900/75 px-3 py-1">
            <Text className="text-xs font-semibold text-white">{item.year}</Text>
          </View>
          <Pressable
            onPress={onFavorite}
            className="rounded-full bg-white/90 p-2"
            hitSlop={8}
          >
            <FontAwesome6
              name="heart"
              size={14}
              color={favorite ? "#ef4444" : "#64748b"}
              solid={favorite}
            />
          </Pressable>
        </View>
      </View>
      <View className="gap-3 p-4">
        <View className="flex-row items-start justify-between gap-3">
          <Text className="flex-1 text-base font-semibold text-slate-900">
            {item.brand} {item.model}
          </Text>
          <Text className="text-lg font-bold text-primary">
            {formatPrice(item.price)}
          </Text>
        </View>
        <View className="flex-row flex-wrap items-center gap-2">
          <Text className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            {item.location}
          </Text>
          <Text className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            {item.fuelType}
          </Text>
          <Text className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            {item.transmission}
          </Text>
        </View>
        <Text className="text-sm text-slate-500">
          {formatNumber(item.mileage)} km • {item.engine}
        </Text>
      </View>
    </Pressable>
  </Link>
);
