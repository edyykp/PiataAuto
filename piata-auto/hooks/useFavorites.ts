import { InfiniteData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { favoritesService } from "@/services/favoritesService";
import { ListingPage } from "@/types/models";

export const useFavorites = (userId?: string) =>
  useQuery({
    queryKey: ["favorites", userId],
    enabled: Boolean(userId),
    queryFn: () => favoritesService.getFavorites(userId!),
    initialData: [],
  });

export const useToggleFavorite = (userId?: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (listingId: string) => {
      const current = (qc.getQueryData<string[]>(["favorites", userId]) ?? []).includes(listingId);
      await favoritesService.toggleFavorite(userId!, listingId, !current);
      return { listingId, nowFavorite: !current };
    },
    onMutate: async (listingId) => {
      await qc.cancelQueries({ queryKey: ["favorites", userId] });
      const previousFavorites = qc.getQueryData<string[]>(["favorites", userId]) ?? [];
      const nowFavorite = !previousFavorites.includes(listingId);
      qc.setQueryData<string[]>(
        ["favorites", userId],
        nowFavorite ? [...previousFavorites, listingId] : previousFavorites.filter((x) => x !== listingId),
      );

      const listingCaches = qc.getQueriesData<InfiniteData<ListingPage>>({ queryKey: ["listings"] });
      const previousListings = listingCaches.map(([key, data]) => [key, data] as const);
      listingCaches.forEach(([key, data]) => {
        if (!data) return;
        qc.setQueryData<InfiniteData<ListingPage>>(key, {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            data: page.data.map((item) =>
              item.id !== listingId
                ? item
                : { ...item, favoritesCount: Math.max(0, item.favoritesCount + (nowFavorite ? 1 : -1)) },
            ),
          })),
        });
      });

      return { previousFavorites, previousListings };
    },
    onError: (_err, _id, context) => {
      if (!context) return;
      qc.setQueryData(["favorites", userId], context.previousFavorites);
      context.previousListings.forEach(([key, data]) => qc.setQueryData(key, data));
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["favorites", userId] });
      qc.invalidateQueries({ queryKey: ["listings"] });
    },
  });
};
