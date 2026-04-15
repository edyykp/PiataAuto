import { BodyType, FuelType, SortBy, Transmission } from "@/types/models";

export const BRANDS = [
  "BMW",
  "Audi",
  "Mercedes",
  "Volkswagen",
  "Skoda",
  "Toyota",
  "Dacia",
  "Ford",
];
export const BODY_TYPES: BodyType[] = [
  "Sedan",
  "SUV",
  "Hatchback",
  "Coupe",
  "Cabriolet",
  "Break",
  "Minibus",
  "Pickup",
];
export const FUELS: FuelType[] = [
  "Petrol",
  "Diesel",
  "Hybrid",
  "Electric",
  "LPG",
];
export const TRANSMISSIONS: Transmission[] = ["Manual", "Automatic"];
export const SORT_OPTIONS: { label: string; value: SortBy }[] = [
  { label: "Cel mai nou", value: "newest" },
  { label: "Preț: mic la mare", value: "priceAsc" },
  { label: "Preț: mare la mic", value: "priceDesc" },
];

// Car models by brand (simplified catalog for demo)
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

// Car generations (simplified for demo)
export const CAR_GENERATIONS: Record<string, string[]> = {
  "BMW X5": [
    "G05 (2019-2023)",
    "G05 (2023+)",
    "F15 (2013-2019)",
    "E70 (2006-2013)",
  ],
  "BMW X3": ["G01 (2017-2021)", "G01 (2021+)", "F25 (2010-2017)"],
  "BMW Series 3": ["G20 (2018-2023)", "G20 (2023+)", "F30 (2011-2019)"],
  "Audi A4": ["B9 (2015-2020)", "B9 (2020+)", "B8 (2008-2015)"],
  "Audi Q5": ["SQ5 (2017-2022)", "Q5 (2017+)", "Q5 (2008-2017)"],
  "Mercedes C-Class": ["W206 (2021+)", "W205 (2014-2021)", "W204 (2007-2014)"],
  "Mercedes E-Class": ["W214 (2023+)", "W213 (2016-2023)", "W212 (2009-2016)"],
};
