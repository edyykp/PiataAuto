import { View } from "react-native";

export const SkeletonCard = () => (
  <View className="mb-3 overflow-hidden rounded-2xl bg-white p-3">
    <View className="h-40 rounded-xl bg-slate-200" />
    <View className="mt-3 h-4 w-2/3 rounded bg-slate-200" />
    <View className="mt-2 h-3 w-1/3 rounded bg-slate-200" />
    <View className="mt-2 h-3 w-1/2 rounded bg-slate-200" />
  </View>
);
