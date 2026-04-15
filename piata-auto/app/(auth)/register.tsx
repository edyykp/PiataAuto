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
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email(),
  password: z.string().min(6),
});

export default function RegisterScreen() {
  const setUser = useAuthStore((s) => s.setUser);
  const { control, handleSubmit } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const user = await authService.signUp(values);
      setUser(user);
      Toast.show({ type: "success", text1: "Cont creat" });
      router.replace("/(tabs)");
    } catch {
      Toast.show({ type: "error", text1: "Creare cont eșuată" });
    }
  });

  return (
    <View className="flex-1 bg-slateBg px-5">
      <View className="mb-8 rounded-[32px] bg-gradient-to-br from-secondary to-primary px-6 py-8 shadow-2xl">
        <Text className="text-3xl font-extrabold text-white">
          Creează-ți contul
        </Text>
        <Text className="mt-3 text-sm text-white/85">
          Alătură-te PiataAuto pentru a posta, căuta și discuta cu vânzătorii
          instant.
        </Text>
      </View>
      <View className="rounded-[32px] bg-white px-5 py-6 shadow-lg">
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <AppInput
              label="Nume"
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <AppInput
              label="Telefon"
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />
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
        <AppButton title="Creează cont" onPress={onSubmit} />
      </View>
      <Link href="/(auth)/login" asChild>
        <Text className="mt-5 text-center text-primary">
          Already have an account?
        </Text>
      </Link>
    </View>
  );
}
