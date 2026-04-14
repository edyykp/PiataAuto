import { CarListing, ListingFilters, ListingPage } from "@/types/models";
import { db } from "@/services/firebase";
import { MOCK_LISTINGS } from "@/services/mockData";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

let dynamicListings = [...MOCK_LISTINGS];
const PAGE_SIZE = 10;

const applyFilters = (listings: CarListing[], filters: ListingFilters) => {
  let items = [...listings];
  if (filters.query) items = items.filter((x) => x.title.toLowerCase().includes(filters.query!.toLowerCase()));
  if (filters.brand) items = items.filter((x) => x.brand === filters.brand);
  if (filters.model) items = items.filter((x) => x.model.toLowerCase().includes(filters.model!.toLowerCase()));
  if (filters.location) items = items.filter((x) => x.location.toLowerCase().includes(filters.location!.toLowerCase()));
  if (filters.fuelType) items = items.filter((x) => x.fuelType === filters.fuelType);
  if (filters.transmission) items = items.filter((x) => x.transmission === filters.transmission);
  if (filters.minPrice !== undefined) items = items.filter((x) => x.price >= filters.minPrice!);
  if (filters.maxPrice !== undefined) items = items.filter((x) => x.price <= filters.maxPrice!);
  if (filters.minYear !== undefined) items = items.filter((x) => x.year >= filters.minYear!);
  if (filters.maxYear !== undefined) items = items.filter((x) => x.year <= filters.maxYear!);
  if (filters.minMileage !== undefined) items = items.filter((x) => x.mileage >= filters.minMileage!);
  if (filters.maxMileage !== undefined) items = items.filter((x) => x.mileage <= filters.maxMileage!);

  if (filters.sortBy === "priceAsc") items.sort((a, b) => a.price - b.price);
  else if (filters.sortBy === "priceDesc") items.sort((a, b) => b.price - a.price);
  else items.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  return items;
};

export const listingsService = {
  async getListings(filters: ListingFilters = {}, cursor = 0): Promise<ListingPage> {
    if (db) {
      const sortField = filters.sortBy === "newest" ? "createdAt" : "price";
      const sortDirection = filters.sortBy === "priceAsc" ? "asc" : "desc";
      const listingQuery = query(collection(db, "listings"), orderBy(sortField, sortDirection), limit(120));
      const snap = await getDocs(listingQuery);
      const firestoreItems = snap.docs.map((item) => {
        const data = item.data() as Omit<CarListing, "id">;
        return { id: item.id, ...data };
      });
      const filtered = applyFilters(firestoreItems, filters);
      const data = filtered.slice(cursor, cursor + PAGE_SIZE);
      const nextCursor = cursor + PAGE_SIZE < filtered.length ? cursor + PAGE_SIZE : undefined;
      return { data, nextCursor };
    }

    const filtered = applyFilters(dynamicListings, filters);
    const data = filtered.slice(cursor, cursor + PAGE_SIZE);
    const nextCursor = cursor + PAGE_SIZE < filtered.length ? cursor + PAGE_SIZE : undefined;
    return { data, nextCursor };
  },

  async getListingById(id: string) {
    if (db) {
      const snap = await getDoc(doc(db, "listings", id));
      if (!snap.exists()) return null;
      const data = snap.data() as Omit<CarListing, "id">;
      return { id: snap.id, ...data };
    }
    return dynamicListings.find((x) => x.id === id) ?? null;
  },

  async getMyListings(userId: string) {
    return dynamicListings.filter((x) => x.userId === userId);
  },

  async createListing(payload: Omit<CarListing, "id" | "createdAt" | "viewsCount" | "favoritesCount">) {
    if (db) {
      const draft = {
        ...payload,
        createdAt: new Date().toISOString(),
        viewsCount: 0,
        favoritesCount: 0,
      };
      const snap = await addDoc(collection(db, "listings"), draft);
      return { id: snap.id, ...draft };
    }

    const listing: CarListing = {
      ...payload,
      id: `listing-${Date.now()}`,
      createdAt: new Date().toISOString(),
      viewsCount: 0,
      favoritesCount: 0,
    };
    dynamicListings = [listing, ...dynamicListings];
    return listing;
  },

  async updateListing(id: string, patch: Partial<CarListing>) {
    if (db) {
      await updateDoc(doc(db, "listings", id), patch);
      return this.getListingById(id);
    }
    dynamicListings = dynamicListings.map((x) => (x.id === id ? { ...x, ...patch } : x));
    return dynamicListings.find((x) => x.id === id) ?? null;
  },

  async deleteListing(id: string) {
    if (db) {
      await deleteDoc(doc(db, "listings", id));
      return true;
    }
    dynamicListings = dynamicListings.filter((x) => x.id !== id);
    return true;
  },
};
