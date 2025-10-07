import {
  type QueryClient,
  type MutationFunction,
  type UseMutationOptions,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { liveRegistry } from "@/lib/query-toolkit-v2/registry";
import type {Collection} from "@/lib/query-toolkit-v2/collection";
import type {Entity} from "@/lib/query-toolkit-v2/entity";
import type {WritableDraft} from "immer";

export const getQuery = <T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>,
  enabled: (() => boolean) | boolean = true,
  options?: Record<string, any>,
) => {
  const query = useQuery<T | undefined>({
    queryKey,
    queryFn: async () => {
      return await queryFn();
    },
    enabled: typeof enabled === "function" ? enabled() : enabled,
    ...options,
  });

  return [query.data, query] as const;
};

export const getMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext = unknown,
>(
  mutationKey: string[],
  mutationFn: MutationFunction<TData, TVariables>,
  options: UseMutationOptions<TData, TError, TVariables, TContext> = {},
) => {
  return useMutation<TData, TError, TVariables, TContext>({
    mutationKey,
    mutationFn: async (...args) => {
      return await mutationFn(...args);
    },
    ...options,
  });
};

export const handleMutationError = async (error: any) => {
  try {
    const errorBody = (await error?.response?.json()) || error.message;

    toast.error(
      errorBody.error ||
        errorBody.message ||
        (typeof errorBody === "string"
          ? errorBody
          : "Unknown error. Please try again later."),
    );
  } catch {
    toast.error("Unknown error. Please try again later.");
  }
};

export const handleAuthSuccess = (queryClient: QueryClient) => () => {
  void queryClient.invalidateQueries({ queryKey: ["me"] });
};

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
            return liveRegistry.createEntityTransaction(entry).update(updateFn);
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
