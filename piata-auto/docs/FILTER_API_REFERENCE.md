// =====================================================================
// FILTER COMPONENTS - PUBLIC API REFERENCE
// =====================================================================

/\*\*

- HomeSearchFilters Component
- ──────────────────────────────────────────────────────────────────
- Main filter UI component that renders all structured search filters
- for the car marketplace home screen.
-
- Features:
- - 7 filter categories (Body Type, Brand, Model, Generation, Year, Price, Mileage)
- - Expandable/collapsible range inputs
- - Dependent dropdowns with modal selection
- - Action buttons (Reset, Search)
- - Full Romanian UI
    \*/

import { HomeSearchFilters } from "@/components/home/HomeSearchFilters";
import { ListingFilters } from "@/types/models";

type HomeSearchFiltersProps = {
// Current filter state
filters: ListingFilters;

// Called whenever user modifies any filter
// Receives updated filters object
onFiltersChange: (filters: ListingFilters) => void;

// Called when user taps "Caută" button
// Typically triggers data re-query with current filters
onSearch: () => void;

// Called when user taps "Resetează" button
// Typically resets filters to { sortBy: "newest" }
onReset: () => void;
};

// Example usage
<HomeSearchFilters
filters={currentFilters}
onFiltersChange={setCurrentFilters}
onSearch={() => queryResults.refetch()}
onReset={() => setCurrentFilters({ sortBy: "newest" })}
/>

/\*\*

- RangeInput Component
- ──────────────────────────────────────────────────────────────────
- Reusable component for range-based inputs (min/max pairs).
- Used for Year, Price, and Mileage filters.
-
- Features:
- - Two side-by-side text inputs
- - Customizable labels and placeholders
- - Numeric keyboard support
- - Proper spacing and styling
    \*/

import { RangeInput } from "@/components/home/RangeInput";

type RangeInputProps = {
// Label shown above inputs
label: string;

// Placeholder for minimum value input
// Default: "De la"
minPlaceholder?: string;

// Placeholder for maximum value input
// Default: "Până la"
maxPlaceholder?: string;

// Current minimum value (as string)
minValue: string;

// Current maximum value (as string)
maxValue: string;

// Called when user changes minimum value
onMinChange: (value: string) => void;

// Called when user changes maximum value
onMaxChange: (value: string) => void;

// Keyboard type for inputs
// Default: "numeric"
// Options: "numeric" | "decimal-pad"
keyboardType?: "numeric" | "decimal-pad";
};

// Example: Price range
<RangeInput
label="Preț (€)"
minPlaceholder="De la"
maxPlaceholder="Până la"
minValue={filters.minPrice?.toString() ?? ""}
maxValue={filters.maxPrice?.toString() ?? ""}
onMinChange={(v) =>
setFilters({
...filters,
minPrice: v ? Number(v) : undefined,
})
}
onMaxChange={(v) =>
setFilters({
...filters,
maxPrice: v ? Number(v) : undefined,
})
}
/>

// Example: Year range
<RangeInput
label="An"
minPlaceholder="De la"
maxPlaceholder="Până la"
minValue={filters.minYear?.toString() ?? ""}
maxValue={filters.maxYear?.toString() ?? ""}
onMinChange={(v) =>
setFilters({
...filters,
minYear: v ? Number(v) : undefined,
})
}
onMaxChange={(v) =>
setFilters({
...filters,
maxYear: v ? Number(v) : undefined,
})
}
/>

// Example: Mileage range
<RangeInput
label="Kilometraj (km)"
minPlaceholder="De la"
maxPlaceholder="Până la"
minValue={filters.minMileage?.toString() ?? ""}
maxValue={filters.maxMileage?.toString() ?? ""}
onMinChange={(v) =>
setFilters({
...filters,
minMileage: v ? Number(v) : undefined,
})
}
onMaxChange={(v) =>
setFilters({
...filters,
maxMileage: v ? Number(v) : undefined,
})
}
/>

/\*\*

- HomeHeader Component (Updated)
- ──────────────────────────────────────────────────────────────────
- Updated header for home screen showing app branding, notifications,
- and active filter count badge.
-
- Previously showed search input; now just displays title and subtitle.
  \*/

import { HomeHeader } from "@/components/home/HomeHeader";
import { ListingFilters } from "@/types/models";

type HomeHeaderProps = {
// Current filter state
filters: ListingFilters;

// Called when filters change
onFiltersChange: (filters: ListingFilters) => void;

// Called when search is performed
onSearch: () => void;

// Called when filters are reset
onReset: () => void;
};

// Example usage
<HomeHeader
filters={currentFilters}
onFiltersChange={setCurrentFilters}
onSearch={() => queryResults.refetch()}
onReset={() => setCurrentFilters({ sortBy: "newest" })}
/>

/\*\*

- DropdownSelect Component (Internal)
- ──────────────────────────────────────────────────────────────────
- Internal utility component for rendering dropdowns with modal picker.
- Used within HomeSearchFilters for Brand, Model, Generation, Body Type.
-
- Not exported for direct use; controlled by HomeSearchFilters.
  \*/

// Props interface (for reference)
type DropdownSelectProps = {
// Label shown above dropdown button
label: string;

// Current selected value
value?: string;

// Array of selectable options
options: Array<{ label: string; value: string }>;

// Called when user selects an option
// Passing same value again deselects it
onSelect: (value: string | undefined) => void;

// Placeholder text when no value selected
// Default: "Selectează..."
placeholder?: string;
};

/\*\*

- ListingFilters Type (Updated)
- ──────────────────────────────────────────────────────────────────
- Complete filter state structure for car search.
  \*/

export type ListingFilters = {
// Range filters
minPrice?: number; // Minimum price in €
maxPrice?: number; // Maximum price in €
minYear?: number; // Minimum year (e.g., 2015)
maxYear?: number; // Maximum year (e.g., 2024)
minMileage?: number; // Minimum mileage in km
maxMileage?: number; // Maximum mileage in km

// Dependent chain filters
bodyType?: BodyType; // "Sedan" | "SUV" | "Hatchback" | ...
brand?: string; // "BMW" | "Audi" | ...
model?: string; // "X5" | "A4" | ... (depends on brand)
generation?: string; // "G05 (2023+)" | ... (depends on model)

// Additional filters
fuelType?: FuelType; // "Petrol" | "Diesel" | "Hybrid" | ...
transmission?: Transmission; // "Manual" | "Automatic"
location?: string; // "București" | "Cluj" | ...
sortBy?: SortBy; // "newest" | "priceAsc" | "priceDesc"

// Deprecated
query?: string; // Free text search (removed from UI)
};

export type BodyType =
| "Sedan"
| "SUV"
| "Hatchback"
| "Coupe"
| "Cabriolet"
| "Break" // Station wagon
| "Minibus"
| "Pickup";

/\*\*

- Constants & Data
- ──────────────────────────────────────────────────────────────────
  \*/

// Available body types
export const BODY_TYPES: BodyType[] = [
"Sedan", "SUV", "Hatchback", "Coupe", "Cabriolet",
"Break", "Minibus", "Pickup"
];

// Car models by brand
// Structure: { [brand]: [models] }
export const CAR_MODELS: Record<string, string[]> = {
BMW: ["X5", "X3", "Series 3", "Series 5", "Series 7", "M440i"],
Audi: ["A4", "A6", "Q5", "Q7", "A3", "A8"],
Mercedes: ["C-Class", "E-Class", "GLC", "GLE", "S-Class", "A-Class"],
Volkswagen: ["Golf", "Passat", "Tiguan", "ID.4", "Jetta", "Arteon"],
Skoda: ["Octavia", "Superb", "Kodiaq", "Kamiq", "Fabia", "Scala"],
Toyota: ["Corolla", "Camry", "RAV4", "Highlander", "Venza", "Prius"],
Dacia: ["Duster", "Sandero", "Logan", "Jogger", "Spring"],
Ford: ["Focus", "Mondeo", "Kuga", "Explorer", "Edge", "Fiesta"],
};

// Car generations by model
// Structure: { [brand model]: [generations] }
export const CAR_GENERATIONS: Record<string, string[]> = {
"BMW X5": ["G05 (2019-2023)", "G05 (2023+)", "F15 (2013-2019)", "E70 (2006-2013)"],
"BMW X3": ["G01 (2017-2021)", "G01 (2021+)", "F25 (2010-2017)"],
"BMW Series 3": ["G20 (2018-2023)", "G20 (2023+)", "F30 (2011-2019)"],
"Audi A4": ["B9 (2015-2020)", "B9 (2020+)", "B8 (2008-2015)"],
"Audi Q5": ["SQ5 (2017-2022)", "Q5 (2017+)", "Q5 (2008-2017)"],
"Mercedes C-Class": ["W206 (2021+)", "W205 (2014-2021)", "W204 (2007-2014)"],
"Mercedes E-Class": ["W214 (2023+)", "W213 (2016-2023)", "W212 (2009-2016)"],
};

// Sort options with Romanian labels
export const SORT_OPTIONS: { label: string; value: SortBy }[] = [
{ label: "Cel mai nou", value: "newest" },
{ label: "Preț: mic la mare", value: "priceAsc" },
{ label: "Preț: mare la mic", value: "priceDesc" },
];

/\*\*

- Integration Examples
- ──────────────────────────────────────────────────────────────────
  \*/

// ─ EXAMPLE 1: Basic Home Screen Setup ─
import { useState } from "react";
import { SafeAreaView, FlatList, View } from "react-native";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeSearchFilters } from "@/components/home/HomeSearchFilters";

export default function HomeScreen() {
const [filters, setFilters] = useState<ListingFilters>({
sortBy: "newest"
});

const { data: results, refetch } = useInfiniteListings(filters);

return (
<SafeAreaView className="flex-1 bg-slateBg">
<FlatList
data={results}
ListHeaderComponent={
<>
<HomeHeader
filters={filters}
onFiltersChange={setFilters}
onSearch={refetch}
onReset={() => setFilters({ sortBy: "newest" })}
/>
<View className="mt-4 bg-white px-4 pb-6 pt-4 rounded-b-3xl">
<HomeSearchFilters
filters={filters}
onFiltersChange={setFilters}
onSearch={refetch}
onReset={() => setFilters({ sortBy: "newest" })}
/>
</View>
</>
}
renderItem={({ item }) => <ListingCard item={item} />}
/>
</SafeAreaView>
);
}

// ─ EXAMPLE 2: With Validation ─
const isValidFilters = (f: ListingFilters): boolean => {
if (f.minPrice && f.maxPrice && f.maxPrice < f.minPrice) return false;
if (f.minYear && f.maxYear && f.maxYear < f.minYear) return false;
if (f.model && !f.brand) return false;
if (f.generation && !f.model) return false;
return true;
};

const handleSearch = () => {
if (!isValidFilters(filters)) {
Toast.show({ type: "error", text1: "Filtrele nu sunt valide" });
return;
}
resultsQuery.refetch();
};

// ─ EXAMPLE 3: Active Filter Count ─
const activeFilterCount = Object.entries(filters).filter(
([key, value]) =>
key !== "sortBy" &&
value !== undefined &&
value !== ""
).length;

// Show badge on header
{activeFilterCount > 0 && (
<View className="absolute -right-1 -top-1 rounded-full bg-amber-400 px-1.5 py-0.5">
<Text className="text-[10px] font-bold text-slate-900">
{activeFilterCount}
</Text>
</View>
)}

/\*\*

- Styling Classes (NativeWind/Tailwind)
- ──────────────────────────────────────────────────────────────────
  \*/

// Button states
"bg-primary" // Blue/primary color button
"bg-slate-100" // Light gray background
"bg-white" // White background
"text-white" // White text

// Sizing
"rounded-2xl" // Medium rounded corners
"rounded-3xl" // Large rounded corners
"px-4" // Horizontal padding
"py-3" // Vertical padding

// Colors
"text-slate-900" // Dark text
"text-slate-500" // Medium gray text
"text-slate-700" // Gray text
"border-slate-200" // Light gray border

// Layout
"flex-row" // Horizontal layout
"justify-between" // Space items apart
"items-center" // Vertical center
"gap-3" // Space between items

// Example: Complete button styling
"rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm"
