import { Link } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { CarListing } from "@/types/models";
import { formatNumber, formatPrice } from "@/utils/format";

type Props = {
  item: CarListing;
  rightAction?: React.ReactNode;
};

export const ListingCard = ({ item, rightAction }: Props) => (
  <Link href={`/listings/${item.id}` as never} asChild>
    <Pressable className="mb-3 overflow-hidden rounded-2xl bg-white shadow-sm">
      <Image source={{ uri: item.images[0] }} className="h-44 w-full" />
      <View className="p-3">
        <View className="flex-row items-start justify-between">
          <Text className="flex-1 text-base font-semibold text-slate-900">{item.title}</Text>
          <Text className="ml-2 text-base font-bold text-primary">{formatPrice(item.price)}</Text>
        </View>
        <Text className="mt-1 text-xs text-slate-500">{item.location}</Text>
        <Text className="mt-2 text-xs text-slate-600">
          {item.year} • {formatNumber(item.mileage)} km • {item.fuelType}
        </Text>
        {rightAction ? <View className="mt-3">{rightAction}</View> : null}
      </View>
    </Pressable>
  </Link>
);
