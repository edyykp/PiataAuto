import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";
import { AppButton, AppInput } from "@/components/ui";
import { useCreateListing } from "@/hooks/useListings";
import { storageService } from "@/services/storageService";
import { useAuthStore } from "@/store/authStore";
import { compressImage } from "@/utils/image";

const schema = z.object({
  title: z.string().min(4),
  brand: z.string().min(2),
  model: z.string().min(1),
  year: z.string().min(4),
  fuelType: z.enum(["Petrol", "Diesel", "Hybrid", "Electric", "LPG"]),
  mileage: z.string().min(1),
  transmission: z.enum(["Manual", "Automatic"]),
  engine: z.string().min(2),
  price: z.string().min(1),
  location: z.string().min(2),
  description: z.string().min(20),
});

export default function PostScreen() {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const user = useAuthStore((s) => s.user);
  const createListing = useCreateListing();
  const { control, handleSubmit } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true, quality: 1 });
    if (!result.canceled) {
      const compressed = await Promise.all(result.assets.map((x) => compressImage(x.uri)));
      setImages((prev) => [...prev, ...compressed]);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!user) return;
    const uploadedImages = await storageService.uploadListingImages(
      user.id,
      images.length ? images : ["https://picsum.photos/seed/fallback/900/600"],
    );
    await createListing.mutateAsync({
      ...values,
      year: Number(values.year),
      mileage: Number(values.mileage),
      price: Number(values.price),
      images: uploadedImages,
      userId: user.id,
    });
    Toast.show({ type: "success", text1: "Listing posted" });
    setStep(1);
    setImages([]);
  });

  return (
    <ScrollView className="flex-1 bg-slateBg px-4 pt-4">
      <Text className="mb-3 text-xl font-bold">Post a car - Step {step}/4</Text>
      {step <= 2 ? (
        <>
          <Controller control={control} name="title" render={({ field }) => <AppInput label="Title" value={field.value} onChangeText={field.onChange} />} />
          <Controller control={control} name="brand" render={({ field }) => <AppInput label="Brand" value={field.value} onChangeText={field.onChange} />} />
          <Controller control={control} name="model" render={({ field }) => <AppInput label="Model" value={field.value} onChangeText={field.onChange} />} />
          <Controller control={control} name="year" render={({ field }) => <AppInput label="Year" value={String(field.value || "")} onChangeText={field.onChange} keyboardType="numeric" />} />
          <Controller control={control} name="fuelType" render={({ field }) => <AppInput label="Fuel (Petrol/Diesel/Hybrid/Electric/LPG)" value={field.value} onChangeText={field.onChange} />} />
        </>
      ) : (
        <>
          <Controller control={control} name="mileage" render={({ field }) => <AppInput label="Mileage" value={String(field.value || "")} onChangeText={field.onChange} keyboardType="numeric" />} />
          <Controller control={control} name="transmission" render={({ field }) => <AppInput label="Transmission (Manual/Automatic)" value={field.value} onChangeText={field.onChange} />} />
          <Controller control={control} name="engine" render={({ field }) => <AppInput label="Engine" value={field.value} onChangeText={field.onChange} />} />
          <Controller control={control} name="price" render={({ field }) => <AppInput label="Price" value={String(field.value || "")} onChangeText={field.onChange} keyboardType="numeric" />} />
          <Controller control={control} name="location" render={({ field }) => <AppInput label="Location" value={field.value} onChangeText={field.onChange} />} />
          <Controller control={control} name="description" render={({ field }) => <AppInput label="Description" value={field.value} onChangeText={field.onChange} multiline numberOfLines={4} />} />
          <AppButton title={`Upload photos (${images.length})`} onPress={pickImage} variant="ghost" />
        </>
      )}
      <View className="mb-8 mt-4 flex-row gap-2">
        <View className="flex-1"><AppButton title="Next step" onPress={() => setStep((s) => Math.min(4, s + 1))} variant="ghost" /></View>
        <View className="flex-1"><AppButton title="Publish" onPress={onSubmit} /></View>
      </View>
    </ScrollView>
  );
}
