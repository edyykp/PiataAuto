// =====================================================================
// HOME SCREEN FILTER SYSTEM - CODE PATTERNS & EXAMPLES
// =====================================================================

// ─────────────────────────────────────────────────────────────────────
// 1. FILTER STATE MANAGEMENT
// ─────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { ListingFilters } from "@/types/models";

export default function HomeScreen() {
// Initialize with default sort
const [filters, setFilters] = useState<ListingFilters>({
sortBy: "newest"
});

// Update individual filter
const handleBrandSelect = (brand: string) => {
setFilters(prev => ({
...prev,
brand,
// Reset dependent fields when parent changes
model: undefined,
generation: undefined,
}));
};

// Update range filter
const handlePriceRange = (minPrice: number | undefined, maxPrice: number | undefined) => {
setFilters(prev => ({
...prev,
minPrice,
maxPrice,
}));
};

// Reset all filters
const handleReset = () => {
setFilters({ sortBy: "newest" });
};

return (
<HomeSearchFilters
filters={filters}
onFiltersChange={setFilters}
onSearch={() => {/_ Results auto-update with new filters _/}}
onReset={handleReset}
/>
);
}

// ─────────────────────────────────────────────────────────────────────
// 2. DEPENDENT DROPDOWN PATTERN
// ─────────────────────────────────────────────────────────────────────

import { useMemo } from "react";
import { CAR_MODELS, CAR_GENERATIONS } from "@/utils/constants";

// Inside HomeSearchFilters component
const handleBrandChange = (brandValue: string | undefined) => {
// When brand changes, always clear dependent fields
onFiltersChange({
...filters,
brand: brandValue,
model: undefined, // Reset!
generation: undefined, // Reset!
});
};

const handleModelChange = (modelValue: string | undefined) => {
// When model changes, clear generation
onFiltersChange({
...filters,
model: modelValue,
generation: undefined, // Reset!
});
};

// Compute available models based on selected brand
const availableModels = useMemo(() => {
if (!filters.brand) return [];
return CAR_MODELS[filters.brand]?.map(model => ({
label: model,
value: model,
})) || [];
}, [filters.brand]);

// Compute available generations based on brand + model
const availableGenerations = useMemo(() => {
if (!filters.model) return [];
const key = `${filters.brand} ${filters.model}`;
return CAR_GENERATIONS[key]?.map(gen => ({
label: gen,
value: gen,
})) || [];
}, [filters.brand, filters.model]);

// Conditionally render dependent dropdowns
{filters.brand && (
<DropdownSelect
    label="Model"
    value={filters.model}
    options={availableModels}
    onSelect={handleModelChange}
  />
)}

{filters.model && availableGenerations.length > 0 && (
<DropdownSelect
    label="Generație"
    value={filters.generation}
    options={availableGenerations}
    onSelect={handleGenerationChange}
  />
)}

// ─────────────────────────────────────────────────────────────────────
// 3. RANGE INPUT PATTERN
// ─────────────────────────────────────────────────────────────────────

import { RangeInput } from "@/components/home/RangeInput";

// Handle range changes with proper null/undefined handling
const handlePriceChange = (min: string, max: string) => {
onFiltersChange({
...filters,
minPrice: min ? Number(min) : undefined,
maxPrice: max ? Number(max) : undefined,
});
};

// Render with current values
<RangeInput
label="Preț (€)"
minPlaceholder="De la"
maxPlaceholder="Până la"
minValue={filters.minPrice?.toString() ?? ""}
maxValue={filters.maxPrice?.toString() ?? ""}
onMinChange={(v) => handlePriceChange(v, filters.maxPrice?.toString() ?? "")}
onMaxChange={(v) => handlePriceChange(filters.minPrice?.toString() ?? "", v)}
keyboardType="numeric"
/>

// ─────────────────────────────────────────────────────────────────────
// 4. COLLAPSIBLE SECTION PATTERN
// ─────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

// Track which section is expanded
const [expandedSection, setExpandedSection] = useState<"price" | "year" | "mileage" | null>(null);

// Collapsible button that shows summary
<Pressable
onPress={() =>
setExpandedSection(expandedSection === "price" ? null : "price")
}
className="mb-4 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm"

>   <View>

    <Text className="text-xs text-slate-500">Preț</Text>
    <Text className="mt-1 text-sm font-medium text-slate-900">
      {filters.minPrice ? `${filters.minPrice.toLocaleString("ro-RO")} €` : "De la"}
      -
      {filters.maxPrice ? `${filters.maxPrice.toLocaleString("ro-RO")} €` : "Până la"}
    </Text>

  </View>
  <FontAwesome6 
    name={expandedSection === "price" ? "chevron-up" : "chevron-down"} 
    size={12} 
    color="#64748b" 
  />
</Pressable>

// Conditionally render expanded content
{expandedSection === "price" && (
<View className="mb-4 rounded-2xl bg-slate-50 p-4">
<RangeInput
label="Preț (€)"
// ... rest of props
/>
</View>
)}

// ─────────────────────────────────────────────────────────────────────
// 5. MODAL DROPDOWN PATTERN
// ─────────────────────────────────────────────────────────────────────

import { Modal, FlatList, Pressable, Text, View } from "react-native";

const DropdownSelect = ({ label, value, options, onSelect }) => {
const [isOpen, setIsOpen] = useState(false);
const selectedLabel = options.find(o => o.value === value)?.label || "Selectează...";

const handleSelect = (newValue: string) => {
// Toggle on same value (deselect), or select new
onSelect(newValue === value ? undefined : newValue);
setIsOpen(false);
};

return (
<>
{/_ Button that shows selection _/}
<Pressable
onPress={() => setIsOpen(true)}
className="flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm" >
<Text className={value ? "text-slate-900" : "text-slate-500"}>
{selectedLabel}
</Text>
<FontAwesome6 name="chevron-down" size={12} color="#64748b" />
</Pressable>

      {/* Modal picker */}
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
              keyExtractor={item => item.value}
              scrollEnabled
              nestedScrollEnabled
              style={{ maxHeight: 300 }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelect(item.value)}
                  className={`border-b border-slate-100 px-4 py-4 ${
                    item.value === value ? "bg-primary/5" : ""
                  }`}
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
            />
          </View>
        </Pressable>
      </Modal>
    </>

);
};

// ─────────────────────────────────────────────────────────────────────
// 6. EXTENDING FILTERS - HOW TO ADD A NEW FILTER
// ─────────────────────────────────────────────────────────────────────

// Step 1: Add to ListingFilters type (types/models.ts)
export type ListingFilters = {
// Existing filters...

// New filter example: colors
color?: "Red" | "Blue" | "Black" | "White" | "Silver";
};

// Step 2: Add constants if needed (utils/constants.ts)
export const COLORS = ["Red", "Blue", "Black", "White", "Silver"];

// Step 3: Add to HomeSearchFilters component
const colorOptions = COLORS.map(c => ({ label: c, value: c }));

<DropdownSelect
label="Culoare"
value={filters.color}
options={colorOptions}
onSelect={(value) =>
onFiltersChange({ ...filters, color: value as any })
}
/>

// That's it! The Home screen will now include the color filter.

// ─────────────────────────────────────────────────────────────────────
// 7. VALIDATION PATTERN
// ─────────────────────────────────────────────────────────────────────

const isValidFilters = (filters: ListingFilters): boolean => {
// Max price should be >= min price
if (filters.minPrice && filters.maxPrice) {
if (filters.maxPrice < filters.minPrice) return false;
}

// Max year should be >= min year
if (filters.minYear && filters.maxYear) {
if (filters.maxYear < filters.minYear) return false;
}

// Model requires brand
if (filters.model && !filters.brand) return false;

// Generation requires model
if (filters.generation && !filters.model) return false;

return true;
};

// Usage: Disable search button if invalid
<AppButton
title="Caută"
onPress={onSearch}
variant={isValidFilters(filters) ? "primary" : "ghost"}
disabled={!isValidFilters(filters)}
/>

// ─────────────────────────────────────────────────────────────────────
// 8. ACTIVE FILTER COUNT PATTERN
// ─────────────────────────────────────────────────────────────────────

const getActiveFilterCount = (filters: ListingFilters): number => {
return Object.entries(filters).filter(
([key, value]) =>
key !== "sortBy" && // Don't count sort
value !== undefined && // Must have value
value !== "" && // Not empty string
!(Array.isArray(value) && value.length === 0) // Not empty array
).length;
};

// Usage: Show badge on header
const activeCount = getActiveFilterCount(filters);

{activeCount > 0 && (
<View className="absolute -right-1 -top-1 rounded-full bg-amber-400 px-1.5 py-0.5">
<Text className="text-[10px] font-bold text-slate-900">
{activeCount}
</Text>
</View>
)}

// ─────────────────────────────────────────────────────────────────────
// 9. PERSISTING FILTERS TO STORAGE
// ─────────────────────────────────────────────────────────────────────

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

export default function HomeScreen() {
const [filters, setFilters] = useState<ListingFilters>({ sortBy: "newest" });

// Load filters on mount
useEffect(() => {
(async () => {
const saved = await AsyncStorage.getItem("homeFilters");
if (saved) {
try {
setFilters(JSON.parse(saved));
} catch (e) {
console.error("Failed to parse saved filters", e);
}
}
})();
}, []);

// Save filters whenever they change
useEffect(() => {
const saveAsync = async () => {
await AsyncStorage.setItem("homeFilters", JSON.stringify(filters));
};
saveAsync().catch(console.error);
}, [filters]);

// Rest of component...
}

// ─────────────────────────────────────────────────────────────────────
// 10. NUMERIC FORMATTING (Romanian locale)
// ─────────────────────────────────────────────────────────────────────

// Display numbers with Romanian formatting
const formatPrice = (price: number): string => {
return price.toLocaleString("ro-RO", {
minimumFractionDigits: 0,
maximumFractionDigits: 0,
});
};

const formatMileage = (km: number): string => {
return `${km.toLocaleString("ro-RO")} km`;
};

// Usage
<Text>
{formatPrice(filters.minPrice ?? 0)} - {formatPrice(filters.maxPrice ?? 999999)} €
</Text>

// Output examples:
// 5000 €
// 10.000 €
// 1.000.000 €
