import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text } from "react-native";
import Toast from "react-native-toast-message";
import { AppButton, AppInput, CenterLoader } from "@/components/ui";
import { useDeleteListing, useListing } from "@/hooks/useListings";
import { listingsService } from "@/services/listingsService";

export default function EditListingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useListing(id);
  const del = useDeleteListing();
  const [price, setPrice] = useState("");
  if (query.isLoading || !query.data) return <CenterLoader />;

  const save = async () => {
    await listingsService.updateListing(id, { price: Number(price || query.data!.price) });
    Toast.show({ type: "success", text1: "Listing updated" });
    router.back();
  };

  const remove = async () => {
    await del.mutateAsync(id);
    Toast.show({ type: "success", text1: "Listing deleted" });
    router.replace("/my-listings");
  };

  return (
    <ScrollView className="flex-1 bg-slateBg px-4 pt-4">
      <Text className="mb-2 text-lg font-semibold">{query.data.title}</Text>
      <AppInput label="Price" keyboardType="numeric" value={price} onChangeText={setPrice} placeholder={String(query.data.price)} />
      <AppButton title="Save changes" onPress={save} />
      <Text className="mb-2" />
      <AppButton title="Delete listing" onPress={remove} variant="danger" />
    </ScrollView>
  );
}
