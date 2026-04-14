import { useEffect, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/services/firebase";
import { CarListing } from "@/types/models";

export const useRealtimeListings = () => {
  const [items, setItems] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(Boolean(db));

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "listings"), orderBy("createdAt", "desc"), limit(120));
    const unsubscribe = onSnapshot(q, (snap) => {
      const rows = snap.docs.map((item) => {
        const data = item.data() as Omit<CarListing, "id">;
        return { id: item.id, ...data };
      });
      setItems(rows);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { items, loading };
};

export const useRealtimeFavoriteIds = (userId?: string) => {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    if (!db || !userId) return;
    const q = query(collection(db, "favorites"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(q, (snap) => {
      setIds(snap.docs.map((docItem) => (docItem.data().listingId as string) ?? ""));
    });
    return unsubscribe;
  }, [userId]);

  return ids;
};
