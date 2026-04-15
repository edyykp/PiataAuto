export type FuelType = "Petrol" | "Diesel" | "Hybrid" | "Electric" | "LPG";
export type Transmission = "Manual" | "Automatic";
export type SortBy = "newest" | "priceAsc" | "priceDesc";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  createdAt: string;
};

export type CarListing = {
  id: string;
  userId: string;
  title: string;
  price: number;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: FuelType;
  transmission: Transmission;
  engine: string;
  description: string;
  images: string[];
  location: string;
  createdAt: string;
  viewsCount: number;
  favoritesCount: number;
};

export type Favorite = {
  id: string;
  userId: string;
  listingId: string;
};

export type BodyType =
  | "Sedan"
  | "SUV"
  | "Hatchback"
  | "Coupe"
  | "Cabriolet"
  | "Break"
  | "Minibus"
  | "Pickup";

export type ListingFilters = {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  model?: string;
  generation?: string;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  bodyType?: BodyType;
  fuelType?: FuelType;
  transmission?: Transmission;
  location?: string;
  sortBy?: SortBy;
};

export type ListingPage = {
  data: CarListing[];
  nextCursor?: number;
};

export type ChatThread = {
  id: string;
  listingId: string;
  participantIds: string[];
  lastMessage: string;
  lastMessageAt: string;
  lastMessageSenderId?: string;
  unreadBy?: Record<string, number>;
  typingBy?: Record<string, string | null>;
};

export type ChatMessage = {
  id: string;
  threadId: string;
  senderId: string;
  text: string;
  createdAt: string;
  readBy?: Record<string, string>;
  notificationMeta?: {
    targetUserIds: string[];
    channel: "push-ready";
    delivered: boolean;
  };
};
