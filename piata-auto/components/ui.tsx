import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export const AppInput = ({
  label,
  ...props
}: { label: string } & React.ComponentProps<typeof TextInput>) => (
  <View className="mb-4">
    <Text className="mb-2 text-sm font-semibold text-slate-700">{label}</Text>
    <TextInput
      className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm"
      placeholderTextColor="#64748b"
      {...props}
    />
  </View>
);

export const AppSelect = ({
  label,
  value,
  placeholder = "Selectează",
  options,
  onValueChange,
  disabled,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  options: readonly string[];
  onValueChange: (value: string) => void;
  disabled?: boolean;
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <View className="mb-4 z-10">
      <Text className="mb-2 text-sm font-semibold text-slate-700">{label}</Text>
      <Pressable
        onPress={() => !disabled && setOpen((current) => !current)}
        className={`flex-row items-center justify-between rounded-3xl border px-4 py-3 bg-white shadow-sm ${
          disabled ? "border-slate-200 opacity-60" : "border-slate-200"
        }`}
      >
        <Text className={`${value ? "text-slate-900" : "text-slate-400"}`}>
          {value || placeholder}
        </Text>
        <FontAwesome6 name="chevron-down" size={14} color="#64748b" />
      </Pressable>

      {open && (
        <View className="mt-2 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {options.map((option) => (
            <Pressable
              key={option}
              onPress={() => {
                onValueChange(option);
                setOpen(false);
              }}
              className="border-b border-slate-100 px-4 py-3"
            >
              <Text
                className={`text-sm ${option === value ? "font-semibold text-slate-900" : "text-slate-700"}`}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export const AppButton = ({
  title,
  onPress,
  variant = "primary",
  icon,
}: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "ghost" | "danger";
  icon?: React.ReactNode;
}) => (
  <Pressable
    onPress={onPress}
    className={`rounded-3xl px-5 py-3 shadow-lg ${
      variant === "primary"
        ? "bg-primary"
        : variant === "danger"
          ? "bg-red-500"
          : "bg-slate-100"
    } active:scale-95`}
  >
    <View className="flex-row items-center justify-center gap-2">
      {icon}
      <Text
        className={`text-center text-base font-semibold ${variant === "ghost" ? "text-slate-900" : "text-white"}`}
      >
        {title}
      </Text>
    </View>
  </Pressable>
);

export const AppTopBar = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <View className="bg-white px-4 py-4 border-b border-slate-200 shadow-sm">
    <Text className="text-lg font-semibold text-slate-900">{title}</Text>
    {subtitle ? (
      <Text className="mt-1 text-sm text-slate-500">{subtitle}</Text>
    ) : null}
  </View>
);

export const CenterLoader = () => (
  <View className="flex-1 items-center justify-center bg-slateBg">
    <ActivityIndicator size="large" color="#2563eb" />
  </View>
);

export const EmptyState = ({ title }: { title: string }) => (
  <View className="mt-20 items-center rounded-3xl bg-white px-8 py-8 shadow-sm">
    <Text className="text-center text-base font-semibold text-slate-700">
      {title}
    </Text>
  </View>
);
