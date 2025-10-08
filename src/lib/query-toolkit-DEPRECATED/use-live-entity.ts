import { useMemo } from "react";
import {
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { EntityOptimisticMutations } from "@/lib/query-toolkit/optimistic-mutations/optimistic-mutations";
import type { Entity } from "@/lib/query-toolkit/entity";
import { EntityOptimisticUpdater } from "@/lib/query-toolkit/optimistic-mutations/updaters";

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

  return {
    data: query.data,
    query,
    optimisticUpdates,
  };
};
