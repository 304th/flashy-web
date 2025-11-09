import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { streamChatCollection } from "@/features/streams/entities/stream-chat.collection";

export const useStreamChatMessages = (streamId: string) => {
  return usePartitionedQuery({
    collection: streamChatCollection,
    queryKey: ["stream", streamId, "chat", "messages"],
    getParams: ({ pageParam }: any) => ({ streamId, pageParam }),
  });
};
