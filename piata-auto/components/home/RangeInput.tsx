import { Text, TextInput, View } from "react-native";

type RangeInputProps = {
  label: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  keyboardType?: "numeric" | "decimal-pad";
};

export const RangeInput = ({
  label,
  minPlaceholder = "De la",
  maxPlaceholder = "Până la",
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  keyboardType = "numeric",
}: RangeInputProps) => (
  <View className="mb-4">
    <Text className="mb-2 text-sm font-semibold text-slate-700">{label}</Text>
    <View className="flex-row gap-3">
      <TextInput
        className="flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm"
        placeholder={minPlaceholder}
        placeholderTextColor="#cbd5e1"
        keyboardType={keyboardType}
        value={minValue}
        onChangeText={onMinChange}
      />
      <TextInput
        className="flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm"
        placeholder={maxPlaceholder}
        placeholderTextColor="#cbd5e1"
        keyboardType={keyboardType}
        value={maxValue}
        onChangeText={onMaxChange}
      />
    </View>
  </View>
);
