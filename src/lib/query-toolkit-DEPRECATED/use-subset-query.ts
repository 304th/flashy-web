import { useQueryClient, useQuery } from "@tanstack/react-query";

const isPaginatedList = <QueryData>(
  data: QueryData | PaginatedList<QueryData>,
): data is PaginatedList<QueryData> =>
  typeof data === "object" && data !== null && "pages" in data;

export const useSubsetQuery = <SubsetData, QueryData>({
  key,
  existingQueryKey,
  selectorFn,
  deps = [],
}: {
  key: string;
  existingQueryKey: readonly unknown[];
  selectorFn: (data: QueryData) => SubsetData;
  deps?: unknown[];
}) => {
  const queryClient = useQueryClient();

  const query = useQuery<SubsetData>({
    queryKey: [...existingQueryKey, "subset", key, ...deps],
    queryFn: () => {
      const data = queryClient.getQueryData<
        QueryData | PaginatedList<QueryData>
      >(existingQueryKey);

      if (!data) {
        throw new Error("No data found for the provided query key");
      }

      if (Array.isArray(data)) {
        return selectorFn(data);
      } else if (isPaginatedList(data)) {
        return selectorFn((data.pages as unknown[]).flat() as QueryData);
      }

      return selectorFn(data);
    },
    enabled: Boolean(queryClient.getQueryData(existingQueryKey)),
    staleTime: 0,
  });

  return [query.data, query] as const;
};
