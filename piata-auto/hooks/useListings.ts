import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listingsService } from "@/services/listingsService";
import { CarListing, ListingFilters, ListingPage } from "@/types/models";

export const useInfiniteListings = (filters: ListingFilters) =>
  useInfiniteQuery({
    queryKey: ["listings", filters],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => listingsService.getListings(filters, pageParam),
    getNextPageParam: (last) => last.nextCursor,
  });

export const useListing = (id: string) =>
  useQuery({
    queryKey: ["listing", id],
    queryFn: () => listingsService.getListingById(id),
  });

export const useCreateListing = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: listingsService.createListing,
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: ["listings"] });
      const previous = qc.getQueriesData({ queryKey: ["listings"] });
      const optimistic: CarListing = {
        ...input,
        id: `tmp-${Date.now()}`,
        createdAt: new Date().toISOString(),
        viewsCount: 0,
        favoritesCount: 0,
      };
      qc.setQueriesData({ queryKey: ["listings"] }, (old: any) => {
        if (!old?.pages?.length) return old;
        const firstPage = old.pages[0] as ListingPage;
        return {
          ...old,
          pages: [{ ...firstPage, data: [optimistic, ...firstPage.data] }, ...old.pages.slice(1)],
        };
      });
      return { previous };
    },
    onError: (_err, _payload, context) => {
      context?.previous.forEach(([key, value]) => qc.setQueryData(key, value));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["listings"] }),
  });
};

export const useDeleteListing = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: listingsService.deleteListing,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["listings"] });
      const previous = qc.getQueriesData({ queryKey: ["listings"] });
      qc.setQueriesData({ queryKey: ["listings"] }, (old: any) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page: ListingPage) => ({
            ...page,
            data: page.data.filter((item) => item.id !== id),
          })),
        };
      });
      return { previous };
    },
    onError: (_err, _id, context) => {
      context?.previous.forEach(([key, value]) => qc.setQueryData(key, value));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["listings"] }),
  });
};
