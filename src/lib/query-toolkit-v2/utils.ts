import {
  type QueryClient,
  type MutationFunction,
  type UseMutationOptions,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import { toast } from "sonner";

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

// Trigger/channel API to dispatch optimistic updates to all live subscribers of a name
import { liveRegistry } from "@/lib/query-toolkit-v2/registry";

type ChannelName = keyof QueryToolkitChannels extends never
  ? string
  : Extract<keyof QueryToolkitChannels, string>;

export function channel(name: ChannelName) {
  const entries = liveRegistry.list(name);

  return {
    async update(id: string, updateFn: (draft: any) => void) {
      const txs = await Promise.all(
        entries.map(async (entry) => {
          if (entry.kind === "collection") {
            return (
              await liveRegistry.createCollectionTransaction(entry)
            ).update(id, updateFn);
          } else if (entry.kind === "partitioned") {
            return (
              await liveRegistry.createPartitionedTransaction(entry)
            ).update(id, updateFn);
          } else {
            return (await liveRegistry.createEntityTransaction(entry)).update(
              updateFn,
            );
          }
        }),
      );
      return txs;
    },
    async delete(id: string) {
      const txs = await Promise.all(
        entries
          .filter((e) => e.kind === "collection" || e.kind === "partitioned")
          .map(async (entry) =>
            (entry.kind === "collection"
              ? liveRegistry.createCollectionTransaction(entry)
              : liveRegistry.createPartitionedTransaction(entry)
            ).delete(id),
          ),
      );
      return txs;
    },
    async prepend(item: any) {
      const txs = await Promise.all(
        entries
          .filter((e) => e.kind === "collection" || e.kind === "partitioned")
          .map(async (entry) =>
            (entry.kind === "collection"
              ? liveRegistry.createCollectionTransaction(entry)
              : liveRegistry.createPartitionedTransaction(entry)
            ).prepend(item),
          ),
      );
      return txs;
    },
    async append(item: any) {
      const txs = await Promise.all(
        entries
          .filter((e) => e.kind === "collection" || e.kind === "partitioned")
          .map(async (entry) =>
            (entry.kind === "collection"
              ? liveRegistry.createCollectionTransaction(entry)
              : liveRegistry.createPartitionedTransaction(entry)
            ).append(item),
          ),
      );
      return txs;
    },
    async move(id: string, position: number) {
      const txs = await Promise.all(
        entries
          .filter((e) => e.kind === "collection" || e.kind === "partitioned")
          .map(async (entry) =>
            (entry.kind === "collection"
              ? liveRegistry.createCollectionTransaction(entry)
              : liveRegistry.createPartitionedTransaction(entry)
            ).move(id, position),
          ),
      );
      return txs;
    },
    async filter(predicate: (item: any) => boolean) {
      const txs = await Promise.all(
        entries
          .filter((e) => e.kind === "collection" || e.kind === "partitioned")
          .map(async (entry) =>
            (entry.kind === "collection"
              ? liveRegistry.createCollectionTransaction(entry)
              : liveRegistry.createPartitionedTransaction(entry)
            ).filter(predicate),
          ),
      );
      return txs;
    },
  } as const;
}

// Backward-compatible alias; remove after migration
export const trigger = channel;
