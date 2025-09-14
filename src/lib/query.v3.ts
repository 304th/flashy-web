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

type DefaultParams = { pageParam: number };

type PartitionedParams<T> = T extends undefined
  ? { pageParam: number }
  : { pageParam: number } & T;

type GetParamsType<T> = T extends undefined
  ? ((params: DefaultParams) => PartitionedParams<T>) | undefined
  : (params: DefaultParams) => PartitionedParams<T>;

interface OptimisticUpdater<Entity, State> {
  prepend(item: Entity, state: State): State;
  append(item: Entity, state: State): State;
  update(
    id: ReturnType<Collection<Entity>["getId"]>,
    item: Partial<Entity>,
    state: State,
  ): State;
  delete(id: ReturnType<Collection<Entity>["getId"]>, state: State): State;
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
    id: ReturnType<Collection<Entity>["getId"]>,
    item: Entity,
    state: Paginated<Entity[]>,
  ): Paginated<Entity[]> {
    return produce(state, (draft) => {
      draft.pages.forEach((page, index) => {
        page.findIndex(
          (post) => (post as Entity)[this.collection.getId()] === id,
        );

        if (index !== -1) {
          page[index] = item as Draft<Entity>;
        }
      });
    });
  }
  delete(
    id: ReturnType<Collection<Entity>["getId"]>,
    state: Paginated<Entity[]>,
  ): Paginated<Entity[]> {
    return produce(state, (draft) => {
      draft.pages.forEach((page, index) => {
        page.findIndex(
          (post) => (post as Entity)[this.collection.getId()] === id,
        );

        if (index !== -1) {
          page.splice(index, 1);
        }
      });
    });
  }
}

class Transactions<Entity, State> {
  private readonly rollbacks: Optimistic<Entity> extends readonly unknown[]
    ? Optimistic<Entity>[number][]
    : never;
  private readonly pendingSyncs: ((state: State, params: Entity) => State)[];

  constructor(
    private readonly queryClient: QueryClient,
    private readonly queryKey: unknown[],
    private readonly collection: Collection<Entity>,
    private readonly updater: OptimisticUpdater<Entity, State>,
  ) {
    this.rollbacks = [] as any as Optimistic<Entity> extends readonly unknown[]
      ? Optimistic<Entity>[number][]
      : never;
    this.pendingSyncs = [];
  }

  private createOptimistic(params: Entity): Optimistic<Entity> {
    return {
      _optimisticId: nanoid(),
      _optimisticStatus: "pending",
      ...params,
    };
  }

  private async execute(
    update: (state: State) => State,
    options?: { sync: boolean },
    sync?: (state: State, params: Entity) => State,
  ) {
    await this.queryClient.cancelQueries({ queryKey: this.queryKey });
    const previous = this.queryClient.getQueryData(this.queryKey) as State;
    this.queryClient.setQueryData(this.queryKey, update);
    this.rollbacks.push(previous);

    if (options?.sync && sync) {
      this.pendingSyncs.push((state: State, params: Entity) => sync(state, params))
    }

    return this;
  }

  async prepend(
    item: Entity extends readonly unknown[] ? never : Partial<Entity>,
    options?: { sync: boolean },
  ): Promise<Transactions<Entity, State>> {
    return this.execute(
      (state: State): State =>
        this.updater.prepend(
          this.createOptimistic(this.collection.createItem(item)),
          state,
        ),
      options,
      (draft, params) => this.updater.update((params as any)[this.collection.getId()], params, draft),
    );
  }

  async append(
    item: Entity extends readonly unknown[] ? never : Partial<Entity>,
    options?: { sync: boolean },
  ): Promise<Transactions<Entity, State>> {
    return this.execute(
      (state: State): State =>
        this.updater.append(
          this.createOptimistic(this.collection.createItem(item)),
          state,
        ),
      options,
      (draft, params) => this.updater.update((params as any)[this.collection.getId()], params, draft),
    );
  }

  async update(
    id: ReturnType<Collection<Entity>["getId"]>,
    item: Entity extends readonly unknown[] ? never : Partial<Entity>,
    options?: { sync: boolean },
  ): Promise<Transactions<Entity, State>> {
    return this.execute(
      (state: State): State => this.updater.update(id, item, state),
      options,
      (draft, params) => this.updater.update((params as any)[this.collection.getId()], params, draft),
    );
  }

  async delete(
    id: ReturnType<Collection<Entity>["getId"]>,
    options?: { sync: boolean },
  ): Promise<Transactions<Entity, State>> {
    return this.execute(
      (state: State): State => this.updater.delete(id, state),
      options,
    );
  }

  public rollback() {
    const previousState = this.rollbacks.pop();

    if (previousState) {
      this.queryClient.setQueryData(this.queryKey, previousState);
    }
  }

  public sync(params: Entity) {
    const pendingSync = this.pendingSyncs.pop();

    if (pendingSync) {
      this.queryClient.setQueryData(this.queryKey, (state: State) =>
        pendingSync(state, params),
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
  onError,
}: {
  mutation: Mutation<Params, Response>;
  optimisticUpdates: ((
    params: Params,
  ) => Promise<Transactions<any, any>>)[];
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
      const transactions = await Promise.all(
        optimisticUpdates.map(async (update) => await update(params)),
      );

      return { transactions };
    },
    onSuccess: async (data, params, context) => {
      context!.transactions.forEach((transaction) => {
        if (transaction.sync) {
          transaction.sync(data);
        }
      });
    },
    onError: async (error, params, context) => {
      context!.transactions.forEach((transaction) => {
        transaction.rollback();
      });

      onError?.(error);
    },
  });
};
