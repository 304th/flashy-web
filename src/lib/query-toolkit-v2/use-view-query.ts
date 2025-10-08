import { useMemo } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";

const isPaginatedList = <QueryData>(
  data: QueryData | PaginatedList<QueryData>,
): data is PaginatedList<QueryData> =>
  typeof data === "object" && data !== null && "pages" in data;

export const useViewQuery = <SubsetData, QueryData>({
  queryKey,
  select,
}: {
  queryKey: readonly unknown[];
  select: (data: QueryData) => SubsetData;
}) => {
  const queryClient = useQueryClient();

  const query = useQuery<QueryData, unknown, QueryData>({
    queryKey,
    enabled: Boolean(queryClient.getQueryData(queryKey)),
  });

  const selectedData = useMemo(() => {
    if (!query.data) return undefined;

    if (Array.isArray(query.data)) {
      return select(query.data);
    } else if (isPaginatedList(query.data)) {
      return select((query.data.pages as unknown[]).flat() as QueryData);
    }

    return select(query.data);
  }, [query.data, select]);

  return {
    data: selectedData,
    query,
  };
};
