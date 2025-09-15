import { useMemo } from "react";
import { produce, type Draft } from "immer";
import { nanoid } from "nanoid";
import {
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Collection } from "@/lib/collection";
import type { Mutation } from "@/lib/mutation";
import {handleMutationError} from "@/lib/query";

type DefaultParams = { pageParam: number };

type PartitionedParams<T> = T extends undefined
  ? { pageParam: number }
  : { pageParam: number } & T;

type GetParamsType<T> = T extends undefined
  ? ((params: DefaultParams) => PartitionedParams<T>) | undefined
  : (params: DefaultParams) => PartitionedParams<T>;

export type OptimisticUpdate<Params> = (params: Params) => Promise<Transactions<any, any>>
interface OptimisticUpdaterOptions {
  sync?: boolean;
  rollback?: boolean;
}

interface OptimisticUpdater<Entity, State> {
  prepend(item: Entity, state: State): State;
  append(item: Entity, state: State): State;
  update(
    id: string,
    item: (state: Draft<Optimistic<Entity>>) => void,
    state: State,
  ): State;
  delete(id: string, state: State): State;
  replace: (id: string, item: Optimistic<Entity>, state: State) => State;
}

class PartitionedOptimisticUpdater<Entity>
  implements OptimisticUpdater<Entity, Paginated<Entity[]>>
{
  constructor(private readonly collection: Collection<Entity>) {}

  prepend(item: Entity, state: Paginated<Entity[]>): Paginated<Entity[]> {
    return produce(state, (draft) => {
      draft.pages[0].unshift(item as Draft<Entity>);
    });
  }
  append(item: Entity, state: Paginated<Entity[]>): Paginated<Entity[]> {
    return produce(state, (draft) => {
      draft.pages[0].push(item as Draft<Entity>);
    });
  }
  update(
    id: string,
    updateFn: (state: Draft<Optimistic<Entity>>) => void,
    state: Paginated<Optimistic<Entity>[]>,
  ): Paginated<Entity[]> {
    return produce(state, (draft) => {
      draft.pages.forEach((page) => {
        const foundIndex = page.findIndex(
          (post) => this.collection.getEntityId(post as Optimistic<Entity>) === id,
        );

        if (foundIndex !== -1) {
          updateFn(page[foundIndex]);
        }
      });
    });
  }
  delete(
    id: string,
    state: Paginated<Optimistic<Entity>[]>,
  ): Paginated<Optimistic<Entity>[]> {
    return produce(state, (draft) => {
      draft.pages.forEach((page, index) => {
        page.findIndex(
          (post) => this.collection.getEntityId(post as Optimistic<Entity>) === id,
        );

        if (index !== -1) {
          page.splice(index, 1);
        }
      });
    });
  }
  replace(
    id: string,
    item: Optimistic<Entity>,
    state: Paginated<Entity[]>,
  ): Paginated<Entity[]> {
    return produce(state, (draft) => {
      draft.pages.forEach((page, index) => {
        page.findIndex(
          (post) => this.collection.getEntityId(post as Optimistic<Entity>) === id,
        );

        if (index !== -1) {
          page[index] = item as Draft<Optimistic<Entity>>;
        }
      });
    });
  }
}

class Transactions<Entity, State> {
  private readonly rollbacks: ((state: State) => State)[];
  private readonly pendingSyncs: ((state: State, params: Optimistic<Entity>) => State)[];

  constructor(
    private readonly queryClient: QueryClient,
    private readonly queryKey: unknown[],
    private readonly collection: Collection<Entity>,
    private readonly updater: OptimisticUpdater<Entity, State>,
  ) {
    this.rollbacks = [];
    this.pendingSyncs = [];
  }

  private createOptimistic(params: Entity): Optimistic<Entity> {
    return {
      _optimisticId: nanoid(),
      _optimisticStatus: "pending",
      ...params,
    };
  }

  private async execute({
    update,
    id,
    item,
    options,
    sync,
  }: {
    update: (state: State) => State;
    id?: string;
    item?: Partial<Optimistic<Entity>>;
    options?: OptimisticUpdaterOptions;
    sync?: (state: State, params: Optimistic<Entity>) => State;
  }) {
    await this.queryClient.cancelQueries({ queryKey: this.queryKey });
    const previous = this.queryClient.getQueryData(this.queryKey) as State;
    this.queryClient.setQueryData(this.queryKey, update);

    if (options?.rollback) {
      this.rollbacks.push(() => previous);
    } else {
      this.rollbacks.push((draft) => this.updater.replace(id || this.collection.getEntityId(item as Entity), { _optimisticStatus: "error" } as Optimistic<Entity>, draft));
    }

    if (options?.sync && sync) {
      this.pendingSyncs.push((state: State, params) => sync(state, params))
    }

    return this;
  }

  async prepend(
    item: Partial<Optimistic<Entity>>,
    options: OptimisticUpdaterOptions = { sync: false, rollback: true },
  ): Promise<Transactions<Entity, State>> {
    return this.execute({
      item,
      update: (state: State): State =>
          this.updater.prepend(
            this.createOptimistic(this.collection.createItem(item)),
            state,
          ),
      options,
      sync: (draft, params) => this.updater.replace(this.collection.getEntityId(params), params, draft),
    });
  }

  async append(
    item: Optimistic<Entity>,
    options: OptimisticUpdaterOptions = { sync: false, rollback: true },
  ): Promise<Transactions<Entity, State>> {
    return this.execute({
      item,
      update: (state: State): State =>
        this.updater.append(
          this.createOptimistic(this.collection.createItem(item)),
          state,
        ),
      options,
      sync: (draft, params) => this.updater.update(this.collection.getEntityId(params), (draft) => { draft }, draft),
    });
  }

  async update(
    id: string,
    updateFn: (state: Draft<Optimistic<Entity>>) => void,
    options: OptimisticUpdaterOptions = { sync: false, rollback: true },
  ): Promise<Transactions<Entity, State>> {
    return this.execute({
      update: (state: State): State => this.updater.update(id, updateFn, state),
      options,
      sync: (draft, params) => this.updater.replace(this.collection.getEntityId(params), params, draft),
    });
  }

  async delete(
    id: string,
    options: OptimisticUpdaterOptions = { sync: false, rollback: true },
  ): Promise<Transactions<Entity, State>> {
    return this.execute({
      id,
      update: (state: State): State => this.updater.delete(id, state),
      options,
    });
  }

  public rollback() {
    const runRollback = this.rollbacks.pop();

    if (runRollback) {
      this.queryClient.setQueryData(this.queryKey, (state: State) => runRollback(state));
    }
  }

  public sync(params: Entity) {
    const pendingSync = this.pendingSyncs.pop();

    if (pendingSync) {
      this.queryClient.setQueryData(this.queryKey, (state: State) =>
        pendingSync(state, params as Optimistic<Entity>),
      );
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
      new Transactions<Entity, Paginated<Entity[]>>(
        queryClient,
        queryKey,
        collection,
        new PartitionedOptimisticUpdater<Entity>(collection),
      ),
    [queryClient, queryKey],
  );

  return {
    data: query.data,
    query,
    optimisticUpdates,
  };
};

export const useOptimisticMutation = <Params, Response>({
  mutation,
  optimisticUpdates,
  onMutate,
  onSuccess,
  onError,
}: {
  mutation: Mutation<Params, Response>;
  optimisticUpdates?: OptimisticUpdate<Params>[];
  onMutate?: (params: Params) => void;
  onSuccess?: (data: Response) => void;
  onError?: (error: Error) => void;
}) => {
  return useMutation<
    Response,
    Error,
    Params,
    { transactions: Transactions<unknown, unknown>[] }
  >({
    mutationFn: async (params: Params) => {
      return await mutation.writeData(params);
    },
    onMutate: async (params) => {
      let transactions: Transactions<unknown, unknown>[] = [];

      try {
        if (optimisticUpdates) {
          transactions = await Promise.all(
            optimisticUpdates.map(async (update) => await update(params)),
          );
        }

        onMutate?.(params);
      } catch (error) {
        await handleMutationError(error);
      }

      return { transactions };
    },
    onSuccess: async (data, _, context) => {
      context!.transactions.forEach((transaction) => {
        if (transaction.sync) {
          transaction.sync(data);
        }
      });

      onSuccess?.(data);
    },
    onError: async (error, _, context) => {
      context!.transactions.forEach((transaction) => {
        transaction.rollback();
      });

      onError?.(error);
      await handleMutationError(error);
    },
  });
};

export const useQuerySubset = <SubsetData, QueryData extends unknown[]>({
  existingQueryKey,
  selectorFn,
  deps,
}: { existingQueryKey: readonly unknown[]; selectorFn: (data: QueryData) => SubsetData; deps: unknown[]}) => {
  const queryClient = useQueryClient();

  return useMemo(() => {
    const data = queryClient.getQueryData<QueryData | PaginatedList<QueryData>>(existingQueryKey);

    if (!data) {
      return undefined;
    }

    const queryData = 'pages' in data ? data.pages.flat() as QueryData : data;

    return selectorFn(queryData);
  }, [existingQueryKey, ...deps]);
}
