import { AppButton, AppInput } from "@/components/ui";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginScreen() {
  const setUser = useAuthStore((s) => s.setUser);
  const { control, handleSubmit } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "demo@piataauto.app", password: "123456" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const user = await authService.signIn(values);
      setUser(user);
      Toast.show({ type: "success", text1: "Bine ai revenit" });
      router.replace("/(tabs)");
    } catch {
      Toast.show({ type: "error", text1: "Autentificarea a eșuat" });
    }
  });

  return (
    <View className="flex-1 bg-slateBg px-5">
      <View className="mb-8 rounded-[32px] bg-gradient-to-br from-primary to-cyan-500 px-6 py-8 shadow-2xl">
        <Text className="text-3xl font-extrabold text-white">
          Bine ai revenit
        </Text>
        <Text className="mt-3 text-sm text-white/85">
          Autentifică-te pentru a explora anunțuri auto puternice și oferte
          exclusive de la vânzători.
        </Text>
      </View>
      <View className="rounded-[32px] bg-white px-5 py-6 shadow-lg">
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <AppInput
              label="Email"
              autoCapitalize="none"
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <AppInput
              label="Parolă"
              secureTextEntry
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />
        <AppButton title="Autentificare" onPress={onSubmit} />
      </View>
      <Link href="/(auth)/register" asChild>
        <Text className="mt-5 text-center text-primary">
          Nu ai cont? Creează unul
        </Text>
      </Link>
    </View>
  );
}
