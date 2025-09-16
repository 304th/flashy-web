import type { Collection } from "@/lib/query-toolkit/collection";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { CollectionOptimisticMutations } from "@/lib/query-toolkit/optimistic-mutations/optimistic-mutations";
import { LiveOptimisticUpdater } from "@/lib/query-toolkit/optimistic-mutations/updaters";

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

      return await collection.readData(params);
    },
    ...options,
  });

  const optimisticUpdates = useMemo(
    () =>
      new CollectionOptimisticMutations<Entity, Entity[]>(
        queryClient,
        queryKey,
        collection,
        new LiveOptimisticUpdater<Entity>(collection),
      ),
    [queryClient, queryKey],
  );

  return {
    data: query.data,
    query,
    optimisticUpdates,
  };
};
