import { usePartitionedQuery } from "@/lib/query-toolkit";
import { repliesCollection } from "@/features/comments/collections/replies";

export const useReplies = (commentId?: string) => {
  return usePartitionedQuery<Reply, { commentId?: string }>({
    collection: repliesCollection,
    queryKey: ["replies", commentId],
    getParams: ({ pageParam }) => ({ pageParam, commentId }),
    options: {
      enabled: Boolean(commentId),
    },
  });
};
