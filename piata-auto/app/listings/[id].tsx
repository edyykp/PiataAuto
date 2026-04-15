import { AppButton, CenterLoader } from "@/components/ui";
import { useFavorites, useToggleFavorite } from "@/hooks/useFavorites";
import { useListing } from "@/hooks/useListings";
import { useCreateOrGetThread } from "@/hooks/useMessages";
import { useAuthStore } from "@/store/authStore";
import { formatNumber, formatPrice } from "@/utils/format";
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_HEIGHT = 300;

// ─── Stat tile ────────────────────────────────────────────────────────────────
const StatTile = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <View className="flex-1 items-start rounded-2xl bg-slate-50 px-3.5 py-3">
    <Text className="mb-1 text-base">{icon}</Text>
    <Text className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
      {label}
    </Text>
    <Text
      className="mt-0.5 text-[13px] font-semibold text-slate-800"
      numberOfLines={1}
    >
      {value}
    </Text>
  </View>
);

// ─── Section header ───────────────────────────────────────────────────────────
const SectionTitle = ({ children }: { children: string }) => (
  <Text className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
    {children}
  </Text>
);

// ─── Main screen ──────────────────────────────────────────────────────────────
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

  const stats = [
    { icon: "📅", label: "An", value: String(item.year) },
    {
      icon: "🛣️",
      label: "Kilometraj",
      value: `${formatNumber(item.mileage)} km`,
    },
    { icon: "⛽", label: "Combustibil", value: item.fuelType },
    { icon: "⚙️", label: "Transmisie", value: item.transmission },
    { icon: "🔧", label: "Motor", value: item.engine },
    ...(item.power
      ? [{ icon: "💪", label: "Putere", value: `${item.power} CP` }]
      : []),
  ];

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
      >
        {/* ── Image Carousel ─────────────────────────────────────────────── */}
        <View style={{ height: IMAGE_HEIGHT }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            scrollEventThrottle={16}
          >
            {item.images.map((img, i) => (
              <Image
                key={img}
                source={{ uri: img }}
                style={{ width: SCREEN_WIDTH, height: IMAGE_HEIGHT }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Bottom gradient */}
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

          {/* Back + Favorite floating buttons */}
          <View
            className="absolute left-0 right-0 top-0 flex-row items-center justify-between px-4"
            style={{ paddingTop: insets.top + 8 }}
          >
            <Pressable
              onPress={() => router.back()}
              className="h-9 w-9 items-center justify-center rounded-full bg-black/30"
              style={{ backdropFilter: "blur(8px)" }}
            >
              <FontAwesome6 name="arrow-left" size={14} color="#fff" />
            </Pressable>

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

          {/* Image counter dots */}
          {item.images.length > 1 && (
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-1.5">
              {item.images.map((_, i) => (
                <View
                  key={i}
                  className={`rounded-full ${
                    i === activeIndex
                      ? "h-2 w-5 bg-white"
                      : "h-2 w-2 bg-white/40"
                  }`}
                />
              ))}
            </View>
          )}

          {/* Photo count badge */}
          <View className="absolute bottom-4 right-4 flex-row items-center gap-1 rounded-full bg-black/40 px-2.5 py-1">
            <FontAwesome6 name="camera" size={10} color="#fff" />
            <Text className="text-[11px] font-semibold text-white">
              {activeIndex + 1}/{item.images.length}
            </Text>
          </View>
        </View>

        {/* ── Content Card (overlaps image) ──────────────────────────────── */}
        <View className="-mt-5 rounded-t-[28px] bg-white px-5 pt-5">
          {/* Title & Price */}
          <View className="mb-1 flex-row items-start justify-between gap-3">
            <Text
              className="flex-1 text-[20px] font-bold leading-tight tracking-tight text-slate-900"
              numberOfLines={2}
            >
              {item.title}
            </Text>
          </View>

          <Text className="mb-1 text-[26px] font-extrabold tracking-tight text-primary">
            {formatPrice(item.price)}
          </Text>

          {/* Location */}
          <View className="mb-5 flex-row items-center gap-1.5">
            <FontAwesome6 name="location-dot" size={12} color="#94a3b8" />
            <Text className="text-[13px] text-slate-400">{item.location}</Text>
          </View>

          {/* ── Stats Grid ─────────────────────────────────────────────── */}
          <SectionTitle>Specificații</SectionTitle>
          <View className="mb-5 gap-2">
            <View className="flex-row gap-2">
              {stats.slice(0, 3).map((s) => (
                <StatTile key={s.label} {...s} />
              ))}
            </View>
            <View className="flex-row gap-2">
              {stats.slice(3).map((s) => (
                <StatTile key={s.label} {...s} />
              ))}
            </View>
          </View>

          {/* ── Divider ────────────────────────────────────────────────── */}
          <View className="mb-5 h-px bg-slate-100" />

          {/* ── Description ────────────────────────────────────────────── */}
          <SectionTitle>Descriere</SectionTitle>
          <Text
            className="mb-5 text-[14px] leading-relaxed text-slate-600"
            selectable
          >
            {item.description}
          </Text>

          {/* ── Divider ────────────────────────────────────────────────── */}
          <View className="mb-5 h-px bg-slate-100" />

          {/* ── Seller card ────────────────────────────────────────────── */}
          <SectionTitle>Vânzător</SectionTitle>
          <View className="mb-2 flex-row items-center gap-3 rounded-2xl bg-slate-50 p-4">
            {/* Avatar placeholder */}
            <View className="h-11 w-11 items-center justify-center rounded-full bg-slate-200">
              <FontAwesome6 name="user" size={18} color="#94a3b8" />
            </View>
            <View className="flex-1">
              <Text className="text-[14px] font-semibold text-slate-800">
                {item.sellerName ?? "Vânzător privat"}
              </Text>
              <Text className="mt-0.5 text-[12px] text-slate-400">
                Răspunde de obicei în câteva ore
              </Text>
            </View>
            <View className="rounded-full bg-emerald-50 px-2.5 py-1">
              <Text className="text-[11px] font-semibold text-emerald-600">
                Activ
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ── Sticky CTA Bar ─────────────────────────────────────────────────── */}
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
                title={isFavorite ? "Salvat ✓" : "Salvează"}
                onPress={() => toggle.mutate(item.id)}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
