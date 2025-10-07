import { useQueryClient, useQuery } from "@tanstack/react-query";

const isPaginatedList = <QueryData>(
  data: QueryData | PaginatedList<QueryData>,
): data is PaginatedList<QueryData> =>
  typeof data === "object" && data !== null && "pages" in data;

export const useViewQuery = <SubsetData, QueryData>({
  queryKey,
  selectorFn,
}: {
  queryKey: readonly unknown[];
  selectorFn: (data: QueryData) => SubsetData;
}) => {
  const query = useQuery<QueryData, unknown, SubsetData>({
    queryKey,
    select: (data) => {
      if (Array.isArray(data)) {
        return selectorFn(data);
      } else if (isPaginatedList(data)) {
        return selectorFn((data.pages as unknown[]).flat() as QueryData);
      }

      return selectorFn(data);
    },
    enabled: Boolean(useQueryClient().getQueryData(queryKey)),
  });

  return {
    data: query.data,
    query,
  }
}