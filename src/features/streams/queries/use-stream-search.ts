import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { streamSearchCollection, type StreamSearchParams } from "@/features/streams/entities/stream-search.collection";

export const useStreamSearch = (searchParams: StreamSearchParams = {}) => {
  return usePartitionedQuery<
    Stream,
    StreamSearchParams & { pageParam: number }
  >({
    collection: streamSearchCollection,
    queryKey: ["streams", "search", searchParams],
    getParams: ({ pageParam }) => ({ ...searchParams } as any),
  });
};
