import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";

export const AppInput = ({
  label,
  ...props
}: { label: string } & React.ComponentProps<typeof TextInput>) => (
  <View className="mb-3">
    <Text className="mb-1 text-xs font-semibold text-slate-700">{label}</Text>
    <TextInput
      className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-900"
      placeholderTextColor="#94a3b8"
      {...props}
    />
  </View>
);

export const AppButton = ({
  title,
  onPress,
  variant = "primary",
}: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "ghost" | "danger";
}) => (
  <Pressable
    onPress={onPress}
    className={`rounded-xl px-4 py-3 ${
      variant === "primary" ? "bg-primary" : variant === "danger" ? "bg-red-500" : "bg-slate-200"
    }`}
  >
    <Text className={`text-center font-semibold ${variant === "ghost" ? "text-slate-800" : "text-white"}`}>{title}</Text>
  </Pressable>
);

export const CenterLoader = () => (
  <View className="flex-1 items-center justify-center">
    <ActivityIndicator />
  </View>
);

export const EmptyState = ({ title }: { title: string }) => (
  <View className="mt-16 items-center px-8">
    <Text className="text-center text-base text-slate-500">{title}</Text>
  </View>
);
