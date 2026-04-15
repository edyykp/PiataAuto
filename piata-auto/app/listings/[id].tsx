import { AppButton, CenterLoader } from "@/components/ui";
import { useFavorites, useToggleFavorite } from "@/hooks/useFavorites";
import { useListing } from "@/hooks/useListings";
import { useCreateOrGetThread } from "@/hooks/useMessages";
import { useAuthStore } from "@/store/authStore";
import { formatNumber, formatPrice } from "@/utils/format";
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_HEIGHT = 300;

// ─── Section Title ───────────────────────────────────────────────
const SectionTitle = ({ children }: { children: string }) => (
  <Text className="mb-3 text-[12px] font-semibold uppercase tracking-widest text-slate-400">
    {children}
  </Text>
);

export default function ListingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useListing(id);
  const user = useAuthStore((s) => s.user);
  const favorites = useFavorites(user?.id);
  const toggle = useToggleFavorite(user?.id);
  const createOrGetThread = useCreateOrGetThread();
  const insets = useSafeAreaInsets();

  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  if (query.isLoading || !query.data) return <CenterLoader />;

  const item = query.data;
  const isFavorite = (favorites.data ?? []).includes(item.id);
  const isOwner = user?.id === item.userId;

  const startConversation = async () => {
    if (!user || isOwner) return;
    const thread = await createOrGetThread.mutateAsync({
      userId: user.id,
      otherUserId: item.userId,
      listingId: item.id,
    });
    router.push(`/messages/${thread.id}` as never);
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
      >
        {/* ── IMAGE CAROUSEL ───────────────────────────────────────── */}
        <View style={{ height: IMAGE_HEIGHT }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
          >
            {item.images.map((img) => (
              <Image
                key={img}
                source={{ uri: img }}
                style={{ width: SCREEN_WIDTH, height: IMAGE_HEIGHT }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.45)"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 100,
            }}
          />

          {/* top buttons */}
          <View
            className="absolute left-0 right-0 flex-row justify-between px-4"
            style={{ paddingTop: insets.top + 8 }}
          >
            <Pressable
              onPress={() => toggle.mutate(item.id)}
              className="h-9 w-9 items-center justify-center rounded-full bg-black/30"
            >
              <FontAwesome6
                name="heart"
                size={15}
                color={isFavorite ? "#f43f5e" : "#fff"}
                solid={isFavorite}
              />
            </Pressable>
          </View>
        </View>

        {/* ── CONTENT ─────────────────────────────────────────────── */}
        <View className="-mt-5 rounded-t-[28px] bg-white px-5 pt-5">
          {/* Title + price */}
          <Text
            className="text-[20px] font-bold text-slate-900"
            numberOfLines={2}
          >
            {item.title}
          </Text>

          <Text className="mt-1 text-[26px] font-extrabold text-primary">
            {formatPrice(item.price)}
          </Text>

          <Text className="mt-1 mb-5 text-[13px] text-slate-400">
            {item.location}
          </Text>

          {/* ── KEY SPECS (IMPORTANT) ─────────────────────────────── */}
          <SectionTitle>Specificații principale</SectionTitle>

          <View className="mb-6 flex-row justify-between">
            <View>
              <Text className="text-xs text-slate-400">An</Text>
              <Text className="text-sm font-semibold text-slate-900">
                {item.year}
              </Text>
            </View>

            <View>
              <Text className="text-xs text-slate-400">Kilometri</Text>
              <Text className="text-sm font-semibold text-slate-900">
                {formatNumber(item.mileage)}
              </Text>
            </View>

            <View>
              <Text className="text-xs text-slate-400">Combustibil</Text>
              <Text className="text-sm font-semibold text-slate-900">
                {item.fuelType}
              </Text>
            </View>

            <View>
              <Text className="text-xs text-slate-400">Cutie</Text>
              <Text className="text-sm font-semibold text-slate-900">
                {item.transmission}
              </Text>
            </View>
          </View>

          {/* ── ENGAGEMENT (clean inline) ─────────────────────────── */}
          <View className="mb-6 flex-row justify-between">
            <Text className="text-xs text-slate-400">
              👁 {formatNumber(item.viewsCount)}
            </Text>
            <Text className="text-xs text-slate-400">
              ❤️ {formatNumber(item.favoritesCount)}
            </Text>
            <Text className="text-xs text-slate-400">
              {new Date(item.createdAt).toLocaleDateString("ro-RO")}
            </Text>
          </View>

          {/* ── DETAILS ────────────────────────────────────────────── */}
          <SectionTitle>Detalii</SectionTitle>

          <View className="mb-6 gap-3">
            {[
              { label: "Marcă", value: item.brand },
              { label: "Model", value: item.model },
              { label: "Motor", value: item.engine },
              item.power && { label: "Putere", value: `${item.power} CP` },
              item.displacement && {
                label: "Cilindree",
                value: `${item.displacement} cm³`,
              },
              { label: "Tracțiune", value: item.traction },
              { label: "Culoare", value: item.color },
              { label: "Origine", value: item.originCountry },
            ]
              .filter(Boolean)
              .map((row: any) => (
                <View
                  key={row.label}
                  className="flex-row justify-between border-b border-slate-100 pb-2"
                >
                  <Text className="text-[13px] text-slate-500">
                    {row.label}
                  </Text>
                  <Text className="text-[13px] font-medium text-slate-900">
                    {row.value}
                  </Text>
                </View>
              ))}
          </View>

          {/* ── FEATURES ───────────────────────────────────────────── */}
          {item.options && item.options?.length > 0 && (
            <>
              <SectionTitle>Dotări</SectionTitle>

              <View className="mb-6 flex-row flex-wrap gap-2">
                {item.options.map((opt) => (
                  <View
                    key={opt}
                    className="rounded-full bg-emerald-50 px-3 py-1.5"
                  >
                    <Text className="text-[12px] font-medium text-emerald-700">
                      {opt}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* ── DESCRIPTION ───────────────────────────────────────── */}
          <SectionTitle>Descriere</SectionTitle>

          <Text className="mb-6 text-[14px] leading-relaxed text-slate-600">
            {item.description}
          </Text>

          {/* ── SELLER ────────────────────────────────────────────── */}
          <SectionTitle>Vânzător</SectionTitle>

          <View className="mb-6 flex-row items-center gap-3 rounded-2xl bg-slate-50 p-4">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-slate-200">
              <FontAwesome6 name="user" size={16} color="#94a3b8" />
            </View>

            <View className="flex-1">
              <Text className="text-[14px] font-semibold text-slate-900">
                {item.sellerName ?? "Vânzător privat"}
              </Text>
              <Text className="text-[12px] text-slate-400">
                Răspunde de obicei în câteva ore
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <View
        className="absolute bottom-0 left-0 right-0 border-t border-slate-100 bg-white px-4 pt-3"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        {isOwner ? (
          <AppButton title="Editează anunțul" onPress={() => {}} />
        ) : (
          <View className="flex-row gap-3">
            <View className="flex-1">
              <AppButton
                title="Trimite mesaj"
                onPress={startConversation}
                variant="ghost"
              />
            </View>
            <View className="flex-1">
              <AppButton
                title={isFavorite ? "Salvat" : "Salvează"}
                onPress={() => toggle.mutate(item.id)}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
