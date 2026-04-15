import { AppButton, AppInput } from "@/components/ui";
import { useCreateListing } from "@/hooks/useListings";
import { storageService } from "@/services/storageService";
import { useAuthStore } from "@/store/authStore";
import { compressImage } from "@/utils/image";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

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
  const { control, handleSubmit } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 1,
    });
    if (!result.canceled) {
      const compressed = await Promise.all(
        result.assets.map((x) => compressImage(x.uri)),
      );
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
    Toast.show({ type: "success", text1: "Anunț publicat" });
    setStep(1);
    setImages([]);
  });

  return (
    <View className="flex-1 bg-slateBg">
      <ScrollView className="px-4 pt-4">
        <View className="mb-5 rounded-[32px] bg-white px-6 py-6 shadow-xl">
          <Text className="text-2xl font-bold text-slate-900">
            Publică o mașină nouă
          </Text>
          <Text className="mt-2 text-sm leading-6 text-slate-500">
            Completează formularul pentru a-ți afișa anunțul în comunitatea
            PiataAuto.
          </Text>
          <View className="mt-4 rounded-full bg-slate-100 px-4 py-2">
            <Text className="text-sm font-semibold text-slate-700">
              Pasul {step} din 4
            </Text>
          </View>
        </View>
        {step <= 2 ? (
          <>
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <AppInput
                  label="Titlu"
                  value={field.value}
                  onChangeText={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="brand"
              render={({ field }) => (
                <AppInput
                  label="Marca"
                  value={field.value}
                  onChangeText={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="model"
              render={({ field }) => (
                <AppInput
                  label="Model"
                  value={field.value}
                  onChangeText={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="year"
              render={({ field }) => (
                <AppInput
                  label="An"
                  value={String(field.value || "")}
                  onChangeText={field.onChange}
                  keyboardType="numeric"
                />
              )}
            />
            <Controller
              control={control}
              name="fuelType"
              render={({ field }) => (
                <AppInput
                  label="Tip combustibil"
                  value={field.value}
                  onChangeText={field.onChange}
                />
              )}
            />
          </>
        ) : (
          <>
            <Controller
              control={control}
              name="mileage"
              render={({ field }) => (
                <AppInput
                  label="Kilometraj"
                  value={String(field.value || "")}
                  onChangeText={field.onChange}
                  keyboardType="numeric"
                />
              )}
            />
            <Controller
              control={control}
              name="transmission"
              render={({ field }) => (
                <AppInput
                  label="Transmisie"
                  value={field.value}
                  onChangeText={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="engine"
              render={({ field }) => (
                <AppInput
                  label="Motor"
                  value={field.value}
                  onChangeText={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="price"
              render={({ field }) => (
                <AppInput
                  label="Preț"
                  value={String(field.value || "")}
                  onChangeText={field.onChange}
                  keyboardType="numeric"
                />
              )}
            />
            <Controller
              control={control}
              name="location"
              render={({ field }) => (
                <AppInput
                  label="Locație"
                  value={field.value}
                  onChangeText={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <AppInput
                  label="Descriere"
                  value={field.value}
                  onChangeText={field.onChange}
                  multiline
                  numberOfLines={4}
                />
              )}
            />
            <AppButton
              title={`Încarcă poze (${images.length})`}
              onPress={pickImage}
              variant="ghost"
            />
          </>
        )}
        <View className="mb-8 mt-4 flex-row gap-3 px-4">
          <View className="flex-1">
            <AppButton
              title="Următor"
              onPress={() => setStep((s) => Math.min(4, s + 1))}
              variant="ghost"
            />
          </View>
          <View className="flex-1">
            <AppButton title="Publică" onPress={onSubmit} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
