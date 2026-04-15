import { AppButton } from "@/components/ui";
import { ListingFilters } from "@/types/models";
import {
  BODY_TYPES,
  BRANDS,
  CAR_GENERATIONS,
  CAR_MODELS,
} from "@/utils/constants";
import { FontAwesome6 } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { RangeInput } from "./RangeInput";

type HomeSearchFiltersProps = {
  filters: ListingFilters;
  onFiltersChange: (filters: ListingFilters) => void;
  onSearch: () => void;
  onReset: () => void;
};

type DropdownOption = {
  label: string;
  value: string;
};

const DropdownSelect = ({
  label,
  value,
  options,
  onSelect,
  placeholder = "Selectează...",
}: {
  label: string;
  value?: string;
  options: DropdownOption[];
  onSelect: (value: string | undefined) => void;
  placeholder?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel =
    options.find((o) => o.value === value)?.label || placeholder;

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-semibold text-slate-700">{label}</Text>
      <Pressable
        onPress={() => setIsOpen(true)}
        className="flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm"
      >
        <Text className={value ? "text-slate-900" : "text-slate-500"}>
          {selectedLabel}
        </Text>
        <FontAwesome6 name="chevron-down" size={12} color="#64748b" />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          onPress={() => setIsOpen(false)}
          className="flex-1 justify-end bg-black/40"
        >
          <View className="rounded-t-3xl bg-white">
            <View className="border-b border-slate-200 px-4 py-4">
              <Text className="text-center text-base font-semibold text-slate-900">
                {label}
              </Text>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              scrollEnabled
              nestedScrollEnabled
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onSelect(item.value === value ? undefined : item.value);
                    setIsOpen(false);
                  }}
                  className={`border-b border-slate-100 px-4 py-4 ${item.value === value ? "bg-primary/5" : ""}`}
                >
                  <View className="flex-row items-center justify-between">
                    <Text
                      className={
                        item.value === value
                          ? "font-semibold text-primary"
                          : "text-slate-900"
                      }
                    >
                      {item.label}
                    </Text>
                    {item.value === value && (
                      <FontAwesome6 name="check" size={14} color="#2563eb" />
                    )}
                  </View>
                </Pressable>
              )}
              style={{ maxHeight: 300 }}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export const HomeSearchFilters = ({
  filters,
  onFiltersChange,
  onSearch,
  onReset,
}: HomeSearchFiltersProps) => {
  const [expandedSection, setExpandedSection] = useState<
    "price" | "year" | "mileage" | null
  >(null);

  // Get available models based on selected brand
  const availableModels = useMemo(
    () =>
      filters.brand && CAR_MODELS[filters.brand]
        ? CAR_MODELS[filters.brand].map((m) => ({ label: m, value: m }))
        : [],
    [filters.brand],
  );

  // Get available generations based on selected model
  const availableGenerations = useMemo(
    () =>
      filters.model
        ? (CAR_GENERATIONS[`${filters.brand} ${filters.model}`] || []).map(
            (g) => ({
              label: g,
              value: g,
            }),
          )
        : [],
    [filters.model, filters.brand],
  );

  const bodyTypeOptions: DropdownOption[] = BODY_TYPES.map((t) => ({
    label: t,
    value: t,
  }));

  const brandOptions: DropdownOption[] = BRANDS.map((b) => ({
    label: b,
    value: b,
  }));

  const handleReset = () => {
    onReset();
    setExpandedSection(null);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="px-4">
      {/* Tip Caroserie */}
      <DropdownSelect
        label="Tip caroserie"
        value={filters.bodyType}
        options={bodyTypeOptions}
        onSelect={(value) =>
          onFiltersChange({ ...filters, bodyType: value as any })
        }
      />

      {/* Marcă */}
      <DropdownSelect
        label="Marcă"
        value={filters.brand}
        options={brandOptions}
        onSelect={(value) =>
          onFiltersChange({
            ...filters,
            brand: value,
            model: undefined,
            generation: undefined,
          })
        }
      />

      {/* Model (dependent on Brand) */}
      {filters.brand && (
        <DropdownSelect
          label="Model"
          value={filters.model}
          options={availableModels}
          onSelect={(value) =>
            onFiltersChange({
              ...filters,
              model: value,
              generation: undefined,
            })
          }
        />
      )}

      {/* Generation (dependent on Model) */}
      {filters.model && availableGenerations.length > 0 && (
        <DropdownSelect
          label="Generație"
          value={filters.generation}
          options={availableGenerations}
          onSelect={(value) =>
            onFiltersChange({ ...filters, generation: value })
          }
        />
      )}

      {/* Year Range */}
      <Pressable
        onPress={() =>
          setExpandedSection(expandedSection === "year" ? null : "year")
        }
        className="mb-4 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm"
      >
        <View>
          <Text className="text-xs text-slate-500">An</Text>
          <Text className="mt-1 text-sm font-medium text-slate-900">
            {filters.minYear || "De la"} - {filters.maxYear || "Până la"}
          </Text>
        </View>
        <FontAwesome6
          name={expandedSection === "year" ? "chevron-up" : "chevron-down"}
          size={12}
          color="#64748b"
        />
      </Pressable>
      {expandedSection === "year" && (
        <View className="mb-4 rounded-2xl bg-slate-50 p-4">
          <RangeInput
            label="An"
            minPlaceholder="De la"
            maxPlaceholder="Până la"
            minValue={filters.minYear?.toString() ?? ""}
            maxValue={filters.maxYear?.toString() ?? ""}
            onMinChange={(v) =>
              onFiltersChange({
                ...filters,
                minYear: v ? Number(v) : undefined,
              })
            }
            onMaxChange={(v) =>
              onFiltersChange({
                ...filters,
                maxYear: v ? Number(v) : undefined,
              })
            }
          />
        </View>
      )}

      {/* Price Range */}
      <Pressable
        onPress={() =>
          setExpandedSection(expandedSection === "price" ? null : "price")
        }
        className="mb-4 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm"
      >
        <View>
          <Text className="text-xs text-slate-500">Preț</Text>
          <Text className="mt-1 text-sm font-medium text-slate-900">
            {filters.minPrice
              ? `${filters.minPrice.toLocaleString("ro-RO")} €`
              : "De la"}{" "}
            -{" "}
            {filters.maxPrice
              ? `${filters.maxPrice.toLocaleString("ro-RO")} €`
              : "Până la"}
          </Text>
        </View>
        <FontAwesome6
          name={expandedSection === "price" ? "chevron-up" : "chevron-down"}
          size={12}
          color="#64748b"
        />
      </Pressable>
      {expandedSection === "price" && (
        <View className="mb-4 rounded-2xl bg-slate-50 p-4">
          <RangeInput
            label="Preț (€)"
            minPlaceholder="De la"
            maxPlaceholder="Până la"
            minValue={filters.minPrice?.toString() ?? ""}
            maxValue={filters.maxPrice?.toString() ?? ""}
            onMinChange={(v) =>
              onFiltersChange({
                ...filters,
                minPrice: v ? Number(v) : undefined,
              })
            }
            onMaxChange={(v) =>
              onFiltersChange({
                ...filters,
                maxPrice: v ? Number(v) : undefined,
              })
            }
          />
        </View>
      )}

      {/* Mileage Range */}
      <Pressable
        onPress={() =>
          setExpandedSection(expandedSection === "mileage" ? null : "mileage")
        }
        className="mb-4 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm"
      >
        <View>
          <Text className="text-xs text-slate-500">Kilometraj</Text>
          <Text className="mt-1 text-sm font-medium text-slate-900">
            {filters.minMileage
              ? `${filters.minMileage.toLocaleString("ro-RO")} km`
              : "De la"}{" "}
            -{" "}
            {filters.maxMileage
              ? `${filters.maxMileage.toLocaleString("ro-RO")} km`
              : "Până la"}
          </Text>
        </View>
        <FontAwesome6
          name={expandedSection === "mileage" ? "chevron-up" : "chevron-down"}
          size={12}
          color="#64748b"
        />
      </Pressable>
      {expandedSection === "mileage" && (
        <View className="mb-6 rounded-2xl bg-slate-50 p-4">
          <RangeInput
            label="Kilometraj (km)"
            minPlaceholder="De la"
            maxPlaceholder="Până la"
            minValue={filters.minMileage?.toString() ?? ""}
            maxValue={filters.maxMileage?.toString() ?? ""}
            onMinChange={(v) =>
              onFiltersChange({
                ...filters,
                minMileage: v ? Number(v) : undefined,
              })
            }
            onMaxChange={(v) =>
              onFiltersChange({
                ...filters,
                maxMileage: v ? Number(v) : undefined,
              })
            }
          />
        </View>
      )}

      {/* Action Buttons */}
      <View className="mb-6 flex-row gap-3">
        <View className="flex-1">
          <AppButton title="Resetează" variant="ghost" onPress={handleReset} />
        </View>
        <View className="flex-1">
          <AppButton title="Caută" onPress={onSearch} />
        </View>
      </View>
    </ScrollView>
  );
};
