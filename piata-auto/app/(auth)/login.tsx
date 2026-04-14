import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { z } from "zod";
import Toast from "react-native-toast-message";
import { AppButton, AppInput } from "@/components/ui";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";

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
      Toast.show({ type: "success", text1: "Welcome back" });
      router.replace("/(tabs)");
    } catch {
      Toast.show({ type: "error", text1: "Login failed" });
    }
  });

  return (
    <View className="flex-1 justify-center bg-slateBg px-5">
      <Text className="text-2xl font-bold text-slate-900">PiataAuto</Text>
      <Text className="mb-6 mt-1 text-slate-500">Sign in to continue</Text>
      <Controller control={control} name="email" render={({ field }) => <AppInput label="Email" autoCapitalize="none" value={field.value} onChangeText={field.onChange} />} />
      <Controller control={control} name="password" render={({ field }) => <AppInput label="Password" secureTextEntry value={field.value} onChangeText={field.onChange} />} />
      <AppButton title="Login" onPress={onSubmit} />
      <Link href="/(auth)/register" asChild>
        <Text className="mt-4 text-center text-primary">No account? Create one</Text>
      </Link>
    </View>
  );
}
