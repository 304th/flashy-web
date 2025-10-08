import { useEffect, useMemo } from "react";
import {
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { type Entity, EntityOptimisticMutations, EntityOptimisticUpdater, liveRegistry } from "@/lib/query-toolkit-v2";

// Define the type for the hook's parameters
interface UseLiveEntityProps<Item, Params = undefined> {
  queryKey: unknown[];
  entity: Entity<Item, Params>;
  options?: Omit<UseQueryOptions<Item, Error, Item, unknown[]>, "queryKey">;
  getParams?: () => Params;
}

export const useLiveEntity = <Item, Params = undefined>({
  queryKey,
  entity,
  options,
  getParams,
}: UseLiveEntityProps<Item, Params>) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const params = getParams ? getParams() : undefined;
      return await entity.readData(params);
    },
    ...options,
  });

  const optimisticUpdates = useMemo(
    () =>
      new EntityOptimisticMutations<Item>(
        queryClient,
        queryKey,
        new EntityOptimisticUpdater<Item>(),
      ),
    [queryClient, queryKey],
  );

  useEffect(() => {
    const entry = {
      kind: "entity" as const,
      name: entity.getName(),
      queryKey,
      queryClient,
      entity,
    };

    // Register only if query is successful and data is not nullish
    if (query.status === "success" && query.data !== null && query.data !== undefined) {
      liveRegistry.register(entry);
    } else {
      // Unregister if data is nullish or query is not successful
      liveRegistry.unregister(entry);
    }
  }, [queryKey, queryClient, entity, query.status, query.data]);

  return {
    data: query.data,
    query,
    optimisticUpdates,
  };
};
