import { AppButton, AppInput } from "@/components/ui";
import { ListingFilters } from "@/types/models";
import { FUELS, SORT_OPTIONS, TRANSMISSIONS } from "@/utils/constants";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

type Props = {
  visible: boolean;
  value: ListingFilters;
  onChange: (value: ListingFilters) => void;
  onClose: () => void;
  onReset: () => void;
  onApply: () => void;
};

export const FiltersSheet = ({
  visible,
  value,
  onChange,
  onClose,
  onReset,
  onApply,
}: Props) => (
  <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
    <View className="flex-1 justify-end bg-black/35">
      <View className="rounded-t-[30px] bg-white px-5 pb-8 pt-4">
        <View className="mb-4 h-1.5 w-12 self-center rounded-full bg-slate-200" />
        <Text className="text-xl font-semibold text-slate-900">Filters</Text>
        <ScrollView className="mt-4" showsVerticalScrollIndicator={false}>
          <AppInput
            label="Min price"
            keyboardType="numeric"
            value={value.minPrice?.toString() ?? ""}
            onChangeText={(v) =>
              onChange({
                ...value,
                minPrice: Number(v) || undefined,
              })
            }
          />
          <AppInput
            label="Max price"
            keyboardType="numeric"
            value={value.maxPrice?.toString() ?? ""}
            onChangeText={(v) =>
              onChange({
                ...value,
                maxPrice: Number(v) || undefined,
              })
            }
          />
          <AppInput
            label="Model"
            value={value.model ?? ""}
            onChangeText={(v) => onChange({ ...value, model: v || undefined })}
          />
          <Text className="mb-2 text-sm font-semibold text-slate-700">Fuel</Text>
          <View className="mb-4 flex-row flex-wrap gap-2">
            {FUELS.map((fuel) => (
              <Pressable
                key={fuel}
                onPress={() =>
                  onChange({
                    ...value,
                    fuelType: value.fuelType === fuel ? undefined : fuel,
                  })
                }
                className={`rounded-full px-3 py-2 ${value.fuelType === fuel ? "bg-slate-900" : "bg-slate-100"}`}
              >
                <Text
                  className={`text-xs font-medium ${value.fuelType === fuel ? "text-white" : "text-slate-700"}`}
                >
                  {fuel}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text className="mb-2 text-sm font-semibold text-slate-700">
            Transmission
          </Text>
          <View className="mb-4 flex-row gap-2">
            {TRANSMISSIONS.map((t) => (
              <Pressable
                key={t}
                onPress={() =>
                  onChange({
                    ...value,
                    transmission: value.transmission === t ? undefined : t,
                  })
                }
                className={`rounded-full px-3 py-2 ${value.transmission === t ? "bg-slate-900" : "bg-slate-100"}`}
              >
                <Text
                  className={`text-xs font-medium ${value.transmission === t ? "text-white" : "text-slate-700"}`}
                >
                  {t}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text className="mb-2 text-sm font-semibold text-slate-700">Sort by</Text>
          <View className="mb-6 flex-row flex-wrap gap-2">
            {SORT_OPTIONS.map((s) => (
              <Pressable
                key={s.value}
                onPress={() => onChange({ ...value, sortBy: s.value })}
                className={`rounded-full px-3 py-2 ${value.sortBy === s.value ? "bg-primary" : "bg-slate-100"}`}
              >
                <Text
                  className={`text-xs font-medium ${value.sortBy === s.value ? "text-white" : "text-slate-700"}`}
                >
                  {s.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <AppButton title="Reset" variant="ghost" onPress={onReset} />
          </View>
          <View className="flex-1">
            <AppButton title="Apply" onPress={onApply} />
          </View>
        </View>
      </View>
    </View>
  </Modal>
);
