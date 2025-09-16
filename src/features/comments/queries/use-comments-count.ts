import { useSubsetQuery } from "@/lib/query-toolkit";

export const useCommentsCount = (postId: string) => {
  return useSubsetQuery<number, CommentPost[]>({
    key: postId,
    existingQueryKey: ["comments", postId],
    selectorFn: (data) => data.length,
    deps: [postId],
  });
};
