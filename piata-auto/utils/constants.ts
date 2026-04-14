import { FuelType, SortBy, Transmission } from "@/types/models";

export const BRANDS = ["BMW", "Audi", "Mercedes", "Volkswagen", "Skoda", "Toyota", "Dacia", "Ford"];
export const FUELS: FuelType[] = ["Petrol", "Diesel", "Hybrid", "Electric", "LPG"];
export const TRANSMISSIONS: Transmission[] = ["Manual", "Automatic"];
export const SORT_OPTIONS: { label: string; value: SortBy }[] = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "priceAsc" },
  { label: "Price: High to Low", value: "priceDesc" },
];
