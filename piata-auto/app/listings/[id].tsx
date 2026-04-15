import { AppButton, CenterLoader } from "@/components/ui";
import { useFavorites, useToggleFavorite } from "@/hooks/useFavorites";
import { useListing } from "@/hooks/useListings";
import { useCreateOrGetThread } from "@/hooks/useMessages";
import { useAuthStore } from "@/store/authStore";
import { formatNumber, formatPrice } from "@/utils/format";
import { router, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";

export default function ListingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useListing(id);
  const user = useAuthStore((s) => s.user);
  const favorites = useFavorites(user?.id);
  const toggle = useToggleFavorite(user?.id);
  const createOrGetThread = useCreateOrGetThread();
  if (query.isLoading || !query.data) return <CenterLoader />;

  const item = query.data;
  const isFavorite = (favorites.data ?? []).includes(item.id);
  const startConversation = async () => {
    if (!user || user.id === item.userId) return;
    const thread = await createOrGetThread.mutateAsync({
      userId: user.id,
      otherUserId: item.userId,
      listingId: item.id,
    });
    router.push(`/messages/${thread.id}` as never);
  };

  return (
    <ScrollView className="flex-1 bg-slateBg">
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {item.images.map((img) => (
          <Image key={img} source={{ uri: img }} className="h-64 w-[390px]" />
        ))}
      </ScrollView>
      <View className="p-4">
        <Text className="text-xl font-bold">{item.title}</Text>
        <Text className="mt-1 text-2xl font-extrabold text-primary">
          {formatPrice(item.price)}
        </Text>
        <Text className="mt-2 text-slate-600">{item.location}</Text>
        <Text className="mt-2 text-slate-700">
          {item.year} • {formatNumber(item.mileage)} km • {item.fuelType} •{" "}
          {item.transmission}
        </Text>
        <Text className="mt-1 text-slate-700">Engine: {item.engine}</Text>
        <Text className="mt-4 text-base text-slate-800">
          {item.description}
        </Text>
        <Text className="mt-4 font-semibold">Vânzător</Text>
        <Text className="text-slate-600">Telefon sau mesaj în aplicație</Text>
        <View className="mt-4 gap-2">
          <AppButton
            title={isFavorite ? "Șterge din preferate" : "Adaugă la preferate"}
            onPress={() => toggle.mutate(item.id)}
          />
          <AppButton
            title="Contactează vânzătorul"
            variant="ghost"
            onPress={startConversation}
          />
        </View>
      </View>
    </ScrollView>
  );
}
