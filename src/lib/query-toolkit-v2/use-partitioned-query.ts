import { useEffect, useMemo } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { type Collection, liveRegistry, PartitionedOptimisticUpdater, CollectionOptimisticMutations } from "@/lib/query-toolkit-v2";

type DefaultParams = { pageParam: number };

type PartitionedParams<T> = T extends undefined
  ? { pageParam: number }
  : { pageParam: number } & T;

type GetParamsType<T> = T extends undefined
  ? ((params: DefaultParams) => PartitionedParams<T>) | undefined
  : (params: DefaultParams) => PartitionedParams<T>;

export const usePartitionedQuery = <Entity, Params>({
  queryKey,
  collection,
  options,
  getParams,
}: {
  queryKey: unknown[];
  collection: Collection<Entity, PartitionedParams<Params>>;
  options?: Record<string, any>;
  getParams?: GetParamsType<Params>;
}) => {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery<
    Entity[],
    unknown,
    Optimistic<Entity>[],
    unknown[],
    number
  >({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const params = getParams
        ? getParams({ pageParam })
        : ({ pageParam } as PartitionedParams<Params>);

      return await collection.readData(params);
    },
    select: (data) => {
      return data.pages.flat() as Optimistic<Entity>[];
    },
    getNextPageParam: (lastPage, allPages) => {
      if (Array.isArray(lastPage) && lastPage.length > 0) {
        return allPages.length + 1;
      }

      return undefined;
    },
    initialPageParam: 1,
    ...options,
  });

  const optimisticUpdates = useMemo(
    () =>
      new CollectionOptimisticMutations<Entity, Paginated<Entity[]>>(
        queryClient,
        queryKey,
        collection,
        new PartitionedOptimisticUpdater<Entity>(collection),
      ),
    [queryClient, queryKey],
  );

  useEffect(() => {
    const entry = {
      kind: "partitioned" as const,
      name: collection.getName(),
      queryKey,
      queryClient,
      collection,
    };

    // Register only if query is successful and data is not nullish
    if (query.status === "success" && query.data !== null && query.data !== undefined) {
      liveRegistry.register(entry);
    } else {
      // Unregister if data is nullish or query is not successful
      liveRegistry.unregister(entry);
    }
  }, [queryKey, queryClient, collection, query.status, query.data]);

  return {
    data: query.data,
    query,
    optimisticUpdates,
  };
};
