import { AppButton } from "@/components/ui";
import { ListingFilters } from "@/types/models";
import { BRANDS, CAR_MODELS } from "@/utils/constants";
import { FontAwesome6 } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";
import { RangeInput } from "./RangeInput";

type HomeSearchFiltersProps = {
  filters: ListingFilters;
  onFiltersChange: (filters: ListingFilters) => void;
  onAdvancedPress: () => void;
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
  onAdvancedPress,
  onReset,
}: HomeSearchFiltersProps) => {
  const availableModels = useMemo(
    () =>
      filters.brand && CAR_MODELS[filters.brand]
        ? CAR_MODELS[filters.brand].map((model) => ({
            label: model,
            value: model,
          }))
        : [],
    [filters.brand],
  );

  const brandOptions: DropdownOption[] = BRANDS.map((brand) => ({
    label: brand,
    value: brand,
  }));

  return (
    <View className="px-4 pb-4">
      <Text className="mb-4 text-lg font-semibold text-white">
        Căutare rapidă
      </Text>

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

      <RangeInput
        label="Preț"
        minPlaceholder="Preț de la"
        maxPlaceholder="Preț până la"
        minValue={filters.minPrice?.toString() ?? ""}
        maxValue={filters.maxPrice?.toString() ?? ""}
        onMinChange={(value) =>
          onFiltersChange({
            ...filters,
            minPrice: value ? Number(value) : undefined,
          })
        }
        onMaxChange={(value) =>
          onFiltersChange({
            ...filters,
            maxPrice: value ? Number(value) : undefined,
          })
        }
      />

      <RangeInput
        label="An"
        minPlaceholder="An de la"
        maxPlaceholder="An până la"
        minValue={filters.minYear?.toString() ?? ""}
        maxValue={filters.maxYear?.toString() ?? ""}
        onMinChange={(value) =>
          onFiltersChange({
            ...filters,
            minYear: value ? Number(value) : undefined,
          })
        }
        onMaxChange={(value) =>
          onFiltersChange({
            ...filters,
            maxYear: value ? Number(value) : undefined,
          })
        }
      />

      <View className="mb-4 flex-row gap-3">
        <View className="flex-1">
          <AppButton title="Resetează" variant="ghost" onPress={onReset} />
        </View>
        <View className="flex-1">
          <AppButton title="Filtre avansate" onPress={onAdvancedPress} />
        </View>
      </View>
    </View>
  );
};
