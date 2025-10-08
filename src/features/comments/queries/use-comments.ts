import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { commentsCollection } from "@/features/comments/collections/comments";

export const useComments = (postId: string) => {
  return usePartitionedQuery<CommentPost, { postId?: string }>({
    collection: commentsCollection,
    queryKey: ["comments", postId],
    getParams: ({ pageParam }) => ({ pageParam, postId }),
  });
};
