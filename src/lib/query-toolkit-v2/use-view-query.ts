import { useQuery } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";

const isPaginatedList = <T>(
  data: T | PaginatedList<T>,
): data is PaginatedList<T> =>
  typeof data === "object" &&
  data !== null &&
  "pages" in data &&
  Array.isArray((data as any).pages);

export interface PaginatedList<T> {
  pages: T[][];
  pageParams: unknown[];
}

export const useViewQuery = <ViewData, CachedData, TError = unknown>({
  queryKey,
  select,
}: {
  queryKey: QueryKey;
  select: (data: CachedData) => ViewData;
}) => {
  return useQuery<CachedData, TError, ViewData>({
    queryKey,
    queryFn: () => Promise.reject("View query never fetches"),
    enabled: false,
    staleTime: Infinity,
    select: (cachedData) => {
      let flatData;

      if (Array.isArray(cachedData)) {
        flatData = cachedData;
      } else if (isPaginatedList(cachedData)) {
        flatData = cachedData.pages.flat() as unknown as CachedData;
      } else {
        flatData = cachedData;
      }

      return select(flatData);
    },
  });
};
