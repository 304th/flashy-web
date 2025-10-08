import type { Draft } from "immer";
import {
  liveRegistry,
  type Collection,
  type Entity,
  type EntityOptimisticMutations,
  type OptTransaction
} from "@/lib/query-toolkit-v2";

export class Channel<T> {
  private readonly entries: ReturnType<typeof liveRegistry.list>;

  constructor(private readonly collection: Collection<T> | Entity<T>) {
    this.entries = liveRegistry.list(collection.getName());
  }

  // Overloads allowed on class methods
  async update(id: string, updateFn: (draft: Draft<Optimistic<T>>) => void): Promise<OptTransaction[]>;
  async update(updateFn: (draft: Draft<Optimistic<T>>) => void): Promise<OptTransaction[]>;
  async update(
    idOrFn: string | ((draft: Draft<Optimistic<T>>) => void),
    maybeFn?: (draft: Draft<Optimistic<T>>) => void,
  ): Promise<OptTransaction[]> {
    const hasId = typeof idOrFn === "string";
    const updateFn = (hasId ? maybeFn : idOrFn) as (draft: Draft<Optimistic<T>>) => void;

    return await Promise.all(
      this.entries.map(async (entry) => {
        if (entry.kind === "collection") {
          return liveRegistry
            .createCollectionTransaction(entry)
            .update(idOrFn as string, updateFn);
        } else if (entry.kind === "partitioned") {
          return liveRegistry
            .createPartitionedTransaction(entry)
            .update(idOrFn as string, updateFn);
        } else {
          return (liveRegistry.createEntityTransaction(entry) as EntityOptimisticMutations<T>).update(updateFn);
        }
      }),
    );
  }

  async delete(id: string) {
    return await Promise.all(
      this.entries
        .filter((e) => e.kind === "collection" || e.kind === "partitioned")
        .map(async (entry) =>
          (entry.kind === "collection"
              ? liveRegistry.createCollectionTransaction(entry)
              : liveRegistry.createPartitionedTransaction(entry)
          ).delete(id),
        ),
    );
  }

  async prepend(item: T) {
    return await Promise.all(
      this.entries
        .filter((e) => e.kind === "collection" || e.kind === "partitioned")
        .map(async (entry) =>
          (entry.kind === "collection"
              ? liveRegistry.createCollectionTransaction(entry)
              : liveRegistry.createPartitionedTransaction(entry)
          ).prepend(item),
        ),
    );
  }

  async append(item: T) {
    return await Promise.all(
      this.entries
        .filter((e) => e.kind === "collection" || e.kind === "partitioned")
        .map(async (entry) =>
          (entry.kind === "collection"
              ? liveRegistry.createCollectionTransaction(entry)
              : liveRegistry.createPartitionedTransaction(entry)
          ).append(item),
        ),
    );
  }

  async move(id: string, position: number) {
    return await Promise.all(
      this.entries
        .filter((e) => e.kind === "collection" || e.kind === "partitioned")
        .map(async (entry) =>
          (entry.kind === "collection"
              ? liveRegistry.createCollectionTransaction(entry)
              : liveRegistry.createPartitionedTransaction(entry)
          ).move(id, position),
        ),
    );
  }

  async filter(predicate: (item: T) => boolean) {
    return await Promise.all(
      this.entries
        .filter((e) => e.kind === "collection" || e.kind === "partitioned")
        .map(async (entry) =>
          (entry.kind === "collection"
              ? liveRegistry.createCollectionTransaction(entry)
              : liveRegistry.createPartitionedTransaction(entry)
          ).filter(predicate),
        ),
    );
  }
}

export function channel<T>(collection: Collection<T> | Entity<T>) {
  return new Channel<T>(collection);
}