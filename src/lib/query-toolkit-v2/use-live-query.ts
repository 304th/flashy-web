import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type Collection,
  CollectionOptimisticMutations,
  LiveOptimisticUpdater,
  liveRegistry,
} from "@/lib/query-toolkit-v2";

export const useLiveQuery = <Entity, Params = undefined>({
  queryKey,
  collection,
  options,
  getParams,
}: {
  queryKey: unknown[];
  collection: Collection<Entity, Params>;
  options?: Record<string, any>;
  getParams?: () => Params;
}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const params = getParams ? getParams() : undefined;

      return await collection.readData(params as any); //FIXME: fix types
    },
    ...options,
  });

  const optimisticUpdates = useMemo(
    () =>
      new CollectionOptimisticMutations<Entity, Entity[]>(
        queryClient,
        queryKey,
        collection as any,
        new LiveOptimisticUpdater<Entity>(collection),
      ),
    [queryClient, queryKey],
  );

  useEffect(() => {
    const entry = {
      kind: "collection" as const,
      name: collection.getName(),
      queryKey,
      queryClient,
      collection: collection as any,
    };

    // Register only if query is successful and data is not nullish
    if (
      query.status === "success" &&
      query.data !== null &&
      query.data !== undefined
    ) {
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
