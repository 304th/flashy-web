import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { streamChatCollection } from "@/features/streams/entities/stream-chat.collection";

const PAGE_QUERY_LIMIT = 50;

export const useStreamChatMessages = (streamId: string) => {
  return usePartitionedQuery({
    collection: streamChatCollection,
    queryKey: ["stream", streamId, "chat", "messages"],
    getParams: ({ pageParam }) =>
      ({
        streamId,
        offset: (pageParam - 1) * PAGE_QUERY_LIMIT,
        limit: PAGE_QUERY_LIMIT,
      }) as any,
    options: {
      enabled: Boolean(streamId),
      staleTime: 30 * 1000, // 10 seconds
    },
  });
};
