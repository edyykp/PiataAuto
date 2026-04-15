import { CarListing } from "@/types/models";
import { formatNumber, formatPrice } from "@/utils/format";
import { Link } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

type Props = {
  item: CarListing;
  rightAction?: React.ReactNode;
};

export const ListingCard = ({ item, rightAction }: Props) => (
  <Link href={`/listings/${item.id}` as never} asChild>
    <Pressable className="mb-4 overflow-hidden rounded-[28px] bg-white shadow-xl">
      <View className="relative h-44 w-full overflow-hidden">
        <Image source={{ uri: item.images[0] }} className="h-full w-full" />
        <View className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent px-4 py-3" />
        <View className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 shadow-sm">
          <Text className="text-xs font-semibold text-slate-900">
            {item.year}
          </Text>
        </View>
      </View>
      <View className="p-4">
        <View className="flex-row items-start justify-between gap-3">
          <Text className="flex-1 text-base font-semibold tracking-tight text-slate-900">
            {item.title}
          </Text>
          <Text className="whitespace-nowrap rounded-full bg-primary px-3 py-1 text-sm font-bold text-white shadow-sm">
            {formatPrice(item.price)}
          </Text>
        </View>
        <View className="mt-3 flex-row flex-wrap items-center gap-2">
          <Text className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {item.location}
          </Text>
          <Text className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {item.fuelType}
          </Text>
          <Text className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {item.transmission}
          </Text>
        </View>
        <Text className="mt-3 text-sm leading-6 text-slate-600">
          {formatNumber(item.mileage)} km •{" "}
          {item.description?.slice(0, 60) ??
            "Fast, reliable car with a clean history."}
        </Text>
        {rightAction ? <View className="mt-4">{rightAction}</View> : null}
      </View>
    </Pressable>
  </Link>
);
