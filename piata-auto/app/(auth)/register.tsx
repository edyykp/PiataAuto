import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";
import { AppButton, AppInput } from "@/components/ui";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";

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
      Toast.show({ type: "success", text1: "Account created" });
      router.replace("/(tabs)");
    } catch {
      Toast.show({ type: "error", text1: "Sign up failed" });
    }
  });

  return (
    <View className="flex-1 justify-center bg-slateBg px-5">
      <Text className="mb-5 text-2xl font-bold text-slate-900">Create account</Text>
      <Controller control={control} name="name" render={({ field }) => <AppInput label="Name" value={field.value} onChangeText={field.onChange} />} />
      <Controller control={control} name="phone" render={({ field }) => <AppInput label="Phone" value={field.value} onChangeText={field.onChange} />} />
      <Controller control={control} name="email" render={({ field }) => <AppInput label="Email" autoCapitalize="none" value={field.value} onChangeText={field.onChange} />} />
      <Controller control={control} name="password" render={({ field }) => <AppInput label="Password" secureTextEntry value={field.value} onChangeText={field.onChange} />} />
      <AppButton title="Create account" onPress={onSubmit} />
      <Link href="/(auth)/login" asChild>
        <Text className="mt-4 text-center text-primary">Already have an account?</Text>
      </Link>
    </View>
  );
}
