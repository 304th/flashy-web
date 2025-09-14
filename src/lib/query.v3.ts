import { useMemo } from "react";
import { produce, type Draft } from "immer";
import {
  QueryClient,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { Collection } from "@/lib/collection";

type DefaultParams = { pageParam: number };
type PartitionedParams<T> = T extends undefined
  ? { pageParam: number }
  : { pageParam: number } & T;
type GetParamsType<T> = T extends undefined
  ? ((params: DefaultParams) => PartitionedParams<T>) | undefined
  : (params: DefaultParams) => PartitionedParams<T>;

interface OptimisticUpdater<Entity, State> {
  prepend(item: Entity, state: State): State;
}

class PartitionedOptimisticUpdater<Entity> implements OptimisticUpdater<Entity, Paginated<Entity[]> > {
  prepend(item: Entity, state: Paginated<Entity[]>): Paginated<Entity[]> {
    return produce(state, (draft) => {
      draft.pages[0].unshift(item as Draft<Entity>);
    })
  }
}

class Transactions<Entity, State> {
  private readonly previousState: Entity extends readonly unknown[]
    ? Entity[number][]
    : never;

  constructor(
    private readonly queryClient: QueryClient,
    private readonly queryKey: unknown[],
    private readonly schema: StaticSchema<Entity>,
    private readonly updater: OptimisticUpdater<Entity, unknown>,
  ) {
    this.previousState = [] as any as Entity extends readonly unknown[]
      ? Entity[number][]
      : never;
  }

  async prepend(
    item: Entity extends readonly unknown[] ? never : Partial<Entity>,
  ): Promise<void> {
    await this.queryClient.cancelQueries({ queryKey: this.queryKey });
    const previous = this.queryClient.getQueryData(this.queryKey) as State;
    this.queryClient.setQueryData(this.queryKey, (state: State): State => {
      return this.updater.prepend(this.schema.createEntityFromParams(item), state);
    });
    this.previousState.push(previous);
  }

  rollback() {
    const previousState = this.previousState.pop();

    if (previousState) {
      this.queryClient.setQueryData(this.queryKey, previousState);
    }
  }
}

export const usePartitionedQuery = <Entity, Params>({
  queryKey,
  collection,
  options,
  getParams,
}: {
  queryKey: unknown[];
  collection: Collection<Optimistic<Entity>, PartitionedParams<Params>>;
  options?: Record<string, any>;
  getParams?: GetParamsType<Params>;
}) => {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery<
    Optimistic<Entity>[],
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

  const updates = useMemo(
    () =>
      new Transactions<Optimistic<Entity>, Paginated<Optimistic<Entity>>>(
        queryClient,
        queryKey,
        collection.getSchema(),
        new PartitionedOptimisticUpdater<Optimistic<Entity>>(),
      ),
    [queryClient, queryKey],
  );

  return {
    data: query.data,
    query,
    updates,
  };
};
