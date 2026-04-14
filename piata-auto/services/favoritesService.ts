import { db } from "@/services/firebase";
import { MOCK_LISTINGS } from "@/services/mockData";
import { deleteDoc, doc, getDocs, increment, query, setDoc, updateDoc, where } from "firebase/firestore";
import { collection } from "firebase/firestore";

let mockFavorites: string[] = [];

export const favoritesService = {
  async getFavorites(userId: string) {
    if (!db) return mockFavorites;
    const snap = await getDocs(query(collection(db, "favorites"), where("userId", "==", userId)));
    return snap.docs.map((x) => x.data().listingId as string);
  },

  async toggleFavorite(userId: string, listingId: string, shouldFavorite: boolean) {
    if (!db) {
      mockFavorites = shouldFavorite
        ? [...new Set([...mockFavorites, listingId])]
        : mockFavorites.filter((id) => id !== listingId);
      const listing = MOCK_LISTINGS.find((x) => x.id === listingId);
      if (listing) listing.favoritesCount = Math.max(0, listing.favoritesCount + (shouldFavorite ? 1 : -1));
      return true;
    }

    const favoriteId = `${userId}_${listingId}`;
    if (shouldFavorite) {
      await setDoc(doc(db, "favorites", favoriteId), { userId, listingId, createdAt: new Date().toISOString() });
      await updateDoc(doc(db, "listings", listingId), { favoritesCount: increment(1) });
    } else {
      await deleteDoc(doc(db, "favorites", favoriteId));
      await updateDoc(doc(db, "listings", listingId), { favoritesCount: increment(-1) });
    }
    return true;
  },
};
