import { useEffect, useMemo } from "react";
import {
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { EntityOptimisticMutations } from "@/lib/query-toolkit-v2/optimistic-mutations/optimistic-mutations";
import type { Entity } from "@/lib/query-toolkit-v2/entity";
import { EntityOptimisticUpdater } from "@/lib/query-toolkit-v2/optimistic-mutations/updaters";
import { liveRegistry } from "@/lib/query-toolkit-v2/registry";

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

    liveRegistry.register(entity.getName(), entry);

    return () => {
      liveRegistry.unregister(entry);
    };
  }, [queryKey, queryClient, entity]);

  return {
    data: query.data,
    query,
    optimisticUpdates,
  };
};
