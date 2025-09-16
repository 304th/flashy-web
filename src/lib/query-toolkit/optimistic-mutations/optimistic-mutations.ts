import { nanoid } from "nanoid";
import type { Draft } from "immer";
import { QueryClient } from "@tanstack/react-query";
import type { Collection } from "@/lib/query-toolkit/collection";
import type { Entity } from "@/lib/query-toolkit/entity";
import {
  type OptimisticUpdater,
  type OptimisticUpdaterOptions,
  type EntityOptimisticUpdater,
} from "@/lib/query-toolkit/optimistic-mutations/updaters";

export type OptimisticUpdate<Params> = (
  params: Params,
) => Promise<CollectionOptimisticMutations<any, any> | EntityOptimisticMutations<any>>;

export class CollectionOptimisticMutations<Entity, State> {
  private readonly rollbacks: ((state: State) => State)[];
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
    options?: OptimisticUpdaterOptions;
    sync?: (state: State, params: Optimistic<Entity>) => State;
  }) {
    await this.queryClient.cancelQueries({ queryKey: this.queryKey });
    const previous = this.queryClient.getQueryData(this.queryKey) as State;
    this.queryClient.setQueryData(this.queryKey, update);
    const mergedOptions = { sync: false, rollback: true, ...options };

    if (mergedOptions?.rollback) {
      this.rollbacks.push(() => previous);
    } else {
      this.rollbacks.push((draft) =>
        this.updater.update(
          id || this.collection.getEntityId(item as Entity),
          (draft) => {
            draft._optimisticStatus = "error";
          },
          draft,
        ),
      );
    }

    if (mergedOptions?.sync && sync) {
      this.pendingSyncs.push((state: State, params) => sync(state, params));
    }

    return this;
  }

  async prepend(
    item: Partial<Optimistic<Entity>>,
    options: OptimisticUpdaterOptions = { sync: false, rollback: true },
  ): Promise<CollectionOptimisticMutations<Entity, State>> {
    return this.execute({
      item,
      update: (state: State): State =>
        this.updater.prepend(
          this.createOptimistic(this.collection.createItem(item)),
          state,
        ),
      options,
      sync: (draft, params) =>
        this.updater.replace(
          this.collection.getEntityId(params),
          params,
          draft,
        ),
    });
  }

  async append(
    item: Optimistic<Entity>,
    options: OptimisticUpdaterOptions = { sync: false, rollback: true },
  ): Promise<CollectionOptimisticMutations<Entity, State>> {
    return this.execute({
      item,
      update: (state: State): State =>
        this.updater.append(
          this.createOptimistic(this.collection.createItem(item)),
          state,
        ),
      options,
      sync: (draft, params) =>
        this.updater.replace(
          this.collection.getEntityId(params),
          params,
          draft,
        ),
    });
  }

  async update(
    id: string,
    updateFn: (state: Draft<Optimistic<Entity>>) => void,
    options: OptimisticUpdaterOptions = { sync: false, rollback: true },
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
    options: OptimisticUpdaterOptions = { sync: false, rollback: true },
  ): Promise<CollectionOptimisticMutations<Entity, State>> {
    return this.execute({
      id,
      update: (state: State): State => this.updater.delete(id, state),
      options,
    });
  }

  public rollback() {
    const runRollback = this.rollbacks.pop();

    if (runRollback) {
      this.queryClient.setQueryData(this.queryKey, (state: State) =>
        runRollback(state),
      );
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

export class EntityOptimisticMutations<Item> {
  private readonly rollbacks: ((state: Item) => Item)[];
  private readonly pendingSyncs: ((
    state: Item,
  ) => Item)[];

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
    options?: OptimisticUpdaterOptions;
    sync?: (params: Optimistic<Item>) => Item;
  }) {
    await this.queryClient.cancelQueries({ queryKey: this.queryKey });
    const previous = this.queryClient.getQueryData(this.queryKey) as Item;
    this.queryClient.setQueryData(this.queryKey, update);
    const mergedOptions = { sync: false, rollback: true, ...options };

    if (mergedOptions?.rollback) {
      this.rollbacks.push(() => previous);
    } else {
      this.rollbacks.push((draft) =>
        this.updater.update(
          (draft) => {
            draft._optimisticStatus = "error";
          },
          draft as Optimistic<Item>,
        ),
      );
    }

    if (mergedOptions?.sync && sync) {
      this.pendingSyncs.push((params) => sync(params as Optimistic<Item>));
    }

    return this;
  }

  async update(
    updateFn: (state: Draft<Optimistic<Item>>) => void,
    options: OptimisticUpdaterOptions = { sync: false, rollback: true },
  ): Promise<EntityOptimisticMutations<Item>> {
    return this.execute({
      update: (state: Optimistic<Item>): Optimistic<Item> => this.updater.update(updateFn, state),
      options,
    });
  }

  public rollback() {
    const runRollback = this.rollbacks.pop();

    if (runRollback) {
      this.queryClient.setQueryData(this.queryKey, (state: Item) =>
        runRollback(state),
      );
    }
  }

  public sync(params: Item) {
    const pendingSync = this.pendingSyncs.pop();

    if (pendingSync) {
      this.queryClient.setQueryData(this.queryKey, pendingSync(params));
    }
  }
}
