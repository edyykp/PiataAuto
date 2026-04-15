import { AppButton, AppInput, AppSelect } from "@/components/ui";
import { useCreateListing } from "@/hooks/useListings";
import { storageService } from "@/services/storageService";
import { useAuthStore } from "@/store/authStore";
import { CarListing } from "@/types/models";
import {
  BODY_TYPES,
  BRANDS,
  CAR_GENERATIONS,
  CAR_MODELS,
  COLORS,
  FIRST_REGISTRATION_OPTIONS,
  FUELS,
  ORIGIN_COUNTRIES,
  TRACTIONS,
  TRANSMISSIONS,
} from "@/utils/constants";
import { compressImage } from "@/utils/image";
import { FontAwesome6 } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

// ─────────────────────────────────────────────
// FULL MARKETPLACE SCHEMA
// ─────────────────────────────────────────────

const schema = z.object({
  // identity
  title: z.string().min(4),
  brand: z.string().min(2),
  model: z.string().min(1),
  generation: z.string().optional(),
  bodyType: z.string(),

  condition: z.enum(["Nou", "Rulat", "Avariat"]).optional(),

  // technical
  year: z.string().min(4),
  mileage: z.string().min(1),
  fuelType: z.enum(["Petrol", "Diesel", "Hybrid", "Electric", "LPG"]),
  transmission: z.enum(["Manual", "Automatic"]),
  engine: z.string().min(2),

  power: z.string().optional(),
  displacement: z.string().optional(),
  traction: z.enum(["Fata", "Spate", "Integrală"]).optional(),

  // market
  price: z.string().min(1),
  currency: z.enum(["EUR", "RON"]).optional(),
  location: z.string().min(2),

  color: z.string().optional(),
  originCountry: z.string().optional(),
  firstRegistration: z.string().optional(),
  vin: z.string().optional(),

  description: z.string().min(20),
});

const CONDITION_OPTIONS = ["Nou", "Rulat", "Avariat"] as const;
const CURRENCY_OPTIONS = ["EUR", "RON"] as const;

// ─────────────────────────────────────────────
// STEP UI
// ─────────────────────────────────────────────

const StepHeader = ({ step }: { step: number }) => (
  <View className="mb-4 rounded-3xl bg-white p-5">
    <Text className="text-xl font-bold text-slate-900">
      Publică un anunț auto
    </Text>

    <Text className="mt-2 text-sm text-slate-500">
      Completează toate detaliile pentru un anunț mai vizibil și mai relevant.
    </Text>

    <View className="mt-3 flex-row justify-between">
      <Text className="text-xs text-slate-400">
        Date complete = mai multe șanse de vânzare
      </Text>

      <View className="rounded-full bg-slate-100 px-3 py-1">
        <Text className="text-xs font-semibold text-slate-700">
          Pasul {step} / 4
        </Text>
      </View>
    </View>
  </View>
);

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────

export default function PostScreen() {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const user = useAuthStore((s) => s.user);
  const createListing = useCreateListing();

  const { control, handleSubmit, setValue } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const brandValue = useWatch({ control, name: "brand" });
  const modelValue = useWatch({ control, name: "model" });
  const generationValue = useWatch({ control, name: "generation" });
  const bodyTypeValue = useWatch({ control, name: "bodyType" });
  const conditionValue = useWatch({ control, name: "condition" });
  const fuelTypeValue = useWatch({ control, name: "fuelType" });
  const transmissionValue = useWatch({ control, name: "transmission" });
  const tractionValue = useWatch({ control, name: "traction" });
  const currencyValue = useWatch({ control, name: "currency" });
  const colorValue = useWatch({ control, name: "color" });
  const originCountryValue = useWatch({ control, name: "originCountry" });
  const firstRegistrationValue = useWatch({
    control,
    name: "firstRegistration",
  });

  const modelOptions = brandValue ? (CAR_MODELS[brandValue] ?? []) : [];
  const generationOptions =
    brandValue && modelValue
      ? (CAR_GENERATIONS[`${brandValue} ${modelValue}`] ?? [])
      : [];

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

    const { condition, vin, currency, ...listingValues } = values;

    await createListing.mutateAsync({
      ...listingValues,
      year: Number(values.year),
      mileage: Number(values.mileage),
      price: Number(values.price),
      displacement: values.displacement
        ? Number(values.displacement)
        : undefined,
      bodyType: values.bodyType as CarListing["bodyType"],
      images: uploadedImages,
      userId: user.id,
      sellerName: user.name || "",
    });

    Toast.show({ type: "success", text1: "Anunț publicat" });

    setStep(1);
    setImages([]);
  });

  const StepNavigation = () => (
    <View className="mt-6 flex-row gap-3">
      <View className="flex-1">
        <AppButton
          title="Înapoi"
          variant="ghost"
          onPress={() => setStep((s) => Math.max(1, s - 1))}
        />
      </View>

      {step < 4 ? (
        <View className="flex-1">
          <AppButton
            title="Continuă"
            onPress={() => setStep((s) => Math.min(4, s + 1))}
          />
        </View>
      ) : (
        <View className="flex-1">
          <AppButton title="Publică anunțul" onPress={onSubmit} />
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        <StepHeader step={step} />

        {/* ───────── IMAGES ───────── */}
        <View className="mb-4 rounded-3xl bg-white p-5">
          <Text className="mb-3 text-xs font-semibold uppercase text-slate-400">
            Fotografii
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3">
              {images.map((img) => (
                <Image
                  key={img}
                  source={{ uri: img }}
                  className="h-24 w-24 rounded-2xl"
                />
              ))}

              <Pressable
                onPress={pickImage}
                className="h-24 w-24 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50"
              >
                <FontAwesome6 name="plus" size={18} color="#94a3b8" />
                <Text className="mt-1 text-[11px] text-slate-400">Adaugă</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>

        {/* ───────── STEP 1: IDENTITATE ───────── */}
        {step === 1 && (
          <View className="rounded-3xl bg-white p-5 gap-4">
            <Text className="text-xs font-semibold uppercase text-slate-400">
              Identificare vehicul
            </Text>

            <AppInput label="Titlu anunț" {...control.register("title")} />

            <AppSelect
              label="Marcă"
              value={brandValue}
              options={BRANDS}
              onValueChange={(value) => {
                setValue("brand", value);
                setValue("model", "");
                setValue("generation", "");
              }}
            />

            <AppSelect
              label="Model"
              value={modelValue}
              options={modelOptions}
              onValueChange={(value) => {
                setValue("model", value);
                setValue("generation", "");
              }}
              disabled={!brandValue}
              placeholder={
                brandValue ? "Selectează modelul" : "Alege marca mai întâi"
              }
            />

            {generationOptions.length > 0 ? (
              <AppSelect
                label="Generație"
                value={generationValue}
                options={generationOptions}
                onValueChange={(value) => setValue("generation", value)}
                placeholder="Selectează generația"
              />
            ) : (
              <AppInput label="Generație" {...control.register("generation")} />
            )}

            <AppSelect
              label="Tip caroserie"
              value={bodyTypeValue}
              options={BODY_TYPES}
              onValueChange={(value) =>
                setValue(
                  "bodyType",
                  value as z.infer<typeof schema>["bodyType"],
                )
              }
            />

            <AppSelect
              label="Stare"
              value={conditionValue}
              options={CONDITION_OPTIONS as readonly string[]}
              onValueChange={(value) =>
                setValue(
                  "condition",
                  value as z.infer<typeof schema>["condition"],
                )
              }
              placeholder="Selectează starea"
            />
          </View>
        )}

        {/* ───────── STEP 2: TEHNIC ───────── */}
        {step === 2 && (
          <View className="rounded-3xl bg-white p-5 gap-4">
            <Text className="text-xs font-semibold uppercase text-slate-400">
              Date tehnice
            </Text>

            <AppInput
              label="An fabricație"
              keyboardType="numeric"
              {...control.register("year")}
            />
            <AppInput
              label="Kilometraj"
              keyboardType="numeric"
              {...control.register("mileage")}
            />

            <AppSelect
              label="Combustibil"
              value={fuelTypeValue}
              options={FUELS}
              onValueChange={(value) =>
                setValue(
                  "fuelType",
                  value as z.infer<typeof schema>["fuelType"],
                )
              }
            />
            <AppSelect
              label="Transmisie"
              value={transmissionValue}
              options={TRANSMISSIONS}
              onValueChange={(value) =>
                setValue(
                  "transmission",
                  value as z.infer<typeof schema>["transmission"],
                )
              }
            />
            <AppInput label="Motor" {...control.register("engine")} />

            <AppInput
              label="Putere (CP)"
              keyboardType="numeric"
              {...control.register("power")}
            />
            <AppInput
              label="Cilindree (cm³)"
              keyboardType="numeric"
              {...control.register("displacement")}
            />

            <AppSelect
              label="Tracțiune"
              value={tractionValue}
              options={TRACTIONS}
              onValueChange={(value) =>
                setValue(
                  "traction",
                  value as z.infer<typeof schema>["traction"],
                )
              }
              placeholder="Selectează tracțiunea"
            />
          </View>
        )}

        {/* ───────── STEP 3: PIATA ───────── */}
        {step === 3 && (
          <View className="rounded-3xl bg-white p-5 gap-4">
            <Text className="text-xs font-semibold uppercase text-slate-400">
              Preț & detalii
            </Text>

            <AppInput
              label="Preț"
              keyboardType="numeric"
              {...control.register("price")}
            />
            <AppSelect
              label="Monedă"
              value={currencyValue}
              options={CURRENCY_OPTIONS as readonly string[]}
              onValueChange={(value) =>
                setValue(
                  "currency",
                  value as z.infer<typeof schema>["currency"],
                )
              }
            />
            <AppInput label="Locație" {...control.register("location")} />

            <AppSelect
              label="Culoare"
              value={colorValue}
              options={COLORS}
              onValueChange={(value) => setValue("color", value)}
              placeholder="Selectează culoarea"
            />
            <AppSelect
              label="Țara de origine"
              value={originCountryValue}
              options={ORIGIN_COUNTRIES}
              onValueChange={(value) => setValue("originCountry", value)}
              placeholder="Selectează țara"
            />
            <AppSelect
              label="Prima înmatriculare"
              value={firstRegistrationValue}
              options={FIRST_REGISTRATION_OPTIONS}
              onValueChange={(value) => setValue("firstRegistration", value)}
              placeholder="Selectează opțiunea"
            />

            <AppInput label="VIN (serie șasiu)" {...control.register("vin")} />
          </View>
        )}

        {/* ───────── STEP 4: DESCRIERE ───────── */}
        {step === 4 && (
          <View className="rounded-3xl bg-white p-5 gap-4">
            <Text className="text-xs font-semibold uppercase text-slate-400">
              Descriere
            </Text>

            <AppInput
              label="Descriere detaliată"
              multiline
              numberOfLines={5}
              {...control.register("description")}
            />
          </View>
        )}

        <StepNavigation />
      </ScrollView>
    </View>
  );
}
