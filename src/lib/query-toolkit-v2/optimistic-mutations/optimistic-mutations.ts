import { nanoid } from "nanoid";
import type { Draft } from "immer";
import { QueryClient } from "@tanstack/react-query";
import type { Collection } from "@/lib/query-toolkit-v2/collection";
import {
  type OptimisticUpdater,
  type OptimisticUpdaterOptions,
  type EntityOptimisticUpdater,
} from "@/lib/query-toolkit-v2/optimistic-mutations/updaters";

/**
 * Extracts a user-friendly error message from an error object
 */
const extractErrorMessage = async (error: any): Promise<string> => {
  try {
    if (typeof error === "string") {
      return error;
    }

    const errorBody = (await error?.response?.json()) || error.message;

    return (
      errorBody?.error ||
      errorBody?.message ||
      (typeof errorBody === "string"
        ? errorBody
        : "Unknown error. Please try again later.")
    );
  } catch {
    return "Unknown error. Please try again later.";
  }
};

export type OptimisticUpdate<Params> = (
  params: Params,
) => Promise<
  CollectionOptimisticMutations<any, any> | EntityOptimisticMutations<any>
>;

export class CollectionOptimisticMutations<Entity, State> {
  private readonly rollbacks: ((
    state: State,
    errorMessage?: string,
  ) => State)[];
  private readonly pendingSyncs: ((
    state: State,
    params: Optimistic<Entity>,
  ) => State)[];

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
    options?: OptimisticUpdaterOptions<Entity>;
    sync?: (state: State, params: Optimistic<Entity>) => State;
  }) {
    await this.queryClient.cancelQueries({ queryKey: this.queryKey });
    const previous = this.queryClient.getQueryData(this.queryKey) as State;
    const mergedOptions = {
      sync: false,
      rollback: true,
      type: "all" as const,
      ...options,
    };
    this.queryClient.setQueriesData(
      { queryKey: this.queryKey, type: mergedOptions.type, exact: true },
      update,
    );

    if (mergedOptions?.rollback) {
      this.rollbacks.push(() => previous);
    } else {
      this.rollbacks.push((draft, errorMessage) =>
        this.updater.update(
          id || this.collection.getEntityId(item as Entity),
          (draft) => {
            draft._optimisticStatus = "error";
            if (errorMessage) {
              draft._optimisticError = errorMessage;
            }
          },
          draft,
        ),
      );
    }

    if (mergedOptions?.sync && sync) {
      this.pendingSyncs.push((state: State, params) =>
        sync(
          state,
          mergedOptions.syncFn ? mergedOptions.syncFn(params) : params,
        ),
      );
    }

    return this;
  }

  async prepend(
    item: Optimistic<Entity>,
    options: OptimisticUpdaterOptions<Entity> = { sync: false, rollback: true },
  ): Promise<CollectionOptimisticMutations<Entity, State>> {
    const optimisticItem = this.createOptimistic(
      this.collection.createItem(item),
    );

    return this.execute({
      item,
      update: (state: State): State =>
        this.updater.prepend(this.createOptimistic(optimisticItem), state),
      options,
      sync: (draft, params) => {
        return this.updater.replaceAt(0, params, draft);
      },
    });
  }

  async prependIfNotExists(
    item: Optimistic<Entity>,
    options: OptimisticUpdaterOptions<Entity> = { sync: false, rollback: true },
  ): Promise<CollectionOptimisticMutations<Entity, State>> {
    const optimisticItem = this.createOptimistic(
      this.collection.createItem(item),
    );

    return this.execute({
      item,
      update: (state: State): State =>
        this.updater.prependIfNotExists(
          this.createOptimistic(optimisticItem),
          state,
        ),
      options,
      sync: (draft, params) => {
        return this.updater.replaceAt(0, params, draft);
      },
    });
  }

  async append(
    item: Optimistic<Entity>,
    options: OptimisticUpdaterOptions<Entity> = { sync: false, rollback: true },
  ): Promise<CollectionOptimisticMutations<Entity, State>> {
    const optimisticItem = this.createOptimistic(
      this.collection.createItem(item),
    );

    return this.execute({
      item,
      update: (state: State): State =>
        this.updater.append(optimisticItem, state),
      options,
      sync: (draft, params) => this.updater.replaceLast(params, draft),
    });
  }

  async appendIfNotExists(
    item: Optimistic<Entity>,
    options: OptimisticUpdaterOptions<Entity> = { sync: false, rollback: true },
  ): Promise<CollectionOptimisticMutations<Entity, State>> {
    const optimisticItem = this.createOptimistic(
      this.collection.createItem(item),
    );

    return this.execute({
      item,
      update: (state: State): State =>
        this.updater.appendIfNotExists(optimisticItem, state),
      options,
      sync: (draft, params) => this.updater.replaceLast(params, draft),
    });
  }

  async update(
    id: string,
    updateFn: (state: Draft<Optimistic<Entity>>) => void,
    options: OptimisticUpdaterOptions<Entity> = { sync: false, rollback: true },
  ): Promise<CollectionOptimisticMutations<Entity, State>> {
    return this.execute({
      update: (state: State): State => this.updater.update(id, updateFn, state),
      options,
      sync: (draft, params) =>
        this.updater.replace(
          this.collection.getEntityId(params),
          params,
          draft,
        ),
    });
  }

  async delete(
    id: string,
    options: OptimisticUpdaterOptions<Entity> = { sync: false, rollback: true },
  ): Promise<CollectionOptimisticMutations<Entity, State>> {
    return this.execute({
      id,
      update: (state: State): State => this.updater.delete(id, state),
      options,
    });
  }

  async move(
    id: string,
    position: number,
    options: OptimisticUpdaterOptions<Entity> = { sync: false, rollback: true },
  ) {
    return this.execute({
      update: (state: State): State => this.updater.move(id, position, state),
      options,
      sync: (draft, params) =>
        this.updater.replace(
          this.collection.getEntityId(params),
          params,
          draft,
        ),
    });
  }

  async filter(
    filterFn: (state: Optimistic<Entity>) => boolean,
    options: OptimisticUpdaterOptions<Entity> = { sync: false, rollback: true },
  ) {
    return this.execute({
      update: (state: State): State => this.updater.filter(filterFn, state),
      options,
    });
  }

  async replaceAll(
    items: Entity[],
    options: OptimisticUpdaterOptions<Entity> = { sync: false, rollback: true },
  ) {
    return this.execute({
      update: (state: State): State => this.updater.replaceAll(items, state),
      options,
    });
  }

  public async rollback(error: TODO, type: "active" | "all" = "all") {
    const runRollback = this.rollbacks.pop();

    if (runRollback) {
      const errorMessage = await extractErrorMessage(error);
      this.queryClient.setQueriesData(
        { queryKey: this.queryKey, type, exact: true },
        (state: State) => runRollback(state, errorMessage),
      );
    }
  }

  public sync(params: Entity, type: "active" | "all" = "all") {
    const pendingSync = this.pendingSyncs.pop();

    if (pendingSync) {
      this.queryClient.setQueriesData(
        { queryKey: this.queryKey, type, exact: true },
        (state: State) => pendingSync(state, params as Optimistic<Entity>),
      );
    }
  }
}

export class EntityOptimisticMutations<Item> {
  private readonly rollbacks: ((state: Item, errorMessage?: string) => Item)[];
  private readonly pendingSyncs: ((state: Item) => Item)[];

  constructor(
    private readonly queryClient: QueryClient,
    private readonly queryKey: unknown[],
    private readonly updater: EntityOptimisticUpdater<Item>,
  ) {
    this.rollbacks = [];
    this.pendingSyncs = [];
  }

  private async execute({
    update,
    options,
    sync,
  }: {
    update: (state: Optimistic<Item>) => Optimistic<Item>;
    options?: OptimisticUpdaterOptions<Item>;
    sync?: (params: Optimistic<Item>) => Item;
  }) {
    await this.queryClient.cancelQueries({ queryKey: this.queryKey });
    const previous = this.queryClient.getQueryData(this.queryKey) as Item;
    const mergedOptions = {
      sync: false,
      rollback: true,
      type: "all" as const,
      ...options,
    };
    this.queryClient.setQueriesData(
      { queryKey: this.queryKey, type: mergedOptions.type, exact: true },
      update,
    );

    if (mergedOptions?.rollback) {
      this.rollbacks.push(() => previous);
    } else {
      this.rollbacks.push((draft, errorMessage) =>
        this.updater.update((draft) => {
          draft._optimisticStatus = "error";
          if (errorMessage) {
            draft._optimisticError = errorMessage;
          }
        }, draft as Optimistic<Item>),
      );
    }

    if (mergedOptions?.sync && sync) {
      this.pendingSyncs.push((params) => sync(params as Optimistic<Item>));
    }

    return this;
  }

  async update(
    updateFn: (state: Draft<Optimistic<Item>>) => void,
    options: OptimisticUpdaterOptions<Item> = { sync: false, rollback: true },
  ): Promise<EntityOptimisticMutations<Item>> {
    return this.execute({
      update: (state: Optimistic<Item>): Optimistic<Item> =>
        this.updater.update(updateFn, state),
      options,
    });
  }

  public async rollback(error: TODO, type: "active" | "all" = "all") {
    const runRollback = this.rollbacks.pop();

    if (runRollback) {
      const errorMessage = await extractErrorMessage(error);
      this.queryClient.setQueriesData(
        { queryKey: this.queryKey, type, exact: true },
        (state: Item) => runRollback(state, errorMessage),
      );
    }
  }

  public sync(params: Item, type: "active" | "all" = "all") {
    const pendingSync = this.pendingSyncs.pop();

    if (pendingSync) {
      this.queryClient.setQueriesData(
        { queryKey: this.queryKey, type, exact: true },
        pendingSync(params),
      );
    }
  }
}
