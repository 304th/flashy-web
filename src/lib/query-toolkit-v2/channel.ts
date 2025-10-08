import type { WritableDraft } from "immer";
import { liveRegistry, type Collection, type Entity } from "@/lib/query-toolkit-v2";

export function channel<T>(collection: Collection<T> | Entity<T>) {
  const entries = liveRegistry.list(collection.getName());

  return {
    async update(id: string, updateFn: (draft: WritableDraft<Optimistic<T>>) => void) {
      return await Promise.all(
        entries.map(async (entry) => {
          if (entry.kind === "collection") {
            return liveRegistry.createCollectionTransaction(entry).update(id, updateFn);
          } else if (entry.kind === "partitioned") {
            return liveRegistry.createPartitionedTransaction(entry).update(id, updateFn);
          } else {
            return liveRegistry.createEntityTransaction(entry).update(updateFn as any); //FIXME: fix types
          }
        }),
      );
    },
    async delete(id: string) {
      return await Promise.all(
        entries
          .filter((e) => e.kind === "collection" || e.kind === "partitioned")
          .map(async (entry) =>
            (entry.kind === "collection"
                ? liveRegistry.createCollectionTransaction(entry)
                : liveRegistry.createPartitionedTransaction(entry)
            ).delete(id),
          ),
      );
    },
    async prepend(item: T) {
      return await Promise.all(
        entries
          .filter((e) => e.kind === "collection" || e.kind === "partitioned")
          .map(async (entry) =>
            (entry.kind === "collection"
                ? liveRegistry.createCollectionTransaction(entry)
                : liveRegistry.createPartitionedTransaction(entry)
            ).prepend(item),
          ),
      );
    },
    async append(item: T) {
      return await Promise.all(
        entries
          .filter((e) => e.kind === "collection" || e.kind === "partitioned")
          .map(async (entry) =>
            (entry.kind === "collection"
                ? liveRegistry.createCollectionTransaction(entry)
                : liveRegistry.createPartitionedTransaction(entry)
            ).append(item),
          ),
      );
    },
    async move(id: string, position: number) {
      return await Promise.all(
        entries
          .filter((e) => e.kind === "collection" || e.kind === "partitioned")
          .map(async (entry) =>
            (entry.kind === "collection"
                ? liveRegistry.createCollectionTransaction(entry)
                : liveRegistry.createPartitionedTransaction(entry)
            ).move(id, position),
          ),
      );
    },
    async filter(predicate: (item: T) => boolean) {
      return await Promise.all(
        entries
          .filter((e) => e.kind === "collection" || e.kind === "partitioned")
          .map(async (entry) =>
            (entry.kind === "collection"
                ? liveRegistry.createCollectionTransaction(entry)
                : liveRegistry.createPartitionedTransaction(entry)
            ).filter(predicate),
          ),
      );
    },
  } as const;
}