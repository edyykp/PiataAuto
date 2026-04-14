import { Link } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { AppButton, AppInput } from "@/components/ui";
import { authService } from "@/services/authService";
import { storageService } from "@/services/storageService";
import { useAuthStore } from "@/store/authStore";
import { compressImage } from "@/utils/image";

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");
  if (!user) return null;

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
    if (result.canceled) return;
    const compressed = await compressImage(result.assets[0].uri);
    const uploaded = await storageService.uploadAvatar(user.id, compressed);
    setAvatarUrl(uploaded);
  };

  const save = async () => {
    const nextUser = await authService.updateMe(user.id, { name, phone, avatarUrl });
    if (!nextUser) return;
    updateUser(nextUser);
    Toast.show({ type: "success", text1: "Profile updated" });
  };

  return (
    <View className="flex-1 bg-slateBg px-4 pt-8">
      <View className="items-center">
        <Image source={{ uri: avatarUrl || "https://picsum.photos/seed/avatar/300/300" }} className="h-24 w-24 rounded-full" />
        <View className="mt-3 w-40"><AppButton title="Change photo" onPress={pickAvatar} variant="ghost" /></View>
        <Text className="mt-3 text-slate-500">{user.email}</Text>
      </View>
      <View className="mt-6">
        <AppInput label="Name" value={name} onChangeText={setName} />
        <AppInput label="Phone" value={phone} onChangeText={setPhone} />
      </View>
      <View className="gap-2">
        <AppButton title="Save profile" onPress={save} />
        <Link href="/my-listings" asChild>
          <View><AppButton title="My listings dashboard" onPress={() => {}} /></View>
        </Link>
        <AppButton title="Logout" onPress={logout} variant="danger" />
      </View>
    </View>
  );
}
