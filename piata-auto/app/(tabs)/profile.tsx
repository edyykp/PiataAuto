import { AppButton, AppInput, AppTopBar } from "@/components/ui";
import { authService } from "@/services/authService";
import { storageService } from "@/services/storageService";
import { useAuthStore } from "@/store/authStore";
import { compressImage } from "@/utils/image";
import * as ImagePicker from "expo-image-picker";
import { Link } from "expo-router";
import { useState } from "react";
import { Image, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");
  if (!user) return null;

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (result.canceled) return;
    const compressed = await compressImage(result.assets[0].uri);
    const uploaded = await storageService.uploadAvatar(user.id, compressed);
    setAvatarUrl(uploaded);
  };

  const save = async () => {
    const nextUser = await authService.updateMe(user.id, {
      name,
      phone,
      avatarUrl,
    });
    if (!nextUser) return;
    updateUser(nextUser);
    Toast.show({ type: "success", text1: "Profil actualizat" });
  };

  return (
    <View className="flex-1 bg-slateBg">
      <AppTopBar title="Profil" subtitle="Setări și informații cont" />
      <View className="px-4 pt-6">
        <View className="rounded-[32px] bg-white px-6 pb-8 pt-8 shadow-xl">
          <View className="items-center">
            <Image
              source={{
                uri: avatarUrl || "https://picsum.photos/seed/avatar/300/300",
              }}
              className="h-28 w-28 rounded-full"
            />
            <Text className="mt-4 text-xl font-semibold text-slate-900">
              {user.name}
            </Text>
            <Text className="mt-1 text-sm text-slate-500">{user.email}</Text>
            <View className="mt-4 w-44">
              <AppButton
                title="Schimbă poza"
                onPress={pickAvatar}
                variant="ghost"
              />
            </View>
          </View>
          <View className="mt-8">
            <AppInput label="Nume" value={name} onChangeText={setName} />
            <AppInput label="Telefon" value={phone} onChangeText={setPhone} />
          </View>
        </View>
      </View>
      <View className="px-4 mt-6 space-y-3">
        <AppButton title="Salvează profilul" onPress={save} />
        <Link href="/my-listings" asChild>
          <View>
            <AppButton
              title="Anunțurile mele"
              onPress={() => {}}
              variant="ghost"
            />
          </View>
        </Link>
        <AppButton title="Deconectare" onPress={logout} variant="danger" />
      </View>
    </View>
  );
}
