import { AppButton } from "@/components/ui";
import type { BodyType, FuelType, SortBy, Transmission } from "@/types/models";
import { ListingFilters } from "@/types/models";
import {
  COLORS,
  FEATURE_OPTIONS,
  FIRST_REGISTRATION_OPTIONS,
  FUELS,
  ORIGIN_COUNTRIES,
  SORT_OPTIONS,
  TRACTIONS,
  TRANSMISSIONS,
} from "@/utils/constants";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

// ─── Body types with icons ────────────────────────────────────────────────────
export const BODY_TYPES: { label: string; icon: string }[] = [
  { label: "Berlină", icon: "🚗" },
  { label: "Break", icon: "🚙" },
  { label: "SUV", icon: "🛻" },
  { label: "Coupe", icon: "🏎️" },
  { label: "Cabrio", icon: "🚘" },
  { label: "Monovolum", icon: "🚐" },
  { label: "Pickup", icon: "🛻" },
  { label: "Microbuz", icon: "🚌" },
  { label: "Van", icon: "🚚" },
];

// ─── Color hex mapping ────────────────────────────────────────────────────────
export const COLOR_MAP: Record<string, string> = {
  Alb: "#FFFFFF",
  Negru: "#111111",
  Gri: "#9CA3AF",
  Argintiu: "#C0C0C0",
  Albastru: "#3B82F6",
  Roșu: "#EF4444",
  Verde: "#22C55E",
  Galben: "#EAB308",
  Portocaliu: "#F97316",
  Maro: "#92400E",
  Bej: "#D6C5A0",
  Violet: "#8B5CF6",
};

type Props = {
  visible: boolean;
  value: ListingFilters;
  onChange: (value: ListingFilters) => void;
  onClose: () => void;
  onApply: () => void;
};

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({
  title,
  children,
  noDivider,
}: {
  title: string;
  children: React.ReactNode;
  noDivider?: boolean;
}) => (
  <View className={`py-4 ${!noDivider ? "border-b border-slate-100" : ""}`}>
    <Text className="mb-3 text-[13px] font-semibold uppercase tracking-widest text-slate-400">
      {title}
    </Text>
    {children}
  </View>
);

// ─── Generic chip row ─────────────────────────────────────────────────────────
const ChipGroup = ({
  options,
  selected,
  onToggle,
  multi = false,
}: {
  options: string[];
  selected?: string | string[];
  onToggle: (option: string) => void;
  multi?: boolean;
}) => (
  <View className="flex-row flex-wrap gap-2">
    {options.map((option) => {
      const isSelected = Array.isArray(selected)
        ? selected.includes(option)
        : selected === option;
      return (
        <Pressable
          key={option}
          onPress={() => onToggle(option)}
          className={`rounded-lg border px-3 py-2 ${
            isSelected
              ? "border-slate-900 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          <Text
            className={`text-[13px] font-medium ${
              isSelected ? "text-white" : "text-slate-600"
            }`}
          >
            {option}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

// ─── Body type chips (icon + label, wider) ────────────────────────────────────
const BodyTypeGroup = ({
  options,
  selected,
  onToggle,
}: {
  options: { label: string; icon: string }[];
  selected?: string;
  onToggle: (label: string) => void;
}) => (
  <View className="flex-row flex-wrap gap-2">
    {options.map(({ label, icon }) => {
      const isSelected = selected === label;
      return (
        <Pressable
          key={label}
          onPress={() => onToggle(label)}
          className={`items-center rounded-xl border px-3 py-2.5 ${
            isSelected
              ? "border-slate-900 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
          style={{ minWidth: 76 }}
        >
          <Text className="mb-1 text-xl">{icon}</Text>
          <Text
            className={`text-[11px] font-semibold ${
              isSelected ? "text-white" : "text-slate-600"
            }`}
          >
            {label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

// ─── Color chips (dot + label) ────────────────────────────────────────────────
const ColorGroup = ({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected?: string;
  onToggle: (option: string) => void;
}) => (
  <View className="flex-row flex-wrap gap-2">
    {options.map((option) => {
      const isSelected = selected === option;
      const hex = COLOR_MAP[option] ?? "#9CA3AF";
      const isLight = ["Alb", "Argintiu", "Gri", "Bej"].includes(option);
      return (
        <Pressable
          key={option}
          onPress={() => onToggle(option)}
          className={`flex-row items-center gap-1.5 rounded-lg border px-2.5 py-2 ${
            isSelected
              ? "border-slate-900 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          <View
            className={`h-3 w-3 rounded-full ${isLight ? "border border-slate-300" : ""}`}
            style={{ backgroundColor: hex }}
          />
          <Text
            className={`text-[13px] font-medium ${
              isSelected ? "text-white" : "text-slate-600"
            }`}
          >
            {option}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

// ─── Min / Max input pair ─────────────────────────────────────────────────────
const RangeInputs = ({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  minLabel,
  maxLabel,
}: {
  minValue?: number;
  maxValue?: number;
  onMinChange: (val?: number) => void;
  onMaxChange: (val?: number) => void;
  minLabel?: string;
  maxLabel?: string;
}) => (
  <View className="flex-row gap-3">
    <View className="flex-1">
      <Text className="mb-2 text-sm font-semibold text-slate-700">
        {minLabel ?? "Min"}
      </Text>
      <TextInput
        className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm"
        placeholderTextColor="#64748b"
        keyboardType="numeric"
        value={minValue?.toString() ?? ""}
        onChangeText={(text) => onMinChange(text ? Number(text) : undefined)}
      />
    </View>
    <View className="flex-1">
      <Text className="mb-2 text-sm font-semibold text-slate-700">
        {maxLabel ?? "Max"}
      </Text>
      <TextInput
        className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm"
        placeholderTextColor="#64748b"
        keyboardType="numeric"
        value={maxValue?.toString() ?? ""}
        onChangeText={(text) => onMaxChange(text ? Number(text) : undefined)}
      />
    </View>
  </View>
);

// ─── Sort pills (radio-style) ─────────────────────────────────────────────────
const SortGroup = ({
  options,
  selected,
  onSelect,
}: {
  options: { label: string; value: string }[];
  selected?: string;
  onSelect: (value: string) => void;
}) => (
  <View className="flex-row flex-wrap gap-2">
    {options.map((option) => {
      const isSelected = selected === option.value;
      return (
        <Pressable
          key={option.value}
          onPress={() => onSelect(option.value)}
          className={`flex-row items-center gap-1.5 rounded-lg border px-3 py-2 ${
            isSelected
              ? "border-slate-900 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          {/* Radio dot */}
          <View
            className={`h-3.5 w-3.5 items-center justify-center rounded-full border ${
              isSelected ? "border-white" : "border-slate-400"
            }`}
          >
            {isSelected && (
              <View className="h-1.5 w-1.5 rounded-full bg-white" />
            )}
          </View>
          <Text
            className={`text-[13px] font-medium ${
              isSelected ? "text-white" : "text-slate-600"
            }`}
          >
            {option.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

// ─── Main component ───────────────────────────────────────────────────────────
export const FiltersSheet = ({
  visible,
  value,
  onChange,
  onClose,
  onApply,
}: Props) => {
  const toggleFeature = (feature: string) => {
    const current = value.options ?? [];
    const next = current.includes(feature)
      ? current.filter((f) => f !== feature)
      : [...current, feature];
    onChange({ ...value, options: next });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <View className="max-h-[92%] rounded-t-[28px] bg-slate-50 pt-3">
          {/* Handle */}
          <View className="mb-1 h-1 w-10 self-center rounded-full bg-slate-300" />

          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-slate-100 px-5 pb-3 pt-2">
            <Text className="text-[18px] font-bold tracking-tight text-slate-900">
              Filtre avansate
            </Text>
            <Pressable
              onPress={onClose}
              className="rounded-full bg-slate-200 px-3 py-1"
            >
              <Text className="text-[13px] font-semibold text-slate-600">
                Închide
              </Text>
            </Pressable>
          </View>

          {/* Scrollable filters */}
          <ScrollView
            className="px-5"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {/* Caroserie */}
            <Section title="Caroserie">
              <BodyTypeGroup
                options={BODY_TYPES}
                selected={value.bodyType}
                onToggle={(label) =>
                  onChange({
                    ...value,
                    bodyType:
                      value.bodyType === label
                        ? undefined
                        : (label as BodyType),
                  })
                }
              />
            </Section>

            {/* Combustibil + Transmisie (side by side sections) */}
            <Section title="Combustibil">
              <ChipGroup
                options={FUELS}
                selected={value.fuelType}
                onToggle={(option) =>
                  onChange({
                    ...value,
                    fuelType:
                      value.fuelType === option
                        ? undefined
                        : (option as FuelType),
                  })
                }
              />
            </Section>

            <Section title="Transmisie">
              <ChipGroup
                options={TRANSMISSIONS}
                selected={value.transmission}
                onToggle={(option) =>
                  onChange({
                    ...value,
                    transmission:
                      value.transmission === option
                        ? undefined
                        : (option as Transmission),
                  })
                }
              />
            </Section>

            <Section title="Tracțiune">
              <ChipGroup
                options={[...TRACTIONS]}
                selected={value.traction}
                onToggle={(option) =>
                  onChange({
                    ...value,
                    traction:
                      value.traction === option
                        ? undefined
                        : (option as "Fata" | "Spate" | "Integrală"),
                  })
                }
              />
            </Section>

            {/* Numeric ranges */}
            <Section title="Putere (CP)">
              <RangeInputs
                minValue={value.minPower}
                maxValue={value.maxPower}
                onMinChange={(v) => onChange({ ...value, minPower: v })}
                onMaxChange={(v) => onChange({ ...value, maxPower: v })}
              />
            </Section>

            <Section title="Capacitate cilindrică (cm³)">
              <RangeInputs
                minValue={value.minDisplacement}
                maxValue={value.maxDisplacement}
                onMinChange={(v) => onChange({ ...value, minDisplacement: v })}
                onMaxChange={(v) => onChange({ ...value, maxDisplacement: v })}
              />
            </Section>

            {/* Primă înmatriculare */}
            <Section title="Primă înmatriculare">
              <ChipGroup
                options={FIRST_REGISTRATION_OPTIONS}
                selected={value.firstRegistration}
                onToggle={(option) =>
                  onChange({
                    ...value,
                    firstRegistration:
                      value.firstRegistration === option ? undefined : option,
                  })
                }
              />
            </Section>

            {/* Culoare */}
            <Section title="Culoare">
              <ColorGroup
                options={COLORS}
                selected={value.color}
                onToggle={(option) =>
                  onChange({
                    ...value,
                    color: value.color === option ? undefined : option,
                  })
                }
              />
            </Section>

            {/* Țara de origine */}
            <Section title="Țara de origine">
              <ChipGroup
                options={ORIGIN_COUNTRIES}
                selected={value.originCountry}
                onToggle={(option) =>
                  onChange({
                    ...value,
                    originCountry:
                      value.originCountry === option ? undefined : option,
                  })
                }
              />
            </Section>

            {/* Dotări */}
            <Section title="Dotări">
              <View className="flex-row flex-wrap gap-2">
                {FEATURE_OPTIONS.map((feature) => {
                  const selected = (value.options ?? []).includes(feature);
                  return (
                    <Pressable
                      key={feature}
                      onPress={() => toggleFeature(feature)}
                      className={`flex-row items-center gap-1.5 rounded-lg border px-3 py-2 ${
                        selected
                          ? "border-slate-900 bg-slate-900"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      {/* Checkmark */}
                      <View
                        className={`h-3.5 w-3.5 items-center justify-center rounded border ${
                          selected
                            ? "border-white bg-white"
                            : "border-slate-400"
                        }`}
                      >
                        {selected && (
                          <Text className="text-[9px] font-bold leading-none text-slate-900">
                            ✓
                          </Text>
                        )}
                      </View>
                      <Text
                        className={`text-[13px] font-medium ${
                          selected ? "text-white" : "text-slate-600"
                        }`}
                      >
                        {feature}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Section>

            {/* Sortare */}
            <Section title="Sortează după" noDivider>
              <SortGroup
                options={SORT_OPTIONS}
                selected={value.sortBy}
                onSelect={(v) => onChange({ ...value, sortBy: v as SortBy })}
              />
            </Section>
          </ScrollView>

          {/* Sticky footer */}
          <View className="border-t border-slate-100 bg-slate-50 px-5 pb-8 pt-3">
            <AppButton title="Aplică filtrele" onPress={onApply} />
          </View>
        </View>
      </View>
    </Modal>
  );
};
