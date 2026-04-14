import { CarListing, UserProfile } from "@/types/models";

export const MOCK_USER: UserProfile = {
  id: "u1",
  name: "Demo User",
  email: "demo@piataauto.app",
  phone: "+40 712 345 678",
  avatarUrl: "",
  createdAt: new Date().toISOString(),
};

export const MOCK_LISTINGS: CarListing[] = Array.from({ length: 40 }).map((_, i) => ({
  id: `listing-${i + 1}`,
  userId: i % 2 === 0 ? "u1" : "u2",
  title: `${["BMW", "Audi", "Toyota", "Mercedes"][i % 4]} ${["320d", "A4", "Corolla", "C220"][i % 4]} ${2015 + (i % 9)}`,
  price: 5500 + i * 650,
  brand: ["BMW", "Audi", "Toyota", "Mercedes"][i % 4],
  model: ["320d", "A4", "Corolla", "C220"][i % 4],
  year: 2015 + (i % 9),
  mileage: 65000 + i * 4200,
  fuelType: ["Diesel", "Petrol", "Hybrid", "Diesel"][i % 4] as CarListing["fuelType"],
  transmission: i % 3 === 0 ? "Automatic" : "Manual",
  engine: `${1.6 + (i % 4) * 0.2}L`,
  description: "Well-maintained vehicle, full service history, no major accidents.",
  images: [
    `https://picsum.photos/seed/car-${i + 1}/900/600`,
    `https://picsum.photos/seed/car-${i + 100}/900/600`,
  ],
  location: ["Bucharest", "Cluj", "Iasi", "Timisoara"][i % 4],
  createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * 8).toISOString(),
  viewsCount: 100 + i * 9,
  favoritesCount: 6 + (i % 15),
}));
