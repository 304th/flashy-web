import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Collection } from "@/lib/query-toolkit-v2/collection";
import { CollectionOptimisticMutations } from "@/lib/query-toolkit-v2/optimistic-mutations/optimistic-mutations";
import { LiveOptimisticUpdater } from "@/lib/query-toolkit-v2/optimistic-mutations/updaters";
import { liveRegistry } from "@/lib/query-toolkit-v2/registry";

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

    liveRegistry.register(entry);

    return () => {
      liveRegistry.unregister(entry);
    };
  }, [queryKey, queryClient, collection]);

  return {
    data: query.data,
    query,
    optimisticUpdates,
  };
};
